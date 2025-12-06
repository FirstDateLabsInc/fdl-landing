import { cn } from "@/lib/utils";

interface RedFlagsListProps {
  items: string[];
  className?: string;
}

export function RedFlagsList({ items, className }: RedFlagsListProps) {
  return (
    <ul className={cn("space-y-4", className)}>
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
