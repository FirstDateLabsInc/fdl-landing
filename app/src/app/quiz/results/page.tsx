"use client";

import { useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Share2, Sparkles } from "lucide-react";

import { ResultsContainer } from "@/components/quiz/results";
import { Button } from "@/components/ui/button";
import { clearQuizProgress } from "@/hooks/use-quiz";
import { getArchetypeById } from "@/lib/quiz/archetypes";
import type { QuizResults } from "@/lib/quiz/types";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

const RESULTS_STORAGE_KEY = "juliet-quiz-results";

interface StoredResults {
  version: number;
  computedAt: number;
  results: QuizResults;
  archetype: {
    id: string;
    name: string;
    emoji: string;
    summary: string;
  };
}

interface ParsedData {
  results: QuizResults;
  archetype: ArchetypeDefinition;
}

// Module-level cache for useSyncExternalStore stability
let cachedSnapshot: ParsedData | null = null;
let cachedStorageValue: string | null = null;

// Parse stored results into full data with archetype lookup
function parseStoredResults(stored: string): ParsedData | null {
  try {
    const parsed = JSON.parse(stored) as StoredResults;

    // Look up full archetype definition
    const fullArchetype = getArchetypeById(parsed.archetype.id);
    const archetype: ArchetypeDefinition = fullArchetype ?? {
      id: parsed.archetype.id,
      name: parsed.archetype.name,
      emoji: parsed.archetype.emoji,
      summary: parsed.archetype.summary,
      strengths: [],
      growthAreas: [],
    };

    return { results: parsed.results, archetype };
  } catch {
    return null;
  }
}

// Subscribe to localStorage changes for results
function subscribeToResults(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === RESULTS_STORAGE_KEY) {
      // Invalidate cache when storage changes externally
      cachedStorageValue = null;
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getResultsSnapshot(): ParsedData | null {
  if (typeof window === "undefined") return null;

  const currentValue = localStorage.getItem(RESULTS_STORAGE_KEY);

  // Only re-parse if raw storage value changed
  if (currentValue !== cachedStorageValue) {
    cachedStorageValue = currentValue;
    cachedSnapshot = currentValue ? parseStoredResults(currentValue) : null;
  }

  return cachedSnapshot;
}

function getResultsServerSnapshot(): ParsedData | null {
  return null; // Server-side: no results
}

export default function QuizResultsPage() {
  const router = useRouter();
  const shareRef = useRef<HTMLDivElement>(null);

  const data = useSyncExternalStore(
    subscribeToResults,
    getResultsSnapshot,
    getResultsServerSnapshot
  );

  const handleRetake = () => {
    // Clear both quiz progress and results
    clearQuizProgress();
    try {
      localStorage.removeItem(RESULTS_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear results:", err);
    }
    router.push("/quiz/questions");
  };

  const handleShare = () => {
    // Scroll to share section
    shareRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Redirect if no results found
  if (!data) {
    // Use effect-free redirect by rendering nothing and pushing in next tick
    if (typeof window !== "undefined") {
      router.replace("/quiz");
    }
    return (
      <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#f9d544]" />
          <p className="mt-4 text-sm text-slate-500">Loading your results...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div ref={shareRef}>
          <ResultsContainer results={data.results} archetype={data.archetype} />
        </div>

        {/* Footer CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={handleRetake} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>

          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>

          <Button
            asChild
            className="gap-2 bg-[#f9d544] text-slate-900 hover:bg-[#ffe362]"
          >
            <Link href="/#waitlist">
              <Sparkles className="h-4 w-4" />
              Start with Juliet
            </Link>
          </Button>
        </div>

        {/* Trust footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Your results are stored locally on your device.
          <br className="hidden sm:block" />
          We don&apos;t collect or share your quiz data.
        </p>
      </main>
  );
}
