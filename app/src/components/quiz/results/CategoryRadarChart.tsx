"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface CategoryDimension {
  label: string;
  value: number; // 0-100
  isPrimary?: boolean;
}

interface CategoryRadarChartProps {
  title: string;
  subtitle?: string;
  dimensions: CategoryDimension[];
  primaryLabel?: string;
  /** Primary style(s) - single string, array of tied styles, or 'mixed' if all are equal */
  primaryStyles?: string | string[] | 'mixed';
  /** Label to show when all styles are mixed (e.g., "Mixed Attachment Style") */
  mixedLabel?: string;
  accentColor?: string;
  fillColor?: string;
  animated?: boolean;
  className?: string;
}

// ============================================================================
// GEOMETRY HELPERS
// ============================================================================

const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = 70;
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

const DIMENSION_LABELS: Record<string, string> = {
  // Attachment
  secure: "Secure",
  anxious: "Anxious",
  avoidant: "Avoidant",
  disorganized: "Fearful",
  // Communication
  passive: "Passive",
  aggressive: "Aggressive",
  passive_aggressive: "Indirect",
  assertive: "Assertive",
};

function getDisplayLabel(name: string): string {
  return DIMENSION_LABELS[name] ?? name;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CategoryRadarChart({
  title,
  subtitle,
  dimensions,
  primaryLabel,
  primaryStyles,
  mixedLabel,
  accentColor = "#cab5d4",
  fillColor = "#f9d544",
  animated = true,
  className,
}: CategoryRadarChartProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

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

  // Generate label positions
  const labelPositions = useMemo(
    () =>
      dimensions.map((dim, i) => {
        const angle = i * angleStep;
        const { x, y } = polarToCartesian(angle, RADIUS + 105);
        return {
          label: getDisplayLabel(dim.label),
          value: dim.value,
          isPrimary: dim.isPrimary,
          x,
          y
        };
      }),
    [dimensions, angleStep]
  );

  // Data polygon points
  const dataPoints = getPolygonPoints(dimensions.map((d) => d.value));

  return (
    <div className={cn("rounded-2xl bg-white p-8 shadow-soft", className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-lg text-slate-500">{subtitle}</p>
        )}
      </div>

      {/* Chart */}
      <div className="flex items-center justify-center py-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[320px] sm:max-w-[26rem] aspect-square"
          role="img"
          aria-label={`Radar chart showing ${title}`}
        >
          {/* Background grid */}
          <g className="stroke-slate-200">
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
              fill={`${fillColor}30`}
              stroke={accentColor}
              strokeWidth={2.5}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
            />
          ) : (
            <polygon
              points={dataPoints}
              fill={`${fillColor}30`}
              stroke={accentColor}
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
                r={dim.isPrimary ? 6 : 4}
                fill={dim.isPrimary ? accentColor : fillColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
              />
            ) : (
              <circle 
                key={dim.label} 
                cx={x} 
                cy={y} 
                r={dim.isPrimary ? 6 : 4} 
                fill={dim.isPrimary ? accentColor : fillColor}
              />
            );
          })}

          {/* Labels with values */}
          {labelPositions.map(({ label, value, isPrimary, x, y }) => (
            <g key={label}>
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "text-[14px]",
                  isPrimary ? "fill-slate-800 font-semibold" : "fill-slate-500 font-medium"
                )}
              >
                {label}
              </text>
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "text-[16px] font-bold",
                  isPrimary ? "fill-[#cab5d4]" : "fill-slate-400"
                )}
              >
                {value}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Primary indicator */}
      {primaryLabel && (
        <div className="mt-4 flex flex-col items-center gap-1">
          {primaryStyles === 'mixed' ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-sm font-medium text-slate-700">
                  {mixedLabel || 'Mixed Style'}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {dimensions.map(d => getDisplayLabel(d.label)).join(', ')}
              </span>
            </>
          ) : Array.isArray(primaryStyles) ? (
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-sm font-medium text-slate-700">
                Primary Styles:{' '}
                <span className="text-slate-900">
                  {primaryStyles.map(s => getDisplayLabel(s)).join(', ')}
                </span>
              </span>
            </div>
          ) : primaryStyles ? (
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-sm font-medium text-slate-700">
                {primaryLabel}:{' '}
                <span className="text-slate-900">{getDisplayLabel(primaryStyles)}</span>
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
