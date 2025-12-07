import { cn } from "@/lib/utils";

interface ContentSectionProps {
  title: string;
  eyebrow?: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({
  title,
  eyebrow,
  id,
  children,
  className,
}: ContentSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-6", className)}>
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-sm font-medium text-slate-500">{eyebrow}</span>
        )}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
