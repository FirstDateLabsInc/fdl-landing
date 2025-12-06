import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TraitGridProps {
  items: string[];
  type: "strength" | "challenge";
  className?: string;
}

export function TraitGrid({ items, type, className }: TraitGridProps) {
  const Icon = type === "strength" ? Check : AlertTriangle;
  const iconColor = type === "strength" ? "text-green-600" : "text-amber-500";

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-xl bg-card p-4 shadow-soft"
        >
          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} />
          <p className="text-sm text-foreground">{item}</p>
        </div>
      ))}
    </div>
  );
}
