"use client";

import Image from "next/image";
import cloudflareLoader from "@/lib/cloudflare-image-loader";
import { cn } from "@/lib/utils";
import type { ArchetypePublic } from "@/lib/quiz/archetypes";

interface Section {
  id: string;
  number: number;
  title: string;
}

interface ResultsNavSidebarProps {
  archetype: ArchetypePublic;
  sections: Section[];
  activeSection: string;
  className?: string;
}

const SECTIONS: Section[] = [
  { id: "pattern", number: 1, title: "Your Story" },
  { id: "profile", number: 2, title: "Dating Profile" },
  { id: "score-insights", number: 3, title: "Score Insights" },
  { id: "dating-meaning", number: 4, title: "What It Means" },
  { id: "red-flags", number: 5, title: "Red Flags" },
  { id: "coaching", number: 6, title: "Coaching Focus" },
  { id: "love-languages", number: 7, title: "Love Languages" },
];

export function ResultsNavSidebar({
  archetype,
  sections = SECTIONS,
  activeSection,
  className,
}: ResultsNavSidebarProps) {
  const scrollToId = (id: string): boolean => {
    const element = document.getElementById(id);
    if (!element) return false;
    const offset = 120; // account for sticky navbar
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  const handleClick = (id: string) => {
    const didScroll = scrollToId(id);
    if (!didScroll && id === "full-picture") {
      window.location.assign("/#waitlist");
    }
  };

  return (
    <aside
      className={cn(
        "sticky top-24 hidden h-fit w-56 shrink-0 rounded-xl bg-background/80 p-4 shadow-soft backdrop-blur lg:block",
        className
      )}
    >
      {/* Archetype Header */}
      <div className="mb-4 text-center">
        <div className="mx-auto mb-2 h-16 w-16 overflow-hidden rounded-full bg-primary/10">
          <Image
            loader={cloudflareLoader}
            src={archetype.image}
            alt={archetype.name}
            width={64}
            height={64}
            className="h-full w-full object-cover object-top"
          />
        </div>
        <p className="text-xs text-muted-foreground">Your type is</p>
        <h3 className="font-semibold text-foreground">{archetype.name}</h3>
      </div>

      {/* Section Links */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On This Page
        </p>
        <nav className="space-y-0.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px]">
                {section.number}
              </span>
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1.5">
        <button
          onClick={() => handleClick("full-picture")}
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Get Full Report
        </button>
        <button
          onClick={() => handleClick("share-results")}
          className="w-full rounded-lg border border-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          Share Results
        </button>
      </div>
    </aside>
  );
}

export { SECTIONS };
