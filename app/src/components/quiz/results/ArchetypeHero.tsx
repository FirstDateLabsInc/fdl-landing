"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import cloudflareLoader from "@/lib/cloudflare-image-loader";
import { OverallRadarChart } from "./OverallRadarChart";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";
import type { QuizResults } from "@/lib/quiz/types";

interface ArchetypeHeroProps {
  archetype: ArchetypeDefinition;
  results: QuizResults;
  className?: string;
}

export function ArchetypeHero({ archetype, results, className }: ArchetypeHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };

  const imageVariants: Variants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      };

  return (
    <motion.div
      className={cn("w-full py-8 lg:py-12", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid items-center gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Left: Text Content */}
        <div className="space-y-6 text-center lg:text-left">
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="text-sm font-medium text-slate-500">
              Your Archetype
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {archetype.name}
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0"
          >
            {archetype.summary}
          </motion.p>
        </div>

        {/* Center: Character Image */}
        <motion.div
          className="relative mx-auto w-full max-w-xs lg:max-w-sm"
          variants={imageVariants}
        >
          <div className="aspect-3/4 relative">
            <Image
              src={archetype.image}
              alt={archetype.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
              className="object-contain"
              loader={cloudflareLoader}
              priority
            />
          </div>
        </motion.div>

        {/* Right: Overall Radar Chart */}
        <motion.div
          className="flex items-center justify-center"
          variants={itemVariants}
        >
          <OverallRadarChart
            results={results}
            animated={true}
            className="[&>div:last-child]:hidden"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
