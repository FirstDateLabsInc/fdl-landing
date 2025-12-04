"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuizContainer } from "@/components/quiz/QuizContainer";
import { clearQuizProgress } from "@/hooks/use-quiz";
import type { QuizResults } from "@/lib/quiz/types";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

const RESULTS_STORAGE_KEY = "juliet-quiz-results";

function QuizQuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle "start over" query param
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      clearQuizProgress();
      // Remove the query param without reloading
      router.replace("/quiz/questions");
    }
  }, [searchParams, router]);

  const handleComplete = useCallback(
    (results: QuizResults, archetype: ArchetypeDefinition) => {
      // Save results to localStorage
      const stored = {
        version: 1 as const,
        computedAt: Date.now(),
        results,
        archetype: {
          id: archetype.id,
          name: archetype.name,
          emoji: archetype.emoji,
          summary: archetype.summary,
        },
      };

      try {
        localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(stored));
      } catch (err) {
        console.error("Failed to save results:", err);
      }

      // Navigate to results page
      router.push("/quiz/results");
    },
    [router]
  );

  return (
    <main>
      <QuizContainer onComplete={handleComplete} />
    </main>
  );
}

export default function QuizQuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#f9d544]" />
            <p className="mt-4 text-sm text-slate-500">Loading quiz...</p>
          </div>
        </div>
      }
    >
      <QuizQuestionsContent />
    </Suspense>
  );
}
