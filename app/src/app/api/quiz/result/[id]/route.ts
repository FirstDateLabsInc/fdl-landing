import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { GetResultResponse } from "@/lib/api/quiz";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetResultResponse>> {
  try {
    const { id } = await params;
    const sessionId = request.headers.get("x-session-id");

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("id, archetype_slug, scores, created_at, anonymous_session_id")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Result not found",
          errorCode: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Ownership check: session must match (if provided)
    if (sessionId && data.anonymous_session_id !== sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
          errorCode: "ACCESS_DENIED",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        id: data.id,
        archetypeSlug: data.archetype_slug,
        scores: data.scores,
        createdAt: data.created_at,
      },
    });
  } catch (err) {
    console.error("Result fetch error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
