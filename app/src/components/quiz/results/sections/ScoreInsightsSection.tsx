"use client";

import { useState, useMemo } from "react";
import { Sparkles, Heart, ShieldCheck, Target, Check, TrendingUp, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getAllScoreInsights } from "@/lib/quiz/data/score-insights";
import { cn } from "@/lib/utils";
import type { QuizResults } from "@/lib/quiz/types";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type ScoreKey = "confidence" | "emotional" | "intimacyComfort" | "boundaries";

const HIGH_THRESHOLD = 75;
const LOW_THRESHOLD = 50;

interface DimensionConfig {
  key: ScoreKey;
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  barColor: string;
}

const DIMENSION_CONFIG: DimensionConfig[] = [
  {
    key: "confidence",
    name: "Dating Confidence",
    shortName: "Confidence",
    icon: Sparkles,
    color: "#f59e0b", // amber
    barColor: "#fbbf24",
  },
  {
    key: "emotional",
    name: "Emotional Availability",
    shortName: "Emotional",
    icon: Heart,
    color: "#ec4899", // pink
    barColor: "#f472b6",
  },
  {
    key: "intimacyComfort",
    name: "Intimacy Comfort",
    shortName: "Intimacy",
    icon: ShieldCheck,
    color: "#8b5cf6", // violet
    barColor: "#a78bfa",
  },
  {
    key: "boundaries",
    name: "Boundary Assertiveness",
    shortName: "Boundaries",
    icon: Target,
    color: "#10b981", // emerald
    barColor: "#34d399",
  },
];

// ============================================================================
// SCORE BAR ITEM
// ============================================================================

interface ScoreBarItemProps {
  dimension: DimensionConfig;
  score: number;
  isSelected: boolean;
  onClick: () => void;
}

function ScoreBarItem({ dimension, score, isSelected, onClick }: ScoreBarItemProps) {
  const Icon = dimension.icon;
  const scoreLevel = score >= HIGH_THRESHOLD ? "High" : score >= LOW_THRESHOLD ? "Medium" : "Growing";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left transition-all duration-200 rounded-xl p-3 sm:p-4",
        "hover:bg-slate-50/80",
        isSelected
          ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent ring-2 ring-primary/30"
          : "bg-white"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
            style={{ backgroundColor: `${dimension.color}15` }}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: dimension.color }} />
          </div>
          <span className="font-semibold text-sm sm:text-base text-slate-800">
            <span className="hidden sm:inline">{dimension.name}</span>
            <span className="sm:hidden">{dimension.shortName}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: score >= HIGH_THRESHOLD ? "#d1fae5" : score >= LOW_THRESHOLD ? "#fef3c7" : "#fce7f3",
              color: score >= HIGH_THRESHOLD ? "#047857" : score >= LOW_THRESHOLD ? "#b45309" : "#be185d",
            }}
          >
            {scoreLevel}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform duration-200",
              isSelected && "rotate-90 text-primary"
            )}
          />
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-6 sm:h-8 rounded-full overflow-hidden bg-slate-100">
        <div
          className="absolute left-0 top-0 h-full flex items-center justify-end pr-3 transition-all duration-300 rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: dimension.barColor,
          }}
        >
          <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-sm">
            {score}%
          </span>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// DETAIL PANEL
// ============================================================================

interface ScoreDetailPanelProps {
  dimension: DimensionConfig;
  score: number;
  label: string;
  strengths: string[];
  growth: string[];
  className?: string;
}

