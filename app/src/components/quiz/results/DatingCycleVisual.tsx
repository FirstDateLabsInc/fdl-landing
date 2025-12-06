import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DatingCycleVisualProps {
  steps: string[];
  className?: string;
}

export function DatingCycleVisual({ steps, className }: DatingCycleVisualProps) {
  return (
    <div className={cn("relative ml-4 space-y-8 border-l-2 border-slate-100 pl-8", className)}>
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative"
        >
          {/* Node Icon */}
          <div className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-slate-50">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-slate-800">
              {index + 1}
            </span>
          </div>

          {/* Content Card */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-sm leading-relaxed text-slate-700">{step}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
