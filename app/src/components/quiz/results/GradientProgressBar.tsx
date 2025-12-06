"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface GradientProgressBarProps {
  label: string;
  detail: string;
  value: number;
  index?: number;
  animated?: boolean;
  className?: string;
}

/**
 * Animated progress bar with gradient from primary to secondary colors
 * Uses CSS variables for theming consistency
 */
export function GradientProgressBar({
  label,
  detail,
  value,
  index = 0,
  animated = true,
  className,
}: GradientProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-lg">
        <span className="text-slate-700">
          {label}: <span className="font-semibold text-slate-900">{detail}</span>
        </span>
        <span className="font-bold text-slate-800">{value}%</span>
      </div>
      <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
        {shouldAnimate ? (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-[#e8c040] to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: "easeOut" }}
          />
        ) : (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-[#e8c040] to-secondary"
            style={{ width: `${value}%` }}
          />
        )}
      </div>
    </div>
  );
}
