import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { WaitlistConfirmation } from "@/emails/WaitlistConfirmation";

/**
 * Debug endpoint to test Resend email sending in isolation.
 * GET /api/test-email - Tests with Resend's test address
 * GET /api/test-email?email=your@email.com - Tests with custom email
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get("email") || "delivered@resend.dev";

  const results = {
    timestamp: new Date().toISOString(),
    testEmail,
    steps: [] as Array<Record<string, unknown>>,
  };

  // Step 1: Check environment variable
  const apiKey = process.env.RESEND_API_KEY;
  results.steps.push({
    step: 1,
    name: "Check RESEND_API_KEY",
    exists: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : null,
    keyLength: apiKey?.length || 0,
  });

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "RESEND_API_KEY not found in environment",
        results,
      },
      { status: 500 }
    );
  }

  // Step 2: Initialize Resend client
  let resend: Resend;
  try {
    resend = new Resend(apiKey);
    results.steps.push({
      step: 2,
      name: "Initialize Resend client",
      success: true,
    });
  } catch (error) {
    results.steps.push({
      step: 2,
      name: "Initialize Resend client",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: "Failed to initialize Resend", results },
      { status: 500 }
    );
  }

  // Step 3: Test simple HTML email (no React template)
  const simpleEmailResult = await testSimpleEmail(resend, testEmail);
  results.steps.push({
    step: 3,
    name: "Send simple HTML email",
    ...simpleEmailResult,
  });

  // Step 4: Test React Email template
  const reactEmailResult = await testReactEmail(resend, testEmail);
  results.steps.push({
    step: 4,
    name: "Send React Email template",
    ...reactEmailResult,
  });

  // Summary
  const allSucceeded = results.steps.every(
    (s: { success?: boolean }) => s.success !== false
  );

  return NextResponse.json({
    success: allSucceeded,
    summary: allSucceeded
      ? "All tests passed! Check your inbox."
      : "Some tests failed. See steps for details.",
    results,
  });
}

async function testSimpleEmail(resend: Resend, to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "First Date Labs <hello@updates.firstdatelabs.com>",
      to: [to],
      subject: "[Test 1] Simple HTML Email - " + new Date().toISOString(),
      html: `
        <h1>Test Email from First Date Labs</h1>
        <p>This is a simple HTML email test.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      return {
        success: false,
        error: error,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
  }
}

async function testReactEmail(resend: Resend, to: string) {
  try {
    // Pre-render the React component to HTML
    const emailComponent = WaitlistConfirmation({
      email: to,
      unsubscribeToken: "test-token-12345",
    });

    const html = await render(emailComponent);

    const { data, error } = await resend.emails.send({
      from: "First Date Labs <hello@updates.firstdatelabs.com>",
      to: [to],
      subject: "[Test 2] React Email Template - " + new Date().toISOString(),
      html, // Use pre-rendered HTML instead of react prop
    });

    if (error) {
      return {
        success: false,
        error: error,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
      emailId: data?.id,
      htmlLength: html.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
  }
}
