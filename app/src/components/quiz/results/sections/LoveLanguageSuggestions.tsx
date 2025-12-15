"use client";

import { useState, useMemo } from "react";
import { Heart, MessageCircle, Clock, Gift, Hand, TrendingUp, ChevronRight } from "lucide-react";

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
  shortName: string;
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
    shortName: "Words",
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
    shortName: "Time",
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
    shortName: "Service",
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
    shortName: "Gifts",
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
    shortName: "Touch",
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
// BAR CHART ITEM
// ============================================================================

interface BarChartItemProps {
  language: {
    key: LoveLanguage;
    name: string;
    shortName: string;
    icon: typeof Heart;
    color: string;
    giveColor: string;
    receiveColor: string;
    score: number;
    give: number;
    receive: number;
    isPriority: boolean;
    needsGrowth: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

function BarChartItem({ language, isSelected, onClick }: BarChartItemProps) {
  const Icon = language.icon;
  const total = language.give + language.receive;
  const giveWidth = total > 0 ? (language.give / total) * 100 : 50;
  const receiveWidth = 100 - giveWidth;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left transition-all duration-200 rounded-xl p-3 sm:p-4",
        "hover:bg-slate-50/80",
        isSelected
          ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent ring-2 ring-primary/30"
          : "bg-white"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
            style={{ backgroundColor: `${language.color}15` }}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: language.color }} />
          </div>
          <span className="font-semibold text-sm sm:text-base text-slate-800">
            <span className="hidden sm:inline">{language.name}</span>
            <span className="sm:hidden">{language.shortName}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {language.isPriority && (
            <span className="hidden sm:inline shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-medium text-secondary-dark">
              Priority
            </span>
          )}
          <ChevronRight
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform duration-200",
              isSelected && "rotate-90 text-primary"
            )}
          />
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative h-6 sm:h-8 rounded-full overflow-hidden bg-slate-100">
        {/* Give portion (left) */}
        <div
          className="absolute left-0 top-0 h-full flex items-center justify-end pr-2 transition-all duration-300"
          style={{
            width: `${giveWidth}%`,
            backgroundColor: language.giveColor,
          }}
        >
          <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-sm">
            {language.give}%
          </span>
        </div>
        {/* Receive portion (right) */}
        <div
          className="absolute right-0 top-0 h-full flex items-center justify-start pl-2 transition-all duration-300"
          style={{
            width: `${receiveWidth}%`,
            backgroundColor: language.receiveColor,
          }}
        >
          <span className="text-[10px] sm:text-xs font-bold text-slate-600">
            {language.receive}%
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-1.5 text-[10px] sm:text-xs text-slate-500">
        <span>Give</span>
        <span>Receive</span>
      </div>
    </button>
  );
}

// ============================================================================
// DETAIL PANEL
// ============================================================================

interface DetailPanelProps {
  language: {
    key: LoveLanguage;
    name: string;
    icon: typeof Heart;
    color: string;
    priorityDescription: string;
    giveTips: string[];
    receiveTips: string[];
    isPriority: boolean;
    needsGrowth: boolean;
    give: number;
    receive: number;
  };
  className?: string;
}

function DetailPanel({ language, className }: DetailPanelProps) {
  const Icon = language.icon;
  const showGiveTips = language.needsGrowth ? language.give <= GROWTH_THRESHOLD : true;
  const showReceiveTips = language.needsGrowth ? language.receive <= GROWTH_THRESHOLD : true;

  return (
    <div className={cn("rounded-2xl bg-white border border-slate-100 shadow-soft p-4 sm:p-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
          style={{ backgroundColor: `${language.color}15` }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: language.color }} />
        </div>
        <div>
          <h4 className="font-semibold text-base sm:text-lg text-slate-800">{language.name}</h4>
          {language.isPriority && (
            <span className="inline-block mt-1 rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary-dark">
              Priority Language
            </span>
          )}
          {language.needsGrowth && !language.isPriority && (
            <span className="inline-block mt-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Growth Area
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base leading-relaxed text-slate-600 mb-5">
        {language.priorityDescription}
      </p>

      {/* Tips sections */}
      <div className="space-y-5">
        {showGiveTips && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-emerald-700">Giving Tips</span>
            </div>
            <ul className="space-y-2.5">
              {language.giveTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: language.color }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showReceiveTips && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                <Heart className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-blue-700">Receiving Tips</span>
            </div>
            <ul className="space-y-2.5">
              {language.receiveTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: language.color }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MOBILE DETAIL (Expandable inline)
// ============================================================================

interface MobileDetailProps {
  language: DetailPanelProps["language"];
  isExpanded: boolean;
}

function MobileDetail({ language, isExpanded }: MobileDetailProps) {
  const showGiveTips = language.needsGrowth ? language.give <= GROWTH_THRESHOLD : true;
  const showReceiveTips = language.needsGrowth ? language.receive <= GROWTH_THRESHOLD : true;

  if (!isExpanded) return null;

  return (
    <div className="px-3 pb-4 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
      {/* Description */}
      <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 rounded-lg p-3">
        {language.priorityDescription}
      </p>

      {/* Tips */}
      <div className="space-y-4">
        {showGiveTips && (
          <div className="bg-emerald-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Giving Tips</span>
            </div>
            <ul className="space-y-1.5">
              {language.giveTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: language.color }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showReceiveTips && (
          <div className="bg-blue-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Receiving Tips</span>
            </div>
            <ul className="space-y-1.5">
              {language.receiveTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: language.color }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
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

  // Default to first priority language, or first in ranking
  const defaultSelected = rankedLanguages.find(l => l.isPriority)?.key || rankedLanguages[0]?.key || 'words';
  const [selectedLanguage, setSelectedLanguage] = useState<LoveLanguage>(defaultSelected);

  const selectedData = rankedLanguages.find(l => l.key === selectedLanguage) || rankedLanguages[0];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop/Tablet: Side-by-side layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Bar charts - spans 2 columns on lg */}
        <div className="lg:col-span-2 space-y-2 rounded-2xl bg-white border border-slate-100 shadow-soft p-3 sm:p-4">
          {rankedLanguages.map((language) => (
            <BarChartItem
              key={language.key}
              language={language}
              isSelected={selectedLanguage === language.key}
              onClick={() => setSelectedLanguage(language.key)}
            />
          ))}
        </div>

        {/* Detail panel - spans 3 columns on lg */}
        <div className="lg:col-span-3">
          <DetailPanel language={selectedData} className="h-full" />
        </div>
      </div>

      {/* Mobile: Stacked with inline expansion */}
      <div className="md:hidden space-y-2 rounded-2xl bg-white border border-slate-100 shadow-soft p-2 overflow-hidden">
        {rankedLanguages.map((language) => (
          <div key={language.key} className="overflow-hidden">
            <BarChartItem
              language={language}
              isSelected={selectedLanguage === language.key}
              onClick={() => setSelectedLanguage(
                selectedLanguage === language.key ? language.key : language.key
              )}
            />
            <MobileDetail
              language={language}
              isExpanded={selectedLanguage === language.key}
            />
          </div>
        ))}
      </div>

      {/* Pro tip */}
      <p className="text-sm text-muted-foreground leading-relaxed px-1">
        <span className="font-semibold text-foreground">Pro tip:</span> People often give love the
        way they want to receive it. Pay attention to how your partner shows affection to understand
        their love language too.
      </p>
    </div>
  );
}
