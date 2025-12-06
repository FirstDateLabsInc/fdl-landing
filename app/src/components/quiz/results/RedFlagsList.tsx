import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedFlagsListProps {
  items: string[];
  className?: string;
}

export function RedFlagsList({ items, className }: RedFlagsListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 rounded-lg border border-red-100 bg-red-50/50 p-3"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-foreground">{item}</p>
        </li>
      ))}
    </ul>
  );
}
