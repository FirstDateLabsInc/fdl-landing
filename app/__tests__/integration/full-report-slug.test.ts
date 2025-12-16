/**
 * Integration Test: create_or_get_full_report_slug() RPC
 *
 * Tests the new security-gated RPC function that only allows
 * authenticated users who've claimed their quiz to create share slugs.
 *
 * Prerequisites:
 *   - SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - SUPABASE_ANON_KEY in .env.local
 *
 * Run from app/ directory:
 *   npx tsx __tests__/integration/full-report-slug.test.ts
 *
 * Test Coverage:
 *   F1: Unauthenticated call rejected with NOT_AUTHENTICATED
 *   F2: Anon key cannot execute (permission denied)
 *   F3: Authenticated but unclaimed quiz rejected
 *   F4: Authenticated + claimed quiz succeeds
 *   F5: Returns existing slug on second call (idempotent)
 *   F6: Rejects invalid slug format
 *   F7: Rejects result owned by different user
 *   F8: Sets public_slug_created_at timestamp
 */

import {
  adminClient,
  anonClient,
  ensureTestUser,
  createAuthenticatedClient,
  createAnonymousSession,
  cleanupTestData,
  log,
  createTestTracker,
  TEST_EMAIL,
} from "../helpers/supabase";

// Generate a valid nanoid-like slug (21 chars, URL-safe alphabet)
function generateTestSlug(): string {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  let result = "";
  for (let i = 0; i < 21; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

const tracker = createTestTracker();

async function testF1_UnauthenticatedCall() {
  log("\n--- Test F1: Unauthenticated Call ---");

  // Use anon client without signing in
  const { data, error } = await anonClient.rpc("create_or_get_full_report_slug", {
    p_result_id: "550e8400-e29b-41d4-a716-446655440000",
    p_new_slug: generateTestSlug(),
  });

  if (error) {
    // Either permission denied (42501) or NOT_AUTHENTICATED (P0001)
    if (
      error.code === "42501" ||
      error.message.includes("permission denied") ||
      error.message.includes("NOT_AUTHENTICATED")
    ) {
      tracker.pass("F1", `Unauthenticated call rejected: ${error.code || error.message}`);
      return;
    }
  }

  // If no error but data indicates failure
  if (data === null || (typeof data === "object" && "error" in data)) {
    tracker.pass("F1", "Unauthenticated call rejected (returned null/error)");
    return;
  }

  tracker.fail("F1", `Expected rejection, got: ${JSON.stringify(data)}`);
}

async function testF2_AnonKeyPermission() {
  log("\n--- Test F2: Anon Key Permission ---");

  // Anon key should not have EXECUTE permission on this function
  const { data, error } = await anonClient.rpc("create_or_get_full_report_slug", {
    p_result_id: "550e8400-e29b-41d4-a716-446655440000",
    p_new_slug: generateTestSlug(),
  });

  if (error && error.code === "42501") {
    tracker.pass("F2", "Anon key correctly denied EXECUTE permission");
    return;
  }

  if (error && error.message.includes("permission denied")) {
    tracker.pass("F2", `Permission denied: ${error.message}`);
    return;
  }

  tracker.fail("F2", `Expected 42501 permission denied, got: ${error?.code || JSON.stringify(data)}`);
}

async function testF3_AuthenticatedButUnclaimed() {
  log("\n--- Test F3: Authenticated But Unclaimed ---");

  const { client: authClient, userId } = await createAuthenticatedClient();

  // Create session and unclaimed quiz result (owned by this user but NOT claimed)
  const sessionId = await createAnonymousSession();
  const { data: result, error: insertError } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: "fiery-pursuer",
      scores: {},
      answers: {},
      user_id: userId, // Owned by user
      claimed_at: null, // NOT claimed
      anonymous_session_id: sessionId,
    })
    .select("id")
    .single();

  if (insertError) {
    tracker.fail("F3", `Setup failed: ${insertError.message}`);
    return;
  }

  log(`Created unclaimed result: ${result.id}`);

  const { data, error } = await authClient.rpc("create_or_get_full_report_slug", {
    p_result_id: result.id,
    p_new_slug: generateTestSlug(),
  });

  // Clean up
  await adminClient.from("quiz_results").delete().eq("id", result.id);

  if (error) {
    if (error.message.includes("QUIZ_NOT_CLAIMED") || error.code === "P0001") {
      tracker.pass("F3", "Correctly rejected unclaimed quiz");
      return;
    }
    // Also accept ACCESS_DENIED
    if (error.message.includes("ACCESS_DENIED") || error.message.includes("RESULT_NOT_FOUND")) {
      tracker.pass("F3", `Correctly rejected: ${error.message}`);
      return;
    }
  }

  tracker.fail("F3", `Expected QUIZ_NOT_CLAIMED, got: ${error?.message || JSON.stringify(data)}`);
}

