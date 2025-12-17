import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/lib/api/quiz";

// UUID v4 regex for validation (defense in depth)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(str: string | undefined | null): boolean {
  return typeof str === "string" && UUID_REGEX.test(str);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateSessionResponse>> {
  try {
    const body = (await request.json()) as CreateSessionRequest;
    const { fingerprintHash, existingSessionId } = body;

    if (!fingerprintHash) {
      return NextResponse.json(
        { sessionId: "", error: "Fingerprint required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("verify_or_create_session", {
      p_fingerprint: fingerprintHash,
      // Only pass valid UUIDs, otherwise null (creates new session)
      p_session_id: isValidUUID(existingSessionId) ? existingSessionId : null,
    });

    if (error) {
      console.error("Session error:", error);
      return NextResponse.json(
        { sessionId: "", error: "Session creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: data });
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json(
      { sessionId: "", error: "Internal error" },
      { status: 500 }
    );
  }
}
