import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface ArchetypeCardProps {
  archetype: ArchetypeDefinition;
  variant: "secure" | "anxious" | "avoidant" | "disorganized";
  className?: string;
}

export function ArchetypeCard({ archetype, variant, className }: ArchetypeCardProps) {
  // Logic to simulate encoded ID for URL
  const hash = typeof window !== 'undefined' ? btoa(archetype.id).replace(/=/g, "") : "";
  const href = `/quiz/results?id=${hash}`; 

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2",
        className
      )}
    >
      {/* Header: Image & Name */}
      <div className="mb-4 flex flex-col items-center">
        <div className="relative mb-6 h-72 w-72 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
           <Image
            src={archetype.image}
            alt={archetype.name}
            fill
            className="object-contain"
          />
        </div>
        
        <h3 className="text-2xl font-black text-foreground transition-colors group-hover:text-primary">
          {archetype.name}
        </h3>
      </div>

      {/* Body: Summary */}
      <div className="mb-6 max-w-xs">
        <p className="line-clamp-4 text-xs leading-relaxed font-medium text-muted-foreground">
          {archetype.summary}
        </p>
      </div>
    </Link>
  );
}