async function testF4_AuthenticatedAndClaimed(): Promise<string | null> {
  log("\n--- Test F4: Authenticated + Claimed Quiz ---");

  const { client: authClient, userId } = await createAuthenticatedClient();

  // Create session and claimed quiz result
  const sessionId = await createAnonymousSession();
  const { data: result, error: insertError } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: "fiery-pursuer",
      scores: {},
      answers: {},
      user_id: userId,
      claimed_at: new Date().toISOString(), // CLAIMED
      anonymous_session_id: sessionId,
    })
    .select("id")
    .single();

  if (insertError) {
    tracker.fail("F4", `Setup failed: ${insertError.message}`);
    return null;
  }

  log(`Created claimed result: ${result.id}`);

  const newSlug = generateTestSlug();
  const { data, error } = await authClient.rpc("create_or_get_full_report_slug", {
    p_result_id: result.id,
    p_new_slug: newSlug,
  });

  if (error) {
    tracker.fail("F4", `RPC failed: ${error.message}`);
    // Clean up
    await adminClient.from("quiz_results").delete().eq("id", result.id);
    return null;
  }

  // Check response
  if (data && data.length > 0) {
    const response = data[0];
    if (response.public_slug === newSlug && response.created === true) {
      tracker.pass("F4", `Created slug: ${response.public_slug}`);
      return result.id; // Return for subsequent tests
    }
  }

  tracker.fail("F4", `Unexpected response: ${JSON.stringify(data)}`);
  await adminClient.from("quiz_results").delete().eq("id", result.id);
  return null;
}

async function testF5_Idempotency(resultId: string) {
  log("\n--- Test F5: Idempotency ---");

  const { client: authClient } = await createAuthenticatedClient();

  // Call again with different slug - should return existing slug
  const differentSlug = generateTestSlug();
  const { data, error } = await authClient.rpc("create_or_get_full_report_slug", {
    p_result_id: resultId,
    p_new_slug: differentSlug,
  });

  if (error) {
    tracker.fail("F5", `RPC failed: ${error.message}`);
    return;
  }

  if (data && data.length > 0) {
    const response = data[0];
    // Should return existing slug with created=false
    if (response.created === false) {
      tracker.pass("F5", `Idempotent: returned existing slug, created=false`);
      return;
    }
  }

  tracker.fail("F5", `Expected idempotent response, got: ${JSON.stringify(data)}`);
}

async function testF6_InvalidSlugFormat() {
  log("\n--- Test F6: Invalid Slug Format ---");

  const { client: authClient, userId } = await createAuthenticatedClient();

  // Create claimed quiz result
  const sessionId = await createAnonymousSession();
  const { data: result, error: insertError } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: "fiery-pursuer",
      scores: {},
      answers: {},
      user_id: userId,
      claimed_at: new Date().toISOString(),
      anonymous_session_id: sessionId,
    })
    .select("id")
    .single();

  if (insertError) {
    tracker.fail("F6", `Setup failed: ${insertError.message}`);
    return;
  }

  const invalidSlugs = [
    "short", // Too short
    "this-is-way-too-long-for-a-valid-slug", // Too long
    "invalid@slug#chars!", // Invalid characters
    "", // Empty
  ];

  let passed = true;
  for (const invalidSlug of invalidSlugs) {
    const { error } = await authClient.rpc("create_or_get_full_report_slug", {
      p_result_id: result.id,
      p_new_slug: invalidSlug,
    });

    if (!error || error.code !== "22023") {
      log(`  Invalid slug "${invalidSlug}" not rejected properly: ${error?.code}`);
      passed = false;
    }
  }

  // Clean up
  await adminClient.from("quiz_results").delete().eq("id", result.id);

  if (passed) {
    tracker.pass("F6", "All invalid slug formats rejected with 22023");
  } else {
    tracker.fail("F6", "Some invalid slugs were not properly rejected");
  }
}

