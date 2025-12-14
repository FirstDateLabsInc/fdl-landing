"use client";

import { useRef, useSyncExternalStore, useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Share2, Sparkles, Check } from "lucide-react";

import { ResultsContainer } from "@/components/quiz/results";
import { Button } from "@/components/ui/button";
import { clearQuizProgress } from "@/hooks/use-quiz";
import { getArchetypeById, type ArchetypeFull, type ArchetypePublic } from "@/lib/quiz/archetypes";
import { cn } from "@/lib/utils";
import type { QuizResults } from "@/lib/quiz/types";

const RESULTS_STORAGE_KEY = "juliet-quiz-results";

interface StoredResults {
  version: number;
  computedAt: number;
  resultId?: string;
  results: QuizResults;
  archetype: {
    id: string;
    name: string;
    emoji: string;
    summary: string;
    image: string;
  };
}

interface ParsedData {
  results: QuizResults;
  // TODO(Phase 4): Change to ArchetypePublic and implement gating UI
  // Currently using ArchetypeFull for ResultsContainer compatibility
  archetype: ArchetypeFull;
  resultId?: string;
}

// Module-level cache for useSyncExternalStore stability
let cachedSnapshot: ParsedData | null = null;
let cachedStorageValue: string | null = null;

// Parse stored results into full data with archetype lookup
function parseStoredResults(stored: string): ParsedData | null {
  try {
    const parsed = JSON.parse(stored) as StoredResults;

    // Look up archetype (returns ArchetypePublic)
    const archetype = getArchetypeById(parsed.archetype.id);

    // Validate archetype exists and has required public fields
    if (!archetype?.patternDescription) {
      console.error('[Quiz Results] Invalid archetype:', parsed.archetype.id);
      return null;
    }

    // TODO(Phase 4): Remove this cast when ResultsContainer accepts ArchetypePublic
    // and implements proper gating UI for locked sections.
    // Currently casting to ArchetypeFull - locked fields will be undefined,
    // causing runtime issues until gating is implemented.
    return { results: parsed.results, archetype: archetype as ArchetypeFull, resultId: parsed.resultId };
  } catch (e) {
    console.error('[Quiz Results] Parse error:', e);
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
  const [copied, setCopied] = useState(false);

  const data = useSyncExternalStore(
    subscribeToResults,
    getResultsSnapshot,
    getResultsServerSnapshot
  );

  // Generate share URL from resultId
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || !data?.resultId) return null;
    return `${window.location.origin}/quiz/results/${data.resultId}`;
  }, [data?.resultId]);

  const handleRetake = useCallback(() => {
    // Clear both quiz progress and results
    clearQuizProgress();
    try {
      localStorage.removeItem(RESULTS_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear results:", err);
    }
    router.push("/quiz/questions");
  }, [router]);

  const handleShare = useCallback(async () => {
    if (!shareUrl || !data) {
      // No shareable link - scroll to share section to show message
      shareRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const shareData = {
      title: `I'm ${data.archetype.name}!`,
      text: `I just discovered I'm "${data.archetype.name}" on the Juliet Dating Personality Quiz! 💝`,
      url: shareUrl,
    };

    // Try native share first (mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Final fallback: scroll to share section
      shareRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shareUrl, data]);

  // Redirect if no results found
  useEffect(() => {
    if (!data && typeof window !== "undefined") {
      router.replace("/quiz");
    }
  }, [data, router]);

  if (!data) {
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
    <main className="min-h-[calc(100vh-4.5rem)]">
      <div ref={shareRef}>
        <ResultsContainer
          results={data.results}
          archetype={data.archetype}
          quizResultId={data.resultId}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        {/* Footer CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={handleRetake} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>

          <Button
            variant="secondary"
            onClick={handleShare}
            className={cn("gap-2", copied && "border-green-500 text-green-600")}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share Results
              </>
            )}
          </Button>

          <Button asChild variant="primary" className="gap-2">
            <Link href="/#waitlist">
              <Sparkles className="h-4 w-4" />
              Start with Juliet
            </Link>
          </Button>
        </div>

        {/* Trust footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Your results are saved so you can revisit and share them.
          <br className="hidden sm:block" />
          We don&apos;t sell or share your quiz data.
        </p>
      </div>
    </main>
  );
}
