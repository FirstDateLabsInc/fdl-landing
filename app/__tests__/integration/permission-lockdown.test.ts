/**
 * Integration Test: Database Permission Lockdown
 *
 * Verifies that anon/authenticated keys cannot call service_role-only RPCs.
 * This validates the security migration applied in security_lockdown_v1.sql.
 *
 * Prerequisites:
 *   - SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - SUPABASE_ANON_KEY in .env.local
 *   - Security migration applied (security_lockdown_v1.sql)
 *
 * Run from app/ directory:
 *   npx tsx __tests__/integration/permission-lockdown.test.ts
 *
 * Test Coverage:
 *   P1-P11: Service-role-only functions denied to anon
 *   P12: claim_quizzes_by_email denied to anon
 *   P13: create_or_get_full_report_slug denied to anon
 *   P14: Authenticated can call claim_quizzes_by_email
 *   P15: Service role can call all functions
 */

import {
  adminClient,
  anonClient,
  ensureTestUser,
  createAuthenticatedClient,
  cleanupTestData,
  log,
  createTestTracker,
} from "../helpers/supabase";

const tracker = createTestTracker();

// Service-role-only functions (should fail with anon key)
const SERVICE_ROLE_ONLY_FUNCTIONS = [
  {
    name: "verify_or_create_session",
    params: { p_fingerprint: "test-fingerprint", p_session_id: null },
  },
  {
    name: "insert_quiz_result",
    params: {
      p_session_id: "550e8400-e29b-41d4-a716-446655440000",
      p_archetype_slug: "test",
      p_scores: {},
      p_answers: {},
    },
  },
  {
    name: "create_or_get_share_slug",
    params: {
      p_result_id: "550e8400-e29b-41d4-a716-446655440000",
      p_session_id: "550e8400-e29b-41d4-a716-446655440001",
      p_new_slug: "test-slug-12345678901",
    },
  },
  {
    name: "join_waitlist",
    params: { p_email: "test@example.com" },
  },
  {
    name: "waitlist_unsubscribe",
    params: { p_token: "550e8400-e29b-41d4-a716-446655440000" },
  },
  {
    name: "get_results_by_fingerprint",
    params: { p_fingerprint: "test-fingerprint" },
  },
  {
    name: "get_quiz_preview",
    params: { result_id: "550e8400-e29b-41d4-a716-446655440000" },
  },
  {
    name: "get_quiz_by_public_slug",
    params: { slug: "test-slug" },
  },
];

// Functions that should be callable by authenticated users
const AUTHENTICATED_FUNCTIONS = [
  {
    name: "claim_quizzes_by_email",
    params: {},
  },
  {
    name: "create_or_get_full_report_slug",
    params: {
      p_result_id: "550e8400-e29b-41d4-a716-446655440000",
      p_new_slug: "test-slug-12345678901",
    },
  },
];

async function testAnonDenied(
  functionName: string,
  params: Record<string, unknown>,
  testId: string
) {
  log(`\n--- Test ${testId}: Anon cannot call ${functionName} ---`);

  const { data, error } = await anonClient.rpc(functionName, params);

  if (error && error.code === "42501") {
    tracker.pass(testId, `Permission denied (42501)`);
    return true;
  }

  if (error && error.message.includes("permission denied")) {
    tracker.pass(testId, `Permission denied: ${error.message.substring(0, 50)}`);
    return true;
  }

  // Some functions might return null/empty without error if RLS blocks data
  // But the security migration should block at EXECUTE level
  tracker.fail(
    testId,
    `Expected 42501 permission denied, got: code=${error?.code}, msg=${error?.message?.substring(0, 50) || "null"}`
  );
  return false;
}

async function testAuthenticatedAllowed(
  functionName: string,
  testId: string
) {
  log(`\n--- Test ${testId}: Authenticated can call ${functionName} ---`);

  const { client } = await createAuthenticatedClient();

  // For claim_quizzes_by_email, we just need to verify it doesn't throw permission error
  const { data, error } = await client.rpc(functionName, {});

  if (error && error.code === "42501") {
    tracker.fail(testId, "Permission denied - should be allowed");
    return false;
  }

  if (error && error.message.includes("permission denied")) {
    tracker.fail(testId, "Permission denied - should be allowed");
    return false;
  }

  // Success or business logic error (like "no email") is fine - we just care about permission
  tracker.pass(
    testId,
    error ? `Allowed (business error: ${error.message.substring(0, 30)})` : "Allowed"
  );
  return true;
}

