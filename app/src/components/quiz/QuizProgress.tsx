"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentPage: number;
  totalPages: number;
  overallProgress: number;
  className?: string;
}

export function QuizProgress({
  currentPage,
  totalPages,
  overallProgress,
  className,
}: QuizProgressProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      <Progress value={overallProgress} />

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">
          Page {currentPage + 1} of {totalPages}
        </span>
        <span className="text-sm text-slate-600">
          {overallProgress}% Complete
        </span>
      </div>
    </div>
  );
}
