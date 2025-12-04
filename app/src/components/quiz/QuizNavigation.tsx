"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  className?: string;
}

export function QuizNavigation({
  canGoBack,
  canGoNext,
  isLastQuestion,
  onBack,
  onNext,
  onSubmit,
  className,
}: QuizNavigationProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4 sm:justify-center",
        className
      )}
    >
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={!canGoBack}
        className={cn(
          "text-slate-600 transition-opacity",
          !canGoBack && "invisible"
        )}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={!canGoNext}
          className="bg-[#f9d544] text-slate-900 hover:bg-[#ffe362] disabled:opacity-50"
        >
          <Check className="mr-1 h-4 w-4" />
          See Results
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="bg-[#f9d544] text-slate-900 hover:bg-[#ffe362] disabled:opacity-50"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
