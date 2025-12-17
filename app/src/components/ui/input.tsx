import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full rounded-xl border bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
  {
    variants: {
      variant: {
        default: "border-slate-200 focus-visible:ring-primary focus-visible:border-primary",
        error: "border-red-500 focus-visible:ring-red-500",
      },
      inputSize: {
        default: "h-12",
        lg: "h-14 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

function Input({
  className,
  variant,
  inputSize,
  type = "text",
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, inputSize, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
