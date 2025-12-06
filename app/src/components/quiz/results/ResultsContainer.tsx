"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ProfileSummary } from "./ProfileSummary";
import { CategoryRadarChart } from "./CategoryRadarChart";
import { OverallRadarChart } from "./OverallRadarChart";
import { LoveLanguageSuggestions } from "./LoveLanguageSuggestions";
import { ShareResults } from "./ShareResults";
import { NumberedSection } from "./NumberedSection";
import { TraitGrid } from "./TraitGrid";
import { DatingCycleVisual } from "./DatingCycleVisual";
import { RedFlagsList } from "./RedFlagsList";
import { CoachingFocusList } from "./CoachingFocusList";
import { ResultsNavSidebar, SECTIONS } from "./ResultsNavSidebar";
import { MobileFloatingNav } from "./MobileFloatingNav";
import { cn } from "@/lib/utils";
import type { QuizResults, AttachmentDimension, CommunicationStyle } from "@/lib/quiz/types";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

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
        <ProfileSummary archetype={archetype} />
      </motion.section>

      {/* MAIN CONTENT: 2-column layout */}
      <div className="flex gap-8">
        {/* Left Column: Scrollable Content */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Section 1: Pattern Recognition */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <NumberedSection number={1} title="The Pattern You Recognize" id="pattern">
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-foreground">
                  {archetype.patternDescription}
                </p>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                    Your Dating Cycle
                  </h3>
                  <DatingCycleVisual steps={archetype.datingCycle} />
                </div>
              </div>
            </NumberedSection>
          </motion.div>

          {/* Section 2: Root Cause */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <NumberedSection number={2} title="Where This Comes From" id="root-cause">
              <div className="rounded-xl bg-card p-5 shadow-soft">
                <p className="text-base leading-relaxed text-foreground">
                  {archetype.rootCause}
                </p>
              </div>
            </NumberedSection>
          </motion.div>

          {/* Section 3: Dating Meaning (Strengths + Challenges) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <NumberedSection number={3} title="What This Means for Dating" id="dating-meaning">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">✓</span>
                    Your Strengths
                  </h3>
                  <TraitGrid items={archetype.datingMeaning.strengths} type="strength" />
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">!</span>
                    Your Challenges
                  </h3>
                  <TraitGrid items={archetype.datingMeaning.challenges} type="challenge" />
                </div>
              </div>
            </NumberedSection>
          </motion.div>

          {/* Section 4: Red Flags */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <NumberedSection number={4} title="When This Goes Wrong" id="red-flags">
              <RedFlagsList items={archetype.redFlags} />
            </NumberedSection>
          </motion.div>

          {/* Section 5: Coaching Focus */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <NumberedSection number={5} title="Your Coaching Focus" id="coaching">
              <CoachingFocusList
                items={archetype.coachingFocus}
                ctaText={archetype.callToActionCopy}
              />
            </NumberedSection>
          </motion.div>

          {/* Section 6: Dating Profile (Radar Charts) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <NumberedSection number={6} title="Your Dating Profile" id="profile">
              <div className="space-y-6">
                <OverallRadarChart results={results} />
                <div className="grid gap-4 sm:grid-cols-2">
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
            </NumberedSection>
          </motion.div>

          {/* Section 7: Love Languages */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <NumberedSection number={7} title="Your Love Languages" id="love-languages">
              <LoveLanguageSuggestions loveLanguages={results.loveLanguages} />
            </NumberedSection>
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
