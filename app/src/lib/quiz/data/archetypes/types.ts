import type { Archetype } from "../../types";

// ============================================================================
// TIER 1: PUBLIC (safe for client bundle)
// ============================================================================

/**
 * Public archetype data that is safe to include in the client bundle.
 * Contains identifying info, summary text, and teaser counts for gated sections.
 */
export interface ArchetypePublic extends Archetype {
  /** Unique archetype ID (e.g., 'golden-partner') */
  id: string;
  /** Main description of the dating pattern */
  patternDescription: string;
  /** Explanation of where this pattern comes from */
  rootCause: string;
  /** CTA copy for coaching prompt */
  callToActionCopy: string;

  // Teaser data for gating UI (PUBLIC - safe for client)
  /** First 3 steps of the dating cycle (for ListGate preview) */
  datingCycleTeaser: string[];
  /** Total count of dating cycle steps */
  datingCycleTotalCount: number;
  /** First 2 red flags (for ListGate preview) */
  redFlagsTeaser: string[];
  /** Total count of red flags */
  redFlagsTotalCount: number;
  /** Coaching focus areas (FREE - no longer gated) */
  coachingFocus: string[];
}

// ============================================================================
// TIER 2: LOCKED (server-only, never in client bundle)
// ============================================================================

/**
 * Locked archetype content that should NEVER reach the client bundle.
 * Import only from server components or API routes.
 */
export interface ArchetypeLocked {
  /** Full dating cycle steps */
  datingCycle: string[];
  /** What this pattern means for dating */
  datingMeaning: {
    strengths: string[];
    challenges: string[];
  };
  /** Full list of red flags to watch for */
  redFlags: string[];
  /** Coaching focus areas */
  coachingFocus: string[];
}

// ============================================================================
// TIER 3: FULL (union for server-side use only)
// ============================================================================

/**
 * Complete archetype data combining public and locked content.
 * Only use in server components or API routes.
 */
export interface ArchetypeFull extends ArchetypePublic, ArchetypeLocked {}

// ============================================================================
// LEGACY (deprecated - use specific tier types)
// ============================================================================

/**
 * @deprecated Use ArchetypePublic, ArchetypeLocked, or ArchetypeFull instead.
 * This type is maintained for migration compatibility but will be removed.
 */
export interface ArchetypeDefinition extends Archetype {
  id: string;
  patternDescription: string;
  datingCycle: string[];
  rootCause: string;
  datingMeaning: {
    strengths: string[];
    challenges: string[];
  };
  redFlags: string[];
  coachingFocus: string[];
  callToActionCopy: string;
}
