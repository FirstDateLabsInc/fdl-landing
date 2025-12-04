"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ProfileSummary } from "./ProfileSummary";
import { RadarChart } from "./RadarChart";
import { ResultCard, type DimensionData, type RankedData } from "./ResultCard";
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

  // Generate share URL (using base64 encoded archetype ID for simplicity)
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      const hash = btoa(archetype.id).replace(/=/g, "");
      return `${window.location.origin}/quiz/results?id=${hash}`;
    }
    return "";
  }, [archetype.id]);

  // Prepare radar chart dimensions
  const radarDimensions = useMemo(
    () => [
      { label: "Attachment", value: results.attachment.scores.secure },
      { label: "Communication", value: results.communication.scores.assertive },
      { label: "Confidence", value: results.confidence },
      { label: "Emotional", value: results.emotional },
      { label: "Intimacy", value: results.intimacy.comfort },
      { label: "Boundaries", value: results.intimacy.boundaries },
    ],
    [results]
  );

  // Prepare attachment dimensions
  const attachmentDimensions: DimensionData[] = useMemo(
    () =>
      Object.entries(results.attachment.scores).map(([name, value]) => ({
        name,
        value,
        isPrimary: name === results.attachment.primary,
      })),
    [results.attachment]
  );

  // Prepare communication dimensions
  const communicationDimensions: DimensionData[] = useMemo(
    () =>
      Object.entries(results.communication.scores).map(([name, value]) => ({
        name,
        value,
        isPrimary: name === results.communication.primary,
      })),
    [results.communication]
  );

  // Prepare love languages ranked list
  const loveLanguagesRanked: RankedData[] = useMemo(
    () =>
      results.loveLanguages.ranked.map((lang, index) => ({
        rank: index + 1,
        name: lang,
        value: results.loveLanguages.scores[lang],
      })),
    [results.loveLanguages]
  );

  // Animation variants for staggered card reveal
  const containerVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
          },
        },
      };

  const cardVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Hero section: Archetype + Radar Chart */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProfileSummary archetype={archetype} />
        <div className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-soft">
          <RadarChart dimensions={radarDimensions} />
        </div>
      </div>

      {/* Result cards grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <ResultCard
            type="dimensions"
            title="Attachment Style"
            description="How you connect with others emotionally"
            data={attachmentDimensions}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ResultCard
            type="dimensions"
            title="Communication Style"
            description="How you express yourself in relationships"
            data={communicationDimensions}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ResultCard
            type="score"
            title="Dating Confidence"
            description="Your self-assurance in dating situations"
            data={{ value: results.confidence }}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ResultCard
            type="score"
            title="Emotional Availability"
            description="Your capacity for emotional connection"
            data={{ value: results.emotional }}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ResultCard
            type="score"
            title="Intimacy Comfort"
            description="How comfortable you are with closeness"
            data={{ value: results.intimacy.comfort }}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ResultCard
            type="score"
            title="Boundary Assertiveness"
            description="Your ability to set healthy boundaries"
            data={{ value: results.intimacy.boundaries }}
          />
        </motion.div>

        <motion.div variants={cardVariants} className="sm:col-span-2">
          <ResultCard
            type="ranked"
            title="Love Languages"
            description="How you prefer to give and receive love"
            data={loveLanguagesRanked}
          />
        </motion.div>
      </motion.div>

      {/* Share section */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <ShareResults shareUrl={shareUrl} archetype={archetype.name} />
      </div>
    </div>
  );
}
