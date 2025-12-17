import { NextRequest, NextResponse } from "next/server";
import type { CreateShareRequest, CreateShareResponse } from "@/lib/api/quiz";

/**
 * Web Share Endpoint - Returns Preview URL Only
 *
 * SECURITY: This endpoint returns a preview URL (general report) for web users.
 * Full report sharing (with public_slug) requires:
 * 1. Authenticated user (mobile app login)
 * 2. Quiz result claimed (claim_quizzes_by_email called)
 * 3. Call to create_or_get_full_report_slug RPC from mobile app
 *
 * This prevents unauthenticated users from minting public_slug via direct API calls.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateShareResponse>> {
  try {
    const body = (await request.json()) as CreateShareRequest;
    const { resultId, sessionId } = body;

    // Validate required fields
    if (!resultId || !sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(resultId) || !uuidRegex.test(sessionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Return preview URL (general report) - no public_slug minting
    // Full report sharing requires authenticated + claimed quiz via mobile app
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://firstdatelabs.com";
    const publicUrl = `${baseUrl}/quiz/results/${resultId}`;

    return NextResponse.json({
      success: true,
      publicUrl,
      created: false, // No slug was created - this is a preview URL
    });
  } catch (err) {
    console.error("Share API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
