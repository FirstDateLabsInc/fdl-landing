/**
 * Gating Components for Quiz Results
 *
 * These components handle content gating for the unlock feature.
 * They work with teaser data from ArchetypePublic - locked content
 * never reaches the client bundle.
 *
 * Usage:
 * - ListGate: For list-based content (datingCycle, redFlags, coachingFocus)
 * - SectionGate: For entire locked sections (datingMeaning)
 * - BlurOverlay: Low-level placeholder blur (used by ListGate)
 * - UnlockPromptCard: Shared CTA component (used by ListGate, SectionGate)
 */

export { ListGate } from "./ListGate";
export { SectionGate } from "./SectionGate";
export { BlurOverlay } from "./BlurOverlay";
export { UnlockPromptCard } from "./UnlockPromptCard";
