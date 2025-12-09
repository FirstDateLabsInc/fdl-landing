/**
 * Quiz Library
 *
 * Central export for all quiz-related types, data, and utilities.
 */

// Types
export * from './types';

// Questions data
export {
  quizSections,
  allQuestions,
  totalQuestions,
  getQuestionById,
  getSectionById,
  getSectionForQuestion,
} from './questions';

// Scoring functions
export {
  scoreAttachment,
  scoreCommunication,
  scoreConfidence,
  scoreEmotionalAvailability,
  scoreIntimacy,
  scoreLoveLanguages,
  calculateAllResults,
  getResponseMap,
  mapToResponses,
  isQuizComplete,
  getCompletionPercentage,
} from './scoring';

// Archetype system
export {
  getArchetype,
  getArchetypeById,
  getAllArchetypes,
  toArchetype,
  type ArchetypeDefinition,
} from './archetypes';

// DB score shape (metrics only)
export type { DBScores } from './types-db';
