// app/src/lib/quiz/data/archetypes/selectors.ts
// CLIENT-SAFE: Only public data selectors - never import locked content here

import type { Archetype, QuizResults } from "../../types";
import type { ArchetypePublic } from "./types";
import { archetypesPublic } from "./public";
import { getArchetypeByProbability } from "./joint-probability";

// Re-export for consumers who need confidence/balanced info
export {
  computeArchetypeByProbability,
  type ArchetypeResult,
} from "./joint-probability";

/**
 * Get PUBLIC archetype from quiz results using joint probability algorithm.
 *
 * Uses P(attachment) × P(communication) to find the most probable archetype
 * cell, with epsilon-based tie-breaking for deterministic results.
 *
 * For confidence/balanced info, use computeArchetypeByProbability() directly.
 *
 * NOTE: Returns only PUBLIC data - safe for client-side use.
 */
export function getArchetype(results: QuizResults): ArchetypePublic {
  return getArchetypeByProbability(results);
}

/**
 * Get PUBLIC archetype data by ID.
 * Safe for client-side use - no locked content.
 */
export function getPublicArchetypeById(id: string): ArchetypePublic | undefined {
  return archetypesPublic.find((a) => a.id === id);
}

/**
 * Get all PUBLIC archetypes.
 * Safe for client-side use - no locked content.
 */
export function getAllPublicArchetypes(): ArchetypePublic[] {
  return [...archetypesPublic];
}

/**
 * Extract base Archetype fields from PUBLIC archetype.
 */
export function toArchetype(definition: ArchetypePublic): Archetype {
  return {
    name: definition.name,
    emoji: definition.emoji,
    summary: definition.summary,
    image: definition.image,
  };
}

// ============================================================================
// LEGACY ALIASES (deprecated - use new names)
// ============================================================================

/**
 * @deprecated Use getPublicArchetypeById instead
 */
export const getArchetypeById = getPublicArchetypeById;

/**
 * @deprecated Use getAllPublicArchetypes instead
 */
export const getAllArchetypes = getAllPublicArchetypes;
