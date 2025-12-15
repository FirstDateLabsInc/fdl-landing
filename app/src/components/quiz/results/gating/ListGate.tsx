import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BlurOverlay } from "./BlurOverlay";
import { UnlockPromptCard } from "./UnlockPromptCard";

interface ListGateProps {
  /** Pre-rendered teaser items (from ArchetypePublic data) */
  visibleItems: ReactNode[];
  /** Number of items locked beyond teasers */
  lockedCount: number;
  /** Message shown in unlock prompt */
  teaserText: string;
  /** Target section ID for CTA scroll */
  ctaTargetId?: string;
  className?: string;
}

/**
 * Gates list-based locked content (datingCycle, redFlags, coachingFocus).
 *
 * Security: This component ONLY receives pre-rendered teaser items from
 * ArchetypePublic data. Locked content never reaches the client bundle.
 * The BlurOverlay renders generic placeholders, not actual locked content.
 */
export function ListGate({
  visibleItems,
  lockedCount,
  teaserText,
  ctaTargetId = "full-picture",
  className,
}: ListGateProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Visible teaser content */}
      <div className="space-y-4">{visibleItems}</div>

      {/* Locked content area with centered overlay */}
      {lockedCount > 0 && (
        <div className="relative mt-4">
          {/* Blur background */}
          <BlurOverlay placeholderCount={Math.min(lockedCount, 3)} />

          {/* Centered unlock overlay - positioned on top of blur */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <UnlockPromptCard
              message={teaserText}
              ctaTargetId={ctaTargetId}
              variant="overlay"
            />
          </div>
        </div>
      )}
    </div>
  );
}
