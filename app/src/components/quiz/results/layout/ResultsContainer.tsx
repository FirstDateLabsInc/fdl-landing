"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { ArchetypeHero } from "../sections/ArchetypeHero";
import { CategoryRadarChart } from "../charts/CategoryRadarChart";
import { LoveLanguageSuggestions } from "../sections/LoveLanguageSuggestions";
import { ScoreInsightsSection } from "../sections/ScoreInsightsSection";
import { ShareResults } from "../sections/ShareResults";
import { QuizWaitlistSection } from "../sections/QuizWaitlistSection";
import { ContentSection } from "./ContentSection";
import { TraitGrid } from "../sections/TraitGrid";
import { DatingCycleVisual } from "../sections/DatingCycleVisual";
import { RedFlagsList } from "../sections/RedFlagsList";
import { CoachingFocusList } from "../sections/CoachingFocusList";
import { ResultsNavSidebar, SECTIONS } from "./ResultsNavSidebar";
import { MobileFloatingNav } from "./MobileFloatingNav";
import { cn } from "@/lib/utils";
import type { QuizResults, AttachmentDimension, CommunicationStyle } from "@/lib/quiz/types";
import { ARCHETYPE_MATRIX, computeArchetypeByProbability, getArchetypeById, type ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface ResultsContainerProps {
  results: QuizResults;
  archetype: ArchetypeDefinition;
  quizResultId?: string;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ResultsContainer({
  results,
  archetype,
  quizResultId,
  className,
}: ResultsContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Track active section for sidebar
  const [activeSection, setActiveSection] = useState("pattern");

  const scrollToId = useCallback((id: string, fallbackHref?: string) => {
    const element = document.getElementById(id);
    if (!element) {
      if (fallbackHref) window.location.assign(fallbackHref);
      return;
    }
    const offset = 120; // account for sticky navbar
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

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

  // Generate share URL - null when unavailable (no broken fallback URLs)
  const shareUrl = useMemo((): string | null => {
    if (typeof window === "undefined" || !quizResultId) {
      return null;
    }
    return `${window.location.origin}/quiz/results/${quizResultId}`;
  }, [quizResultId]);

  const archetypeSignals = useMemo(
    () => computeArchetypeByProbability(results, true),
    [results]
  );

  const blendedNotice = useMemo(() => {
    const confidence = archetypeSignals.confidence;
    const isBalanced = archetypeSignals.isBalanced;

    // Only show when the profile isn't sharply differentiated
    const show = isBalanced || confidence < 0.35;

    // Suggest a couple nearby archetypes (excluding the current match)
    const alternatives: string[] = [];
    const seen = new Set<string>([archetype.id]);

    if (show && archetypeSignals.debug?.topCells) {
      for (const cell of archetypeSignals.debug.topCells) {
        const id = ARCHETYPE_MATRIX[cell.attachment][cell.communication];
        if (seen.has(id)) continue;
        seen.add(id);
        alternatives.push(getArchetypeById(id)?.name ?? id);
        if (alternatives.length >= 2) break;
      }
    }

    return { show, confidence, isBalanced, alternatives };
  }, [archetypeSignals, archetype.id]);

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
  const sectionVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
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
        <ArchetypeHero archetype={archetype} results={results} />
      </motion.section>

      {/* Blended profile notice (low-confidence or evenly distributed results) */}
      {blendedNotice.show && (
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="rounded-2xl bg-secondary/15 p-5 shadow-soft">
            <p className="text-sm font-semibold text-foreground">
              Your profile is nuanced
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Your answers were close across multiple styles. This is your
              strongest match, but you may relate to more than one archetype.
            </p>
            {blendedNotice.alternatives.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Close matches:{" "}
                <span className="font-medium text-foreground">
                  {blendedNotice.alternatives.join(", ")}
                </span>
              </p>
            )}
          </div>
        </motion.section>
      )}

      {/* MAIN CONTENT: 2-column layout */}
      <div className="flex gap-8">
        {/* Left Column: Scrollable Content */}
        <div className="min-w-0 flex-1 space-y-16">
          {/* Section 1: Your Story (Pattern + Origin + Cycle) */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <ContentSection
              title="Your Dating Pattern"
              id="pattern"
              eyebrow="Your Story"
              sectionNumber={1}
            >
              {/* Part 1: Overview - hooks with recognition */}
              <p className="text-lg leading-relaxed text-slate-700">
                {archetype.patternDescription}
              </p>

              {/* Part 2: Origin - provides the "why" */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Where This Comes From
                </h3>
                <p className="text-lg leading-relaxed text-slate-600">
                  {archetype.rootCause}
                </p>
              </div>

              {/* Part 3: The Cycle - evidence after context */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  How This Plays Out
                </h3>
                <DatingCycleVisual steps={archetype.datingCycle} />
              </div>
            </ContentSection>
          </motion.div>

          {/* Section 2: Dating Profile (Radar Charts) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <ContentSection
              title="Your Dating Profile"
              id="profile"
              eyebrow="Deep Dive"
              sectionNumber={2}
            >
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
            </ContentSection>
          </motion.div>

          {/* Section 3: Score Insights */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <ContentSection
              title="Understanding Your Scores"
              id="score-insights"
              eyebrow="Insights"
              sectionNumber={3}
            >
              <ScoreInsightsSection results={results} />
            </ContentSection>
          </motion.div>

          {/* Section 4: Dating Meaning (Strengths + Challenges) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
          >
            <ContentSection
              title="What This Means for Dating"
              id="dating-meaning"
              eyebrow="Analysis"
              sectionNumber={4}
            >
              <div className="mb-8 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/quiz/dating-meaning-illustration.png"
                  alt="Dating personality illustration"
                  width={500}
                  height={300}
                  className="rounded-xl object-cover"
                />
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700">Strengths</h3>
                  <TraitGrid items={archetype.datingMeaning.strengths} type="strength" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700">Growth Areas</h3>
                  <TraitGrid items={archetype.datingMeaning.challenges} type="challenge" />
                </div>
              </div>
            </ContentSection>
          </motion.div>

          {/* Section 5: Red Flags */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <ContentSection
              title="When This Goes Wrong"
              id="red-flags"
              eyebrow="Warning Signs"
              sectionNumber={5}
            >
              <RedFlagsList items={archetype.redFlags} />
            </ContentSection>
          </motion.div>

          {/* Section 6: Coaching Focus */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
          >
            <ContentSection
              title="Your Coaching Focus"
              id="coaching"
              eyebrow="Growth Plan"
              sectionNumber={6}
            >
              <CoachingFocusList
                items={archetype.coachingFocus}
                ctaText={archetype.callToActionCopy}
                onCtaClick={() => scrollToId("full-picture", "/#waitlist")}
              />
            </ContentSection>
          </motion.div>

          {/* Section 7: Love Languages */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <ContentSection
              title="Your Love Languages"
              id="love-languages"
              eyebrow="Connection"
              sectionNumber={7}
            >
              <div className="mb-8 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/quiz/red-flags-illustration.png"
                  alt="Red flags illustration"
                  width={500}
                  height={300}
                  className="rounded-xl object-cover"
                />
              </div>
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
            <div id="share-results" className="rounded-2xl bg-white p-6 shadow-sm">
              <ShareResults shareUrl={shareUrl} archetype={archetype.name} />
            </div>
          </motion.div>

          {/* Waitlist Signup - Only show if we have a quiz result ID */}
          {quizResultId && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <div id="full-picture">
                <QuizWaitlistSection
                  quizResultId={quizResultId}
                  archetypeName={archetype.name}
                  archetypeEmoji={archetype.emoji}
                />
              </div>
            </motion.div>
          )}
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
