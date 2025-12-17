"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Clock,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArchetypesGrid } from "@/components/archetypes/ArchetypesGrid";
import { archetypes } from "@/lib/quiz/archetypes";

const QUIZ_BENEFITS = [
  {
    image: "/images/quiz/benefit-attachment.png",
    title: "Attachment Style",
    description: "Understand how you connect emotionally with partners",
    position: "center 25%", // focus on face
  },
  {
    image: "/images/quiz/benefit-communication.png",
    title: "Communication Patterns",
    description: "Discover your natural way of expressing needs",
    position: "center 20%", // focus on face
  },
  {
    image: "/images/quiz/benefit-love.png",
    title: "Love Languages",
    description: "Learn how you prefer to give and receive love",
    position: "center 25%", // focus on face
  },
  {
    image: "/images/quiz/benefit-archetype.png",
    title: "Dating Archetype",
    description: "Get your unique personality profile for dating",
    position: "center 30%", // focus on face
  },
];

export default function QuizPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 md:pt-12 md:pb-16 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        {/* Hopeful sparkle icon */}
        <motion.div
          initial={
            prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }
          }
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-flex h-16 w-16 items-center justify-center"
        >
          {/* Main sparkle - gradient gold */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="url(#sparkleGradient)"
            />
            <defs>
              <linearGradient
                id="sparkleGradient"
                x1="4"
                y1="2"
                x2="20"
                y2="18"
              >
                <stop offset="0%" stopColor="#ffe362" />
                <stop offset="100%" stopColor="#f9d544" />
              </linearGradient>
            </defs>
          </svg>
          {/* Secondary smaller sparkles for brilliance */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute -top-1 -right-1 opacity-70"
          >
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="#ffb347"
            />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute -bottom-1 -left-2 opacity-50"
          >
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="#cab5d4"
            />
          </svg>
        </motion.div>
        {/* Eyebrow with decorative lines */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/60" />
          <span className="text-sm font-semibold tracking-[0.25em] uppercase text-secondary-dark sm:text-base">
            Discover Your
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/60" />
        </motion.div>

        <motion.h1
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-3 text-4xl leading-tight font-bold tracking-tight sm:text-5xl sm:leading-tight"
        >
          <span className="from-secondary to-primary bg-gradient-to-r bg-clip-text text-transparent">
            Dating & Relationship Personality
          </span>
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600"
        >
          Our science-backed quiz reveals your unique archetype among{" "}
          <Link
            href="#archetypes"
            className="text-secondary decoration-secondary hover:text-secondary/80 hover:decoration-secondary/70 font-medium underline underline-offset-2 transition-colors"
          >
            16 dating personalities
          </Link>
          , plus your attachment style, communication patterns, and love
          languages.
          <br />
          <span className="mt-1 block">
            Everything you need to understand yourself better in dating.
          </span>
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~6 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>48 questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>100% private</span>
          </div>
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary shadow-soft hover:bg-accent hover:shadow-hover px-8 text-slate-900 transition-all hover:-translate-y-0.5"
          >
            <Link href="/quiz/questions?new=true">
              Reveal My Archetype
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Benefits section */}
      <div className="mt-20">
        <h2 className="text-center text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase">
          What You&apos;ll Learn
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {QUIZ_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="shadow-soft hover:shadow-hover rounded-xl bg-white/60 p-2.5 sm:p-4 text-center transition-shadow"
            >
              <div className="mx-auto w-full overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="h-24 sm:h-32 w-full rounded-lg object-cover"
                  style={{ objectPosition: benefit.position }}
                />
              </div>
              <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-slate-900">
                {benefit.title}
              </h3>
              <p className="mt-1 text-[10px] sm:text-xs leading-relaxed text-slate-500">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Archetypes section */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <div className="text-center">
          <h2
            id="archetypes"
            className="text-foreground mt-2 scroll-mt-24 text-[1.9rem] font-semibold tracking-tight sm:text-[2.25rem]"
          >
            Dating Personalities 101
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base sm:text-lg">
            Decode the 16 archetypes and unlock their secrets.
          </p>
        </div>

        <div className="mt-8">
          <ArchetypesGrid archetypes={archetypes} />
        </div>
      </div>
    </main>
  );
}
