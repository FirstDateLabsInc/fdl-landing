import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CoachingFocusListProps {
  items: string[];
  ctaText: string;
  onCtaClick?: () => void;
  className?: string;
}

export function CoachingFocusList({
  items,
  ctaText,
  onCtaClick,
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
      <Button
        type="button"
        onClick={onCtaClick}
        className="w-full justify-center"
      >
        {ctaText}
      </Button>
    </div>
  );
}
