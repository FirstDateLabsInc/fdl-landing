"use client";

import { useMemo } from "react";
import { Heart, MessageCircle, Clock, Gift, Hand, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LoveLanguage, LoveLanguageResult } from "@/lib/quiz/types";

interface LoveLanguageSuggestionsProps {
  loveLanguages: LoveLanguageResult;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIORITY_THRESHOLD = 75; // >= 75% is Priority
const GROWTH_THRESHOLD = 50; // <= 50% needs growth

// ============================================================================
// LOVE LANGUAGE CONFIG
// ============================================================================

interface LanguageConfig {
  name: string;
  icon: typeof Heart;
  color: string;
  giveColor: string;
  receiveColor: string;
  priorityDescription: string;
  giveTips: string[];
  receiveTips: string[];
}

const LANGUAGE_CONFIG: Record<LoveLanguage, LanguageConfig> = {
  words: {
    name: "Words of Affirmation",
    icon: MessageCircle,
    color: "#f472b6",
    giveColor: "#ec4899",
    receiveColor: "#fbcfe8",
    priorityDescription: "You thrive on meaningful words—both giving compliments and receiving verbal appreciation deeply matter to you.",
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
  },
  time: {
    name: "Quality Time",
    icon: Clock,
    color: "#60a5fa",
    giveColor: "#3b82f6",
    receiveColor: "#bfdbfe",
    priorityDescription: "Connection through presence matters most—you show love by being fully present and feel valued when others give you undivided attention.",
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
  },
  service: {
    name: "Acts of Service",
    icon: Hand,
    color: "#34d399",
    giveColor: "#10b981",
    receiveColor: "#a7f3d0",
    priorityDescription: "Actions speak louder than words for you—you express care by helping others and feel most loved when someone eases your burdens.",
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
  },
  gifts: {
    name: "Receiving Gifts",
    icon: Gift,
    color: "#fbbf24",
    giveColor: "#f59e0b",
    receiveColor: "#fde68a",
    priorityDescription: "Thoughtful gestures matter deeply—you love finding the perfect gift and feel cherished when someone remembers the little things.",
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
  },
  touch: {
    name: "Physical Touch",
    icon: Heart,
    color: "#f87171",
    giveColor: "#ef4444",
    receiveColor: "#fecaca",
    priorityDescription: "Physical connection is your love language—you feel most secure and loved through hugs, holding hands, and being close to your partner.",
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
  },
};

// ============================================================================
// COMBINED PIE CHART (Give vs Receive in one circle)
// ============================================================================

function CombinedPieChart({
  give,
  receive,
  giveColor,
  receiveColor,
  size = 90,
}: {
  give: number;
  receive: number;
  giveColor: string;
  receiveColor: string;
  size?: number;
}) {
  // Show give and receive as portions of the pie (out of 200 total max)
  const total = give + receive;
  const giveAngle = total > 0 ? (give / total) * 360 : 180;
  const gradient = `conic-gradient(${giveColor} 0deg ${giveAngle}deg, ${receiveColor} ${giveAngle}deg 360deg)`;

  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: gradient,
        }}
        title={`Give: ${give}% | Receive: ${receive}%`}
      />
      <div className="mt-3 flex justify-center gap-6 text-sm">
        <span className="text-slate-500">Receive: <span className="font-bold text-slate-700">{receive}%</span></span>
        <span className="text-slate-500">Give: <span className="font-bold text-slate-700">{give}%</span></span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export function LoveLanguageSuggestions({
  loveLanguages,
  className,
}: LoveLanguageSuggestionsProps) {
  // Get all languages ranked with their data
  const rankedLanguages = useMemo(() => {
    return loveLanguages.ranked.map((lang, index) => ({
      key: lang,
      rank: index + 1,
      ...LANGUAGE_CONFIG[lang],
      score: loveLanguages.scores[lang],
      give: loveLanguages.giveReceive[lang].give,
      receive: loveLanguages.giveReceive[lang].receive,
      isPriority: loveLanguages.scores[lang] >= PRIORITY_THRESHOLD,
      needsGrowth: loveLanguages.giveReceive[lang].give <= GROWTH_THRESHOLD || 
                   loveLanguages.giveReceive[lang].receive <= GROWTH_THRESHOLD,
    }));
  }, [loveLanguages]);

  // Separate into priorities and growth areas
  const priorities = rankedLanguages.filter((l) => l.isPriority);
  const growthLanguages = rankedLanguages.filter((l) => l.needsGrowth && !l.isPriority);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Priority Languages - Grid Layout (2 columns) */}
      {priorities.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {priorities.map((language) => {
            const Icon = language.icon;
            return (
              <div
                key={language.key}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-5 w-5" style={{ color: language.color }} />
                    <h4 className="text-base font-semibold text-slate-800">{language.name}</h4>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-medium text-secondary-dark">
                    Priority
                  </span>
                </div>

                {/* Pie Chart - Large and Centered */}
                <div className="flex items-center justify-center py-2">
                  <CombinedPieChart
                    give={language.give}
                    receive={language.receive}
                    giveColor={language.giveColor}
                    receiveColor={language.receiveColor}
                    size={120}
                  />
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600 mt-3">
                  {language.priorityDescription}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Growth Areas - Grid Layout (2 columns) */}
      {growthLanguages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-800">Areas to Grow</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {growthLanguages.map((language) => {
              const Icon = language.icon;
              const showGiveTips = language.give <= GROWTH_THRESHOLD;
              const showReceiveTips = language.receive <= GROWTH_THRESHOLD;

              return (
                <div
                  key={language.key}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Icon className="h-5 w-5" style={{ color: language.color }} />
                    <h4 className="text-base font-semibold text-slate-800">{language.name}</h4>
                  </div>

                  {/* Pie Chart - Large and Centered */}
                  <div className="flex items-center justify-center py-2">
                    <CombinedPieChart
                      give={language.give}
                      receive={language.receive}
                      giveColor={language.giveColor}
                      receiveColor={language.receiveColor}
                      size={120}
                    />
                  </div>

                  {/* All 3 Tips */}
                  <div className="mt-4 space-y-4">
                    {showGiveTips && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                          <TrendingUp className="h-4 w-4" />
                          <span>Giving Tips</span>
                        </div>
                        <ul className="space-y-2">
                          {language.giveTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: language.color }} />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {showReceiveTips && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                          <TrendingUp className="h-4 w-4" />
                          <span>Receiving Tips</span>
                        </div>
                        <ul className="space-y-2">
                          {language.receiveTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: language.color }} />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pro tip */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">Pro tip:</span> People often give love the
        way they want to receive it. Pay attention to how your partner shows affection to understand
        their love language too.
      </p>
    </div>
  );
}
