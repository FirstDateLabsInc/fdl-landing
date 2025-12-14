import { cn } from "@/lib/utils";

interface ContentSectionProps {
  title: string;
  eyebrow?: string;
  sectionNumber?: number;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({
  title,
  eyebrow,
  sectionNumber,
  id,
  children,
  className,
}: ContentSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-6", className)}>
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-lg font-medium text-slate-500">{eyebrow}</span>
        )}
        <div className="flex items-center gap-3">
          {sectionNumber && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-700">
              {sectionNumber}
            </span>
          )}
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
