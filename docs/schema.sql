/* ====================================================================
   FINAL PRODUCTION SCHEMA - Quiz Application
   
   Platform: Supabase (PostgreSQL) + Cloudflare Workers
   Version: 1.1.0
   Last Updated: 2025-12
   
   ARCHITECTURE DECISIONS:
   ├── Anonymous users: Session UUID + secure insert function
   ├── Email access: Backend (service_role) + signed tokens
   ├── Data retention: Denormalized fingerprint survives session deletion
   └── Cost optimization: Sessions auto-expire after 30 days
   
   SECURITY MODEL:
   ├── Anonymous inserts: SECURITY DEFINER function validates session
   ├── In-session viewing: RLS with x-session-id header
   ├── Email "view later": Signed JWT tokens validated by backend
   └── Authenticated users: Standard Supabase Auth + RLS
   
   ==================================================================== */

-- ============================================================
-- 0. SCHEMA HARDENING
-- ============================================================
REVOKE CREATE ON SCHEMA public FROM PUBLIC;


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- pgcrypto: Cryptographic functions (hashing, encryption)
-- NOT needed for gen_random_uuid() but useful for:
--   • digest() - SHA256/SHA512 hashing
--   • crypt() / gen_salt() - password hashing
--   • encrypt() / decrypt() - symmetric encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


-- ============================================================
-- 2. TABLE: profiles
-- ============================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free' 
        CHECK (plan IN ('free', 'premium')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_plan ON profiles(plan);


-- ============================================================
-- 3. TABLE: anonymous_sessions
-- ============================================================
CREATE TABLE public.anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint_hash TEXT NOT NULL,
    claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX idx_sessions_fingerprint ON anonymous_sessions(fingerprint_hash);
CREATE INDEX idx_sessions_expires ON anonymous_sessions(expires_at) 
    WHERE claimed_by IS NULL;


-- ============================================================
-- 4. TABLE: quiz_results
-- ============================================================
CREATE TABLE public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- IDENTITY
    anonymous_session_id UUID REFERENCES anonymous_sessions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fingerprint_hash TEXT,
    
    -- QUIZ DATA
    archetype_slug TEXT NOT NULL,
    scores JSONB NOT NULL CHECK (jsonb_typeof(scores) = 'object'),
    answers JSONB NOT NULL CHECK (jsonb_typeof(answers) = 'object'),
    -- JSONB preserves array structure for ties like ["anxious", "avoidant"]
    -- Use -> (not ->>) to keep JSONB type instead of extracting as TEXT
    primary_attachment JSONB GENERATED ALWAYS AS (
        scores->'attachment'->'primary'
    ) STORED,
    
    -- ANALYTICS & ATTRIBUTION
    source TEXT DEFAULT 'web',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- EMAIL HANDLING
    email TEXT CHECK (
        email IS NULL OR 
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    
    -- DATA INTEGRITY
    idempotency_key TEXT UNIQUE,
    duration_seconds INT CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    claimed_at TIMESTAMPTZ
);

ALTER TABLE quiz_results ADD CONSTRAINT quiz_results_has_identity
    CHECK (
        user_id IS NOT NULL 
        OR fingerprint_hash IS NOT NULL 
        OR anonymous_session_id IS NOT NULL
    );


-- ============================================================
-- 5. INDEXES
-- ============================================================
CREATE INDEX idx_results_user ON quiz_results(user_id) 
    WHERE user_id IS NOT NULL;

CREATE INDEX idx_results_session ON quiz_results(anonymous_session_id) 
    WHERE anonymous_session_id IS NOT NULL;

CREATE INDEX idx_results_fingerprint ON quiz_results(fingerprint_hash)
    WHERE fingerprint_hash IS NOT NULL;

CREATE INDEX idx_results_unclaimed_email ON quiz_results(lower(email)) 
    WHERE user_id IS NULL AND email IS NOT NULL;

-- GIN index for JSONB enables efficient containment queries:
--   WHERE primary_attachment ? 'anxious'  (contains element)
--   WHERE primary_attachment @> '"secure"' (matches value)
CREATE INDEX idx_results_attachment ON quiz_results
    USING GIN (primary_attachment)
    WHERE primary_attachment IS NOT NULL;

CREATE INDEX idx_results_archetype ON quiz_results(archetype_slug);

CREATE INDEX idx_results_created_at ON quiz_results(created_at DESC);

CREATE INDEX idx_results_utm ON quiz_results(utm_source, utm_campaign, created_at DESC)
    WHERE utm_source IS NOT NULL;

CREATE INDEX idx_results_claimed_at ON quiz_results(claimed_at)
    WHERE claimed_at IS NOT NULL;


-- ============================================================
-- 6. AUTO-UPDATE TRIGGERS
-- ============================================================
CREATE TRIGGER handle_updated_at_profiles 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE PROCEDURE extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_quiz_results 
    BEFORE UPDATE ON quiz_results 
    FOR EACH ROW 
    EXECUTE PROCEDURE extensions.moddatetime(updated_at);


-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_sessions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles 
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);

