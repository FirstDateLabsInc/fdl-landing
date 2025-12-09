import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { UpdateEmailRequest, UpdateEmailResponse } from "@/lib/api/quiz";

export async function POST(
  request: NextRequest
): Promise<NextResponse<UpdateEmailResponse>> {
  try {
    const body = (await request.json()) as UpdateEmailRequest;
    const { resultId, sessionId, email } = body;

    if (!email || !resultId || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Verify ownership before update
    const { data: existing } = await supabase
      .from("quiz_results")
      .select("anonymous_session_id")
      .eq("id", resultId)
      .single();

    if (!existing || existing.anonymous_session_id !== sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    // Update email
    const { error } = await supabase
      .from("quiz_results")
      .update({ email })
      .eq("id", resultId);

    if (error) {
      console.error("Email update error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email update failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
