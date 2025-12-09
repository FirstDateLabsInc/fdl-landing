import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  JoinWaitlistRequest,
  JoinWaitlistResponse,
} from "@/lib/api/waitlist";

export async function POST(
  request: NextRequest
): Promise<NextResponse<JoinWaitlistResponse>> {
  try {
    const body = (await request.json()) as JoinWaitlistRequest;
    const { email, utmSource, utmMedium, utmCampaign, referrer } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
          errorCode: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from("waitlist").insert({
      email,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      referrer: referrer || null,
    });

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === "23505") {
        return NextResponse.json({
          success: true, // Still return success - user is already on waitlist
        });
      }
      console.error("Waitlist error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to join waitlist",
          errorCode: "DATABASE_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist signup failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        errorCode: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
