import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoachingFocusListProps {
  items: string[];
  ctaText: string;
  className?: string;
}

export function CoachingFocusList({ items, ctaText, className }: CoachingFocusListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-lg bg-primary/5 p-3"
          >
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">{item}</p>
          </li>
        ))}
      </ul>
      <button className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-shadow hover:shadow-hover">
        {ctaText}
      </button>
    </div>
  );
}
