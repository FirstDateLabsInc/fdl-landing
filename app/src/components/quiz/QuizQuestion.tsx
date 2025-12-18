"use client";

import { motion, useReducedMotion } from "motion/react";

import { LikertScale } from "@/components/ui/likert-scale";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  value: number | string | null;
  onValueChange: (value: number | string) => void;
  className?: string;
  disableAnimation?: boolean;
}

export function QuizQuestion({
  question,
  value,
  onValueChange,
  className,
  disableAnimation = false,
}: QuizQuestionProps) {
  const prefersReducedMotion = useReducedMotion();

  const handleLikertChange = (likertValue: number) => {
    onValueChange(likertValue);
  };

  const handleScenarioChange = (scenarioValue: string) => {
    onValueChange(scenarioValue);
  };

  const motionProps = (prefersReducedMotion || disableAnimation)
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
      };

  return (
    <motion.div
      key={question.id}
      className={cn("flex flex-col items-start gap-6", className)}
      {...motionProps}
    >
      <h2 className="w-full text-left text-lg font-semibold text-slate-900 sm:text-xl">
        {question.text}
      </h2>

      {question.type === "likert" && (
        <LikertScale
          value={typeof value === "number" ? value : null}
          onValueChange={handleLikertChange}
          className="w-full"
        />
      )}

      {question.type === "scenario" && question.options && (
        <RadioGroup
          value={typeof value === "string" ? value : ""}
          onValueChange={handleScenarioChange}
          variant="default"
          options={question.options.map((opt) => ({
            value: opt.key,
            label: `${opt.key}. ${opt.text}`,
          }))}
          className="w-full max-w-lg"
        />
      )}
    </motion.div>
  );
}
