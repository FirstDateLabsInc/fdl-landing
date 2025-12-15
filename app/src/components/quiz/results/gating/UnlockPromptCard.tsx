"use client";

import { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UnlockPromptCardProps {
  /** Message explaining what's locked and why to unlock */
  message: string;
  /** Target section ID for CTA scroll (defaults to waitlist section) */
  ctaTargetId?: string;
  /** 'overlay' for centered on blur, 'subtle' for inline, 'prominent' for section-level */
  variant?: "subtle" | "prominent" | "overlay";
  className?: string;
}

/**
 * CTA card prompting users to unlock premium content.
 * Used by ListGate and SectionGate components.
 */
export function UnlockPromptCard({
  message,
  ctaTargetId = "full-picture",
  variant = "subtle",
  className,
}: UnlockPromptCardProps) {
  const handleClick = useCallback(() => {
    const element = document.getElementById(ctaTargetId);
    if (element) {
      const offset = 120; // Account for sticky navbar
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [ctaTargetId]);

  // Overlay variant - compact card for blur areas (responsive: smaller on mobile)
  if (variant === "overlay") {
    return (
      <div className={cn("relative text-center px-3 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-white via-primary/5 to-secondary/10 border border-slate-100/80 shadow-soft backdrop-blur-sm", className)}>
        {/* Decorative sparkle */}
        <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 text-primary/50">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>

        {/* Compact message + button layout */}
        <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium text-slate-700">{message}</p>
        <Button
          onClick={handleClick}
          size="sm"
          className="gap-1 sm:gap-1.5 text-xs sm:text-sm h-7 sm:h-8 px-3 sm:px-4 bg-gradient-to-r from-primary to-accent hover:shadow-md transition-all duration-300 text-slate-800 font-semibold border-0"
        >
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Unlock
        </Button>
      </div>
    );
  }

  if (variant === "prominent") {
    return (
      <div className={cn("relative text-center rounded-2xl bg-gradient-to-br from-white via-primary/5 to-secondary/10 p-8 border border-slate-100/80 shadow-soft", className)}>
        {/* Decorative sparkle accent */}
        <div className="absolute -top-2 -right-2 text-primary/50">
          <Sparkles className="h-5 w-5" />
        </div>

        <p className="mb-5 text-lg font-medium text-slate-700">{message}</p>
        <Button
          onClick={handleClick}
          className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-hover transition-all duration-300 text-slate-800 font-semibold border-0"
        >
          <Sparkles className="h-4 w-4" />
          Unlock Full Results
        </Button>
      </div>
    );
  }

  // Subtle variant - glassmorphism inline CTA bar
  return (
    <div
      className={cn(
        "mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary/15 via-accent/8 to-secondary/15 p-4 border border-white/50 backdrop-blur-sm shadow-soft",
        className
      )}
    >
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <Button
        size="sm"
        onClick={handleClick}
        className="bg-gradient-to-r from-primary to-accent text-slate-800 font-medium hover:shadow-md transition-all duration-200 border-0"
      >
        Unlock
      </Button>
    </div>
  );
}
