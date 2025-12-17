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
    -- Extracts both attachment and communication primary styles
    -- Format: {"attachment": "secure", "communication": "assertive"}
    -- Values can be string, array (ties), or "mixed"
    primary_styles JSONB GENERATED ALWAYS AS (
        ('{"attachment":' || (scores->'attachment'->'primary')::text ||
         ',"communication":' || (scores->'communication'->'primary')::text || '}')::jsonb
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

    -- PUBLIC SHARING
    public_slug TEXT UNIQUE,
    public_slug_created_at TIMESTAMPTZ,
    
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

CREATE INDEX idx_quiz_results_public_slug ON quiz_results(public_slug) 
    WHERE public_slug IS NOT NULL;

CREATE INDEX idx_results_unclaimed_email ON quiz_results(lower(email)) 
    WHERE user_id IS NULL AND email IS NOT NULL;

-- GIN index for JSONB enables efficient containment queries:
--   WHERE primary_styles @> '{"attachment": "secure"}'
--   WHERE primary_styles->'attachment' ? 'anxious'
CREATE INDEX idx_results_primary_styles ON quiz_results
    USING GIN (primary_styles)
    WHERE primary_styles IS NOT NULL;

CREATE INDEX idx_results_archetype ON quiz_results(archetype_slug);

CREATE INDEX idx_results_created_at ON quiz_results(created_at DESC);

-- Composite for archetype analytics with time filtering
CREATE INDEX idx_results_archetype_created
    ON quiz_results(archetype_slug, created_at DESC);

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
-- Note: results_select_anon policy REMOVED (2025-12-15 security lockdown)
--       Web access now uses service_role key which bypasses RLS
--       Mobile access uses authenticated JWT with results_select_authenticated

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
    ON CONFLICT (idempotency_key) DO NOTHING
    RETURNING id INTO v_result_id;

    IF v_result_id IS NULL AND p_idempotency_key IS NOT NULL THEN
        SELECT id INTO v_result_id
        FROM quiz_results
        WHERE idempotency_key = p_idempotency_key;
    END IF;
    
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

-- ============================================
-- RPC Functions for Quiz Results
-- ============================================
-- These functions provide column-level security by exposing
-- only safe columns through SECURITY DEFINER functions.
-- 
-- IMPORTANT: The existing codebase uses service_role key which
-- bypasses RLS. These RPCs are for future-proofing when/if
-- anon key access is needed.
-- ============================================

-- 1. Preview access (safe columns only)
-- Used by: /quiz/results/[resultId] route
CREATE OR REPLACE FUNCTION get_quiz_preview(result_id UUID)
RETURNS TABLE (
  id UUID,
  archetype_slug TEXT,
  scores JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- pg_temp LAST prevents temp object hijacking
AS $$
BEGIN
  RETURN QUERY
  SELECT qr.id, qr.archetype_slug, qr.scores, qr.created_at
  FROM quiz_results qr
  WHERE qr.id = result_id;
END;
$$;

-- 2. Public share access (by slug)
-- Used by: /quiz/p/[publicSlug] route
CREATE OR REPLACE FUNCTION get_quiz_by_public_slug(slug TEXT)
RETURNS TABLE (
  id UUID,
  archetype_slug TEXT,
  scores JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT qr.id, qr.archetype_slug, qr.scores, qr.created_at
  FROM quiz_results qr
  WHERE qr.public_slug = slug;
END;
$$;

-- 3. Create/get share slug (idempotent)
-- Used by: /api/quiz/share endpoint
-- Returns existing slug or creates new one
CREATE OR REPLACE FUNCTION create_or_get_share_slug(
  p_result_id UUID,
  p_session_id UUID,
  p_new_slug TEXT
)
RETURNS TABLE (
  public_slug TEXT,
  created BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_existing_slug TEXT;
  v_session_id UUID;
BEGIN
  -- Verify ownership via session_id
  SELECT qr.anonymous_session_id, qr.public_slug
  INTO v_session_id, v_existing_slug
  FROM quiz_results qr
  WHERE qr.id = p_result_id;
  
  -- Result not found
  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'RESULT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  
  -- Session mismatch (ownership verification)
  IF v_session_id != p_session_id THEN
    RAISE EXCEPTION 'ACCESS_DENIED' USING ERRCODE = 'P0001';
  END IF;
  
  -- Return existing slug if present (idempotent)
  IF v_existing_slug IS NOT NULL THEN
    RETURN QUERY SELECT v_existing_slug, FALSE;
    RETURN;
  END IF;
  
  -- Create new slug (using table alias to avoid column name ambiguity)
  UPDATE quiz_results qr
  SET public_slug = p_new_slug,
      public_slug_created_at = NOW()
  WHERE qr.id = p_result_id
    AND qr.public_slug IS NULL;  -- Double-check for race condition
  
  -- Return the new slug
  RETURN QUERY SELECT p_new_slug, TRUE;
END;
$$;

-- ───────────────────────────────────────────────────────────
-- FUNCTION: create_or_get_full_report_slug (AUTHENTICATED ONLY)
-- ───────────────────────────────────────────────────────────
-- Business Logic:
--   - Web users can share general report (preview URL) without login
--   - Full report sharing requires: (1) authenticated user, (2) claimed the quiz
--   - Once full report link exists, ANYONE can view it (gate is on creation, not viewing)
CREATE OR REPLACE FUNCTION create_or_get_full_report_slug(
  p_result_id UUID,
  p_new_slug TEXT
)
RETURNS TABLE (public_slug TEXT, created BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_existing_slug TEXT;
  v_claimed_at TIMESTAMPTZ;
BEGIN
  -- Must be authenticated
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED' USING ERRCODE = 'P0001';
  END IF;

  -- Validate slug format (nanoid 21 chars, URL-safe alphabet)
  IF p_new_slug IS NULL OR p_new_slug !~ '^[A-Za-z0-9_-]{21}$' THEN
    RAISE EXCEPTION 'INVALID_SLUG' USING ERRCODE = '22023';
  END IF;

  -- Check ownership AND claimed status
  SELECT qr.public_slug, qr.claimed_at INTO v_existing_slug, v_claimed_at
  FROM quiz_results qr
  WHERE qr.id = p_result_id
    AND qr.user_id = v_uid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'RESULT_NOT_FOUND_OR_NOT_OWNED' USING ERRCODE = 'P0002';
  END IF;

  -- Must have claimed the quiz (logged into mobile app)
  IF v_claimed_at IS NULL THEN
    RAISE EXCEPTION 'QUIZ_NOT_CLAIMED' USING ERRCODE = 'P0001';
  END IF;

  -- Return existing slug if already created (idempotent)
  IF v_existing_slug IS NOT NULL THEN
    RETURN QUERY SELECT v_existing_slug, FALSE;
    RETURN;
  END IF;

  -- Create new slug
  UPDATE quiz_results qr
  SET public_slug = p_new_slug,
      public_slug_created_at = now()
  WHERE qr.id = p_result_id
    AND qr.user_id = v_uid
    AND qr.public_slug IS NULL;

  IF NOT FOUND THEN
    -- Race condition: another request created the slug
    SELECT qr.public_slug INTO v_existing_slug
    FROM quiz_results qr
    WHERE qr.id = p_result_id;

    RETURN QUERY SELECT v_existing_slug, FALSE;
    RETURN;
  END IF;

  RETURN QUERY SELECT p_new_slug, TRUE;
END;
$$;

COMMENT ON FUNCTION create_or_get_full_report_slug IS
'Creates or retrieves a public sharing slug for quiz results.
Requires authenticated user who owns AND has claimed the quiz result.
Once created, the public_slug allows anyone to view the full report.';

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
-- 9. FUNCTION PERMISSIONS (Security Lockdown v1 - 2025-12-15)
-- ============================================================
-- ARCHITECTURE:
--   Web: Cloudflare WAF → Next.js API routes → service_role key → Supabase
--   Mobile: Supabase Auth → authenticated JWT → RLS (for claim only)
--
-- This pattern locks down all RPC functions to service_role only,
-- with exceptions for:
--   • claim_quizzes_by_email: authenticated + service_role (mobile direct)
--   • Auth triggers: supabase_auth_admin + service_role
--   • create_or_get_full_report_slug: authenticated + service_role (mobile only)
-- ============================================================

-- -----------------------------------------------------------------------------
-- 9.1 Website-Only Functions → service_role Only
-- These are called via Next.js API routes which use SUPABASE_SERVICE_ROLE_KEY
-- -----------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) TO service_role;

REVOKE EXECUTE ON FUNCTION insert_quiz_result(uuid, text, jsonb, jsonb, text, text, text, text, text, text, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION insert_quiz_result(uuid, text, jsonb, jsonb, text, text, text, text, text, text, text, integer) TO service_role;

REVOKE EXECUTE ON FUNCTION create_or_get_share_slug(UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_or_get_share_slug(UUID, UUID, TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION get_quiz_preview(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_preview(UUID) TO service_role;

REVOKE EXECUTE ON FUNCTION get_quiz_by_public_slug(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_by_public_slug(TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION cleanup_sessions() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_sessions() TO service_role;

-- -----------------------------------------------------------------------------
-- 9.2 Mobile-Only Functions → authenticated + service_role
-- Called directly from mobile app with Supabase Auth JWT
-- -----------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION claim_quizzes_by_email() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION claim_quizzes_by_email() TO authenticated, service_role;

-- Full report sharing requires authenticated user who has claimed the quiz
REVOKE EXECUTE ON FUNCTION create_or_get_full_report_slug(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION create_or_get_full_report_slug(UUID, TEXT) TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 9.3 Auth Trigger Functions → supabase_auth_admin + service_role
-- CRITICAL: These are triggers on auth.users, executed by supabase_auth_admin
-- -----------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO supabase_auth_admin, service_role;


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
-- Also syncs email to quiz_results for claim_quizzes_by_email flow
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

  -- Sync email to quiz_results for claim_quizzes_by_email flow
  -- First-touch attribution: only set if email is currently NULL
  IF p_quiz_result_id IS NOT NULL THEN
    UPDATE quiz_results
    SET email = v_email_normalized
    WHERE id = p_quiz_result_id
      AND email IS NULL;
  END IF;

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
-- 17. WAITLIST FUNCTION PERMISSIONS (Security Lockdown v1)
-- ============================================================

-- Website-only functions → service_role only
REVOKE EXECUTE ON FUNCTION join_waitlist(text, text, text, text, text, text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION join_waitlist(text, text, text, text, text, text, uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION waitlist_unsubscribe(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION waitlist_unsubscribe(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION waitlist_mark_converted(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION waitlist_mark_converted(text, uuid) TO service_role;

-- Auth trigger → supabase_auth_admin + service_role
REVOKE EXECUTE ON FUNCTION auto_convert_waitlist() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION auto_convert_waitlist() TO supabase_auth_admin, service_role;

-- ============================================================
-- 18. WAITLIST ANALYTICS VIEW
-- ============================================================

/*
 * VIEW: waitlist_stats
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: How healthy is our waitlist? What's the overall conversion rate?
 *
 * WHY: Daily health check for waitlist growth and app download pipeline.
 *      Helps answer "Are we growing?" and "Are signups converting to users?"
 *
 * COLUMNS:
 *   - total_signups:       All-time waitlist entries (any status)
 *   - active:              Currently subscribed, waiting for app
 *   - converted:           Downloaded the app (status='converted')
 *   - unsubscribed:        Opted out of waitlist
 *   - conversion_rate_pct: % of signups who downloaded app
 *   - signups_7d:          New signups in last 7 days (growth velocity)
 *   - signups_30d:         New signups in last 30 days (monthly trend)
 *
 * EXAMPLE:
 *   SELECT * FROM waitlist_stats;
 */
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT
  COUNT(*) AS total_signups,
  COUNT(*) FILTER (WHERE status = 'active') AS active,
  COUNT(*) FILTER (WHERE status = 'converted') AS converted,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') AS unsubscribed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'converted') / NULLIF(COUNT(*), 0), 2) AS conversion_rate_pct,
  COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') AS signups_7d,
  COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days') AS signups_30d
FROM waitlist;

-- ============================================================
-- 19. QUIZ ANALYTICS VIEWS
-- ============================================================

/*
 * VIEW: quiz_completion_stats
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Is the quiz being used? Which personality results are most common?
 *
 * WHY: Monitor quiz engagement and identify if certain archetypes dominate.
 *      If one archetype is 80%+ of results, quiz may need rebalancing.
 *
 * COLUMNS:
 *   - total_completions:     All-time quiz completions
 *   - completions_7d:        Quiz completions in last 7 days
 *   - completions_30d:       Quiz completions in last 30 days
 *   - unique_archetypes:     How many different results are being assigned
 *   - most_common_archetype: The personality type assigned most often
 *
 * EXAMPLE:
 *   SELECT * FROM quiz_completion_stats;
 *   -- Check if results are balanced: unique_archetypes should be high
 */
CREATE OR REPLACE VIEW quiz_completion_stats AS
SELECT
  COUNT(*) AS total_completions,
  COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') AS completions_7d,
  COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days') AS completions_30d,
  COUNT(DISTINCT archetype_slug) AS unique_archetypes,
  MODE() WITHIN GROUP (ORDER BY archetype_slug) AS most_common_archetype
FROM quiz_results;


/*
 * VIEW: quiz_to_waitlist_funnel
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Does completing the quiz drive more waitlist signups?
 *
 * WHY: Measures whether quiz is an effective lead generation tool.
 *      Compare quiz_to_waitlist_pct over time to evaluate quiz ROI.
 *      If quiz users convert to waitlist at higher rate than direct,
 *      invest more in quiz promotion.
 *
 * COLUMNS:
 *   - quiz_completions:      Total users who finished the quiz
 *   - quiz_driven_signups:   Waitlist signups that came through quiz
 *   - direct_signups:        Waitlist signups without taking quiz
 *   - quiz_to_waitlist_pct:  Conversion rate: quiz → waitlist signup
 *   - quiz_completions_7d:   Quiz completions in last 7 days
 *   - quiz_signups_7d:       Quiz-driven signups in last 7 days
 *
 * KEY METRIC: quiz_to_waitlist_pct
 *   - >50%: Quiz is effective at converting to signups
 *   - <20%: Quiz may be entertainment only, not driving action
 *
 * EXAMPLE:
 *   SELECT quiz_to_waitlist_pct FROM quiz_to_waitlist_funnel;
 */
CREATE OR REPLACE VIEW quiz_to_waitlist_funnel AS
SELECT
  (SELECT COUNT(*) FROM quiz_results) AS quiz_completions,
  COUNT(*) FILTER (WHERE quiz_result_id IS NOT NULL) AS quiz_driven_signups,
  COUNT(*) FILTER (WHERE quiz_result_id IS NULL) AS direct_signups,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE quiz_result_id IS NOT NULL) /
    NULLIF((SELECT COUNT(*) FROM quiz_results), 0), 2
  ) AS quiz_to_waitlist_pct,
  (SELECT COUNT(*) FROM quiz_results WHERE created_at >= now() - interval '7 days') AS quiz_completions_7d,
  COUNT(*) FILTER (WHERE quiz_result_id IS NOT NULL AND created_at >= now() - interval '7 days') AS quiz_signups_7d
FROM waitlist
WHERE status IN ('active', 'converted');


/*
 * VIEW: quiz_to_app_funnel
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Does the quiz ultimately drive app downloads?
 *
 * WHY: The ultimate ROI question for the quiz feature.
 *      Compare quiz_signup_to_app_pct vs direct_signup_to_app_pct:
 *      - If quiz users convert better → quiz creates higher-intent leads
 *      - If direct users convert better → quiz may attract window-shoppers
 *
 * COLUMNS:
 *   - total_conversions:       All users who downloaded the app
 *   - quiz_driven_conversions: App downloads from users who took quiz first
 *   - direct_conversions:      App downloads from users who skipped quiz
 *   - quiz_attribution_pct:    % of all app downloads that came through quiz
 *   - quiz_signup_to_app_pct:  Quiz waitlist → app conversion rate
 *   - direct_signup_to_app_pct: Direct waitlist → app conversion rate
 *
 * KEY INSIGHT: Compare quiz_signup_to_app_pct vs direct_signup_to_app_pct
 *   - quiz > direct: Quiz creates more committed users
 *   - quiz < direct: Direct visitors may be more motivated
 *
 * EXAMPLE:
 *   SELECT quiz_signup_to_app_pct, direct_signup_to_app_pct
 *   FROM quiz_to_app_funnel;
 */
CREATE OR REPLACE VIEW quiz_to_app_funnel AS
SELECT
  COUNT(*) FILTER (WHERE status = 'converted') AS total_conversions,
  COUNT(*) FILTER (WHERE status = 'converted' AND quiz_result_id IS NOT NULL) AS quiz_driven_conversions,
  COUNT(*) FILTER (WHERE status = 'converted' AND quiz_result_id IS NULL) AS direct_conversions,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'converted' AND quiz_result_id IS NOT NULL) /
    NULLIF(COUNT(*) FILTER (WHERE status = 'converted'), 0), 2
  ) AS quiz_attribution_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'converted' AND quiz_result_id IS NOT NULL) /
    NULLIF(COUNT(*) FILTER (WHERE quiz_result_id IS NOT NULL), 0), 2
  ) AS quiz_signup_to_app_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'converted' AND quiz_result_id IS NULL) /
    NULLIF(COUNT(*) FILTER (WHERE quiz_result_id IS NULL), 0), 2
  ) AS direct_signup_to_app_pct
FROM waitlist;


/*
 * VIEW: conversion_by_archetype
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Which quiz personality types convert best to app downloads?
 *
 * WHY: Identify high-value user segments for targeted marketing.
 *      If "Adventurous Romantic" converts at 40% but "Casual Dater" at 5%,
 *      prioritize messaging to attract more Adventurous Romantics.
 *
 * COLUMNS:
 *   - archetype_slug:        Quiz result type (personality category)
 *   - quiz_completions:      Users who got this result
 *   - waitlist_signups:      Users with this result who joined waitlist
 *   - app_conversions:       Users with this result who downloaded app
 *   - quiz_to_waitlist_pct:  This archetype's quiz → waitlist rate
 *   - waitlist_to_app_pct:   This archetype's waitlist → app rate
 *   - quiz_to_app_pct:       This archetype's end-to-end conversion
 *
 * ACTIONABLE: Find archetypes with high quiz_to_app_pct and target
 *             marketing to attract similar personality types.
 *
 * EXAMPLE:
 *   SELECT archetype_slug, quiz_to_app_pct
 *   FROM conversion_by_archetype
 *   ORDER BY quiz_to_app_pct DESC;
 */
CREATE OR REPLACE VIEW conversion_by_archetype AS
SELECT
  qr.archetype_slug,
  COUNT(DISTINCT qr.id) AS quiz_completions,
  COUNT(DISTINCT w.id) AS waitlist_signups,
  COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'converted') AS app_conversions,
  ROUND(100.0 * COUNT(DISTINCT w.id) / NULLIF(COUNT(DISTINCT qr.id), 0), 2) AS quiz_to_waitlist_pct,
  ROUND(100.0 * COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'converted') / NULLIF(COUNT(DISTINCT w.id), 0), 2) AS waitlist_to_app_pct,
  ROUND(100.0 * COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'converted') / NULLIF(COUNT(DISTINCT qr.id), 0), 2) AS quiz_to_app_pct
FROM quiz_results qr
LEFT JOIN waitlist w ON w.quiz_result_id = qr.id
GROUP BY qr.archetype_slug
ORDER BY quiz_completions DESC;


/*
 * VIEW: conversion_by_source
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: Which marketing channels drive the highest-converting quiz users?
 *
 * WHY: Optimize ad spend by identifying which campaigns produce
 *      users who actually download the app, not just take the quiz.
 *      A campaign with 1000 quiz completions but 0% app conversion
 *      is worse than one with 100 completions at 20% conversion.
 *
 * COLUMNS:
 *   - utm_source:           Traffic source (instagram, tiktok, google, 'direct')
 *   - utm_campaign:         Campaign name or 'none' if not tagged
 *   - quiz_completions:     Users from this source who completed quiz
 *   - waitlist_signups:     Users from this source who joined waitlist
 *   - app_conversions:      Users from this source who downloaded app
 *   - quiz_to_waitlist_pct: Source's quiz → waitlist conversion
 *   - quiz_to_app_pct:      Source's end-to-end conversion (the key metric)
 *
 * ACTIONABLE: Double down on sources with high quiz_to_app_pct,
 *             cut spend on sources with high volume but low conversion.
 *
 * EXAMPLE:
 *   SELECT utm_source, quiz_completions, quiz_to_app_pct
 *   FROM conversion_by_source
 *   WHERE quiz_completions > 50
 *   ORDER BY quiz_to_app_pct DESC;
 */
CREATE OR REPLACE VIEW conversion_by_source AS
SELECT
  COALESCE(qr.utm_source, 'direct') AS utm_source,
  COALESCE(qr.utm_campaign, 'none') AS utm_campaign,
  COUNT(DISTINCT qr.id) AS quiz_completions,
  COUNT(DISTINCT w.id) AS waitlist_signups,
  COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'converted') AS app_conversions,
  ROUND(100.0 * COUNT(DISTINCT w.id) / NULLIF(COUNT(DISTINCT qr.id), 0), 2) AS quiz_to_waitlist_pct,
  ROUND(100.0 * COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'converted') / NULLIF(COUNT(DISTINCT qr.id), 0), 2) AS quiz_to_app_pct
FROM quiz_results qr
LEFT JOIN waitlist w ON w.quiz_result_id = qr.id
GROUP BY COALESCE(qr.utm_source, 'direct'), COALESCE(qr.utm_campaign, 'none')
ORDER BY quiz_completions DESC;


/*
 * VIEW: daily_quiz_conversions
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: How are quiz conversions trending day-over-day?
 *
 * WHY: Spot trends, seasonality, and campaign impacts over time.
 *      Did a TikTok post cause a spike? Did a bug tank conversions?
 *      Rolling 90-day window for recent trend analysis.
 *
 * COLUMNS:
 *   - date:                       Calendar date
 *   - quiz_completions:           Quiz completions on this day
 *   - waitlist_signups:           All waitlist signups on this day
 *   - quiz_driven_signups:        Waitlist signups from quiz on this day
 *   - app_conversions:            App downloads on this day
 *   - daily_quiz_to_waitlist_pct: That day's quiz → waitlist rate
 *
 * USE CASES:
 *   - Weekly review: SELECT * FROM daily_quiz_conversions LIMIT 7;
 *   - Find best day: ORDER BY quiz_completions DESC LIMIT 1;
 *   - Spot drops: Look for days where daily_quiz_to_waitlist_pct crashes
 *
 * EXAMPLE:
 *   SELECT date, quiz_completions, quiz_driven_signups, daily_quiz_to_waitlist_pct
 *   FROM daily_quiz_conversions
 *   WHERE date >= now() - interval '7 days';
 */
CREATE OR REPLACE VIEW daily_quiz_conversions AS
SELECT
  d.date,
  COALESCE(q.completions, 0) AS quiz_completions,
  COALESCE(w.signups, 0) AS waitlist_signups,
  COALESCE(w.quiz_signups, 0) AS quiz_driven_signups,
  COALESCE(c.conversions, 0) AS app_conversions,
  ROUND(100.0 * COALESCE(w.quiz_signups, 0) / NULLIF(COALESCE(q.completions, 0), 0), 2) AS daily_quiz_to_waitlist_pct
FROM (
  SELECT generate_series(
    (now() - interval '90 days')::date,
    now()::date,
    '1 day'::interval
  )::date AS date
) d
LEFT JOIN (
  SELECT created_at::date AS date, COUNT(*) AS completions
  FROM quiz_results GROUP BY 1
) q ON q.date = d.date
LEFT JOIN (
  SELECT created_at::date AS date, COUNT(*) AS signups,
    COUNT(*) FILTER (WHERE quiz_result_id IS NOT NULL) AS quiz_signups
  FROM waitlist GROUP BY 1
) w ON w.date = d.date
LEFT JOIN (
  SELECT converted_at::date AS date, COUNT(*) AS conversions
  FROM waitlist WHERE status = 'converted' GROUP BY 1
) c ON c.date = d.date
ORDER BY d.date DESC;


/*
 * VIEW: time_to_conversion
 * ─────────────────────────────────────────────────────────────
 * PURPOSE: How long does it take users to move through the funnel?
 *
 * WHY: Understand user decision-making timeline.
 *      - Fast conversion (< 1 hour): High-intent, quiz creates urgency
 *      - Slow conversion (> 7 days): Need nurturing, add email sequences
 *      Helps design follow-up timing (when to send reminder emails).
 *
 * COLUMNS:
 *   - id:                     Waitlist entry ID (for debugging)
 *   - archetype_slug:         User's quiz result
 *   - utm_source:             Where they came from
 *   - quiz_completed_at:      When they finished the quiz
 *   - waitlist_joined_at:     When they signed up for waitlist
 *   - converted_at:           When they downloaded the app
 *   - hours_quiz_to_waitlist: Hours between quiz and signup
 *   - hours_waitlist_to_app:  Hours between signup and app download
 *   - hours_quiz_to_app:      Total hours from quiz to app download
 *
 * AGGREGATE EXAMPLE:
 *   SELECT
 *     ROUND(AVG(hours_quiz_to_waitlist), 1) AS avg_hours_to_signup,
 *     ROUND(AVG(hours_quiz_to_app), 1) AS avg_hours_to_app,
 *     ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY hours_quiz_to_app), 1) AS median_hours
 *   FROM time_to_conversion;
 */
CREATE OR REPLACE VIEW time_to_conversion AS
SELECT
  w.id,
  qr.archetype_slug,
  COALESCE(qr.utm_source, 'direct') AS utm_source,
  qr.created_at AS quiz_completed_at,
  w.created_at AS waitlist_joined_at,
  w.converted_at,
  ROUND(EXTRACT(EPOCH FROM (w.created_at - qr.created_at)) / 3600, 2) AS hours_quiz_to_waitlist,
  ROUND(EXTRACT(EPOCH FROM (w.converted_at - w.created_at)) / 3600, 2) AS hours_waitlist_to_app,
  ROUND(EXTRACT(EPOCH FROM (w.converted_at - qr.created_at)) / 3600, 2) AS hours_quiz_to_app
FROM waitlist w
JOIN quiz_results qr ON qr.id = w.quiz_result_id
WHERE w.status = 'converted'
ORDER BY w.converted_at DESC;


-- ============================================================
-- 20. ANALYTICS VIEW SECURITY (Security Lockdown v1 - 2025-12-15)
-- ============================================================
-- All analytics views are admin-only. Use ALTER VIEW to set security_invoker
-- (safer than DROP/CREATE as it preserves any view dependents).
-- SECURITY INVOKER means views respect RLS of the querying user.

ALTER VIEW waitlist_stats SET (security_invoker = true);
ALTER VIEW quiz_completion_stats SET (security_invoker = true);
ALTER VIEW quiz_to_waitlist_funnel SET (security_invoker = true);
ALTER VIEW quiz_to_app_funnel SET (security_invoker = true);
ALTER VIEW conversion_by_archetype SET (security_invoker = true);
ALTER VIEW conversion_by_source SET (security_invoker = true);
ALTER VIEW daily_quiz_conversions SET (security_invoker = true);
ALTER VIEW time_to_conversion SET (security_invoker = true);

-- Revoke all access from anon/authenticated (admin-only analytics)
REVOKE ALL ON waitlist_stats FROM PUBLIC, anon, authenticated;
REVOKE ALL ON quiz_completion_stats FROM PUBLIC, anon, authenticated;
REVOKE ALL ON quiz_to_waitlist_funnel FROM PUBLIC, anon, authenticated;
REVOKE ALL ON quiz_to_app_funnel FROM PUBLIC, anon, authenticated;
REVOKE ALL ON conversion_by_archetype FROM PUBLIC, anon, authenticated;
REVOKE ALL ON conversion_by_source FROM PUBLIC, anon, authenticated;
REVOKE ALL ON daily_quiz_conversions FROM PUBLIC, anon, authenticated;
REVOKE ALL ON time_to_conversion FROM PUBLIC, anon, authenticated;

-- Ensure service_role can still query all tables/views
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;


-- ============================================================
-- 21. ARCHIVE FUNCTION
-- ============================================================

-- Archive old raw answers after 1 year to save storage (35-55% reduction)
-- Scores and attribution are preserved, only raw answers cleared
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

-- Run monthly at 4 AM on the 1st
SELECT cron.schedule(
    'archive-old-answers',
    '0 4 1 * *',
    'SELECT public.archive_old_answers();'
);

REVOKE EXECUTE ON FUNCTION archive_old_answers() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION archive_old_answers() TO service_role;


-- ============================================================
-- INITIAL DATA / MIGRATIONS
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
