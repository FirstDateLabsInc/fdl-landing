import { cn } from "@/lib/utils";

interface DatingCycleVisualProps {
  steps: string[];
  className?: string;
}

export function DatingCycleVisual({ steps, className }: DatingCycleVisualProps) {
  return (
    <ol className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <li
          key={index}
          className="flex items-start gap-4 text-base leading-relaxed text-slate-700"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
