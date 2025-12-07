import { cn } from "@/lib/utils";

interface TraitGridProps {
  items: string[];
  type: "strength" | "challenge";
  className?: string;
}

export function TraitGrid({ items, className }: TraitGridProps) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-base leading-relaxed text-slate-700"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
          {item}
        </li>
      ))}
    </ul>
  );
}
