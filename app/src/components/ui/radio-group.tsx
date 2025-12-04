"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const radioGroupVariants = cva("grid gap-3", {
  variants: {
    variant: {
      default: "gap-3",
      compact: "flex flex-wrap gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const radioItemVariants = cva(
  "group relative flex cursor-pointer items-center rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#f9d544] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf6] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-slate-200 bg-white p-4 hover:border-[#f9d544]/50 hover:bg-[#fffdf6] data-[state=checked]:border-[#f9d544] data-[state=checked]:bg-[#f9d544]/10",
        compact:
          "border-slate-200 bg-white px-4 py-2 text-sm hover:border-[#f9d544]/50 data-[state=checked]:border-[#f9d544] data-[state=checked]:bg-[#f9d544]/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {
  options: { value: string; label: string }[];
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, variant, options, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(radioGroupVariants({ variant, className }))}
      {...props}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(radioItemVariants({ variant }))}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-5 items-center justify-center rounded-full border-2 border-slate-300 transition-colors group-data-[state=checked]:border-[#f9d544] group-data-[state=checked]:bg-[#f9d544]">
              <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-white" />
            </div>
            <span className="text-slate-700 group-data-[state=checked]:text-slate-900 group-data-[state=checked]:font-medium">
              {option.label}
            </span>
          </div>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
});
RadioGroup.displayName = "RadioGroup";

export { RadioGroup, radioGroupVariants, radioItemVariants };
