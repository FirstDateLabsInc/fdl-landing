"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import type { QuizResults } from "@/lib/quiz/types";

interface OverallRadarChartProps {
  results: QuizResults;
  animated?: boolean;
  className?: string;
}

// ============================================================================
// GEOMETRY HELPERS
// ============================================================================

const SIZE = 380;
const CENTER = SIZE / 2;
const RADIUS = 90;
const LEVELS = 5;

function polarToCartesian(
  angle: number,
  radius: number
): { x: number; y: number } {
  const adjustedAngle = angle - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(adjustedAngle),
    y: CENTER + radius * Math.sin(adjustedAngle),
  };
}

function getPolygonPoints(values: number[], maxValue: number = 100): string {
  const n = values.length;
  const angleStep = (2 * Math.PI) / n;

  return values
    .map((value, i) => {
      const angle = i * angleStep;
      const normalizedRadius = (value / maxValue) * RADIUS;
      const { x, y } = polarToCartesian(angle, normalizedRadius);
      return `${x},${y}`;
    })
    .join(" ");
}

function getGridPoints(level: number, numAxes: number): string {
  const radius = (level / LEVELS) * RADIUS;
  const angleStep = (2 * Math.PI) / numAxes;

  return Array.from({ length: numAxes })
    .map((_, i) => {
      const { x, y } = polarToCartesian(i * angleStep, radius);
      return `${x},${y}`;
    })
    .join(" ");
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

const ATTACHMENT_LABELS: Record<string, string> = {
  secure: "Secure",
  anxious: "Anxious",
  avoidant: "Avoidant",
  disorganized: "Fearful",
};

// ============================================================================
// GRADIENT PROGRESS BAR COMPONENT
// ============================================================================

interface GradientProgressBarProps {
  label: string;
  detail: string;
  value: number;
  index: number;
  animated?: boolean;
}

function GradientProgressBar({ 
  label, 
  detail, 
  value, 
  index, 
  animated = true 
}: GradientProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  // Progressive gradient colors - smooth transition from yellow to purple
  const startColor = "#f9d544";
  const midColor = "#e8c040";
  const endColor = "#cab5d4";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-lg">
        <span className="text-slate-700">
          {label}: <span className="font-semibold text-slate-900">{detail}</span>
        </span>
        <span className="font-bold text-slate-800">{value}%</span>
      </div>
      <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
        {shouldAnimate ? (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${startColor} 0%, ${midColor} 50%, ${endColor} 100%)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: "easeOut" }}
          />
        ) : (
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ 
              width: `${value}%`,
              background: `linear-gradient(90deg, ${startColor} 0%, ${midColor} 50%, ${endColor} 100%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OverallRadarChart({
  results,
  animated = true,
  className,
}: OverallRadarChartProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  // Build 6-dimension profile from results
  const dimensions = useMemo(() => [
    { 
      label: "Attachment", 
      value: results.attachment.scores[results.attachment.primary],
      detail: ATTACHMENT_LABELS[results.attachment.primary] || results.attachment.primary,
      fullLabel: `${ATTACHMENT_LABELS[results.attachment.primary] || results.attachment.primary}`,
      category: "Attachment",
    },
    { 
      label: "Communication", 
      value: results.communication.scores[results.communication.primary],
      detail: results.communication.primary.charAt(0).toUpperCase() + results.communication.primary.slice(1).replace('_', '-'),
      fullLabel: results.communication.primary.charAt(0).toUpperCase() + results.communication.primary.slice(1).replace('_', '-'),
      category: "Communication",
    },
    { 
      label: "Confidence", 
      value: results.confidence,
      detail: results.confidence >= 70 ? "High" : results.confidence >= 40 ? "Moderate" : "Building",
      fullLabel: results.confidence >= 70 ? "High" : results.confidence >= 40 ? "Moderate" : "Building",
      category: "Confidence",
    },
    { 
      label: "Emotional", 
      value: results.emotional,
      detail: results.emotional >= 70 ? "Open" : results.emotional >= 40 ? "Balanced" : "Reserved",
      fullLabel: results.emotional >= 70 ? "Open" : results.emotional >= 40 ? "Balanced" : "Reserved",
      category: "Emotional",
    },
    { 
      label: "Intimacy", 
      value: results.intimacy.comfort,
      detail: results.intimacy.comfort >= 70 ? "Comfortable" : results.intimacy.comfort >= 40 ? "Moderate" : "Cautious",
      fullLabel: results.intimacy.comfort >= 70 ? "Comfortable" : results.intimacy.comfort >= 40 ? "Moderate" : "Cautious",
      category: "Intimacy",
    },
    { 
      label: "Boundaries", 
      value: results.intimacy.boundaries,
      detail: results.intimacy.boundaries >= 70 ? "Strong" : results.intimacy.boundaries >= 40 ? "Growing" : "Flexible",
      fullLabel: results.intimacy.boundaries >= 70 ? "Strong" : results.intimacy.boundaries >= 40 ? "Growing" : "Flexible",
      category: "Boundaries",
    },
  ], [results]);

  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;

  // Generate grid levels
  const gridLevels = useMemo(
    () =>
      Array.from({ length: LEVELS }, (_, i) => ({
        level: i + 1,
        points: getGridPoints(i + 1, n),
      })),
    [n]
  );

  // Generate axis lines
  const axisLines = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const angle = i * angleStep;
        const end = polarToCartesian(angle, RADIUS);
        return { x1: CENTER, y1: CENTER, x2: end.x, y2: end.y };
      }),
    [n, angleStep]
  );

  // Generate label positions - offset further for longer labels
  const labelPositions = useMemo(
    () =>
      dimensions.map((dim, i) => {
        const angle = i * angleStep;
        const { x, y } = polarToCartesian(angle, RADIUS + 50);
        return { ...dim, x, y };
      }),
    [dimensions, angleStep]
  );

  // Data polygon points
  const dataPoints = getPolygonPoints(dimensions.map((d) => d.value));

  // Colors for data points
  const colors = ["#f9d544", "#cab5d4", "#f9d544", "#cab5d4", "#f9d544", "#cab5d4"];

  return (
    <div className={cn("rounded-2xl bg-white p-5 shadow-soft", className)}>
      {/* Header */}
      <div className="mb-2 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Your Dating Profile</h3>
        <p className="text-lg text-slate-500">Overall personality overview</p>
      </div>

      {/* Chart */}
      <div className="flex items-center justify-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-72 w-72 sm:h-80 sm:w-80"
          role="img"
          aria-label="Radar chart showing overall dating profile"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9d544" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#cab5d4" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9d544" />
              <stop offset="100%" stopColor="#cab5d4" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <g>
            {gridLevels.map(({ level, points }) => (
              <polygon
                key={level}
                points={points}
                fill="none"
                strokeWidth={1}
                className="stroke-slate-200"
              />
            ))}
          </g>

          {/* Axis lines */}
          <g className="stroke-slate-200">
            {axisLines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                strokeWidth={1}
              />
            ))}
          </g>

          {/* Data polygon */}
          {shouldAnimate ? (
            <motion.polygon
              points={dataPoints}
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
              strokeWidth={2.5}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
            />
          ) : (
            <polygon
              points={dataPoints}
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
              strokeWidth={2.5}
            />
          )}

          {/* Data points */}
          {dimensions.map((dim, i) => {
            const angle = i * angleStep;
            const normalizedRadius = (dim.value / 100) * RADIUS;
            const { x, y } = polarToCartesian(angle, normalizedRadius);

            return shouldAnimate ? (
              <motion.circle
                key={dim.label}
                cx={x}
                cy={y}
                r={5}
                fill={colors[i]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
              />
            ) : (
              <circle 
                key={dim.label} 
                cx={x} 
                cy={y} 
                r={5} 
                fill={colors[i]}
              />
            );
          })}

          {/* Labels - Full descriptive labels */}
          {labelPositions.map(({ fullLabel, category, value, x, y }) => (
            <g key={category}>
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-800 text-[15px] font-semibold"
              >
                {fullLabel} {category}
              </text>
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#cab5d4] text-[18px] font-bold"
              >
                {value}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend with Gradient Progress Bars */}
      <div className="mt-1 space-y-1">
        {dimensions.map((dim, i) => (
          <GradientProgressBar
            key={dim.label}
            label={dim.label}
            detail={dim.detail}
            value={dim.value}
            index={i}
            animated={animated}
          />
        ))}
      </div>
    </div>
  );
}
