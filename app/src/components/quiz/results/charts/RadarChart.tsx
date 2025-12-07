"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface RadarDimension {
  label: string;
  value: number; // 0-100
}

interface RadarChartProps {
  dimensions: RadarDimension[];
  animated?: boolean;
  className?: string;
}

// ============================================================================
// GEOMETRY HELPERS
// ============================================================================

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 120;
const LEVELS = 5;

function polarToCartesian(
  angle: number,
  radius: number
): { x: number; y: number } {
  // Adjust angle so 0 points up (-90 degrees offset)
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
// COMPONENT
// ============================================================================

export function RadarChart({
  dimensions,
  animated = true,
  className,
}: RadarChartProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;

  // Generate grid levels (background hexagon layers)
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

  // Generate label positions (slightly outside the chart)
  const labelPositions = useMemo(
    () =>
      dimensions.map((dim, i) => {
        const angle = i * angleStep;
        const { x, y } = polarToCartesian(angle, RADIUS + 30);
        return { label: dim.label, x, y };
      }),
    [dimensions, angleStep]
  );

  // Data polygon points
  const dataPoints = getPolygonPoints(dimensions.map((d) => d.value));

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full max-w-md"
        role="img"
        aria-label="Radar chart showing quiz results across 6 dimensions"
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
            className="fill-[#f9d544]/30 stroke-[#cab5d4]"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />
        ) : (
          <polygon
            points={dataPoints}
            className="fill-[#f9d544]/30 stroke-[#cab5d4]"
            strokeWidth={2}
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
              r={4}
              className="fill-[#cab5d4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
            />
          ) : (
            <circle key={dim.label} cx={x} cy={y} r={4} className="fill-[#cab5d4]" />
          );
        })}

        {/* Labels */}
        {labelPositions.map(({ label, x, y }) => (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 text-[10px] font-medium"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
