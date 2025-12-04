"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentSection: string;
  currentQuestionIndex: number;
  totalQuestionsInSection: number;
  overallProgress: number;
  className?: string;
}

export function QuizProgress({
  currentSection,
  currentQuestionIndex,
  totalQuestionsInSection,
  overallProgress,
  className,
}: QuizProgressProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      <Progress value={overallProgress} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          {currentSection}
        </span>
        <span className="text-sm text-slate-600">
          Question {currentQuestionIndex + 1} of {totalQuestionsInSection}
        </span>
      </div>
    </div>
  );
}
