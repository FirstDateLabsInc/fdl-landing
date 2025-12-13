import type { DBAnswerMap } from "@/lib/quiz/types";

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
}

type CanonicalAnswerEntry = {
  v?: number;
  k?: string;
};

export async function computeQuizIdempotencyKey(params: {
  sessionId: string;
  fingerprintHash: string;
  answers: DBAnswerMap;
}): Promise<string> {
  const { sessionId, fingerprintHash, answers } = params;

  const canonicalAnswers = Object.entries(answers)
    .map(([questionId, entry]) => [
      questionId,
      { v: entry.v, k: entry.k } satisfies CanonicalAnswerEntry,
    ])
    .sort(([a], [b]) => a.localeCompare(b));

  const payload = JSON.stringify({
    v: 1,
    sessionId,
    fingerprintHash,
    answers: canonicalAnswers,
  });

  const hash = await sha256Hex(payload);
  return `quiz:v1:${hash}`;
}

