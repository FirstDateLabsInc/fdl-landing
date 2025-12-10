"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./ResultsNavSidebar";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface MobileFloatingNavProps {
  activeSection: string;
  archetype: ArchetypeDefinition;
  className?: string;
}

export function MobileFloatingNav({ activeSection, archetype, className }: MobileFloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside to close - clean pattern
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={ref} className={cn("fixed bottom-6 w-full px-4 z-50 lg:hidden flex justify-center", className)}>
      <div className="relative w-full max-w-sm">
        {/* Local Popup - always in DOM, CSS controls visibility */}
        <nav
          className={cn(
            "absolute bottom-20 left-0 right-0 w-full origin-bottom rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out-back",
            isOpen ? "scale-100 opacity-100 translate-y-0" : "pointer-events-none scale-95 opacity-0 translate-y-4"
          )}
        >
          <div className="mb-2 px-3 py-2 border-b border-gray-100">
             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
          </div>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">{SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeSection === s.id
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-muted-foreground">
                  {s.number}
                </span>
                <span className="truncate">{s.title}</span>
                {activeSection === s.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Floating Pill Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-auto items-center gap-3 rounded-full bg-white p-2 pr-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5 active:scale-[0.98] transition-all duration-150 mx-auto"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/50 text-2xl">
            {archetype.emoji}
          </div>
          
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            isOpen ? "bg-muted text-foreground" : "bg-transparent text-muted-foreground"
          )}>
            <ChevronUp 
              className={cn(
                "h-5 w-5 transition-transform duration-200", 
                isOpen ? "rotate-180" : "rotate-0"
              )} 
            />
          </div>
        </button>
      </div>
    </div>
  );
}
