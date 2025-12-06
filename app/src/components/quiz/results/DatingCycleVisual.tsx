import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatingCycleVisualProps {
  steps: string[];
  className?: string;
}

export function DatingCycleVisual({ steps, className }: DatingCycleVisualProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {steps.map((step, index) => (
        <div key={index}>
          <div className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-soft">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-muted-foreground">
              {index + 1}
            </span>
            <p className="text-sm text-foreground">{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
