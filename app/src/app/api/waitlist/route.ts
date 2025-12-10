import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getResend, EMAIL_FROM } from "@/lib/email/resend";
import { render } from "@react-email/render";
import { WaitlistConfirmation } from "@/emails/WaitlistConfirmation";
import type {
  JoinWaitlistRequest,
  JoinWaitlistResponse,
} from "@/lib/api/waitlist";

/** Response shape from join_waitlist() RPC */
interface JoinWaitlistRpcResult {
  success: boolean;
  id?: string;
  is_new?: boolean;
  unsubscribe_token?: string;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<JoinWaitlistResponse>> {
  try {
    const body = (await request.json()) as JoinWaitlistRequest;
    const { email, source, utmSource, utmMedium, utmCampaign, referrer, quizResultId } = body;

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
    const { data, error } = await supabase.rpc("join_waitlist", {
      p_email: email,
      p_source: source || "web",
      p_utm_source: utmSource || null,
      p_utm_medium: utmMedium || null,
      p_utm_campaign: utmCampaign || null,
      p_referrer: referrer || null,
      p_quiz_result_id: quizResultId || null,
    });

    if (error) {
      console.error("Waitlist RPC error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to join waitlist",
          errorCode: "DATABASE_ERROR",
        },
        { status: 500 }
      );
    }

    const result = data as JoinWaitlistRpcResult;

    // RPC returns JSON with success field
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Invalid email",
          errorCode: result.error === "invalid_email" ? "INVALID_EMAIL" : "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Send confirmation email for new signups
    if (result.is_new && result.unsubscribe_token) {
      try {
        const resend = getResend();
        // Pre-render React Email to HTML (fixes Turbopack bundling issue)
        const emailHtml = await render(
          WaitlistConfirmation({
            email,
            unsubscribeToken: result.unsubscribe_token,
          })
        );
        await resend.emails.send({
          from: EMAIL_FROM,
          to: [email],
          subject: "Welcome to First Date Labs!",
          html: emailHtml,
        });
      } catch (emailError) {
        // Log but don't fail the request - email is non-critical
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      isNew: result.is_new,
      unsubscribeToken: result.unsubscribe_token,
    });
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
