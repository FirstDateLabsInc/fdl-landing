import { cn } from "@/lib/utils";

interface NumberedSectionProps {
  number: number;
  title: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function NumberedSection({
  number,
  title,
  id,
  children,
  className,
}: NumberedSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-muted-foreground">
          {number}
        </span>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}
