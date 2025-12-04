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
      <div ref={ref} className={cn("flex items-center gap-3", className)}>
        {/* Left label */}
        <span className="text-xs text-slate-600 sm:text-sm whitespace-nowrap">
          {labels.low}
        </span>

        {/* Radio group */}
        <RadioGroupPrimitive.Root
          value={value?.toString() ?? ""}
          onValueChange={handleValueChange}
          className="flex items-center justify-start gap-4 sm:gap-6"
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
                  "relative size-12 sm:size-14 rounded-full border-2 transition-all duration-200",
                  "flex items-center justify-center text-sm sm:text-base font-medium",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[#f9d544] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf6]",
                  "cursor-pointer hover:scale-105",
                  // Default state (unselected)
                  !isSelected && "border-slate-300 text-slate-600",
                  // Selected state - clearer color
                  isSelected && "border-[#f9d544] text-white scale-110 bg-[#f9d544]"
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

        {/* Right label */}
        <span className="text-xs text-slate-600 sm:text-sm whitespace-nowrap">
          {labels.high}
        </span>
      </div>
    );
  }
);
LikertScale.displayName = "LikertScale";

export { LikertScale };
