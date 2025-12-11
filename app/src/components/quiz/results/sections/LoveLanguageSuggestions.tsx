"use client";

import { useMemo } from "react";
import { Heart, MessageCircle, Clock, Gift, Hand, Lightbulb, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LoveLanguage, LoveLanguageResult } from "@/lib/quiz/types";

interface LoveLanguageSuggestionsProps {
  loveLanguages: LoveLanguageResult;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STRONG = 70;
const LOW = 40;

// ============================================================================
// LOVE LANGUAGE CONFIG
// ============================================================================

interface LanguageConfig {
  name: string;
  icon: typeof Heart;
  color: string;
  giveTips: string[];
  receiveTips: string[];
  giveInsights: {
    high: string;
    moderate: string;
    low: string;
  };
  receiveInsights: {
    high: string;
    moderate: string;
    low: string;
  };
}

const LANGUAGE_CONFIG: Record<LoveLanguage, LanguageConfig> = {
  words: {
    name: "Words of Affirmation",
    icon: MessageCircle,
    color: "#f472b6",
    giveTips: [
      "Send thoughtful good morning texts",
      "Leave encouraging notes in unexpected places",
      "Express specific compliments about their qualities",
    ],
    receiveTips: [
      "Let your partner know you need verbal encouragement",
      "Share when compliments make you feel appreciated",
      "Ask for words of affirmation when you need them",
    ],
    giveInsights: {
      high: "You're great at expressing appreciation and encouragement!",
      moderate: "You sometimes express love through words.",
      low: "Consider sharing more verbal appreciation with your partner.",
    },
    receiveInsights: {
      high: "Words of encouragement make you feel deeply loved.",
      moderate: "You appreciate receiving verbal affirmation.",
      low: "Let partners know when you need verbal encouragement.",
    },
  },
  time: {
    name: "Quality Time",
    icon: Clock,
    color: "#60a5fa",
    giveTips: [
      "Put away phones during conversations",
      "Plan dedicated date nights weekly",
      "Take walks together without distractions",
    ],
    receiveTips: [
      "Express when you need undivided attention",
      "Suggest activities you can do together",
      "Share how quality time makes you feel valued",
    ],
    giveInsights: {
      high: "You prioritize being fully present with loved ones!",
      moderate: "You value spending time together when possible.",
      low: "Try dedicating more undivided attention to your partner.",
    },
    receiveInsights: {
      high: "Undivided attention makes you feel truly valued.",
      moderate: "You enjoy quality time with your partner.",
      low: "You may want more focused time together.",
    },
  },
  service: {
    name: "Acts of Service",
    icon: Hand,
    color: "#34d399",
    giveTips: [
      "Help with tasks before being asked",
      "Take over responsibilities when they're stressed",
      "Cook their favorite meal after a long day",
    ],
    receiveTips: [
      "Communicate when you need practical support",
      "Let your partner know which tasks mean most to you",
      "Share appreciation when they help out",
    ],
    giveInsights: {
      high: "You naturally show love by helping and doing things for others!",
      moderate: "You show care through helpful actions sometimes.",
      low: "Consider helping with tasks to show you care.",
    },
    receiveInsights: {
      high: "Actions speak louder than words for you.",
      moderate: "You appreciate when partners help out.",
      low: "Communicate when you need practical support.",
    },
  },
  gifts: {
    name: "Receiving Gifts",
    icon: Gift,
    color: "#fbbf24",
    giveTips: [
      "Remember small things they mention wanting",
      "Bring home thoughtful surprises occasionally",
      "Mark special occasions with meaningful gifts",
    ],
    receiveTips: [
      "Share what kind of gifts make you feel loved",
      "Let partners know it's the thought that counts",
      "Express gratitude when receiving thoughtful items",
    ],
    giveInsights: {
      high: "You love finding the perfect gift to show you care!",
      moderate: "You occasionally express love through thoughtful gifts.",
      low: "Small, thoughtful gifts can mean a lot to your partner.",
    },
    receiveInsights: {
      high: "Thoughtful gifts make you feel remembered and valued.",
      moderate: "You appreciate receiving meaningful presents.",
      low: "Gifts aren't your main love language, but they're nice.",
    },
  },
  touch: {
    name: "Physical Touch",
    icon: Heart,
    color: "#f87171",
    giveTips: [
      "Hold hands when walking together",
      "Offer comforting hugs during tough times",
      "Sit close during movies or conversations",
    ],
    receiveTips: [
      "Ask for physical affection when you need it",
      "Share what types of touch feel most comforting",
      "Let your partner know when closeness matters to you",
    ],
    giveInsights: {
      high: "You naturally express love through physical connection!",
      moderate: "You use physical touch to show affection at times.",
      low: "Physical touch may not be your go-to way to show love.",
    },
    receiveInsights: {
      high: "Physical closeness makes you feel secure and loved.",
      moderate: "You enjoy physical affection from your partner.",
      low: "Physical touch isn't your primary need, but it matters.",
    },
  },
};

// ============================================================================
// TYPES
// ============================================================================

interface ImprovementArea {
  lang: LoveLanguage;
  type: "give" | "receive";
  score: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getGiveInsight(lang: LoveLanguage, score: number): { text: string; isPositive: boolean } {
  const config = LANGUAGE_CONFIG[lang];
  if (score >= STRONG) {
    return { text: config.giveInsights.high, isPositive: true };
  } else if (score < LOW) {
    return { text: config.giveInsights.low, isPositive: false };
  }
  return { text: config.giveInsights.moderate, isPositive: true };
}

function getReceiveInsight(lang: LoveLanguage, score: number): { text: string; isPositive: boolean } {
  const config = LANGUAGE_CONFIG[lang];
  if (score >= STRONG) {
    return { text: config.receiveInsights.high, isPositive: true };
  } else if (score < LOW) {
    return { text: config.receiveInsights.low, isPositive: false };
  }
  return { text: config.receiveInsights.moderate, isPositive: true };
}

function findImprovementAreas(loveLanguages: LoveLanguageResult): ImprovementArea[] {
  const areas: ImprovementArea[] = [];

  for (const lang of loveLanguages.ranked) {
    const { give, receive } = loveLanguages.giveReceive[lang];
    if (give < STRONG) {
      areas.push({ lang, type: "give", score: give });
    }
    if (receive < STRONG) {
      areas.push({ lang, type: "receive", score: receive });
    }
  }

  // Sort by score ascending (lowest first - needs most help)
  areas.sort((a, b) => a.score - b.score);

  return areas;
}

function getTipsForArea(area: ImprovementArea): string[] {
  const config = LANGUAGE_CONFIG[area.lang];
  const tips = area.type === "give" ? config.giveTips : config.receiveTips;
  // Return all 3 tips for this area
  return tips;
}

// ============================================================================
// MINI PROGRESS BAR
// ============================================================================

export function LoveLanguageSuggestions({
  loveLanguages,
  className,
}: LoveLanguageSuggestionsProps) {

  // Get strong languages (combined score >= 70%) - up to 3
  const strongLanguages = useMemo(() => {
    return loveLanguages.ranked
      .filter((lang) => loveLanguages.scores[lang] >= STRONG)
      .slice(0, 3)
      .map((lang) => ({
        key: lang,
        ...LANGUAGE_CONFIG[lang],
        give: loveLanguages.giveReceive[lang].give,
        receive: loveLanguages.giveReceive[lang].receive,
        combinedScore: loveLanguages.scores[lang],
      }));
  }, [loveLanguages]);

  // Find improvement areas (scores below STRONG threshold)
  const improvementAreas = useMemo(() => {
    return findImprovementAreas(loveLanguages).slice(0, 3);
  }, [loveLanguages]);

  // Check if all areas are strong
  const allStrong = improvementAreas.length === 0;

  // Generate personalized opening paragraph
  const openingParagraph = useMemo(() => {
    if (strongLanguages.length === 0) {
      return "Here are some areas where you can grow in expressing and receiving love.";
    }

    const names = strongLanguages.map(l => l.name);
    if (names.length === 1) {
      return `You value ${names[0]} - this is a strength in how you connect!`;
    } else if (names.length === 2) {
      return `You value ${names[0]} and ${names[1]} - these are your strengths in love!`;
    } else {
      return `You value ${names[0]}, ${names[1]}, and ${names[2]} - love flows naturally for you!`;
    }
  }, [strongLanguages]);

  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-6 sm:space-y-8">
        {strongLanguages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-secondary-dark" />
              <span className="text-lg font-semibold">Your Strengths</span>
            </div>
            <div className="space-y-3">
              {strongLanguages.map((language) => {
                const Icon = language.icon;
                return (
                  <div key={language.key} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-foreground">
                      <Icon className="h-4 w-4 text-secondary-dark" />
                      <span className="text-base font-semibold">{language.name}</span>
                      <span className="text-sm text-muted-foreground">{language.combinedScore}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You naturally value this language—keep nurturing it.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!allStrong && improvementAreas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Target className="h-5 w-5 text-secondary-dark" />
              <span className="text-lg font-semibold">Areas to Grow</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-1">
              {improvementAreas.map((area) => {
                const config = LANGUAGE_CONFIG[area.lang];
                const Icon = config.icon;
                const tips = getTipsForArea(area);
                const typeLabel = area.type === "give" ? "Giving" : "Receiving";

                return (
                  <div
                    key={`${area.lang}-${area.type}`}
                    className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-foreground">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/10 text-secondary-dark">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-base font-semibold">{config.name}</span>
                      <span className="text-sm text-muted-foreground">{typeLabel}: {area.score}%</span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground sm:text-base">
                      {tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {allStrong && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-4 w-4 text-secondary-dark" />
              <span className="text-sm font-semibold">You&apos;re strong across all love languages</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keep nurturing these connections and stay curious about how your partner&apos;s love languages might differ from yours.
            </p>
          </div>
        )}

        <div className="pt-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Pro tip:</span> People often give love the way they want to receive it. Pay attention to how your partner shows affection to understand their love language too.
          </p>
        </div>
      </div>
    </div>
  );
}
