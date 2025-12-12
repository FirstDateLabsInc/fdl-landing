import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { parseDbScores } from "@/lib/quiz/utils/parse-db-scores";
import type { GetResultResponse } from "@/lib/api/quiz";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetResultResponse>> {
  try {
    const { id } = await params;

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("id, archetype_slug, scores, created_at")
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

    const scores = parseDbScores(data.scores);
    if (!scores) {
      console.error("[Quiz Results] Invalid scores payload for result:", id);
      return NextResponse.json(
        {
          success: false,
          error: "Result not found",
          errorCode: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Public access via UUID - no ownership check needed
    // UUID provides 122 bits of entropy (unguessable)
    return NextResponse.json({
      success: true,
      result: {
        id: data.id,
        archetypeSlug: data.archetype_slug,
        scores,
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
