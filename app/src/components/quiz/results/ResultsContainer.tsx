"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ArchetypeHero } from "./ArchetypeHero";
import { CategoryRadarChart } from "./CategoryRadarChart";
import { OverallRadarChart } from "./OverallRadarChart";
import { LoveLanguageSuggestions } from "./LoveLanguageSuggestions";
import { ShareResults } from "./ShareResults";
import { ContentSection } from "./ContentSection";
import { TraitGrid } from "./TraitGrid";
import { DatingCycleVisual } from "./DatingCycleVisual";
import { RedFlagsList } from "./RedFlagsList";
import { CoachingFocusList } from "./CoachingFocusList";
import { ResultsNavSidebar, SECTIONS } from "./ResultsNavSidebar";
import { MobileFloatingNav } from "./MobileFloatingNav";
import { cn } from "@/lib/utils";
import type { QuizResults, AttachmentDimension, CommunicationStyle } from "@/lib/quiz/types";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";
import { Sparkles, History, Scale, ShieldAlert, Target, UserCircle, Heart, Share2 } from "lucide-react";

interface ResultsContainerProps {
  results: QuizResults;
  archetype: ArchetypeDefinition;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ResultsContainer({
  results,
  archetype,
  className,
}: ResultsContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Track active section for sidebar
  const [activeSection, setActiveSection] = useState("pattern");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Generate share URL
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      const hash = btoa(archetype.id).replace(/=/g, "");
      return `${window.location.origin}/quiz/results?id=${hash}`;
    }
    return "";
  }, [archetype.id]);

  // Prepare attachment dimensions for radar chart
  const attachmentDimensions = useMemo(() => {
    const { primary } = results.attachment;
    return Object.entries(results.attachment.scores).map(([name, value]) => ({
      label: name,
      value,
      isPrimary: Array.isArray(primary)
        ? primary.includes(name as AttachmentDimension)
        : primary === 'mixed'
          ? true // all are primary in mixed
          : name === primary,
    }));
  }, [results.attachment]);

  // Prepare communication dimensions for radar chart
  const communicationDimensions = useMemo(() => {
    const { primary } = results.communication;
    return Object.entries(results.communication.scores).map(([name, value]) => ({
      label: name,
      value,
      isPrimary: Array.isArray(primary)
        ? primary.includes(name as CommunicationStyle)
        : primary === 'mixed'
          ? true // all are primary in mixed
          : name === primary,
    }));
  }, [results.communication]);

  // Animation variants for staggered section reveal
  const sectionVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };

  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-6", className)}>
      {/* HERO: Profile Summary */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <ArchetypeHero archetype={archetype} />
      </motion.section>

      {/* MAIN CONTENT: 2-column layout */}
      <div className="flex gap-8">
        {/* Left Column: Scrollable Content */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Section 1: Pattern Recognition */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <ContentSection 
              title="The Pattern You Recognize" 
              id="pattern"
              eyebrow="THE PATTERN"
              icon={Sparkles}
              variant="highlight"
            >
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-slate-700">
                  {archetype.patternDescription}
                </p>
                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Your Dating Loop
                  </h3>
                  <DatingCycleVisual steps={archetype.datingCycle} />
                </div>
              </div>
            </ContentSection>
          </motion.div>

          {/* Section 2: Root Cause */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <ContentSection 
              title="Where This Comes From" 
              id="root-cause"
              eyebrow="THE ORIGIN"
              icon={History}
            >
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-lg leading-relaxed text-slate-700">
                  {archetype.rootCause}
                </p>
              </div>
            </ContentSection>
          </motion.div>

          {/* Section 3: Dating Meaning (Strengths + Challenges) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <ContentSection 
              title="What This Means for Dating" 
              id="dating-meaning"
              eyebrow="ANALYSIS"
              icon={Scale}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-green-600">
                    Your Strengths
                  </h3>
                  <TraitGrid items={archetype.datingMeaning.strengths} type="strength" />
                </div>
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-600">
                    Your Challenges
                  </h3>
                  <TraitGrid items={archetype.datingMeaning.challenges} type="challenge" />
                </div>
              </div>
            </ContentSection>
          </motion.div>

          {/* Section 4: Red Flags */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <ContentSection 
              title="When This Goes Wrong" 
              id="red-flags"
              eyebrow="WARNING SIGNS"
              icon={ShieldAlert}
              variant="amber"
            >
              <RedFlagsList items={archetype.redFlags} />
            </ContentSection>
          </motion.div>

          {/* Section 5: Coaching Focus */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <ContentSection 
              title="Your Coaching Focus" 
              id="coaching"
              eyebrow="GROWTH PLAN"
              icon={Target}
              variant="green"
            >
              <CoachingFocusList
                items={archetype.coachingFocus}
                ctaText={archetype.callToActionCopy}
              />
            </ContentSection>
          </motion.div>

          {/* Section 6: Dating Profile (Radar Charts) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <ContentSection 
              title="Your Dating Profile" 
              id="profile"
              eyebrow="DEEP DIVE"
              icon={UserCircle}
              variant="purple"
            >
              <div className="space-y-6">
                <OverallRadarChart results={results} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <CategoryRadarChart
                    title="Attachment Style"
                    subtitle="How you connect emotionally"
                    dimensions={attachmentDimensions}
                    primaryLabel="Primary"
                    primaryStyles={results.attachment.primary}
                    mixedLabel="Mixed"
                    accentColor="var(--secondary)"
                    fillColor="var(--primary)"
                  />
                  <CategoryRadarChart
                    title="Communication Style"
                    subtitle="How you express yourself"
                    dimensions={communicationDimensions}
                    primaryLabel="Primary"
                    primaryStyles={results.communication.primary}
                    mixedLabel="Mixed"
                    accentColor="var(--chart-2)"
                    fillColor="var(--chart-3)"
                  />
                </div>
              </div>
            </ContentSection>
          </motion.div>

          {/* Section 7: Love Languages */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <ContentSection 
              title="Your Love Languages" 
              id="love-languages"
              eyebrow="CONNECTION"
              icon={Heart}
              variant="highlight"
            >
              <LoveLanguageSuggestions loveLanguages={results.loveLanguages} />
            </ContentSection>
          </motion.div>

          {/* Share Results */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <div className="rounded-2xl bg-white p-5 shadow-soft">
              <ShareResults shareUrl={shareUrl} archetype={archetype.name} />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sticky Sidebar (desktop only) */}
        <ResultsNavSidebar
          archetype={archetype}
          sections={SECTIONS}
          activeSection={activeSection}
        />
      </div>

      {/* Mobile Floating Nav */}
      <MobileFloatingNav activeSection={activeSection} archetype={archetype} />
    </div>
  );
}
