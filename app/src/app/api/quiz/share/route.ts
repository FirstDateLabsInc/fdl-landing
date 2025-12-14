import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { CreateShareRequest, CreateShareResponse } from "@/lib/api/quiz";

/** RPC response type for create_or_get_share_slug function */
interface ShareSlugResponse {
  public_slug: string;
  created: boolean;
}

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

    const supabase = getSupabaseServer();

    // Generate new slug (21 chars = 126 bits entropy)
    const newSlug = nanoid(21);

    // Call RPC - handles ownership verification + idempotency
    const { data, error } = await supabase
      .rpc("create_or_get_share_slug", {
        p_result_id: resultId,
        p_session_id: sessionId,
        p_new_slug: newSlug,
      })
      .single<ShareSlugResponse>();

    if (error) {
      // Map PostgreSQL error codes to HTTP responses
      if (error.code === "P0002") {
        return NextResponse.json(
          { success: false, error: "Result not found" },
          { status: 404 }
        );
      }
      if (error.code === "P0001") {
        return NextResponse.json(
          { success: false, error: "Access denied" },
          { status: 403 }
        );
      }
      console.error("Share creation error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create share link" },
        { status: 500 }
      );
    }

    // Build public URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://firstdatelabs.com";
    const publicUrl = `${baseUrl}/quiz/p/${data.public_slug}`;

    return NextResponse.json({
      success: true,
      publicUrl,
      created: data.created,
    });
  } catch (err) {
    console.error("Share API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