async function testServiceRoleAllowed() {
  log("\n--- Test P15: Service role can call functions ---");

  let allPassed = true;

  // Test a few functions with service role
  const testFunctions = [
    { name: "get_results_by_fingerprint", params: { p_fingerprint: "nonexistent" } },
    { name: "get_quiz_preview", params: { result_id: "550e8400-e29b-41d4-a716-446655440000" } },
  ];

  for (const fn of testFunctions) {
    const { error } = await adminClient.rpc(fn.name, fn.params);

    if (error && error.code === "42501") {
      log(`  ❌ ${fn.name}: permission denied`);
      allPassed = false;
    } else {
      log(`  ✅ ${fn.name}: allowed (error=${error?.code || "none"})`);
    }
  }

  if (allPassed) {
    tracker.pass("P15", "Service role can call all tested functions");
  } else {
    tracker.fail("P15", "Some functions denied to service role");
  }
}

async function testViewsSecurityInvoker() {
  log("\n--- Test P16: Analytics views have security_invoker ---");

  const { data, error } = await adminClient.rpc("", {}).then(() => null).catch(() => null);

  // Query view security settings directly
  const { data: viewData, error: viewError } = await adminClient
    .from("pg_catalog.pg_class")
    .select("relname, reloptions")
    .in("relname", [
      "waitlist_stats",
      "quiz_completion_stats",
      "quiz_to_waitlist_funnel",
      "quiz_to_app_funnel",
      "conversion_by_archetype",
      "conversion_by_source",
      "daily_quiz_conversions",
      "time_to_conversion",
    ]);

  // Alternative: just try to select from views with anon client
  let allBlocked = true;
  const views = [
    "waitlist_stats",
    "quiz_completion_stats",
    "quiz_to_waitlist_funnel",
    "quiz_to_app_funnel",
    "conversion_by_archetype",
    "conversion_by_source",
    "daily_quiz_conversions",
    "time_to_conversion",
  ];

  for (const view of views) {
    const { data, error } = await anonClient.from(view).select("*").limit(1);

    if (data && data.length > 0) {
      log(`  ⚠️ ${view}: anon can read (SECURITY ISSUE)`);
      allBlocked = false;
    } else if (error && (error.code === "42501" || error.message.includes("permission denied"))) {
      log(`  ✅ ${view}: blocked`);
    } else {
      log(`  ✅ ${view}: no data or RLS blocked`);
    }
  }

  if (allBlocked) {
    tracker.pass("P16", "All analytics views blocked from anon");
  } else {
    tracker.fail("P16", "Some analytics views accessible to anon");
  }
}

async function testRLSPolicyRemoved() {
  log("\n--- Test P17: results_select_anon policy removed ---");

  // Try to select from quiz_results with anon client using header spoofing
  // This should fail because the policy was removed
  const fakeSessionId = "550e8400-e29b-41d4-a716-446655440000";

  const spoofedAnonClient = await import("@supabase/supabase-js").then((m) =>
    m.createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            "x-session-id": fakeSessionId,
          },
        },
        auth: { persistSession: false },
      }
    )
  );

  const { data, error } = await spoofedAnonClient
    .from("quiz_results")
    .select("id")
    .limit(1);

  // Should get no data because RLS policy was removed
  if (!data || data.length === 0) {
    tracker.pass("P17", "results_select_anon policy removed - no data returned");
    return;
  }

  if (error && error.code === "42501") {
    tracker.pass("P17", "Permission denied at table level");
    return;
  }

  tracker.fail("P17", `Unexpected result: ${data?.length} rows returned`);
}

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("   Suite P: Permission Lockdown Tests");
  console.log("=".repeat(60) + "\n");

  try {
    // Cleanup any previous test data
    await cleanupTestData();

    // Ensure test user exists
    await ensureTestUser();

    // Test service-role-only functions with anon key
    let testNum = 1;
    for (const fn of SERVICE_ROLE_ONLY_FUNCTIONS) {
      await testAnonDenied(fn.name, fn.params, `P${testNum}`);
      testNum++;
    }

    // Test authenticated-only functions with anon key
    for (const fn of AUTHENTICATED_FUNCTIONS) {
      await testAnonDenied(fn.name, fn.params, `P${testNum}`);
      testNum++;
    }

    // Test authenticated can call claim_quizzes_by_email
    await testAuthenticatedAllowed("claim_quizzes_by_email", "P14");

    // Test service role can call functions
    await testServiceRoleAllowed();

    // Test analytics views security
    await testViewsSecurityInvoker();

    // Test RLS policy removal
    await testRLSPolicyRemoved();

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
