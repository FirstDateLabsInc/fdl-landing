import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TraitGridProps {
  items: string[];
  type: "strength" | "challenge";
  className?: string;
}

export function TraitGrid({ items, type, className }: TraitGridProps) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-base leading-relaxed text-slate-700"
        >
          {type === "strength" ? (
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          ) : (
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}
