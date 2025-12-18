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

// Gradient opacity levels for each rating
const fillOpacities = {
  1: "0",      // Empty circle
  2: "0.25",   // 25% filled
  3: "0.5",    // 50% filled
  4: "0.75",   // 75% filled
  5: "1",      // 100% filled
};

const LikertScale = React.forwardRef<HTMLDivElement, LikertScaleProps>(
  ({ value, onValueChange, labels = defaultLabels, className }, ref) => {
    const handleValueChange = (val: string) => {
      onValueChange(parseInt(val, 10));
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-4 sm:gap-6", className)}>
        {/* Mobile: Labels on top */}
        <div className="flex items-center justify-between sm:hidden">
          <span className="text-xs text-slate-600">
            {labels.low}
          </span>
          <span className="text-xs text-slate-600">
            {labels.high}
          </span>
        </div>

        {/* Desktop: Labels on sides */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          {/* Left label - desktop only */}
          <span className="text-base text-slate-600 whitespace-nowrap">
            {labels.low}
          </span>

          {/* Radio group */}
          <RadioGroupPrimitive.Root
            value={value?.toString() ?? ""}
            onValueChange={handleValueChange}
            className="flex items-center justify-start sm:gap-6 lg:gap-8"
            orientation="horizontal"
          >
            {[1, 2, 3, 4, 5].map((num) => {
              const isSelected = value === num;
              const opacity = fillOpacities[num as keyof typeof fillOpacities];

              return (
                <RadioGroupPrimitive.Item
                  key={num}
                  value={num.toString()}
                  className={cn(
                    "relative sm:size-14 lg:size-16 shrink-0 rounded-full border transition-all duration-200",
                    "flex items-center justify-center text-xs sm:text-base lg:text-lg font-medium",
                    "outline-none focus-visible:ring-2 focus-visible:ring-[#f9d544] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf6]",
                    "cursor-pointer hover:scale-105",
                    // Default state (unselected)
                    !isSelected && "border-slate-300 text-slate-600",
                    // Selected state - clearer color
                    isSelected && "border-secondary text-white scale-110 bg-secondary"
                  )}
                  aria-label={`Rating ${num} of 5`}
                  style={{
                    backgroundColor: !isSelected
                      ? `rgba(249, 213, 68, ${opacity})` // Show gradient when unselected
                      : undefined // Use className background when selected
                  }}
                >
                  <span className="relative z-10 font-semibold">{num}</span>
                </RadioGroupPrimitive.Item>
              );
            })}
          </RadioGroupPrimitive.Root>

          {/* Right label - desktop only */}
          <span className="text-base text-slate-600 whitespace-nowrap">
            {labels.high}
          </span>
        </div>

        {/* Mobile: Radio group centered */}
        <RadioGroupPrimitive.Root
          value={value?.toString() ?? ""}
          onValueChange={handleValueChange}
          className="flex sm:hidden items-center justify-between w-full max-w-md mx-auto"
          orientation="horizontal"
        >
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = value === num;
            const opacity = fillOpacities[num as keyof typeof fillOpacities];

            return (
              <RadioGroupPrimitive.Item
                key={num}
                value={num.toString()}
                className={cn(
                  "relative size-11 min-[375px]:size-[50px] min-[480px]:size-14 shrink-0 rounded-full border transition-all duration-200",
                  "flex items-center justify-center text-xs min-[375px]:text-sm min-[480px]:text-base font-medium",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[#f9d544] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf6]",
                  "cursor-pointer hover:scale-105",
                  // Default state (unselected)
                  !isSelected && "border-slate-300 text-slate-600",
                  // Selected state - clearer color
                  isSelected && "border-secondary text-white scale-110 bg-secondary"
                )}
                aria-label={`Rating ${num} of 5`}
                style={{
                  backgroundColor: !isSelected
                    ? `rgba(249, 213, 68, ${opacity})` // Show gradient when unselected
                    : undefined // Use className background when selected
                }}
              >
                <span className="relative z-10 font-semibold">{num}</span>
              </RadioGroupPrimitive.Item>
            );
          })}
        </RadioGroupPrimitive.Root>
      </div>
    );
  }
);
LikertScale.displayName = "LikertScale";

export { LikertScale };
