"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ProfileSummary } from "./ProfileSummary";
import { CategoryRadarChart } from "./CategoryRadarChart";
import { OverallRadarChart } from "./OverallRadarChart";
import { LoveLanguageSuggestions } from "./LoveLanguageSuggestions";
import { ShareResults } from "./ShareResults";
import { cn } from "@/lib/utils";
import type { QuizResults } from "@/lib/quiz/types";
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

  // Generate share URL
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      const hash = btoa(archetype.id).replace(/=/g, "");
      return `${window.location.origin}/quiz/results?id=${hash}`;
    }
    return "";
  }, [archetype.id]);

  // Prepare attachment dimensions for radar chart
  const attachmentDimensions = useMemo(
    () =>
      Object.entries(results.attachment.scores).map(([name, value]) => ({
        label: name,
        value,
        isPrimary: name === results.attachment.primary,
      })),
    [results.attachment]
  );

  // Prepare communication dimensions for radar chart
  const communicationDimensions = useMemo(
    () =>
      Object.entries(results.communication.scores).map(([name, value]) => ({
        label: name,
        value,
        isPrimary: name === results.communication.primary,
      })),
    [results.communication]
  );

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
    <div
      className={cn(
        "mx-auto w-full max-w-4xl space-y-2 px-4 py-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* SECTION 1: Profile Summary (Archetype) */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <ProfileSummary archetype={archetype} />
      </motion.section>

      {/* SECTION 2: Overall Radar Chart */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <OverallRadarChart results={results} />
      </motion.section>

      {/* SECTION 3: Attachment Style Radar Chart */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <CategoryRadarChart
          title="Attachment Style"
          subtitle="How you connect emotionally with others"
          dimensions={attachmentDimensions}
          primaryLabel="Primary Style"
          accentColor="#cab5d4"
          fillColor="#f9d544"
        />
      </motion.section>

      {/* SECTION 4: Communication Style Radar Chart */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <CategoryRadarChart
          title="Communication Style"
          subtitle="How you express yourself in relationships"
          dimensions={communicationDimensions}
          primaryLabel="Primary Style"
          accentColor="#60a5fa"
          fillColor="#34d399"
        />
      </motion.section>

      {/* SECTION 5: Love Language Suggestions */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <LoveLanguageSuggestions loveLanguages={results.loveLanguages} />
      </motion.section>

      {/* SECTION 6: Share Results */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-br from-[#fffdf6] via-white to-[#f9d544]/5 p-3">
          <ShareResults shareUrl={shareUrl} archetype={archetype.name} />
        </div>
      </motion.section>
    </div>
  );
}
