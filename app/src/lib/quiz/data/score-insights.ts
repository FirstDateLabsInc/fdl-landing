/**
 * Score Insights Utility
 *
 * Provides personalized narrative content based on user's score ranges.
 * Score ranges: low (0-39), moderate (40-69), strong (70-100)
 */

import scoreData from "./score-insights.json";

type ScoreRange = "low" | "moderate" | "strong";

export interface ScoreInsight {
  title: string;
  label: string;
  strengths: string[];
  growth: string[];
}

function getScoreRange(score: number): ScoreRange {
  if (score <= 39) return "low";
  if (score <= 69) return "moderate";
  return "strong";
}

export function getConfidenceInsight(score: number): ScoreInsight {
  const range = getScoreRange(score);
  const data = scoreData.confidence[range];
  return {
    title: scoreData.confidence.title,
    label: data.label,
    strengths: data.strengths,
    growth: data.growth,
  };
}

export function getEmotionalInsight(score: number): ScoreInsight {
  const range = getScoreRange(score);
  const data = scoreData.emotional[range];
  return {
    title: scoreData.emotional.title,
    label: data.label,
    strengths: data.strengths,
    growth: data.growth,
  };
}

export function getIntimacyComfortInsight(score: number): ScoreInsight {
  const range = getScoreRange(score);
  const data = scoreData.intimacy.comfort[range];
  return {
    title: scoreData.intimacy.comfort.title,
    label: data.label,
    strengths: data.strengths,
    growth: data.growth,
  };
}

export function getBoundaryInsight(score: number): ScoreInsight {
  const range = getScoreRange(score);
  const data = scoreData.intimacy.boundaries[range];
  return {
    title: scoreData.intimacy.boundaries.title,
    label: data.label,
    strengths: data.strengths,
    growth: data.growth,
  };
}

/**
 * Get all score insights for a user's results
 */
export function getAllScoreInsights(results: {
  confidence: number;
  emotional: number;
  intimacy: { comfort: number; boundaries: number };
}): {
  confidence: ScoreInsight & { score: number };
  emotional: ScoreInsight & { score: number };
  intimacyComfort: ScoreInsight & { score: number };
  boundaries: ScoreInsight & { score: number };
} {
  return {
    confidence: {
      ...getConfidenceInsight(results.confidence),
      score: results.confidence,
    },
    emotional: {
      ...getEmotionalInsight(results.emotional),
      score: results.emotional,
    },
    intimacyComfort: {
      ...getIntimacyComfortInsight(results.intimacy.comfort),
      score: results.intimacy.comfort,
    },
    boundaries: {
      ...getBoundaryInsight(results.intimacy.boundaries),
      score: results.intimacy.boundaries,
    },
  };
}
