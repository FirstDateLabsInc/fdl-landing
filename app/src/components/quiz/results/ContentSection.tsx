import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface ContentSectionProps {
  title: string;
  eyebrow?: string;
  icon?: LucideIcon;
  id: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  variant?: "default" | "highlight" | "amber" | "green" | "blue" | "purple";
}

const VARIANTS = {
  default: "bg-slate-100 text-slate-600",
  highlight: "bg-[#f9d544]/20 text-slate-800",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
};

export function ContentSection({
  title,
  eyebrow,
  icon: Icon,
  id,
  children,
  className,
  headerClassName,
  variant = "default",
}: ContentSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 w-full", className)}>
      <div className={cn("mb-6 flex flex-col gap-2", headerClassName)}>
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {eyebrow}
          </span>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                VARIANTS[variant]
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
      </div>
      <div className="relative">
        {children}
      </div>
    </section>
  );
}
