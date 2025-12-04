"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

interface LikertScaleProps {
  value: number | null;
  onValueChange: (value: number) => void;
  labels?: { low: string; high: string };
  className?: string;
}

const defaultLabels = {
  low: "Strongly Disagree",
  high: "Strongly Agree",
};

const LikertScale = React.forwardRef<HTMLDivElement, LikertScaleProps>(
  ({ value, onValueChange, labels = defaultLabels, className }, ref) => {
    const handleValueChange = (val: string) => {
      onValueChange(parseInt(val, 10));
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)}>
        <RadioGroupPrimitive.Root
          value={value?.toString() ?? ""}
          onValueChange={handleValueChange}
          className="flex items-center justify-center gap-2 sm:gap-4"
          orientation="horizontal"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <RadioGroupPrimitive.Item
              key={num}
              value={num.toString()}
              className={cn(
                "size-10 sm:size-12 rounded-full border-2 transition-all duration-200",
                "flex items-center justify-center text-sm sm:text-base font-medium",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#f9d544] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf6]",
                "cursor-pointer hover:border-[#f9d544]/50 hover:scale-105",
                "data-[state=unchecked]:border-slate-300 data-[state=unchecked]:bg-[#fffdf6] data-[state=unchecked]:text-slate-600",
                "data-[state=checked]:border-[#f9d544] data-[state=checked]:bg-[#f9d544] data-[state=checked]:text-white data-[state=checked]:scale-110"
              )}
              aria-label={`Rating ${num} of 5`}
            >
              {num}
            </RadioGroupPrimitive.Item>
          ))}
        </RadioGroupPrimitive.Root>

        <div className="flex justify-between text-xs sm:text-sm text-slate-500">
          <span>{labels.low}</span>
          <span>{labels.high}</span>
        </div>
      </div>
    );
  }
);
LikertScale.displayName = "LikertScale";

export { LikertScale };
