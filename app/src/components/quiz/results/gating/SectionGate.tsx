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
    <div className={cn("relative rounded-2xl bg-slate-50/80 p-8", className)}>
      {/* Illustration (blurred) */}
      {illustrationSrc && (
        <div className="mb-6 flex justify-center">
          <div className="relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={illustrationSrc}
              alt=""
              width={400}
              height={240}
              className="object-cover opacity-30 blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white/90 p-4 shadow-lg">
                <Lock className="h-8 w-8 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lock indicator when no illustration */}
      {!illustrationSrc && (
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-white/90 p-4 shadow-lg">
            <Lock className="h-8 w-8 text-slate-400" />
          </div>
        </div>
      )}

      {/* Unlock CTA */}
      <UnlockPromptCard message={teaserText} ctaTargetId={ctaTargetId} variant="prominent" />
    </div>
  );
}
