"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import cloudflareLoader from "@/lib/cloudflare-image-loader";
import { OverallRadarChart } from "../charts/OverallRadarChart";
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
      <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12">
        {/* Left: Text Content */}
        <div className="order-2 flex flex-col justify-center space-y-6 text-center md:order-none md:text-left">
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="text-sm font-medium text-slate-500">
              Your Archetype
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {archetype.name}
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            {archetype.summary}
          </motion.p>
        </div>

        {/* Center: Character Image */}
        <motion.div
          className="order-1 flex items-center justify-center md:order-none"
          variants={imageVariants}
        >
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="aspect-3/4 relative">
              <Image
                src={archetype.image}
                alt={archetype.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 512px"
                className="object-contain"
                loader={cloudflareLoader}
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Right: Overall Radar Chart */}
        <motion.div
          className="order-3 flex items-center justify-center md:col-span-2 lg:col-span-1"
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
