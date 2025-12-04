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

  const listVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.2,
          },
        },
      };

  const itemVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, x: -10 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.3 },
        },
      };

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br from-[#fffdf6] via-white to-[#cab5d4]/10 p-4",
        className
      )}
      {...motionProps}
    >
      {/* Archetype Header - Centered */}
      <div className="text-center">
        <span className="text-6xl" role="img" aria-label="archetype icon">
          {archetype.emoji}
        </span>
        <h2 className="mt-4 text-3xl font-bold text-slate-900">
          {archetype.name}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
          {archetype.summary}
        </p>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Strengths Section - Full Width */}
      <div className="mb-3">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
          Your Strengths
        </h3>
        <motion.ul
          className="mx-auto max-w-2xl space-y-3"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {archetype.strengths.map((strength, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-start gap-3 text-slate-700"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f9d544]" />
              <span className="text-base">{strength}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Growth Areas Section - Full Width */}
      <div>
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
          Growth Areas
        </h3>
        <motion.ul
          className="mx-auto max-w-2xl space-y-3"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {archetype.growthAreas.map((area, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-start gap-3 text-slate-700"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#cab5d4]" />
              <span className="text-base">{area}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
