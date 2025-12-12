import type { DBScores } from '../types-db';
import { dbScoresSchema } from '../schemas';

/**
 * Runtime validation for DB-stored quiz scores.
 * Returns null when the payload doesn't match the expected DBScores shape.
 */
export function parseDbScores(value: unknown): DBScores | null {
  const parsed = dbScoresSchema.safeParse(value);
  if (!parsed.success) return null;
  return parsed.data as DBScores;
}

