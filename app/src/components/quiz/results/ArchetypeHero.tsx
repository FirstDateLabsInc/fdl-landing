"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Sparkles, Zap, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import cloudflareLoader from "@/lib/cloudflare-image-loader";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface ArchetypeHeroProps {
  archetype: ArchetypeDefinition;
  className?: string;
}

export function ArchetypeHero({ archetype, className }: ArchetypeHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: "easeOut" },
        },
      };

  return (
    <motion.div
      className={cn("relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8 lg:p-12", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-[#f9d544]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-blue-100/20 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* LEFT COLUMN: Identity (Name, Emoji, Summary) */}
        <div className="flex flex-col gap-6 text-center lg:col-span-4 lg:text-left">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-500">You are</span>
              {archetype.name}
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="prose prose-slate">
             <p className="text-lg leading-relaxed text-slate-700">
              {archetype.summary}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
             <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-[#f9d544]/20 text-slate-800 hover:bg-[#f9d544]/30 transition-colors">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 fill-[#f9d544]" />
                Primary Archetype
             </span>
          </motion.div>
        </div>

        {/* CENTER COLUMN: Character Image */}
        <motion.div 
          className="relative mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center lg:col-span-4"
          variants={imageVariants}
        >
          {/* Main Character Image - Large & Centered */}
          <div className="aspect-[3/4] w-full relative drop-shadow-2xl">
              <Image
                src={archetype.image}
                alt={archetype.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain transform hover:scale-105 transition-transform duration-500"
                loader={cloudflareLoader}
                priority
              />
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Quick Stats (Strengths & Challenges) */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          
          {/* Strengths Card */}
          <motion.div 
            variants={itemVariants}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
          >
            <div className="mb-3 flex items-center gap-2 text-green-600">
              <Zap className="h-5 w-5 fill-current" />
              <h3 className="font-bold uppercase tracking-wide text-xs">Your Superpowers</h3>
            </div>
            <ul className="space-y-2">
              {archetype.datingMeaning.strengths.slice(0, 3).map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  {strength}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Challenges Card */}
          <motion.div 
            variants={itemVariants}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
          >
            <div className="mb-3 flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5 fill-current" />
              <h3 className="font-bold uppercase tracking-wide text-xs">Your Kryptonite</h3>
            </div>
            <ul className="space-y-2">
              {archetype.datingMeaning.challenges.slice(0, 3).map((challenge, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {challenge}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
