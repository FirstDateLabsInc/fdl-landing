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
      {/* Gradient fade from content above - brand tinted */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent via-white/60 to-white/95" />

      {/* Placeholder skeleton items with enhanced blur and shimmer */}
      <div className="space-y-3 blur-[6px]">
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full rounded-md bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
              <div className="h-4 w-3/4 rounded-md bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.15s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom fade for smoother transition */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
