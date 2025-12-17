/**
 * Integration Test: claim_quizzes_by_email() RPC
 *
 * Tests the Supabase RPC function that claims quiz results when a user
 * signs up with the same email they used during the quiz.
 *
 * Prerequisites:
 *   - SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - SUPABASE_ANON_KEY in .env.local
 *
 * Run from app/ directory:
 *   npx tsx __tests__/integration/claim-rpc.test.ts
 *
 * Test Coverage:
 *   E1: Insert test quiz result with email
 *   E2: Claim RPC returns { success: true, claimed_count: 1 }
 *   E3: Database state: user_id set, email cleared, claimed_at set
 *   E4: Multiple results claimed in single call
 *   E5: Idempotency - second call returns claimed_count: 0
 *   E6: Case-insensitive email matching
 *   E7: Unauthenticated call rejected
 */

import { config } from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const TEST_EMAIL = "claim-test@firstdatelabs.com";
const TEST_PASSWORD = "TestPassword123!";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

interface ClaimResponse {
  success: boolean;
  claimed_count?: number;
  error?: string;
}

const results: TestResult[] = [];

function log(msg: string) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

function pass(name: string, message: string) {
  results.push({ name, passed: true, message });
  log(`✅ ${name}: ${message}`);
}

function fail(name: string, message: string) {
  results.push({ name, passed: false, message });
  log(`❌ ${name}: ${message}`);
}

// Service role client (for admin operations)
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Anonymous client (for unauthenticated tests)
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function cleanup() {
  log("Cleaning up test data...");

  // Get test user ID
  const { data: testUser } = await adminClient.auth.admin.listUsers();
  const user = testUser.users.find(u => u.email === TEST_EMAIL);

  // Delete test quiz results by email
  await adminClient
    .from("quiz_results")
    .delete()
    .or(`email.ilike.%claim-test%,email.ilike.%CLAIM-TEST%`);

  // Delete quiz results claimed by test user
  if (user) {
    await adminClient
      .from("quiz_results")
      .delete()
      .eq("user_id", user.id);
  }

  // Delete test anonymous sessions (fingerprint starts with "test-")
  await adminClient
    .from("anonymous_sessions")
    .delete()
    .like("fingerprint_hash", "test-%");

  log("Cleanup complete");
}

