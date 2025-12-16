import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getResend, EMAIL_FROM } from "@/lib/email/resend";
import { render } from "@react-email/render";
import { WaitlistConfirmation } from "@/emails/WaitlistConfirmation";
import { QuizResultsEmail } from "@/emails/QuizResultsEmail";
import { verifyTurnstileToken } from "@/lib/turnstile";
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
    const {
      email,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      quizResultId,
      archetypeName,
      archetypeEmoji,
      turnstileToken,
    } = body;

    // Verify Turnstile token if provided (before any DB operations)
    if (turnstileToken) {
      const clientIP =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for") ||
        undefined;
      const verification = await verifyTurnstileToken(turnstileToken, clientIP);

      if (!verification.success) {
        return NextResponse.json(
          {
            success: false,
            error: verification.error || "Verification failed",
            errorCode: "TURNSTILE_FAILED",
          },
          { status: 400 }
        );
      }
    }

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

        // Use quiz-specific email if archetype info is present
        const isQuizSignup = quizResultId && archetypeName && archetypeEmoji;

        const emailComponent = isQuizSignup
          ? QuizResultsEmail({
              email,
              unsubscribeToken: result.unsubscribe_token,
              archetypeName,
              archetypeEmoji,
              quizResultUrl: `https://firstdatelabs.com/quiz/results/${quizResultId}`,
            })
          : WaitlistConfirmation({
              email,
              unsubscribeToken: result.unsubscribe_token,
            });

        const subject = isQuizSignup
          ? `Your Dating Pattern: ${archetypeEmoji} ${archetypeName}`
          : "Welcome to First Date Labs!";

        // Pre-render React Email to HTML (fixes Turbopack bundling issue)
        const emailHtml = await render(emailComponent);

        await resend.emails.send({
          from: EMAIL_FROM,
          to: [email],
          subject,
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