-- ANONYMOUS_SESSIONS POLICIES
CREATE POLICY "sessions_service_only" ON anonymous_sessions 
    FOR ALL TO service_role 
    USING (true) 
    WITH CHECK (true);

-- QUIZ_RESULTS POLICIES
-- Note: Anonymous INSERT handled by insert_quiz_result() function

CREATE POLICY "results_select_anon" ON quiz_results 
    FOR SELECT TO anon
    USING (
        anonymous_session_id::text = 
            current_setting('request.headers', true)::json->>'x-session-id'
    );

CREATE POLICY "results_insert_authenticated" ON quiz_results
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "results_select_authenticated" ON quiz_results 
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = user_id);


-- ============================================================
-- 8. FUNCTIONS
-- ============================================================

-- ───────────────────────────────────────────────────────────
-- FUNCTION: verify_or_create_session
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION verify_or_create_session(
    p_fingerprint TEXT,
    p_session_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session_id UUID;
BEGIN
    IF p_session_id IS NOT NULL THEN
        SELECT id INTO v_session_id 
        FROM anonymous_sessions 
        WHERE id = p_session_id 
          AND fingerprint_hash = p_fingerprint
          AND expires_at > NOW()
          AND claimed_by IS NULL;
        
        IF v_session_id IS NOT NULL THEN
            RETURN v_session_id;
        END IF;
    END IF;
    
    INSERT INTO anonymous_sessions (fingerprint_hash)
    VALUES (p_fingerprint)
    RETURNING id INTO v_session_id;
    
    RETURN v_session_id;
END;
$$;

-- ───────────────────────────────────────────────────────────
-- FUNCTION: insert_quiz_result (SECURE)
-- ───────────────────────────────────────────────────────────
-- Validates session before allowing insert
CREATE OR REPLACE FUNCTION insert_quiz_result(
    p_session_id UUID,
    p_archetype_slug TEXT,
    p_scores JSONB,
    p_answers JSONB,
    p_fingerprint_hash TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'web',
    p_utm_source TEXT DEFAULT NULL,
    p_utm_medium TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL,
    p_duration_seconds INT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result_id UUID;
    v_session_fingerprint TEXT;
BEGIN
    -- Validate session: exists, not expired, not claimed
    SELECT fingerprint_hash INTO v_session_fingerprint
    FROM anonymous_sessions
    WHERE id = p_session_id
      AND expires_at > NOW()
      AND claimed_by IS NULL;
    
    IF v_session_fingerprint IS NULL THEN
        RAISE EXCEPTION 'Invalid, expired, or claimed session'
            USING ERRCODE = 'P0001';
    END IF;
    
    -- Verify fingerprint consistency if provided
    IF p_fingerprint_hash IS NOT NULL 
       AND p_fingerprint_hash != v_session_fingerprint THEN
        RAISE EXCEPTION 'Session fingerprint mismatch'
            USING ERRCODE = 'P0002';
    END IF;
    
    INSERT INTO quiz_results (
        anonymous_session_id,
        fingerprint_hash,
        archetype_slug,
        scores,
        answers,
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        email,
        idempotency_key,
        duration_seconds
    ) VALUES (
        p_session_id,
        COALESCE(p_fingerprint_hash, v_session_fingerprint),
        p_archetype_slug,
        p_scores,
        p_answers,
        p_source,
        p_utm_source,
        p_utm_medium,
        p_utm_campaign,
        p_email,
        p_idempotency_key,
        p_duration_seconds
    )
    RETURNING id INTO v_result_id;
    
    RETURN v_result_id;
END;
$$;

-- ───────────────────────────────────────────────────────────
-- FUNCTION: claim_quizzes_by_email
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION claim_quizzes_by_email()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID;
    v_email TEXT;
    v_count INT;
BEGIN
    v_uid := auth.uid();
    IF v_uid IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'not_authenticated');
    END IF;
    
    SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
    IF v_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'no_email');
    END IF;

    WITH claimed AS (
        UPDATE quiz_results
        SET 
            user_id = v_uid,
            claimed_at = NOW(),
            email = NULL
        WHERE lower(email) = lower(v_email) 
          AND user_id IS NULL
        RETURNING id
    )
    SELECT count(*) INTO v_count FROM claimed;

    UPDATE anonymous_sessions
    SET 
        claimed_by = v_uid,
        claimed_at = NOW()
    WHERE fingerprint_hash IN (
        SELECT DISTINCT fingerprint_hash 
        FROM quiz_results 
        WHERE user_id = v_uid
          AND fingerprint_hash IS NOT NULL
    )
    AND claimed_by IS NULL;

    RETURN json_build_object('success', true, 'claimed_count', COALESCE(v_count, 0));
