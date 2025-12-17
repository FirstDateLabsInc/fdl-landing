"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { OVERALL_RADAR, OVERALL_RADAR_CONFIG } from "@/lib/quiz/radar-geometry";
import {
  getDisplayLabel,
  getScoreDetail,
  formatCommunicationStyle,
} from "@/lib/quiz/labels";
import { GradientProgressBar } from "./GradientProgressBar";
import type { QuizResults } from "@/lib/quiz/types";

interface OverallRadarChartProps {
  results: QuizResults;
  animated?: boolean;
  className?: string;
}

const { size: SIZE, radius: RADIUS } = OVERALL_RADAR_CONFIG;
const {
  center: CENTER,
  levels: LEVELS,
  polarToCartesian,
  getPolygonPoints,
  getGridPoints,
} = OVERALL_RADAR;

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
  const dimensions = useMemo(() => {
    // Helper to get attachment value and label
    const getAttachmentInfo = () => {
      const { primary, scores } = results.attachment;
      if (primary === "mixed") {
        const avgScore = scores.secure;
        return { value: avgScore, detail: "Balanced", fullLabel: "Balanced" };
      } else if (Array.isArray(primary)) {
        const score = scores[primary[0]];
        const labels = primary.map((p) => getDisplayLabel(p));
        return {
          value: score,
          detail: labels.join("/"),
          fullLabel: labels.join("/"),
        };
      } else {
        return {
          value: scores[primary],
          detail: getDisplayLabel(primary),
          fullLabel: getDisplayLabel(primary),
        };
      }
    };

    // Helper to get communication value and label
    const getCommunicationInfo = () => {
      const { primary, scores } = results.communication;
      if (primary === "mixed") {
        const avgScore = scores.passive;
        return { value: avgScore, detail: "Balanced", fullLabel: "Balanced" };
      } else if (Array.isArray(primary)) {
        const score = scores[primary[0]];
        const labels = primary.map(formatCommunicationStyle);
        return {
          value: score,
          detail: labels.join("/"),
          fullLabel: labels.join("/"),
        };
      } else {
        return {
          value: scores[primary],
          detail: formatCommunicationStyle(primary),
          fullLabel: formatCommunicationStyle(primary),
        };
      }
    };

    const attachmentInfo = getAttachmentInfo();
    const communicationInfo = getCommunicationInfo();

    return [
      {
        label: "Attachment",
        value: attachmentInfo.value,
        detail: attachmentInfo.detail,
        fullLabel: attachmentInfo.fullLabel,
        category: "Attachment",
      },
      {
        label: "Communication",
        value: communicationInfo.value,
        detail: communicationInfo.detail,
        fullLabel: communicationInfo.fullLabel,
        category: "Communication",
      },
      {
        label: "Confidence",
        value: results.confidence,
        detail: getScoreDetail(results.confidence, "confidence"),
        fullLabel: getScoreDetail(results.confidence, "confidence"),
        category: "Confidence",
      },
      {
        label: "Emotional",
        value: results.emotional,
        detail: getScoreDetail(results.emotional, "emotional"),
        fullLabel: getScoreDetail(results.emotional, "emotional"),
        category: "Emotional",
      },
      {
        label: "Intimacy",
        value: results.intimacy.comfort,
        detail: getScoreDetail(results.intimacy.comfort, "intimacy"),
        fullLabel: getScoreDetail(results.intimacy.comfort, "intimacy"),
        category: "Intimacy",
      },
      {
        label: "Boundaries",
        value: results.intimacy.boundaries,
        detail: getScoreDetail(results.intimacy.boundaries, "boundaries"),
        fullLabel: getScoreDetail(results.intimacy.boundaries, "boundaries"),
        category: "Boundaries",
      },
    ];
  }, [results]);

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
        const { x, y } = polarToCartesian(angle, RADIUS + 65);
        return { ...dim, x, y };
      }),
    [dimensions, angleStep]
  );

  // Data polygon points
  const dataPoints = getPolygonPoints(dimensions.map((d) => d.value));

  // Alternating colors using CSS variables
  const colors = [
    "var(--primary)",
    "var(--secondary)",
    "var(--primary)",
    "var(--secondary)",
    "var(--primary)",
    "var(--secondary)",
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <p className="text-sm text-slate-500">Your personality overview</p>

      {/* Chart */}
      <div className="flex items-center justify-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-64 w-64 max-w-full sm:h-72 sm:w-72 md:h-80 md:w-80"
          role="img"
          aria-label="Radar chart showing overall dating profile"
        >
          {/* Gradient definitions using CSS vars */}
          <defs>
            <linearGradient
              id="fillGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop
                offset="100%"
                stopColor="var(--secondary)"
                stopOpacity="0.35"
              />
            </linearGradient>
            <linearGradient
              id="strokeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--secondary)" />
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
              <circle key={dim.label} cx={x} cy={y} r={5} fill={colors[i]} />
            );
          })}

          {/* Labels - Split into two lines for readability */}
          {labelPositions.map(({ fullLabel, category, value, x, y }) => (
            <g key={category}>
              <text
                x={x}
                y={y - 22}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-800 text-[17px]"
              >
                <tspan x={x} dy="0">
                  {fullLabel}
                </tspan>
                <tspan x={x} dy="1.2em">
                  {category}
                </tspan>
              </text>
              <text
                x={x}
                y={y + 34}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-secondary text-[18px] font-bold"
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
