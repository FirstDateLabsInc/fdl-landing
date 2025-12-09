import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/lib/api/quiz";

export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateSessionResponse>> {
  try {
    const body = (await request.json()) as CreateSessionRequest;
    const { fingerprintHash, existingSessionId } = body;

    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("verify_or_create_session", {
      p_fingerprint: fingerprintHash,
      p_session_id: existingSessionId || null,
    });

    if (error) {
      console.error("Session error:", error);
      return NextResponse.json({ sessionId: "" }, { status: 500 });
    }

    return NextResponse.json({ sessionId: data });
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json({ sessionId: "" }, { status: 500 });
  }
}
