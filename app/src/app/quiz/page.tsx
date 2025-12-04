"use client";

import Link from "next/link";
import { Clock, Lock, Sparkles, Heart, Brain, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { hasQuizProgress } from "@/hooks/use-quiz";
import { useSyncExternalStore } from "react";

// Subscribe to localStorage changes for quiz progress
function subscribeToQuizProgress(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === "juliet-quiz-state") {
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getQuizProgressSnapshot() {
  return hasQuizProgress();
}

function getQuizProgressServerSnapshot() {
  return false; // Server-side: assume no progress
}

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
  const hasProgress = useSyncExternalStore(
    subscribeToQuizProgress,
    getQuizProgressSnapshot,
    getQuizProgressServerSnapshot
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Hero */}
        <div className="text-center">
          <span className="inline-block text-5xl" role="img" aria-label="sparkles">
            ✨
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Discover Your
            <br />
            <span className="text-[#cab5d4]">Dating Personality</span>
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

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#f9d544] px-8 text-slate-900 hover:bg-[#ffe362]"
            >
              <Link href="/quiz/questions">
                {hasProgress ? "Resume Quiz" : "Start Quiz"}
              </Link>
            </Button>

            {hasProgress && (
              <Button asChild variant="ghost" size="lg">
                <Link href="/quiz/questions?new=true">Start Over</Link>
              </Button>
            )}
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

        {/* Trust signals */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Based on established psychology research including attachment theory,
            <br className="hidden sm:block" />
            communication styles, and the 5 Love Languages framework.
          </p>
        </div>
      </main>
  );
}
