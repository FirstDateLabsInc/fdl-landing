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
