import type { Archetype, QuizResults } from "../../types";
import type { ArchetypeDefinition } from "./types";
import { archetypes } from "./definitions";
import { getArchetypeByProbability } from "./joint-probability";

// Re-export for consumers who need confidence/balanced info
export {
  computeArchetypeByProbability,
  type ArchetypeResult,
} from "./joint-probability";

/**
 * Get archetype from quiz results using joint probability algorithm.
 *
 * Uses P(attachment) × P(communication) to find the most probable archetype
 * cell, with epsilon-based tie-breaking for deterministic results.
 *
 * For confidence/balanced info, use computeArchetypeByProbability() directly.
 */
export function getArchetype(results: QuizResults): ArchetypeDefinition {
  return getArchetypeByProbability(results);
}

export function getArchetypeById(id: string): ArchetypeDefinition | undefined {
  return archetypes.find((a) => a.id === id);
}

export function getAllArchetypes(): ArchetypeDefinition[] {
  return [...archetypes];
}

export function toArchetype(definition: ArchetypeDefinition): Archetype {
  return {
    name: definition.name,
    emoji: definition.emoji,
    summary: definition.summary,
    image: definition.image,
  };
}
