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
  /** 'subtle' for inline use, 'prominent' for section-level gates */
  variant?: "subtle" | "prominent";
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

  if (variant === "prominent") {
    return (
      <div className={cn("text-center", className)}>
        <p className="mb-4 text-lg font-medium text-slate-700">{message}</p>
        <Button onClick={handleClick} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Unlock Full Results
        </Button>
      </div>
    );
  }

  // Subtle variant - inline CTA bar
  return (
    <div
      className={cn(
        "mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-4",
        className
      )}
    >
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <Button size="sm" variant="secondary" onClick={handleClick}>
        Unlock
      </Button>
    </div>
  );
}
