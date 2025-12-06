"use client";

import { useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizNavigation } from "./QuizNavigation";
import { QuizStatement } from "./QuizStatement";
import { useQuiz } from "@/hooks/use-quiz";
import {
  calculateAllResults,
  mapToResponses,
  getArchetype,
} from "@/lib/quiz";
import type { QuizResults } from "@/lib/quiz/types";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";
import { cn } from "@/lib/utils";

interface QuizContainerProps {
  onComplete: (results: QuizResults, archetype: ArchetypeDefinition) => void;
}

export function QuizContainer({ onComplete }: QuizContainerProps) {
  const {
    responses,
    currentPageQuestions,
    currentPage,
    totalPages,
    setResponse,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isLastPage,
    progress,
    clearProgress,
  } = useQuiz();

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

  const handleSubmit = useCallback(() => {
    // Convert response map to QuizResponse array
    const responseArray = mapToResponses(responses);

    // Calculate results
    const results = calculateAllResults(responseArray);

    // Determine archetype from attachment × communication matrix
    const archetype = getArchetype(
      results.attachment.primary,
      results.communication.primary
    );

    // Clear quiz progress from localStorage
    clearProgress();

    // Call completion callback
    onComplete(results, archetype);
  }, [responses, clearProgress, onComplete]);

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
                    value={responses[question.id] ?? null}
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
