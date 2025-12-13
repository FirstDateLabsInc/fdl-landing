import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { scoreQuizFromAnswers } from "@/lib/quiz/server/score-quiz";
import { computeQuizIdempotencyKey } from "@/lib/api/quiz/idempotency";
import type { SubmitQuizResponse } from "@/lib/api/quiz";

// Zod schema for request validation
// v is optional for scenario questions (only k matters)
// k is optional for likert questions (only v matters)
const DBAnswerEntrySchema = z
  .object({
    v: z.number().min(1).max(5).optional(), // Likert scale value (1-5)
    t: z.number().positive(), // timestamp
    k: z.string().optional(), // selectedKey for scenario questions
  })
  .refine(
    (data) => data.v !== undefined || data.k !== undefined,
    { message: "Answer must have either v (likert) or k (scenario)" }
  );

const SubmitQuizSchema = z.object({
  sessionId: z.string().min(1),
  fingerprintHash: z.string().min(1),
  answers: z.record(z.string(), DBAnswerEntrySchema),
  email: z.string().email().optional(),
  durationSeconds: z.number().positive().optional(),
  // UTM tracking fields
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SubmitQuizResponse>> {
  try {
    const rawBody: unknown = await request.json();
    const parsed = SubmitQuizSchema.safeParse(rawBody);

    if (!parsed.success) {
      const raw = isRecord(rawBody) ? rawBody : {};
      const answers = isRecord(raw.answers) ? raw.answers : null;
      const fingerprintHash =
        typeof raw.fingerprintHash === "string" ? raw.fingerprintHash : null;

      console.error("Validation error:", JSON.stringify(parsed.error.flatten(), null, 2));
      console.error("Raw body sample:", JSON.stringify({
        sessionId: typeof raw.sessionId === "string" ? raw.sessionId : null,
        fingerprintHash: fingerprintHash ? fingerprintHash.slice(0, 10) + "..." : null,
        answerCount: answers ? Object.keys(answers).length : 0,
        sampleAnswers: answers ? Object.entries(answers).slice(0, 3) : [],
      }, null, 2));
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          errorCode: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const {
      sessionId,
      fingerprintHash,
      answers,
      email,
      durationSeconds,
      utmSource,
      utmMedium,
      utmCampaign,
    } = parsed.data;

    const serverIdempotencyKey = await computeQuizIdempotencyKey({
      sessionId,
      fingerprintHash,
      answers,
    });

    // 1. Score quiz server-side
    const { results, archetypeSlug, confidence, isBalanced } =
      scoreQuizFromAnswers(answers);

    // 2. Persist to Supabase using service role (bypasses RLS)
    // RPC validates session internally and returns result UUID
    const supabase = getSupabaseServer();
    const { data: resultId, error } = await supabase.rpc("insert_quiz_result", {
      p_session_id: sessionId,
      p_archetype_slug: archetypeSlug,
      p_scores: results,
      p_answers: answers,
      p_fingerprint_hash: fingerprintHash || null,
      p_email: email || null,
      p_duration_seconds: durationSeconds || null,
      p_idempotency_key: serverIdempotencyKey,
      p_utm_source: utmSource || null,
      p_utm_medium: utmMedium || null,
      p_utm_campaign: utmCampaign || null,
    });

    if (error) {
      // Treat idempotency collisions as a replay: fetch and return the existing row id.
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("quiz_results")
          .select("id")
          .eq("idempotency_key", serverIdempotencyKey)
          .single();

        if (existing?.id) {
          return NextResponse.json({
            success: true,
            resultId: existing.id,
            archetypeSlug,
            scores: results,
            confidence,
            isBalanced,
          });
        }
      }

      console.error("Supabase error:", error);
      // Map Postgres error codes to API error codes
      const errorCode =
        error.code === "P0001"
          ? "INVALID_SESSION"
        : error.code === "P0002"
          ? "FINGERPRINT_MISMATCH"
          : "DATABASE_ERROR";
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          errorCode,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      resultId,
      archetypeSlug,
      scores: results,
      confidence,
      isBalanced,
    });
  } catch (err) {
    console.error("Quiz submission error:", err);
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
