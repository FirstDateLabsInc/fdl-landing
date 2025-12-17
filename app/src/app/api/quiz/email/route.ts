import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { UpdateEmailResponse } from "@/lib/api/quiz";

// Zod schema aligned with quiz_results table constraints
const UpdateEmailSchema = z.object({
  resultId: z.string().uuid(),
  sessionId: z.string().uuid(),
  email: z.string().email(),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<UpdateEmailResponse>> {
  try {
    const rawBody: unknown = await request.json();
    const parsed = UpdateEmailSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
        },
        { status: 400 }
      );
    }

    const { resultId, sessionId, email } = parsed.data;

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
