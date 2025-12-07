"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import cloudflareLoader from "@/lib/cloudflare-image-loader";
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
        "rounded-2xl bg-white p-5 shadow-soft",
        className
      )}
      {...motionProps}
    >
      {/* Archetype Header - Centered */}
      <div className="text-center">
        <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
          <Image
            src={archetype.image}
            alt={archetype.name}
            fill
            sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
            className="object-contain"
            loader={cloudflareLoader}
            loading="eager"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          {archetype.name}
        </h2>
      </div>
      <p className="mt-3 text-lg leading-relaxed text-slate-600">
        {archetype.summary}
      </p>
    </motion.div>
  );
}
