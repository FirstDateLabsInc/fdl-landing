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
}

export function QuizQuestion({
  question,
  value,
  onValueChange,
  className,
}: QuizQuestionProps) {
  const prefersReducedMotion = useReducedMotion();

  const handleLikertChange = (likertValue: number) => {
    onValueChange(likertValue);
  };

  const handleScenarioChange = (scenarioValue: string) => {
    onValueChange(scenarioValue);
  };

  const motionProps = prefersReducedMotion
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
      className={cn("flex flex-col items-center gap-8", className)}
      {...motionProps}
    >
      <h2 className="max-w-xl text-center text-xl font-semibold text-slate-900 sm:text-2xl">
        {question.text}
      </h2>

      {question.type === "likert" && (
        <LikertScale
          value={typeof value === "number" ? value : null}
          onValueChange={handleLikertChange}
          labels={{ low: "Strongly Disagree", high: "Strongly Agree" }}
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
