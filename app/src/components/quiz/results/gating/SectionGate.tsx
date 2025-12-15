import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UnlockPromptCard } from "./UnlockPromptCard";

interface SectionGateProps {
  /** Message explaining what's locked */
  teaserText: string;
  /** Optional illustration image (displayed blurred) */
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
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-primary/5 to-secondary/10 p-8 backdrop-blur-sm border border-slate-100/60 shadow-soft", className)}>
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-secondary/15 to-primary/15 blur-2xl" />

      {/* Illustration (blurred) */}
      {illustrationSrc && (
        <div className="relative mb-6 flex justify-center">
          <div className="relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={illustrationSrc}
              alt=""
              width={400}
              height={240}
              className="object-cover opacity-25 blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Premium floating lock with glow */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md scale-150" />
                <div className="relative rounded-full bg-white p-5 shadow-hover border border-primary/10">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lock indicator when no illustration */}
      {!illustrationSrc && (
        <div className="relative mb-6 flex justify-center">
          {/* Premium floating lock with glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md scale-150" />
            <div className="relative rounded-full bg-white p-5 shadow-hover border border-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      )}

      {/* Unlock CTA */}
      <div className="relative z-10">
        <UnlockPromptCard message={teaserText} ctaTargetId={ctaTargetId} variant="prominent" />
      </div>
    </div>
  );
}
