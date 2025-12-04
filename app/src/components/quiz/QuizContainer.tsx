"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizNavigation } from "./QuizNavigation";
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

  const handleValueChange = useCallback(
    (questionId: string) => (value: number | string) => {
      setResponse(questionId, value);
    },
    [setResponse]
  );

  const handleSubmit = useCallback(() => {
    // Convert response map to QuizResponse array
    const responseArray = mapToResponses(responses);

    // Calculate results
    const results = calculateAllResults(responseArray);

    // Determine archetype
    const archetype = getArchetype(
      results.attachment.primary,
      results.communication.primary,
      results.confidence
    );

    // Clear quiz progress from localStorage
    clearProgress();

    // Call completion callback
    onComplete(results, archetype);
  }, [responses, clearProgress, onComplete]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <QuizProgress
        currentPage={currentPage}
        totalPages={totalPages}
        overallProgress={progress}
      />

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
            {currentPageQuestions.map((question, index) => {
              const isAnswered = responses[question.id] !== undefined && responses[question.id] !== null;
              // Check if any previous question on this page is answered (for shadow effect)
              const hasPreviousAnswered = currentPageQuestions
                .slice(0, index)
                .some(q => responses[q.id] !== undefined && responses[q.id] !== null);

              return (
                <div
                  key={question.id}
                  className={cn(
                    "w-full transition-opacity duration-300",
                    // Add shadow/dim effect if previous question answered but this one isn't
                    !isAnswered && hasPreviousAnswered && "opacity-40"
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
              );
            })}
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
