"use client";

import { useMemo } from "react";

import { ScoreInsightCard } from "./ScoreInsightCard";
import { getAllScoreInsights } from "@/lib/quiz/data/score-insights";
import { cn } from "@/lib/utils";
import type { QuizResults } from "@/lib/quiz/types";

interface ScoreInsightsSectionProps {
  results: QuizResults;
  className?: string;
}

/**
 * Container component displaying all 4 score insight cards:
 * - Dating Confidence
 * - Emotional Availability
 * - Intimacy Comfort
 * - Boundary Assertiveness
 */
export function ScoreInsightsSection({
  results,
  className,
}: ScoreInsightsSectionProps) {
  const insights = useMemo(
    () => getAllScoreInsights(results),
    [results]
  );

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <ScoreInsightCard
        title={insights.confidence.title}
        score={insights.confidence.score}
        label={insights.confidence.label}
        strengths={insights.confidence.strengths}
        growth={insights.confidence.growth}
        index={0}
      />
      <ScoreInsightCard
        title={insights.emotional.title}
        score={insights.emotional.score}
        label={insights.emotional.label}
        strengths={insights.emotional.strengths}
        growth={insights.emotional.growth}
        index={1}
      />
      <ScoreInsightCard
        title={insights.intimacyComfort.title}
        score={insights.intimacyComfort.score}
        label={insights.intimacyComfort.label}
        strengths={insights.intimacyComfort.strengths}
        growth={insights.intimacyComfort.growth}
        index={2}
      />
      <ScoreInsightCard
        title={insights.boundaries.title}
        score={insights.boundaries.score}
        label={insights.boundaries.label}
        strengths={insights.boundaries.strengths}
        growth={insights.boundaries.growth}
        index={3}
      />
    </div>
  );
}
