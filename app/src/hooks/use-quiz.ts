"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { QuizResponse, QuizQuestion } from "@/lib/quiz/types";
import { allQuestions, getSectionForQuestion } from "@/lib/quiz/questions";

// ============================================================================
// TYPES
// ============================================================================

interface QuizState {
  sessionId: string;
  startedAt: number;
  currentIndex: number;
  responses: Record<string, number | string>;
}

interface UseQuizReturn {
  state: QuizState;
  responses: Record<string, number | string>;
  currentQuestion: QuizQuestion;
  currentSection: string;
  currentSectionTitle: string;
  questionIndexInSection: number;
  totalQuestionsInSection: number;
  setResponse: (questionId: string, value: number | string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  progress: number;
  clearProgress: () => void;
  hasExistingProgress: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = "juliet-quiz-state";

// ============================================================================
// HELPERS
// ============================================================================

function generateSessionId(): string {
  return `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createInitialState(): QuizState {
  return {
    sessionId: generateSessionId(),
    startedAt: Date.now(),
    currentIndex: 0,
    responses: {},
  };
}

function saveToStorage(state: QuizState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is unavailable
    console.warn("Failed to save quiz progress to localStorage");
  }
}

function loadFromStorage(): QuizState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate structure
    if (
      typeof parsed.sessionId !== "string" ||
      typeof parsed.startedAt !== "number" ||
      typeof parsed.currentIndex !== "number" ||
      typeof parsed.responses !== "object"
    ) {
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed as QuizState;
  } catch {
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    return null;
  }
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

function checkExistingProgress(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

// ============================================================================
// HOOK
// ============================================================================

export function useQuiz(resume = true): UseQuizReturn {
  const [state, setState] = useState<QuizState>(() => {
    if (resume) {
      const saved = loadFromStorage();
      if (saved) return saved;
    }
    return createInitialState();
  });

  const [hasExistingProgress] = useState(() => checkExistingProgress());

  // Auto-save on state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Current question data
  const currentQuestion = useMemo(
    () => allQuestions[state.currentIndex] ?? allQuestions[0],
    [state.currentIndex]
  );

  // Section info
  const sectionInfo = useMemo(() => {
    const section = getSectionForQuestion(currentQuestion.id);
    if (!section) {
      return {
        id: "unknown",
        title: "Unknown Section",
        questionIndex: 0,
        totalQuestions: 1,
      };
    }

    const questionIndex = section.questions.findIndex(
      (q) => q.id === currentQuestion.id
    );

    return {
      id: section.id,
      title: section.title,
      questionIndex: questionIndex >= 0 ? questionIndex : 0,
      totalQuestions: section.questions.length,
    };
  }, [currentQuestion]);

  // Response handlers
  const setResponse = useCallback(
    (questionId: string, value: number | string) => {
      setState((prev) => ({
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: value,
        },
      }));
    },
    []
  );

  // Navigation
  const goToNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, allQuestions.length - 1),
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, []);

  // Navigation state
  const canGoPrevious = state.currentIndex > 0;
  const isLastQuestion = state.currentIndex === allQuestions.length - 1;

  // Can go next only if current question is answered
  const canGoNext = useMemo(() => {
    const currentResponse = state.responses[currentQuestion.id];
    return currentResponse !== undefined && currentResponse !== null;
  }, [state.responses, currentQuestion.id]);

  // Progress percentage
  const progress = useMemo(() => {
    const answeredCount = Object.keys(state.responses).length;
    return Math.round((answeredCount / allQuestions.length) * 100);
  }, [state.responses]);

  // Clear progress
  const clearProgress = useCallback(() => {
    clearStorage();
    setState(createInitialState());
  }, []);

  return {
    state,
    responses: state.responses,
    currentQuestion,
    currentSection: sectionInfo.id,
    currentSectionTitle: sectionInfo.title,
    questionIndexInSection: sectionInfo.questionIndex,
    totalQuestionsInSection: sectionInfo.totalQuestions,
    setResponse,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    progress,
    clearProgress,
    hasExistingProgress,
  };
}

// ============================================================================
// STATIC HELPERS (for use outside the hook)
// ============================================================================

export function hasQuizProgress(): boolean {
  return checkExistingProgress();
}

export function clearQuizProgress(): void {
  clearStorage();
}

export function getQuizResponses(): QuizResponse[] | null {
  const state = loadFromStorage();
  if (!state) return null;

  const now = Date.now();
  return Object.entries(state.responses).map(([questionId, value]) => ({
    questionId,
    value: typeof value === "number" ? value : 0,
    selectedKey: typeof value === "string" ? value : undefined,
    timestamp: now,
  }));
}
