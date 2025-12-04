"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const radioGroupVariants = cva("grid gap-4", {
  variants: {
    variant: {
      default: "gap-4",
      compact: "flex flex-wrap gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const radioItemVariants = cva(
  "group relative flex cursor-pointer items-start rounded-2xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#f9d544] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf6] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-slate-200/80 bg-white/50 backdrop-blur-sm p-5 hover:border-[#f9d544]/40 hover:bg-[#fffdf6]/60 hover:shadow-md data-[state=checked]:border-[#f9d544] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#fffdf6] data-[state=checked]:to-[#f9d544]/10 data-[state=checked]:shadow-lg data-[state=checked]:shadow-[#f9d544]/10",
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
          <div className="flex items-start gap-4 w-full">
            {/* Premium radio indicator */}
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white transition-all duration-300 group-hover:border-[#f9d544]/60 group-hover:shadow-sm group-data-[state=checked]:border-[#f9d544] group-data-[state=checked]:bg-[#f9d544] group-data-[state=checked]:shadow-md group-data-[state=checked]:shadow-[#f9d544]/30 mt-0.5">
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <div className="size-2.5 rounded-full bg-white" />
              </RadioGroupPrimitive.Indicator>
            </div>

            {/* Text content with premium typography */}
            <span className="flex-1 text-[15px] leading-relaxed text-slate-700 transition-colors duration-300 group-hover:text-slate-900 group-data-[state=checked]:text-slate-900 group-data-[state=checked]:font-medium">
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
