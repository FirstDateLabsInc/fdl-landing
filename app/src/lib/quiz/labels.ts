// Centralized dimension label mappings for quiz results

/**
 * Human-readable labels for all dimension types used across
 * attachment, communication, and love language categories
 */
export const DIMENSION_LABELS: Record<string, string> = {
  // Attachment Styles
  secure: "Secure",
  anxious: "Anxious",
  avoidant: "Avoidant",
  disorganized: "Fearful",
  // Communication Styles
  passive: "Passive",
  aggressive: "Aggressive",
  passive_aggressive: "Passive-Aggressive",
  assertive: "Assertive",
  // Love Languages
  words: "Words of Affirmation",
  time: "Quality Time",
  service: "Acts of Service",
  gifts: "Receiving Gifts",
  touch: "Physical Touch",
};

/**
 * Get human-readable display label for a dimension
 * Falls back to the raw name if not found
 */
export function getDisplayLabel(name: string): string {
  return DIMENSION_LABELS[name] ?? name;
}

type ScoreCategory = "confidence" | "emotional" | "intimacy" | "boundaries";

const SCORE_THRESHOLDS = {
  confidence: { high: "High", mid: "Moderate", low: "Building" },
  emotional: { high: "Open", mid: "Balanced", low: "Reserved" },
  intimacy: { high: "Comfortable", mid: "Moderate", low: "Cautious" },
  boundaries: { high: "Strong", mid: "Growing", low: "Flexible" },
} as const;

/**
 * Get score-based detail label for radar chart dimensions
 * Uses consistent thresholds: >=70 = high, >=40 = mid, <40 = low
 */
export function getScoreDetail(score: number, category: ScoreCategory): string {
  const thresholds = SCORE_THRESHOLDS[category];
  if (score >= 70) return thresholds.high;
  if (score >= 40) return thresholds.mid;
  return thresholds.low;
}

/**
 * Format communication style for display
 * Handles snake_case conversion and capitalization
 */
export function formatCommunicationStyle(style: string): string {
  return style.charAt(0).toUpperCase() + style.slice(1).replace("_", "-");
}