END;
$$;

-- ───────────────────────────────────────────────────────────
-- FUNCTION: get_results_by_fingerprint
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_results_by_fingerprint(p_fingerprint TEXT)
RETURNS SETOF quiz_results
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM quiz_results 
    WHERE fingerprint_hash = p_fingerprint
    ORDER BY created_at DESC;
$$;

-- ───────────────────────────────────────────────────────────
-- FUNCTION: cleanup_sessions
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.cleanup_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM anonymous_sessions 
    WHERE claimed_by IS NULL 
      AND expires_at < NOW();

    DELETE FROM anonymous_sessions
    WHERE claimed_by IS NOT NULL
      AND claimed_at < NOW() - INTERVAL '90 days';
END;
$$;

-- ───────────────────────────────────────────────────────────
-- FUNCTION: handle_new_user (Profile Creation)
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- 9. FUNCTION PERMISSIONS
-- ============================================================
REVOKE EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION insert_quiz_result FROM PUBLIC;
GRANT EXECUTE ON FUNCTION insert_quiz_result TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION claim_quizzes_by_email() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_quizzes_by_email() TO authenticated;

REVOKE EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION cleanup_sessions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION cleanup_sessions() TO postgres;


-- ============================================================
-- 10. SCHEDULED MAINTENANCE
-- ============================================================
SELECT cron.schedule(
    'cleanup-sessions',
    '0 3 * * *',
    'SELECT public.cleanup_sessions();'
);


-- ============================================================
-- 12. TABLE: waitlist
-- ============================================================
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('pending', 'active', 'unsubscribed', 'converted')),

  -- Attribution
  source TEXT DEFAULT 'web' CHECK (source IN ('web', 'quiz', 'referral', 'api', 'other')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,

  -- Quiz integration
  quiz_result_id UUID REFERENCES quiz_results(id) ON DELETE SET NULL,

  -- Compliance
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  unsubscribed_at TIMESTAMPTZ,

  -- Conversion tracking
  converted_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  converted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN waitlist.status IS 'pending reserved for future double opt-in';

-- ============================================================
-- 13. WAITLIST INDEXES
-- ============================================================
-- Case-insensitive uniqueness (single row per email, reactivation via update)
CREATE UNIQUE INDEX waitlist_email_unique ON waitlist (lower(email));

-- Fast unsubscribe token lookup
CREATE UNIQUE INDEX waitlist_unsubscribe_token_idx ON waitlist (unsubscribe_token);

-- Active subscribers for campaigns
CREATE INDEX waitlist_active_created_idx ON waitlist (created_at DESC)
WHERE status = 'active';

-- UTM analytics
CREATE INDEX waitlist_utm_idx ON waitlist (utm_source, utm_campaign)
WHERE utm_source IS NOT NULL;

-- Quiz attribution
CREATE INDEX waitlist_quiz_result_idx ON waitlist (quiz_result_id)
WHERE quiz_result_id IS NOT NULL;

-- Conversion reporting
CREATE INDEX waitlist_converted_idx ON waitlist (converted_at DESC)
WHERE status = 'converted';

-- ============================================================
-- 14. WAITLIST TRIGGER
-- ============================================================
CREATE TRIGGER waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);

-- ============================================================
-- 15. WAITLIST RLS
-- ============================================================
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_service_only" ON waitlist
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 16. WAITLIST FUNCTIONS
-- ============================================================

