-- =============================================================================
-- SECURITY LOCKDOWN MIGRATION v1
-- =============================================================================
-- Date: 2025-12-15
-- Purpose: Lock down database permissions to service_role only pattern
-- Source Plan: /Users/zyy/.claude/plans/temporal-greeting-nygaard.md
--
-- EXECUTION: Apply via Supabase SQL Editor (Dashboard > SQL Editor)
-- ROLLBACK: See rollback section at bottom of file
-- =============================================================================

BEGIN;

-- =============================================================================
-- PHASE 1: LOCK DOWN RPC FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1.1 Website-Only Functions → service_role Only
-- These are called via Next.js API routes which use SUPABASE_SERVICE_ROLE_KEY
-- -----------------------------------------------------------------------------

-- verify_or_create_session
REVOKE EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) TO service_role;

-- insert_quiz_result (12 params with defaults)
REVOKE EXECUTE ON FUNCTION insert_quiz_result(uuid, text, jsonb, jsonb, text, text, text, text, text, text, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION insert_quiz_result(uuid, text, jsonb, jsonb, text, text, text, text, text, text, text, integer) TO service_role;

-- create_or_get_share_slug
REVOKE EXECUTE ON FUNCTION create_or_get_share_slug(UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_or_get_share_slug(UUID, UUID, TEXT) TO service_role;

-- join_waitlist (7 params with defaults)
REVOKE EXECUTE ON FUNCTION join_waitlist(text, text, text, text, text, text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION join_waitlist(text, text, text, text, text, text, uuid) TO service_role;

-- waitlist_unsubscribe (uuid param, not text)
REVOKE EXECUTE ON FUNCTION waitlist_unsubscribe(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION waitlist_unsubscribe(uuid) TO service_role;

-- cleanup_sessions
REVOKE EXECUTE ON FUNCTION cleanup_sessions() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_sessions() TO service_role;

-- archive_old_answers
REVOKE EXECUTE ON FUNCTION archive_old_answers() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION archive_old_answers() TO service_role;

-- waitlist_mark_converted (2 params: text, uuid)
REVOKE EXECUTE ON FUNCTION waitlist_mark_converted(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION waitlist_mark_converted(text, uuid) TO service_role;

-- get_results_by_fingerprint
REVOKE EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) TO service_role;

-- get_quiz_preview (public read, but via service_role)
REVOKE EXECUTE ON FUNCTION get_quiz_preview(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_preview(UUID) TO service_role;

-- get_quiz_by_public_slug (public read, but via service_role)
REVOKE EXECUTE ON FUNCTION get_quiz_by_public_slug(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_by_public_slug(TEXT) TO service_role;

-- -----------------------------------------------------------------------------
-- 1.2 Mobile-Only Function → authenticated + service_role
-- Called directly from mobile app with Supabase Auth JWT
-- -----------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION claim_quizzes_by_email() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION claim_quizzes_by_email() TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 1.3 Auth Trigger Functions → supabase_auth_admin + service_role
-- CRITICAL: These are triggers on auth.users, executed by supabase_auth_admin
-- -----------------------------------------------------------------------------

-- handle_new_user: creates profile row on signup
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO supabase_auth_admin, service_role;

-- auto_convert_waitlist: marks waitlist converted on signup
REVOKE EXECUTE ON FUNCTION auto_convert_waitlist() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION auto_convert_waitlist() TO supabase_auth_admin, service_role;

-- =============================================================================
-- PHASE 2: FIX ANALYTICS VIEWS (8 Views)
-- =============================================================================
-- All views are currently SECURITY DEFINER (bypass RLS) - dangerous if anon key exposed
-- Fix: Set security_invoker = true and revoke access from anon/authenticated
-- -----------------------------------------------------------------------------

-- Set security_invoker on all analytics views
ALTER VIEW waitlist_stats SET (security_invoker = true);
ALTER VIEW quiz_completion_stats SET (security_invoker = true);
ALTER VIEW quiz_to_waitlist_funnel SET (security_invoker = true);
ALTER VIEW quiz_to_app_funnel SET (security_invoker = true);
ALTER VIEW conversion_by_archetype SET (security_invoker = true);
ALTER VIEW conversion_by_source SET (security_invoker = true);
ALTER VIEW daily_quiz_conversions SET (security_invoker = true);
ALTER VIEW time_to_conversion SET (security_invoker = true);

-- Revoke access entirely (admin-only analytics)
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

-- =============================================================================
-- PHASE 3: REMOVE VULNERABLE RLS POLICY
-- =============================================================================
-- results_select_anon uses header-based auth which is spoofable if anon key exposed
-- Web now uses service_role (bypasses RLS), mobile uses authenticated
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS results_select_anon ON quiz_results;

-- Keep mobile-friendly policies (already exist and are secure):
-- results_select_authenticated: auth.uid() = user_id
-- results_insert_authenticated: auth.uid() = user_id

-- =============================================================================
-- PHASE 4: NEW RPC FOR FULL REPORT SHARING (AUTHENTICATED ONLY)
-- =============================================================================
-- Business Logic:
--   - Web users can share general report (preview URL) without login
--   - Full report sharing requires: (1) authenticated user, (2) claimed the quiz
--   - Once full report link exists, ANYONE can view it (gate is on creation, not viewing)
-- -----------------------------------------------------------------------------

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

-- Only authenticated users + service_role can call
REVOKE EXECUTE ON FUNCTION create_or_get_full_report_slug(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION create_or_get_full_report_slug(UUID, TEXT) TO authenticated, service_role;

-- Add comment for documentation
COMMENT ON FUNCTION create_or_get_full_report_slug IS
'Creates or retrieves a public sharing slug for quiz results.
Requires authenticated user who owns AND has claimed the quiz result.
Once created, the public_slug allows anyone to view the full report.';

COMMIT;

-- =============================================================================
-- VERIFICATION QUERIES (Run after migration to confirm success)
-- =============================================================================
/*
-- Check function grants
SELECT
  p.proname as function_name,
  CASE WHEN has_function_privilege('anon', p.oid, 'EXECUTE') THEN 'YES' ELSE 'NO' END as anon,
  CASE WHEN has_function_privilege('authenticated', p.oid, 'EXECUTE') THEN 'YES' ELSE 'NO' END as authenticated,
  CASE WHEN has_function_privilege('service_role', p.oid, 'EXECUTE') THEN 'YES' ELSE 'NO' END as service_role
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'verify_or_create_session', 'insert_quiz_result', 'create_or_get_share_slug',
    'join_waitlist', 'waitlist_unsubscribe', 'cleanup_sessions', 'archive_old_answers',
    'waitlist_mark_converted', 'get_results_by_fingerprint', 'get_quiz_preview',
    'get_quiz_by_public_slug', 'claim_quizzes_by_email', 'handle_new_user',
    'auto_convert_waitlist', 'create_or_get_full_report_slug'
  )
ORDER BY p.proname;

-- Check view security modes
SELECT
  c.relname as view_name,
  CASE
    WHEN 'security_invoker=true' = ANY(c.reloptions) THEN 'INVOKER (safe)'
    ELSE 'DEFINER (dangerous)'
  END as security_mode
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'v'
  AND c.relname IN (
    'waitlist_stats', 'quiz_completion_stats', 'quiz_to_waitlist_funnel',
    'quiz_to_app_funnel', 'conversion_by_archetype', 'conversion_by_source',
    'daily_quiz_conversions', 'time_to_conversion'
  )
ORDER BY c.relname;

-- Check RLS policies on quiz_results
SELECT policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'quiz_results'
ORDER BY policyname;
*/

-- =============================================================================
-- ROLLBACK (Use only if migration causes issues)
-- =============================================================================
/*
BEGIN;

-- Restore function grants to original state
GRANT EXECUTE ON FUNCTION verify_or_create_session(TEXT, UUID) TO PUBLIC;
GRANT EXECUTE ON FUNCTION insert_quiz_result(uuid, text, jsonb, jsonb, text, text, text, text, text, text, text, integer) TO PUBLIC;
GRANT EXECUTE ON FUNCTION create_or_get_share_slug(UUID, UUID, TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION join_waitlist(text, text, text, text, text, text, uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION waitlist_unsubscribe(uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION cleanup_sessions() TO PUBLIC;
GRANT EXECUTE ON FUNCTION archive_old_answers() TO PUBLIC;
GRANT EXECUTE ON FUNCTION waitlist_mark_converted(text, uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_results_by_fingerprint(TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_quiz_preview(UUID) TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_quiz_by_public_slug(TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION claim_quizzes_by_email() TO PUBLIC;
GRANT EXECUTE ON FUNCTION handle_new_user() TO PUBLIC;
GRANT EXECUTE ON FUNCTION auto_convert_waitlist() TO PUBLIC;

-- Restore view access
GRANT SELECT ON waitlist_stats TO PUBLIC;
GRANT SELECT ON quiz_completion_stats TO PUBLIC;
GRANT SELECT ON quiz_to_waitlist_funnel TO PUBLIC;
GRANT SELECT ON quiz_to_app_funnel TO PUBLIC;
GRANT SELECT ON conversion_by_archetype TO PUBLIC;
GRANT SELECT ON conversion_by_source TO PUBLIC;
GRANT SELECT ON daily_quiz_conversions TO PUBLIC;
GRANT SELECT ON time_to_conversion TO PUBLIC;

-- Recreate results_select_anon policy
CREATE POLICY results_select_anon ON quiz_results
  FOR SELECT TO anon
  USING (anonymous_session_id::text = current_setting('request.headers', true)::json->>'x-session-id');

-- Drop new function
DROP FUNCTION IF EXISTS create_or_get_full_report_slug(UUID, TEXT);

COMMIT;
*/