async function ensureTestUser(): Promise<string> {
  log("Ensuring test user exists...");

  // Check if user exists
  const { data: users } = await adminClient.auth.admin.listUsers();
  let user = users.users.find(u => u.email === TEST_EMAIL);

  if (user) {
    log(`Test user exists: ${user.id}`);
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

  log(`Created test user: ${data.user.id}`);
  return data.user.id;
}

async function testE7_UnauthenticatedCall() {
  log("\n--- Test E7: Unauthenticated Call ---");

  const { data, error } = await anonClient.rpc("claim_quizzes_by_email");

  if (error) {
    // RPC might throw error for unauthenticated calls
    pass("E7", `Unauthenticated call rejected with error: ${error.message}`);
    return;
  }

  const response = data as ClaimResponse;
  if (response.success === false && response.error === "not_authenticated") {
    pass("E7", "Unauthenticated call returns { success: false, error: 'not_authenticated' }");
  } else {
    fail("E7", `Expected rejection, got: ${JSON.stringify(response)}`);
  }
}

async function createAnonymousSession(): Promise<string> {
  // Create anonymous session first (required by foreign key)
  const sessionId = crypto.randomUUID();
  const { error } = await adminClient
    .from("anonymous_sessions")
    .insert({
      id: sessionId,
      fingerprint_hash: `test-${Date.now()}`,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

  if (error) {
    throw new Error(`Failed to create anonymous session: ${error.message}`);
  }
  return sessionId;
}

async function testE1_InsertTestData(): Promise<string[]> {
  log("\n--- Test E1: Insert Test Quiz Results ---");

  // Create anonymous session first (required by foreign key)
  const sessionId = await createAnonymousSession();

  // Insert single test result
  const { data, error } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: "fiery-pursuer",
      scores: { attachment: { primary: "anxious", scores: {} } },
      answers: {},
      email: TEST_EMAIL,
      anonymous_session_id: sessionId,
    })
    .select("id")
    .single();

  if (error) {
    fail("E1", `Failed to insert test data: ${error.message}`);
    return [];
  }

  pass("E1", `Inserted quiz result: ${data.id} (session: ${sessionId})`);
  return [data.id];
}

async function testE2_RunClaimScript(authClient: SupabaseClient): Promise<ClaimResponse | null> {
  log("\n--- Test E2: Run Claim Script ---");

  const { data, error } = await authClient.rpc("claim_quizzes_by_email");

  if (error) {
    fail("E2", `RPC call failed: ${error.message}`);
    return null;
  }

  const response = data as ClaimResponse;
  if (response.success && response.claimed_count === 1) {
    pass("E2", `RPC returned: { success: true, claimed_count: ${response.claimed_count} }`);
  } else if (response.success && response.claimed_count !== 1) {
    fail("E2", `Expected claimed_count=1, got: ${response.claimed_count}`);
  } else {
    fail("E2", `RPC returned failure: ${JSON.stringify(response)}`);
  }

  return response;
}

async function testE3_VerifyDatabaseState(userId: string, resultIds: string[]) {
  log("\n--- Test E3: Verify Database State ---");

  const { data, error } = await adminClient
    .from("quiz_results")
    .select("id, user_id, email, claimed_at")
    .in("id", resultIds);

  if (error) {
    fail("E3", `Failed to query database: ${error.message}`);
    return;
  }

  if (!data || data.length === 0) {
    fail("E3", "No quiz results found");
    return;
  }

  const result = data[0];
  const checks = [
    { name: "user_id set", passed: result.user_id === userId },
    { name: "email cleared", passed: result.email === null },
    { name: "claimed_at set", passed: result.claimed_at !== null },
  ];

  const allPassed = checks.every(c => c.passed);
  const details = checks.map(c => `${c.name}: ${c.passed ? "✓" : "✗"}`).join(", ");

  if (allPassed) {
    pass("E3", `Database state verified: ${details}`);
  } else {
    fail("E3", `Database state invalid: ${details}`);
  }
}

async function testE4_MultipleResults(authClient: SupabaseClient): Promise<ClaimResponse | null> {
  log("\n--- Test E4: Multiple Results Claiming ---");

  // Create sessions for each quiz result (required by foreign key)
  const session1 = await createAnonymousSession();
  const session2 = await createAnonymousSession();
  const session3 = await createAnonymousSession();

  // Insert 3 more quiz results
  const { error: insertError } = await adminClient
    .from("quiz_results")
    .insert([
      { archetype_slug: "secure-anchor", scores: {}, answers: {}, email: TEST_EMAIL, anonymous_session_id: session1 },
      { archetype_slug: "cool-detacher", scores: {}, answers: {}, email: TEST_EMAIL, anonymous_session_id: session2 },
      { archetype_slug: "anxious-connector", scores: {}, answers: {}, email: TEST_EMAIL, anonymous_session_id: session3 },
    ]);

  if (insertError) {
    fail("E4", `Failed to insert multiple results: ${insertError.message}`);
    return null;
  }

  log("Inserted 3 additional quiz results");

  // Run claim
  const { data, error } = await authClient.rpc("claim_quizzes_by_email");

  if (error) {
    fail("E4", `RPC call failed: ${error.message}`);
    return null;
  }

  const response = data as ClaimResponse;
  if (response.success && response.claimed_count === 3) {
    pass("E4", `Multiple results claimed: { success: true, claimed_count: ${response.claimed_count} }`);
  } else if (response.success && response.claimed_count !== 3) {
    fail("E4", `Expected claimed_count=3, got: ${response.claimed_count}`);
  } else {
    fail("E4", `RPC returned failure: ${JSON.stringify(response)}`);
  }

  return response;
}

async function testE5_Idempotency(authClient: SupabaseClient) {
  log("\n--- Test E5: Idempotency Test ---");

  // Second call should return claimed_count: 0
  const { data, error } = await authClient.rpc("claim_quizzes_by_email");

  if (error) {
    fail("E5", `RPC call failed: ${error.message}`);
    return;
  }

  const response = data as ClaimResponse;
  if (response.success && response.claimed_count === 0) {
    pass("E5", "Idempotent: second call returns { success: true, claimed_count: 0 }");
  } else {
    fail("E5", `Expected claimed_count=0, got: ${JSON.stringify(response)}`);
  }
}

async function testE6_CaseInsensitive(authClient: SupabaseClient) {
  log("\n--- Test E6: Case-Insensitive Email Match ---");

  // Create session first (required by foreign key)
  const sessionId = await createAnonymousSession();

  // Insert with UPPERCASE email
  const { error: insertError } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: "secure-anchor",
      scores: {},
      answers: {},
      email: "CLAIM-TEST@FIRSTDATELABS.COM", // Uppercase
      anonymous_session_id: sessionId,
    });

  if (insertError) {
    fail("E6", `Failed to insert uppercase email result: ${insertError.message}`);
    return;
  }

  log("Inserted quiz result with UPPERCASE email");

  // Run claim (user email is lowercase)
  const { data, error } = await authClient.rpc("claim_quizzes_by_email");

  if (error) {
    fail("E6", `RPC call failed: ${error.message}`);
    return;
  }

  const response = data as ClaimResponse;
  if (response.success && response.claimed_count === 1) {
    pass("E6", "Case-insensitive: uppercase email claimed by lowercase user");
  } else {
    fail("E6", `Expected claimed_count=1, got: ${JSON.stringify(response)}`);
  }
}

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("   Suite E: claim_quizzes_by_email() RPC Tests");
  console.log("=".repeat(60) + "\n");

  try {
    // Cleanup any previous test data
    await cleanup();

    // Ensure test user exists
    const userId = await ensureTestUser();

    // E7: Test unauthenticated call (should fail)
    await testE7_UnauthenticatedCall();

    // Create authenticated client
    log("\nSigning in as test user...");
    const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (authError) {
      throw new Error(`Failed to sign in: ${authError.message}`);
    }

    log(`Signed in as: ${authData.user.email}`);

    // Create authenticated client with session
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${authData.session.access_token}`,
        },
      },
    });

    // E1: Insert test data
    const resultIds = await testE1_InsertTestData();

    if (resultIds.length > 0) {
      // E2: Run claim script
      await testE2_RunClaimScript(authClient);

      // E3: Verify database state
      await testE3_VerifyDatabaseState(userId, resultIds);

      // E4: Test multiple results
      await testE4_MultipleResults(authClient);

      // E5: Test idempotency
      await testE5_Idempotency(authClient);

      // E6: Test case-insensitive
      await testE6_CaseInsensitive(authClient);
    }

    // Cleanup
    await cleanup();

  } catch (err) {
    console.error("\n❌ Test suite error:", err);
    process.exit(1);
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("   Test Summary");
  console.log("=".repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`\n   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total:  ${results.length}\n`);

  if (failed > 0) {
    console.log("Failed tests:");
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
    process.exit(1);
  }

  console.log("✅ All tests passed!\n");
}

main();