-- ───────────────────────────────────────────────────────────
-- FUNCTION: join_waitlist
-- Handles new signups AND reactivations (single row per email)
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION join_waitlist(
  p_email TEXT,
  p_source TEXT DEFAULT 'web',
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_quiz_result_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_is_new BOOLEAN;
  v_unsubscribe_token UUID;
  v_email_normalized TEXT;
BEGIN
  -- Normalize email
  v_email_normalized := lower(trim(p_email));

  -- Validate email format (stricter regex)
  IF v_email_normalized !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_email');
  END IF;

  -- Upsert: insert or update existing (including reactivation after unsubscribe)
  INSERT INTO waitlist (email, source, utm_source, utm_medium, utm_campaign, referrer, quiz_result_id)
  VALUES (v_email_normalized, p_source, p_utm_source, p_utm_medium, p_utm_campaign, p_referrer, p_quiz_result_id)
  ON CONFLICT (lower(email))
  DO UPDATE SET
    status = 'active',
    unsubscribed_at = NULL,
    updated_at = now(),
    -- First-touch attribution (only update if null)
    utm_source = COALESCE(waitlist.utm_source, EXCLUDED.utm_source),
    utm_medium = COALESCE(waitlist.utm_medium, EXCLUDED.utm_medium),
    utm_campaign = COALESCE(waitlist.utm_campaign, EXCLUDED.utm_campaign),
    quiz_result_id = COALESCE(waitlist.quiz_result_id, EXCLUDED.quiz_result_id)
  RETURNING id, (xmax = 0), unsubscribe_token
  INTO v_id, v_is_new, v_unsubscribe_token;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'is_new', v_is_new,
    'unsubscribe_token', v_unsubscribe_token
  );
END;
$$;


-- ───────────────────────────────────────────────────────────
-- FUNCTION: waitlist_unsubscribe
-- Token-based unsubscribe
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION waitlist_unsubscribe(p_token UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  UPDATE waitlist
  SET status = 'unsubscribed', unsubscribed_at = now()
  WHERE unsubscribe_token = p_token AND status = 'active'
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'invalid_or_already_unsubscribed');
  END IF;

  RETURN json_build_object('success', true, 'id', v_id);
END;
$$;


-- ───────────────────────────────────────────────────────────
-- FUNCTION: waitlist_mark_converted
-- Manual conversion tracking
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION waitlist_mark_converted(
  p_email TEXT,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE waitlist
  SET status = 'converted', converted_user_id = p_user_id, converted_at = now()
  WHERE lower(email) = lower(trim(p_email)) AND status = 'active';

  RETURN FOUND;
END;
$$;


-- ───────────────────────────────────────────────────────────
-- FUNCTION: auto_convert_waitlist
-- Auto-conversion trigger when user signs up
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION auto_convert_waitlist()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE waitlist
  SET status = 'converted', converted_user_id = NEW.id, converted_at = now()
  WHERE lower(email) = lower(NEW.email) AND status = 'active';
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_convert_waitlist
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_convert_waitlist();

-- ============================================================
-- 17. WAITLIST FUNCTION PERMISSIONS
-- ============================================================
REVOKE EXECUTE ON FUNCTION join_waitlist FROM PUBLIC;
GRANT EXECUTE ON FUNCTION join_waitlist TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION waitlist_unsubscribe FROM PUBLIC;
GRANT EXECUTE ON FUNCTION waitlist_unsubscribe TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION waitlist_mark_converted FROM PUBLIC;
GRANT EXECUTE ON FUNCTION waitlist_mark_converted TO service_role;


-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================


-- OPTIONAL: Archive old raw answers after 1 year to save space
-- Scores and attribution are preserved, only raw answers cleared
/*
CREATE OR REPLACE FUNCTION public.archive_old_answers()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE quiz_results 
    SET answers = '{}'::jsonb 
    WHERE created_at < NOW() - INTERVAL '1 year'
      AND answers != '{}'::jsonb;
END;
$$;

SELECT extensions.cron.schedule(
    'archive-old-answers',
    '0 4 1 * *',
    'SELECT public.archive_old_answers();'
);
*/


-- ============================================================
-- 11. INITIAL DATA / MIGRATIONS
-- ============================================================
-- Add any seed data or migration helpers here

-- Example: Create profile automatically when user signs up
-- (Usually done via Supabase trigger or Edge Function)
/*
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
*/


-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
