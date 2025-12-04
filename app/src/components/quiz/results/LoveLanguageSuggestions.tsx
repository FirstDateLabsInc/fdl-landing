"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Heart, MessageCircle, Clock, Gift, Hand, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LoveLanguage, LoveLanguageResult } from "@/lib/quiz/types";

interface LoveLanguageSuggestionsProps {
  loveLanguages: LoveLanguageResult;
  className?: string;
}

// ============================================================================
// LOVE LANGUAGE CONFIG
// ============================================================================

interface LanguageConfig {
  name: string;
  icon: typeof Heart;
  color: string;
  suggestions: string[];
}

const LANGUAGE_CONFIG: Record<LoveLanguage, LanguageConfig> = {
  words: {
    name: "Words of Affirmation",
    icon: MessageCircle,
    color: "#f472b6",
    suggestions: [
      "Send thoughtful good morning texts",
      "Leave encouraging notes in unexpected places",
      "Express specific compliments about their qualities",
      "Verbalize appreciation for small gestures",
      "Write heartfelt letters for special occasions",
    ],
  },
  time: {
    name: "Quality Time",
    icon: Clock,
    color: "#60a5fa",
    suggestions: [
      "Put away phones during conversations",
      "Plan dedicated date nights weekly",
      "Take walks together without distractions",
      "Learn a new hobby together",
      "Create rituals like morning coffee chats",
    ],
  },
  service: {
    name: "Acts of Service",
    icon: Hand,
    color: "#34d399",
    suggestions: [
      "Help with tasks before being asked",
      "Take over responsibilities when they're stressed",
      "Cook their favorite meal after a long day",
      "Handle errands they've been putting off",
      "Anticipate needs and act proactively",
    ],
  },
  gifts: {
    name: "Receiving Gifts",
    icon: Gift,
    color: "#fbbf24",
    suggestions: [
      "Remember small things they mention wanting",
      "Bring home thoughtful surprises occasionally",
      "Mark special occasions with meaningful gifts",
      "Create handmade items with personal touch",
      "Keep a note of their wishlist items",
    ],
  },
  touch: {
    name: "Physical Touch",
    icon: Heart,
    color: "#f87171",
    suggestions: [
      "Hold hands when walking together",
      "Offer comforting hugs during tough times",
      "Sit close during movies or conversations",
      "Give back rubs without being asked",
      "Create physical connection throughout the day",
    ],
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function LoveLanguageSuggestions({
  loveLanguages,
  className,
}: LoveLanguageSuggestionsProps) {
  const prefersReducedMotion = useReducedMotion();

  // Get top 2 love languages to focus suggestions on
  const topLanguages = useMemo(() => {
    const sorted = [...loveLanguages.ranked].slice(0, 2);
    return sorted.map((lang) => ({
      key: lang,
      ...LANGUAGE_CONFIG[lang],
    }));
  }, [loveLanguages.ranked]);

  const containerVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      };

  const itemVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, x: -10 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.3, ease: "easeOut" },
        },
      };

  return (
    <div className={cn("rounded-2xl bg-white p-6 shadow-soft", className)}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f9d544]/20 to-[#cab5d4]/20">
          <Lightbulb className="h-5 w-5 text-[#cab5d4]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Love Language Tips</h3>
          <p className="text-sm text-slate-500">Ways to connect based on your preferences</p>
        </div>
      </div>

      {/* Suggestions for top languages */}
      <div className="space-y-6">
        {topLanguages.map((language, langIndex) => {
          const Icon = language.icon;
          return (
            <div key={language.key}>
              {/* Language header */}
              <div className="mb-3 flex items-center gap-2">
                <div 
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${language.color}20` }}
                >
                  <Icon 
                    className="h-3.5 w-3.5" 
                    style={{ color: language.color }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {language.name}
                </span>
                {langIndex === 0 && (
                  <span className="ml-auto rounded-full bg-[#f9d544]/20 px-2 py-0.5 text-xs font-medium text-slate-700">
                    Primary
                  </span>
                )}
              </div>

              {/* Suggestions list */}
              <motion.ul
                className="space-y-2 pl-9"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {language.suggestions.slice(0, 3).map((suggestion, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span 
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: language.color }}
                    />
                    {suggestion}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          );
        })}
      </div>

      {/* Pro tip */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-[#fffdf6] to-[#f9d544]/10 p-4">
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Pro tip:</span> People often give love 
          the way they want to receive it. Pay attention to how your partner shows affection 
          to understand their love language too!
        </p>
      </div>
    </div>
  );
}

