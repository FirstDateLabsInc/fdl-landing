import { cn } from "@/lib/utils";

interface BlurOverlayProps {
  /** Number of placeholder skeleton items to show */
  placeholderCount?: number;
  className?: string;
}

/**
 * Renders blurred placeholder skeletons for locked content.
 * Security: This component never receives real locked content -
 * it only renders generic skeleton shapes to indicate hidden items.
 */
export function BlurOverlay({ placeholderCount = 3, className }: BlurOverlayProps) {
  return (
    <div className={cn("pointer-events-none select-none", className)}>
      {/* Gradient fade from content above */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-white" />

      {/* Placeholder skeleton items */}
      <div className="space-y-3 blur-[2px]">
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="h-6 w-6 shrink-0 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
