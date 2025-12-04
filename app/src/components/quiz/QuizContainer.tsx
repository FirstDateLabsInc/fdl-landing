"use client";

import { useCallback } from "react";
import { AnimatePresence } from "motion/react";

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

interface QuizContainerProps {
  onComplete: (results: QuizResults, archetype: ArchetypeDefinition) => void;
}

export function QuizContainer({ onComplete }: QuizContainerProps) {
  const {
    responses,
    currentQuestion,
    currentSectionTitle,
    questionIndexInSection,
    totalQuestionsInSection,
    setResponse,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    progress,
    clearProgress,
  } = useQuiz();

  const handleValueChange = useCallback(
    (value: number | string) => {
      setResponse(currentQuestion.id, value);
    },
    [setResponse, currentQuestion.id]
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

  const currentValue = responses[currentQuestion.id] ?? null;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-2xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <QuizProgress
        currentSection={currentSectionTitle}
        currentQuestionIndex={questionIndexInSection}
        totalQuestionsInSection={totalQuestionsInSection}
        overallProgress={progress}
      />

      <div className="flex flex-1 items-center justify-center py-8">
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue}
            onValueChange={handleValueChange}
          />
        </AnimatePresence>
      </div>

      <QuizNavigation
        canGoBack={canGoPrevious}
        canGoNext={canGoNext}
        isLastQuestion={isLastQuestion}
        onBack={goToPrevious}
        onNext={goToNext}
        onSubmit={handleSubmit}
        className="pb-4"
      />
    </div>
  );
}
