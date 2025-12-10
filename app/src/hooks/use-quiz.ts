"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { AnswerState, QuizResponse, QuizQuestion } from "@/lib/quiz/types";
import { allQuestions, getSectionForQuestion } from "@/lib/quiz/questions";
import { toQuizResponses } from "@/lib/quiz/utils/answer-transform";

// ============================================================================
// TYPES
// ============================================================================

interface QuizState {
  sessionId: string;
  startedAt: number;
  currentPage: number;
  shuffledQuestionIds: string[];
  responses: AnswerState;
}

interface UseQuizReturn {
  state: QuizState;
  responses: AnswerState;
  currentPageQuestions: QuizQuestion[];
  currentPage: number;
  totalPages: number;
  setResponse: (questionId: string, value: number | string) => void;
  setSessionId: (serverSessionId: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastPage: boolean;
  progress: number;
  clearProgress: () => void;
  hasExistingProgress: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = "juliet-quiz-state";
const QUESTIONS_PER_PAGE = 6;
const TOTAL_PAGES = 8;

// ============================================================================
// HELPERS
// ============================================================================

function generateSessionId(): string {
  // Return empty string - server will provide the real UUID
  return "";
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createInitialState(): QuizState {
  const shuffledIds = shuffleArray(allQuestions.map(q => q.id));

  return {
    sessionId: generateSessionId(),
    startedAt: Date.now(),
    currentPage: 0,
    shuffledQuestionIds: shuffledIds,
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
      typeof parsed.currentPage !== "number" ||
      !Array.isArray(parsed.shuffledQuestionIds) ||
      parsed.shuffledQuestionIds.length !== 48 ||
      typeof parsed.responses !== "object"
    ) {
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Migrate legacy response map (number|string) into structured AnswerState
    const legacyResponses = parsed.responses as Record<string, unknown>;
    const responses: AnswerState = {};
    for (const [questionId, value] of Object.entries(legacyResponses)) {
      if (typeof value === "object" && value !== null && "value" in value) {
        const obj = value as { value?: number; selectedKey?: string; timestamp?: number };
        if (typeof obj.value === "number" && typeof obj.timestamp === "number") {
          responses[questionId] = {
            value: obj.value,
            selectedKey: typeof obj.selectedKey === "string" ? obj.selectedKey : undefined,
            timestamp: obj.timestamp,
          };
          continue;
        }
      }

      if (typeof value === "number" || typeof value === "string") {
        responses[questionId] = {
          value: typeof value === "number" ? value : 0,
          selectedKey: typeof value === "string" ? value : undefined,
          timestamp: Date.now(),
        };
      }
    }

    return {
      sessionId: parsed.sessionId,
      startedAt: parsed.startedAt,
      currentPage: parsed.currentPage,
      shuffledQuestionIds: parsed.shuffledQuestionIds,
      responses,
    };
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

  // Current page questions
  const currentPageQuestions = useMemo(() => {
    const startIndex = state.currentPage * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;

    return state.shuffledQuestionIds
      .slice(startIndex, endIndex)
      .map(id => allQuestions.find(q => q.id === id))
      .filter(Boolean) as QuizQuestion[];
  }, [state.currentPage, state.shuffledQuestionIds]);

  // Response handlers
  const setResponse = useCallback(
    (questionId: string, value: number | string) => {
      // O(1) write: overwrite the question entry with a fully-typed answer object
      setState((prev) => ({
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: {
            value: typeof value === "number" ? value : 0,
            selectedKey: typeof value === "string" ? value : undefined,
            timestamp: Date.now(),
          },
        },
      }));
    },
    []
  );

  // Navigation
  const goToNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, TOTAL_PAGES - 1),
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 0),
    }));
  }, []);

  // Navigation state
  const canGoPrevious = state.currentPage > 0;
  const isLastPage = state.currentPage === TOTAL_PAGES - 1;

  // Can go next only if all questions on current page are answered
  const canGoNext = useMemo(() => {
    return currentPageQuestions.every(q => {
      const response = state.responses[q.id];
      return response !== undefined && response !== null;
    });
  }, [state.responses, currentPageQuestions]);

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

  // Update sessionId with server-validated value
  const setSessionId = useCallback((serverSessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessionId: serverSessionId,
    }));
  }, []);

  return {
    state,
    responses: state.responses,
    currentPageQuestions,
    currentPage: state.currentPage,
    totalPages: TOTAL_PAGES,
    setResponse,
    setSessionId,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isLastPage,
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

  return toQuizResponses(state.responses);
}
