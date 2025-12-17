"use client";

import { useCallback } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionGateProps {
  /** Message explaining what's locked */
  teaserText: string;
  /** Optional illustration image (displayed as subtle blurred background) */
  illustrationSrc?: string;
  /** Target section ID for CTA scroll */
  ctaTargetId?: string;
  className?: string;
}

/**
 * Gates entire locked sections (datingMeaning, etc.).
 *
 * Security: This component renders a placeholder with optional blurred
 * illustration. No locked content is passed to this component - it only
 * shows a lock overlay with CTA to unlock.
 */
export function SectionGate({
  teaserText,
  illustrationSrc,
  ctaTargetId = "full-picture",
  className,
}: SectionGateProps) {
  const handleClick = useCallback(() => {
    const element = document.getElementById(ctaTargetId);
    if (element) {
      const offset = 120; // Account for sticky navbar
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [ctaTargetId]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-primary/5 to-secondary/10 p-8 sm:p-12 backdrop-blur-sm border border-slate-100/60 shadow-soft",
        className
      )}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-secondary/15 to-primary/15 blur-2xl" />

      {/* Optional blurred illustration as background */}
      {illustrationSrc && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={illustrationSrc}
            alt=""
            className="w-full h-full object-cover opacity-15 blur-md"
          />
        </div>
      )}

      {/* Single centered content block */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Premium floating lock with glow */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md scale-150" />
          <div className="relative rounded-full bg-white p-4 sm:p-5 shadow-hover border border-primary/10">
            <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </div>

        {/* Message */}
        <p className="mb-5 text-base sm:text-lg font-medium text-slate-700 max-w-sm">
          {teaserText}
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleClick}
          className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-hover transition-all duration-300 text-slate-800 font-semibold border-0"
        >
          <Sparkles className="h-4 w-4" />
          Unlock Full Results
        </Button>
      </div>
    </div>
  );
}
