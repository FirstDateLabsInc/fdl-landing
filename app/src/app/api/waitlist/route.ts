import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getResend, EMAIL_FROM } from "@/lib/email/resend";
import { render } from "@react-email/render";
import { WaitlistConfirmation } from "@/emails/WaitlistConfirmation";
import { QuizResultsEmail } from "@/emails/QuizResultsEmail";
import { getPublicArchetypeById } from "@/lib/quiz/archetypes";
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

    // Send email for:
    // 1) New signups (welcome or quiz email)
    // 2) Returning users coming from quiz flow (they expect quiz results email)
    const isQuizSubmission = !!quizResultId;
    if (result.unsubscribe_token && (result.is_new || isQuizSubmission)) {
      try {
        const resend = getResend();

        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://firstdatelabs.com";

        // Use quiz-specific email only if we can resolve archetype image server-side
        let quizEmailPayload:
          | {
              archetypeName: string;
              archetypeImageUrl: string;
              quizResultUrl: string;
            }
          | undefined;

        if (quizResultId) {
          const { data: quizResult } = await supabase
            .from("quiz_results")
            .select("archetype_slug")
            .eq("id", quizResultId)
            .single();

          if (quizResult?.archetype_slug) {
            const archetype = getPublicArchetypeById(quizResult.archetype_slug);
            if (archetype?.image && archetype.name) {
              quizEmailPayload = {
                archetypeName: archetype.name,
                archetypeImageUrl: `${baseUrl}${archetype.image}`,
                quizResultUrl: `${baseUrl}/quiz/results/${quizResultId}`,
              };
            }
          }
        }

        const emailComponent = quizEmailPayload
          ? QuizResultsEmail({
              email,
              unsubscribeToken: result.unsubscribe_token,
              archetypeName: quizEmailPayload.archetypeName,
              archetypeImageUrl: quizEmailPayload.archetypeImageUrl,
              quizResultUrl: quizEmailPayload.quizResultUrl,
            })
          : WaitlistConfirmation({
              email,
              unsubscribeToken: result.unsubscribe_token,
            });

        const subject = quizEmailPayload
          ? `Your Dating Pattern: ${quizEmailPayload.archetypeName}`
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
