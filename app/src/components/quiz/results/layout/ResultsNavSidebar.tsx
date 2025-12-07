"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface Section {
  id: string;
  number: number;
  title: string;
}

interface ResultsNavSidebarProps {
  archetype: ArchetypeDefinition;
  sections: Section[];
  activeSection: string;
  className?: string;
}

const SECTIONS: Section[] = [
  { id: "pattern", number: 1, title: "The Pattern" },
  { id: "root-cause", number: 2, title: "Root Cause" },
  { id: "dating-meaning", number: 3, title: "What It Means" },
  { id: "red-flags", number: 4, title: "Red Flags" },
  { id: "coaching", number: 5, title: "Coaching Focus" },
  { id: "profile", number: 6, title: "Dating Profile" },
  { id: "love-languages", number: 7, title: "Love Languages" },
];

export function ResultsNavSidebar({
  archetype,
  sections = SECTIONS,
  activeSection,
  className,
}: ResultsNavSidebarProps) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      className={cn(
        "sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl bg-background/80 p-5 shadow-soft backdrop-blur lg:block",
        className
      )}
    >
      {/* Archetype Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full bg-primary/10">
          <Image
            src={archetype.image}
            alt={archetype.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Your type is</p>
        <h3 className="font-semibold text-foreground">{archetype.name}</h3>
        <p className="text-2xl">{archetype.emoji}</p>
      </div>

      {/* Section Links */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On This Page
        </p>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">
                {section.number}
              </span>
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          Get the App
        </button>
        <button className="w-full rounded-lg border border-muted px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
          Share Results
        </button>
      </div>
    </aside>
  );
}

export { SECTIONS };
