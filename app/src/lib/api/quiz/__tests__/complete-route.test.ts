import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: vi.fn(),
}));

vi.mock("@/lib/quiz/server/score-quiz", () => ({
  scoreQuizFromAnswers: vi.fn(),
}));

import { getSupabaseServer } from "@/lib/supabase/server";
import { scoreQuizFromAnswers } from "@/lib/quiz/server/score-quiz";

function makeRequest(body: unknown): NextRequest {
  return { json: vi.fn().mockResolvedValue(body) } as unknown as NextRequest;
}

function makeBaseBody(overrides?: Record<string, unknown>) {
  return {
    sessionId: "session-123",
    fingerprintHash: "fp-123",
    answers: {
      Q1: { v: 3, t: 111 },
      Q2: { k: "A", t: 222 },
    },
    idempotencyKey: "client-key",
    ...overrides,
  };
}

describe("/api/quiz/complete", () => {
  const getSupabaseServerMock = vi.mocked(getSupabaseServer);
  const scoreQuizFromAnswersMock = vi.mocked(scoreQuizFromAnswers);

  beforeEach(() => {
    vi.resetAllMocks();
    scoreQuizFromAnswersMock.mockReturnValue({
      results: { attachment: { primary: "secure", scores: {} } } as any,
      archetypeSlug: "chameleon",
      confidence: 0.7,
      isBalanced: false,
    } as any);
  });

  it("computes a deterministic idempotency key on the server (ignores client key, ignores timestamps, ignores answer ordering)", async () => {
    const supabase = {
      rpc: vi.fn().mockResolvedValue({ data: "result-1", error: null }),
    };
    getSupabaseServerMock.mockReturnValue(supabase as any);

    const { POST } = await import("@/app/api/quiz/complete/route");

    await POST(makeRequest(makeBaseBody()));
    await POST(
      makeRequest(
        makeBaseBody({
          answers: {
            Q1: { v: 3, t: 999 }, // timestamp changed
            Q2: { k: "A", t: 888 },
          },
        })
      )
    );
    await POST(
      makeRequest(
        makeBaseBody({
          answers: {
            Q2: { k: "A", t: 222 }, // order changed
            Q1: { v: 3, t: 111 },
          },
        })
      )
    );
    await POST(
      makeRequest(
        makeBaseBody({
          answers: {
            Q1: { v: 4, t: 111 }, // answer changed
            Q2: { k: "A", t: 222 },
          },
        })
      )
    );
    await POST(
      makeRequest(
        makeBaseBody({
          sessionId: "session-OTHER", // session changed
        })
      )
    );

    const firstCallArgs = supabase.rpc.mock.calls[0]?.[1] as
      | { p_idempotency_key?: unknown }
      | undefined;
    const secondCallArgs = supabase.rpc.mock.calls[1]?.[1] as
      | { p_idempotency_key?: unknown }
      | undefined;
    const thirdCallArgs = supabase.rpc.mock.calls[2]?.[1] as
      | { p_idempotency_key?: unknown }
      | undefined;
    const fourthCallArgs = supabase.rpc.mock.calls[3]?.[1] as
      | { p_idempotency_key?: unknown }
      | undefined;
    const fifthCallArgs = supabase.rpc.mock.calls[4]?.[1] as
      | { p_idempotency_key?: unknown }
      | undefined;

    expect(typeof firstCallArgs?.p_idempotency_key).toBe("string");
    expect(firstCallArgs?.p_idempotency_key).not.toBe("client-key");
    expect(firstCallArgs?.p_idempotency_key).toBe(secondCallArgs?.p_idempotency_key);
    expect(firstCallArgs?.p_idempotency_key).toBe(thirdCallArgs?.p_idempotency_key);
    expect(firstCallArgs?.p_idempotency_key).not.toBe(fourthCallArgs?.p_idempotency_key);
    expect(firstCallArgs?.p_idempotency_key).not.toBe(fifthCallArgs?.p_idempotency_key);
  });

  it("treats unique-constraint collisions as a successful replay and returns the existing result id", async () => {
    const existingResultId = "existing-uuid";

    const single = vi.fn().mockResolvedValue({
      data: { id: existingResultId },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const supabase = {
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "23505", message: "duplicate key" },
      }),
      from,
    };
    getSupabaseServerMock.mockReturnValue(supabase as any);

    const { POST } = await import("@/app/api/quiz/complete/route");
    const response = await POST(makeRequest(makeBaseBody()));
    const payload = (await response.json()) as {
      success?: boolean;
      resultId?: string;
    };

    expect(payload.success).toBe(true);
    expect(payload.resultId).toBe(existingResultId);
    expect(from).toHaveBeenCalledWith("quiz_results");
  });
});

