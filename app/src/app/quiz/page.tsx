import Link from "next/link";
import { Clock, Lock, Sparkles, Heart, Brain, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArchetypesGrid } from "@/components/archetypes/ArchetypesGrid";
import { archetypes } from "@/lib/quiz/archetypes";

const QUIZ_BENEFITS = [
  {
    icon: Heart,
    title: "Attachment Style",
    description: "Understand how you connect emotionally with partners",
  },
  {
    icon: MessageCircle,
    title: "Communication Patterns",
    description: "Discover your natural way of expressing needs",
  },
  {
    icon: Brain,
    title: "Love Languages",
    description: "Learn how you prefer to give and receive love",
  },
  {
    icon: Sparkles,
    title: "Dating Archetype",
    description: "Get your unique personality profile for dating",
  },
];

export default function QuizPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero */}
        <div className="text-center">
          {/* Hopeful sparkle icon */}
          <div className="relative inline-flex items-center justify-center h-16 w-16">
            {/* Main sparkle - gradient gold */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                fill="url(#sparkleGradient)"
              />
              <defs>
                <linearGradient id="sparkleGradient" x1="4" y1="2" x2="20" y2="18">
                  <stop offset="0%" stopColor="#ffe362" />
                  <stop offset="100%" stopColor="#f9d544" />
                </linearGradient>
              </defs>
            </svg>
            {/* Secondary smaller sparkles for brilliance */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute -top-1 -right-1 opacity-70">
              <path
                d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                fill="#ffb347"
              />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="absolute -bottom-1 -left-2 opacity-50">
              <path
                d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                fill="#cab5d4"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Discover Your
            <br />
            <span className="text-[#cab5d4]">Free Dating Personality</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Our science-backed quiz reveals your attachment style, communication
            patterns, and love languages—everything you need to understand yourself
            better in relationships.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>~8 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>48 questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>100% private</span>
            </div>
          </div>

          {/* CTA button */}
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#f9d544] px-8 text-slate-900 hover:bg-[#ffe362]"
            >
              <Link href="/quiz/questions?new=true">Start Quiz</Link>
            </Button>
          </div>
        </div>

        {/* Benefits section */}
        <div className="mt-20">
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            What You&apos;ll Learn
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {QUIZ_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl bg-white p-6 shadow-soft transition-shadow hover:shadow-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9d544]/20">
                  <benefit.icon className="h-5 w-5 text-slate-900" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Archetypes section */}
        <div className="mt-20 sm:mt-24 lg:mt-28">
          <div className="text-center">
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Dating Personalities 101
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
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