async function testF7_NotOwnedResult() {
  log("\n--- Test F7: Result Not Owned ---");

  const { client: authClient } = await createAuthenticatedClient();

  // Create a result owned by a DIFFERENT user
  const sessionId = await createAnonymousSession();
  const { data: result, error: insertError } = await adminClient
    .from("quiz_results")
    .insert({
      archetype_slug: "fiery-pursuer",
      scores: {},
      answers: {},
      user_id: "99999999-9999-9999-9999-999999999999", // Different user
      claimed_at: new Date().toISOString(),
      anonymous_session_id: sessionId,
    })
    .select("id")
    .single();

  if (insertError) {
    tracker.fail("F7", `Setup failed: ${insertError.message}`);
    return;
  }

  const { data, error } = await authClient.rpc("create_or_get_full_report_slug", {
    p_result_id: result.id,
    p_new_slug: generateTestSlug(),
  });

  // Clean up
  await adminClient.from("quiz_results").delete().eq("id", result.id);

  if (error) {
    if (
      error.message.includes("RESULT_NOT_FOUND") ||
      error.message.includes("NOT_OWNED") ||
      error.code === "P0002"
    ) {
      tracker.pass("F7", "Correctly rejected non-owned result");
      return;
    }
  }

  tracker.fail("F7", `Expected rejection, got: ${error?.message || JSON.stringify(data)}`);
}

async function testF8_TimestampSet(resultId: string) {
  log("\n--- Test F8: Timestamp Set ---");

  // Query the result to check public_slug_created_at
  const { data, error } = await adminClient
    .from("quiz_results")
    .select("public_slug, public_slug_created_at")
    .eq("id", resultId)
    .single();

  if (error) {
    tracker.fail("F8", `Query failed: ${error.message}`);
    return;
  }

  if (data.public_slug && data.public_slug_created_at) {
    const createdAt = new Date(data.public_slug_created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    // Should have been created within the last minute
    if (diffMs < 60000 && diffMs >= 0) {
      tracker.pass("F8", `public_slug_created_at set: ${data.public_slug_created_at}`);
      return;
    }
  }

  tracker.fail("F8", `Timestamp not set properly: ${JSON.stringify(data)}`);
}

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("   Suite F: create_or_get_full_report_slug() RPC Tests");
  console.log("=".repeat(60) + "\n");

  try {
    // Cleanup any previous test data
    await cleanupTestData();

    // Ensure test user exists
    await ensureTestUser();

    // Run tests
    await testF1_UnauthenticatedCall();
    await testF2_AnonKeyPermission();
    await testF3_AuthenticatedButUnclaimed();

    // F4 returns resultId for subsequent tests
    const resultId = await testF4_AuthenticatedAndClaimed();

    if (resultId) {
      await testF5_Idempotency(resultId);
      await testF8_TimestampSet(resultId);

      // Clean up the test result
      await adminClient.from("quiz_results").delete().eq("id", resultId);
    }

    await testF6_InvalidSlugFormat();
    await testF7_NotOwnedResult();

    // Final cleanup
    await cleanupTestData();
  } catch (err) {
    console.error("\n❌ Test suite error:", err);
    process.exit(1);
  }

  // Print summary and exit
  const success = tracker.printSummary();
  process.exit(success ? 0 : 1);
}

main();
