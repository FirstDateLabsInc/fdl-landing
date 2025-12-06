import { Check, AlertTriangle, Sparkles, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface TraitGridProps {
  items: string[];
  type: "strength" | "challenge";
  className?: string;
}

export function TraitGrid({ items, type, className }: TraitGridProps) {
  const isStrength = type === "strength";
  const Icon = isStrength ? Sparkles : ShieldAlert;
  
  const cardStyles = isStrength 
    ? "bg-green-50/50 border-green-100/50 hover:border-green-200" 
    : "bg-amber-50/50 border-amber-100/50 hover:border-amber-200";
    
  const iconBgStyles = isStrength
    ? "bg-green-100 text-green-600"
    : "bg-amber-100 text-amber-600";

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "flex gap-4 rounded-xl border p-4 shadow-sm transition-colors",
            cardStyles
          )}
        >
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconBgStyles)}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{item}</p>
        </motion.div>
      ))}
    </div>
  );
}
