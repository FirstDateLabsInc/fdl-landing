"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizNavigation } from "./QuizNavigation";
import { QuizStatement } from "./QuizStatement";
import { useQuiz } from "@/hooks/use-quiz";
import { serializeAnswers } from "@/lib/quiz/utils/answer-transform";
import { getArchetypeById } from "@/lib/quiz/data/archetypes";
import { generateFingerprintHash } from "@/lib/fingerprint";
import type { QuizResults } from "@/lib/quiz/types";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";
import type {
  SubmitQuizRequest,
  SubmitQuizResponse,
} from "@/lib/api/quiz";
import { cn } from "@/lib/utils";

interface QuizContainerProps {
  onComplete: (results: QuizResults, archetype: ArchetypeDefinition, resultId: string) => void;
}

export function QuizContainer({ onComplete }: QuizContainerProps) {
  const {
    responses,
    currentPageQuestions,
    currentPage,
    totalPages,
    setResponse,
    setSessionId,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isLastPage,
    progress,
    clearProgress,
    state,
  } = useQuiz();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string>("");
  const sessionInitRef = useRef(false);

  // Generate fingerprint and validate session on mount (runs once)
  useEffect(() => {
    if (sessionInitRef.current) return;
    sessionInitRef.current = true;

    async function initSession() {
      try {
        const fp = await generateFingerprintHash();
        setFingerprint(fp);

        // Validate session with server (pass existing client sessionId for resume)
        const res = await fetch("/api/quiz/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fingerprintHash: fp,
            existingSessionId: state.sessionId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.sessionId) {
            setSessionId(data.sessionId);
          }
        }
      } catch (err) {
        console.error("Session initialization failed:", err);
        // Continue with client-generated sessionId as fallback
      }
    }
    initSession();
  }, [state.sessionId, setSessionId]);

  // Ref for the progress bar section to enable auto-scroll
  const progressRef = useRef<HTMLDivElement>(null);

  // Refs for each question to enable auto-scroll to next unanswered
  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-scroll to progress bar when page changes (after user clicks Next/Back)
  useEffect(() => {
    if (progressRef.current && currentPage > 0) {
      // Smooth scroll to progress bar section (including % Complete text)
      progressRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const handleValueChange = useCallback(
    (questionId: string) => (value: number | string) => {
      setResponse(questionId, value);

      // Auto-scroll to the next unanswered question after answering
      // Use double rAF to wait for React re-render and animation start
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Find first unanswered EXCLUDING the one we just answered
          // (responses is stale in this closure, so we exclude questionId)
          const nextUnanswered = currentPageQuestions.find(
            (q) =>
              q.id !== questionId &&
              (responses[q.id] === undefined || responses[q.id] === null)
          );

          if (nextUnanswered) {
            const ref = questionRefs.current.get(nextUnanswered.id);
            ref?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    },
    [setResponse, currentPageQuestions, responses]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Serialize answers for server-side scoring
      const answerMap = serializeAnswers(responses);
      const payload: SubmitQuizRequest = {
        sessionId: state.sessionId,
        fingerprintHash: fingerprint,
        answers: answerMap,
        idempotencyKey: crypto.randomUUID(),
      };

      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server error");
      }

      const serverData = (await res.json()) as SubmitQuizResponse;

      if (serverData?.scores && serverData.archetypeSlug && serverData.resultId) {
        const archetype = getArchetypeById(serverData.archetypeSlug);
        if (archetype) {
          clearProgress();
          onComplete(serverData.scores as unknown as QuizResults, archetype, serverData.resultId);
          return;
        }
      }

      // Server returned invalid data
      throw new Error("Invalid server response");
    } catch (err) {
      console.error("Quiz submission failed", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [responses, state.sessionId, fingerprint, clearProgress, onComplete]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      {/* 3-Step Info Cards - At the very top */}
      <div className="mb-8">
        <QuizStatement scrollAnchorRef={progressRef} />
      </div>

      <div>
        <QuizProgress
          currentPage={currentPage}
          totalPages={totalPages}
          overallProgress={progress}
        />
      </div>

      {/* Questions Section */}
      <div className="flex flex-1 items-start py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-8"
          >
            {/* Find the first unanswered question on this page (O(n) single pass) */}
            {(() => {
              const firstUnansweredIndex = currentPageQuestions.findIndex(
                q => responses[q.id] === undefined || responses[q.id] === null
              );
              return currentPageQuestions.map((question, index) => (
                <div
                  key={question.id}
                  ref={(el) => {
                    if (el) questionRefs.current.set(question.id, el);
                  }}
                  className={cn(
                    "w-full transition-opacity duration-300",
                    // Dim all questions except the first unanswered (current focus)
                    firstUnansweredIndex !== -1 && index !== firstUnansweredIndex && "opacity-40"
                  )}
                >
                  <QuizQuestion
                    question={question}
                    value={responses[question.id]?.value ?? null}
                    onValueChange={handleValueChange(question.id)}
                    disableAnimation={true}
                  />
                  {index < currentPageQuestions.length - 1 && (
                    <div className="my-8 border-b border-slate-200" />
                  )}
                </div>
              ));
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {submitError}
        </div>
      )}

      <QuizNavigation
        canGoBack={canGoPrevious}
        canGoNext={canGoNext}
        isLastQuestion={isLastPage}
        onBack={goToPrevious}
        onNext={goToNext}
        onSubmit={handleSubmit}
        className="pb-4"
      />
    </div>
  );
}
