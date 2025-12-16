/**
 * Supabase Test Helpers
 *
 * Shared utilities for integration tests that interact with real Supabase.
 *
 * Prerequisites:
 *   - SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - SUPABASE_ANON_KEY in .env.local
 */

import { config } from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Configuration
export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// Test user credentials
export const TEST_EMAIL = "test-security@firstdatelabs.com";
export const TEST_PASSWORD = "TestPassword123!";

// Service role client (for admin operations - bypasses RLS)
export const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Anonymous client (for unauthenticated tests)
export const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Create or retrieve a test user
 * @returns User ID
 */
export async function ensureTestUser(): Promise<string> {
  // Check if user exists
  const { data: users } = await adminClient.auth.admin.listUsers();
  let user = users.users.find((u) => u.email === TEST_EMAIL);

  if (user) {
    return user.id;
  }

  // Create test user
  const { data, error } = await adminClient.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true, // Auto-confirm email
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  return data.user.id;
}

/**
 * Create an authenticated Supabase client for the test user
 */
export async function createAuthenticatedClient(): Promise<{
  client: SupabaseClient;
  userId: string;
  accessToken: string;
}> {
  const { data: authData, error: authError } =
    await anonClient.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

  if (authError || !authData.session) {
    throw new Error(`Failed to sign in: ${authError?.message}`);
  }

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${authData.session.access_token}`,
      },
    },
  });

  return {
    client,
    userId: authData.user.id,
    accessToken: authData.session.access_token,
  };
}

/**
 * Create an anonymous session (required by foreign key for quiz_results)
 * @returns Session ID
 */
export async function createAnonymousSession(): Promise<string> {
  const sessionId = crypto.randomUUID();
  const { error } = await adminClient.from("anonymous_sessions").insert({
    id: sessionId,
    fingerprint_hash: `test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  });

  if (error) {
    throw new Error(`Failed to create anonymous session: ${error.message}`);
  }
  return sessionId;
}

/**
 * Create a quiz result for testing
 */
export async function createQuizResult(opts: {
  email?: string;
  userId?: string;
  claimedAt?: string;
  publicSlug?: string;
  archetypeSlug?: string;
}): Promise<{ id: string; sessionId: string }> {
  const sessionId = await createAnonymousSession();

  const { data, error } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: opts.archetypeSlug || "fiery-pursuer",
      scores: { attachment: { primary: "anxious", scores: {} } },
      answers: {},
      email: opts.email || null,
      user_id: opts.userId || null,
      claimed_at: opts.claimedAt || null,
      public_slug: opts.publicSlug || null,
      anonymous_session_id: sessionId,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create quiz result: ${error.message}`);
  }

  return { id: data.id, sessionId };
}

/**
 * Clean up all test data
 */
export async function cleanupTestData(): Promise<void> {
  // Get test user ID
  const { data: testUsers } = await adminClient.auth.admin.listUsers();
  const user = testUsers.users.find((u) => u.email === TEST_EMAIL);

  // Delete quiz results by email pattern
  await adminClient
    .from("quiz_results")
    .delete()
    .or("email.ilike.%test-security%,email.ilike.%TEST-SECURITY%");

  // Delete quiz results claimed by test user
  if (user) {
    await adminClient.from("quiz_results").delete().eq("user_id", user.id);
  }

  // Delete test anonymous sessions (fingerprint starts with "test-")
  await adminClient
    .from("anonymous_sessions")
    .delete()
    .like("fingerprint_hash", "test-%");
}

/**
 * Log helper with timestamp
 */
export function log(msg: string): void {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

/**
 * Test result tracking
 */
export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function createTestTracker() {
  const results: TestResult[] = [];

  return {
    pass(name: string, message: string) {
      results.push({ name, passed: true, message });
      log(`✅ ${name}: ${message}`);
    },
    fail(name: string, message: string) {
      results.push({ name, passed: false, message });
      log(`❌ ${name}: ${message}`);
    },
    getResults() {
      return results;
    },
    printSummary() {
      const passed = results.filter((r) => r.passed).length;
      const failed = results.filter((r) => !r.passed).length;

      console.log("\n" + "=".repeat(60));
      console.log("   Test Summary");
      console.log("=".repeat(60));
      console.log(`\n   Passed: ${passed}`);
      console.log(`   Failed: ${failed}`);
      console.log(`   Total:  ${results.length}\n`);

      if (failed > 0) {
        console.log("Failed tests:");
        results
          .filter((r) => !r.passed)
          .forEach((r) => {
            console.log(`  - ${r.name}: ${r.message}`);
          });
        return false;
      }

      console.log("✅ All tests passed!\n");
      return true;
    },
  };
}
