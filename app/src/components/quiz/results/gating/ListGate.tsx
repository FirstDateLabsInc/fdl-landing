import type { ReactNode } from "react";
import { Lock } from "lucide-react";
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

      {/* Locked content indicator */}
      {lockedCount > 0 && (
        <div className="relative mt-4">
          <BlurOverlay placeholderCount={Math.min(lockedCount, 3)} />

          {/* Premium lock badge with glassmorphism */}
          <div className="absolute left-0 top-4 z-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm border border-white/40">
            <Lock className="h-3.5 w-3.5 text-primary" />
            {lockedCount} more locked
          </div>

          {/* Unlock CTA */}
          <UnlockPromptCard message={teaserText} ctaTargetId={ctaTargetId} />
        </div>
      )}
    </div>
  );
}
