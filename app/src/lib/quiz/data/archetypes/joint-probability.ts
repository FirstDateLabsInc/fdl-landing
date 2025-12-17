import type {
  QuizResults,
  AttachmentDimension,
  CommunicationStyle,
} from "../../types";
import type { ArchetypePublic } from "./types";
import { archetypesPublic } from "./public";
import { ARCHETYPE_MATRIX } from "./matrix";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EPSILON for floating-point tie detection.
 * If |joint1 - joint2| < EPSILON, they're considered tied.
 */
const EPSILON = 0.005;

/** log2(4) = maximum entropy for 4-category distribution */
const MAX_ENTROPY_4 = 2.0;

/** 90% of max entropy = "nearly uniform" threshold for balanced detection */
const BALANCED_THRESHOLD = 0.9;

/**
 * Priority order for tie-breaking (documented, healthiest patterns first).
 * Also serves as iteration order for cell generation.
 */
const ATTACHMENT_PRIORITY: readonly AttachmentDimension[] = [
  "secure",
  "anxious",
  "avoidant",
  "disorganized",
] as const;

const COMMUNICATION_PRIORITY: readonly CommunicationStyle[] = [
  "assertive",
  "passive",
  "aggressive",
  "passive_aggressive",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ArchetypeCell {
  attachment: AttachmentDimension;
  communication: CommunicationStyle;
  joint: number;
  /** Priority index 0-15 for deterministic tie-breaking (lower = higher priority) */
  priority: number;
}

export interface ArchetypeResult {
  archetype: ArchetypePublic;
  /** 0-1, higher = more distinctive profile. If < 0.3, consider showing "blended profile" UI */
  confidence: number;
  /** true if both axes have high entropy (nearly uniform) - informational for UI */
  isBalanced: boolean;
  debug?: {
    topCells: ArchetypeCell[];
    attachmentEntropy: number;
    communicationEntropy: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shannon entropy: measures distribution "flatness".
 * - H = 0: perfectly peaked (one category = 100%)
 * - H = 2.0: perfectly uniform (each = 25%)
 */
function entropy(probs: number[]): number {
  return -probs.reduce((sum, p) => {
    if (p <= 0) return sum;
    return sum + p * Math.log2(p);
  }, 0);
}

/**
 * Normalize scores to probability distribution.
 * Guards against zero/NaN: falls back to uniform (1/n each) if sum <= 0.
 * Does NOT mutate input scores object.
 */
function normalize<T extends string>(
  scores: Readonly<Record<T, number>>,
  keys: readonly T[]
): Record<T, number> {
  const sum = keys.reduce((acc, k) => acc + (scores[k] ?? 0), 0);
  const result = {} as Record<T, number>;

  if (sum <= 0) {
    // Degenerate case: all zeros or negative -> uniform distribution
    const uniform = 1 / keys.length;
    for (const k of keys) result[k] = uniform;
  } else {
    for (const k of keys) result[k] = (scores[k] ?? 0) / sum;
  }

  return result;
}

/** Look up archetype definition by ID, logs error and falls back to first if not found */
function findArchetype(id: string): ArchetypePublic {
  const found = archetypesPublic.find((a) => a.id === id);
  if (!found) {
    console.error(
      `[joint-probability] Unknown archetype ID: "${id}". Check ARCHETYPE_MATRIX and public.ts.`
    );
    return archetypesPublic[0];
  }
  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Algorithm
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute archetype using joint probability of attachment x communication.
 *
 * Algorithm:
 * 1. Normalize attachment scores -> P(A) probability distribution
 * 2. Normalize communication scores -> P(C) probability distribution
 * 3. For each of 16 cells, compute joint = P(A) x P(C) with priority index
 * 4. Sort by joint descending; ties (within EPSILON) resolved by priority
 * 5. Calculate confidence from entropy (low entropy = high confidence)
 * 6. Detect balanced state (both axes nearly uniform)
 *
 * Guarantees:
 * - Immutable: input `results` is never mutated
 * - Deterministic: epsilon-based tie-breaking with documented priority order
 * - NaN-safe: zero sums fall back to uniform distribution
 *
 * @param results - Full quiz results with all dimension scores (read-only)
 * @param includeDebug - Include debug info (top cells, entropy values)
 */
export function computeArchetypeByProbability(
  results: QuizResults,
  includeDebug = false
): ArchetypeResult {
  const { attachment, communication } = results;

  // Step 1: Normalize to probability distributions (creates new objects)
  const pAttach = normalize(attachment.scores, ATTACHMENT_PRIORITY);
  const pComm = normalize(communication.scores, COMMUNICATION_PRIORITY);

  // Step 2: Compute joint probabilities for all 16 cells with priority index
  const cells: ArchetypeCell[] = [];
  let priorityIdx = 0;

  for (const aDim of ATTACHMENT_PRIORITY) {
    for (const cStyle of COMMUNICATION_PRIORITY) {
      cells.push({
        attachment: aDim,
        communication: cStyle,
        joint: pAttach[aDim] * pComm[cStyle],
        priority: priorityIdx++,
      });
    }
  }

  // Step 3: Sort by joint descending; epsilon-based tie uses priority
  cells.sort((a, b) => {
    const diff = b.joint - a.joint;
    if (Math.abs(diff) < EPSILON) {
      // Within epsilon: deterministic tiebreak by priority (lower = wins)
      return a.priority - b.priority;
    }
    return diff;
  });

  // Step 4: Winner is first after sort
  const winner = cells[0];

  // Step 5: Calculate entropy-based confidence
  const attachEntropy = entropy(Object.values(pAttach));
  const commEntropy = entropy(Object.values(pComm));

  // Average entropy ratio: 0 = peaked, 1 = uniform
  const avgEntropyRatio = (attachEntropy + commEntropy) / (2 * MAX_ENTROPY_4);
  const confidence = 1 - avgEntropyRatio;

  // Step 6: Detect balanced (both axes nearly uniform)
  // No "balanced" archetype exists, so we still return top cell
  // UI can use isBalanced flag to show "blended profile" messaging
  const isBalanced =
    attachEntropy > BALANCED_THRESHOLD * MAX_ENTROPY_4 &&
    commEntropy > BALANCED_THRESHOLD * MAX_ENTROPY_4;

  // Step 7: Build result (archetype lookup)
  const id = ARCHETYPE_MATRIX[winner.attachment][winner.communication];

  const result: ArchetypeResult = {
    archetype: findArchetype(id),
    confidence,
    isBalanced,
  };

  if (includeDebug) {
    result.debug = {
      topCells: cells.slice(0, 4),
      attachmentEntropy: attachEntropy,
      communicationEntropy: commEntropy,
    };
  }

  return result;
}

/**
 * Simple getter - returns just the public archetype data.
 * Use computeArchetypeByProbability() for confidence/balanced info.
 */
export function getArchetypeByProbability(
  results: QuizResults
): ArchetypePublic {
  return computeArchetypeByProbability(results).archetype;
}