function ScoreDetailPanel({ dimension, score, label, strengths, growth, className }: ScoreDetailPanelProps) {
  const Icon = dimension.icon;
  const scoreLevel = score >= HIGH_THRESHOLD ? "High" : score >= LOW_THRESHOLD ? "Medium" : "Growing";

  return (
    <div className={cn("rounded-2xl bg-white border border-slate-100 shadow-soft p-4", className)}>
      {/* Header - compact */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ backgroundColor: `${dimension.color}15` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: dimension.color }} />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-slate-800 truncate">{dimension.name}</h4>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: score >= HIGH_THRESHOLD ? "#d1fae5" : score >= LOW_THRESHOLD ? "#fef3c7" : "#fce7f3",
              color: score >= HIGH_THRESHOLD ? "#047857" : score >= LOW_THRESHOLD ? "#b45309" : "#be185d",
            }}
          >
            {score}% - {scoreLevel}
          </span>
        </div>
      </div>

      {/* Description - compact */}
      <p className="text-xs leading-relaxed text-slate-600 mb-4">
        {label}
      </p>

      {/* Strengths and Growth sections - compact */}
      <div className="space-y-3">
        {strengths.length > 0 && (
          <div className="bg-emerald-50/50 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Strengths</span>
            </div>
            <ul className="space-y-1.5">
              {strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: dimension.color }}
                  />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {growth.length > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Areas to Grow</span>
            </div>
            <ul className="space-y-1.5">
              {growth.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: dimension.color }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MOBILE DETAIL (Expandable inline)
// ============================================================================

interface MobileDetailProps {
  dimension: DimensionConfig;
  label: string;
  strengths: string[];
  growth: string[];
  isExpanded: boolean;
}

function MobileDetail({ dimension, label, strengths, growth, isExpanded }: MobileDetailProps) {
  if (!isExpanded) return null;

  return (
    <div className="px-3 pb-4 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
      {/* Description */}
      <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 rounded-lg p-3">
        {label}
      </p>

      {/* Strengths and Growth */}
      <div className="space-y-4">
        {strengths.length > 0 && (
          <div className="bg-emerald-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Strengths</span>
            </div>
            <ul className="space-y-1.5">
              {strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: dimension.color }}
                  />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {growth.length > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Areas to Grow</span>
            </div>
            <ul className="space-y-1.5">
              {growth.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: dimension.color }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ScoreInsightsSectionProps {
  results: QuizResults;
  className?: string;
}

/**
 * Container component displaying all 4 score insight dimensions:
 * - Dating Confidence
 * - Emotional Availability
 * - Intimacy Comfort
 * - Boundary Assertiveness
 *
 * Uses interactive bar chart + detail panel layout matching Love Languages UI
 */
export function ScoreInsightsSection({
  results,
  className,
}: ScoreInsightsSectionProps) {
  const insights = useMemo(
    () => getAllScoreInsights(results),
    [results]
  );

  // Build dimension data array
  const dimensionData = useMemo(() => {
    return DIMENSION_CONFIG.map((config) => ({
      ...config,
      score: insights[config.key].score,
      label: insights[config.key].label,
      strengths: insights[config.key].strengths,
      growth: insights[config.key].growth,
    }));
  }, [insights]);

  // Default to highest score dimension
  const defaultSelected = dimensionData.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev
  ).key;
  const [selectedKey, setSelectedKey] = useState<ScoreKey>(defaultSelected);

  const selectedData = dimensionData.find(d => d.key === selectedKey) || dimensionData[0];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop/Tablet: Side-by-side layout */}
      <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Bar charts - 3 columns on md (60%), 2 columns on lg (66%) */}
        <div className="md:col-span-3 lg:col-span-2 space-y-2 rounded-2xl bg-white border border-slate-100 shadow-soft p-3 sm:p-4">
          {dimensionData.map((dimension) => (
            <ScoreBarItem
              key={dimension.key}
              dimension={dimension}
              score={dimension.score}
              isSelected={selectedKey === dimension.key}
              onClick={() => setSelectedKey(dimension.key)}
            />
          ))}
        </div>

        {/* Detail panel - 2 columns on md (40%), 1 column on lg (33%) */}
        <div className="md:col-span-2 lg:col-span-1">
          <ScoreDetailPanel
            dimension={selectedData}
            score={selectedData.score}
            label={selectedData.label}
            strengths={selectedData.strengths}
            growth={selectedData.growth}
            className="h-full"
          />
        </div>
      </div>

      {/* Mobile: Stacked with inline expansion */}
      <div className="md:hidden space-y-2 rounded-2xl bg-white border border-slate-100 shadow-soft p-2 overflow-hidden">
        {dimensionData.map((dimension) => (
          <div key={dimension.key} className="overflow-hidden">
            <ScoreBarItem
              dimension={dimension}
              score={dimension.score}
              isSelected={selectedKey === dimension.key}
              onClick={() => setSelectedKey(dimension.key)}
            />
            <MobileDetail
              dimension={dimension}
              label={dimension.label}
              strengths={dimension.strengths}
              growth={dimension.growth}
              isExpanded={selectedKey === dimension.key}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
