import { cn } from "@/lib/utils";

interface CoachingFocusListProps {
  items: string[];
  ctaText: string;
  className?: string;
}

export function CoachingFocusList({
  items,
  ctaText,
  className,
}: CoachingFocusListProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <ol className="space-y-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-4 text-base leading-relaxed text-slate-700"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
      <button className="w-full rounded-lg bg-slate-900 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-slate-800">
        {ctaText}
      </button>
    </div>
  );
}
