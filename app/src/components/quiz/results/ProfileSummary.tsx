"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface ProfileSummaryProps {
  archetype: ArchetypeDefinition;
  className?: string;
}

export function ProfileSummary({ archetype, className }: ProfileSummaryProps) {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
      };

  return (
    <motion.div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-[#fffdf6] to-[#f9d544]/10 p-8 shadow-soft",
        className
      )}
      {...motionProps}
    >
      <div className="text-center">
        <span className="text-6xl" role="img" aria-label="archetype icon">
          {archetype.emoji}
        </span>
        <h2 className="mt-4 text-3xl font-bold text-slate-900">
          {archetype.name}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-lg text-slate-600">
          {archetype.summary}
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            Your Strengths
          </h3>
          <ul className="space-y-2">
            {archetype.strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f9d544]" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            Growth Areas
          </h3>
          <ul className="space-y-2">
            {archetype.growthAreas.map((area, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#cab5d4]" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
