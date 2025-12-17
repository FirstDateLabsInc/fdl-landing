// app/src/lib/quiz/sections.policy.ts
// CLIENT-SAFE: Contains only configuration, no locked content
//
// Centralized policy for which quiz result sections are locked/free.
// Change lock decisions here - UI components read this configuration.

/**
 * Section lock configuration
 */
export const SECTION_POLICY = {
  /** Hero section with archetype name + radar chart */
  hero: { locked: false },

  /** "Your Dating Pattern" paragraph description */
  pattern: { locked: false },

  /** Dating Cycle visual steps - show 2 teasers */
  datingCycle: { locked: true, teaserCount: 2 },

  /** "Where This Comes From" root cause explanation */
  rootCause: { locked: false },

  /** Dating Profile radar charts */
  profile: { locked: false },

  /** Score insights - bars visible, meaning/next steps locked */
  scoreInsights: { locked: true, showBars: true },

  /** "What This Means for Dating" strengths/challenges */
  datingMeaning: { locked: true },

  /** Red flags section - show 1 teaser */
  redFlags: { locked: true, teaserCount: 1 },

  /** Coaching focus areas */
  coachingFocus: { locked: true },

  /** Love Languages section */
  loveLanguages: { locked: false },
} as const;

export type SectionId = keyof typeof SECTION_POLICY;
export type SectionConfig = (typeof SECTION_POLICY)[SectionId];

/**
 * Check if a section is locked by default.
 * Used by UI components to determine gating behavior.
 */
export function isSectionLocked(sectionId: SectionId): boolean {
  return SECTION_POLICY[sectionId].locked;
}

/**
 * Get the teaser count for a locked section.
 * Returns 0 for FREE sections or sections without teaserCount.
 */
export function getTeaserCount(sectionId: SectionId): number {
  const config = SECTION_POLICY[sectionId];
  return "teaserCount" in config ? config.teaserCount : 0;
}

/**
 * Get all locked section IDs.
 */
export function getLockedSections(): SectionId[] {
  return (Object.keys(SECTION_POLICY) as SectionId[]).filter(
    (id) => SECTION_POLICY[id].locked
  );
}

/**
 * Get all free (unlocked) section IDs.
 */
export function getFreeSections(): SectionId[] {
  return (Object.keys(SECTION_POLICY) as SectionId[]).filter(
    (id) => !SECTION_POLICY[id].locked
  );
}
