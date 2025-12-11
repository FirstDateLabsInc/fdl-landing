"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface ScoreInsightCardProps {
  title: string;
  score: number;
  label: string;
  strengths: string[];
  growth: string[];
  index?: number;
  className?: string;
}

/**
 * Card component displaying a score dimension with personalized insights
 * Shows: score bar, interpretive label, strengths, and growth areas
 */
export function ScoreInsightCard({
  title,
  score,
  label,
  strengths,
  growth,
  index = 0,
  className,
}: ScoreInsightCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      {/* Header with title and score */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-base font-semibold text-slate-800">{title}</h4>
        <span className="text-lg font-bold text-slate-900">{score}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {shouldAnimate ? (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-[#e8c040] to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
          />
        ) : (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-[#e8c040] to-secondary"
            style={{ width: `${score}%` }}
          />
        )}
      </div>

      {/* Score interpretation label */}
      <p className="mb-4 text-sm font-medium leading-relaxed text-slate-700">
        {label}
      </p>

      {/* Strengths section */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Check className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Strengths
          </span>
        </div>
        <ul className="space-y-1.5">
          {strengths.map((strength, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-slate-600"
            >
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Growth areas section */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Areas to Grow
          </span>
        </div>
        <ul className="space-y-1.5">
          {growth.map((tip, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-slate-600"
            >
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
