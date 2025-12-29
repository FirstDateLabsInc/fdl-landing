"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizNavigation } from "./QuizNavigation";
import { QuizStatement } from "./QuizStatement";
import { useQuiz } from "@/hooks/use-quiz";
import { useFlushOnHide } from "@/hooks/use-flush-on-hide";
import { serializeAnswers } from "@/lib/quiz/utils/answer-transform";
import { getArchetypeById } from "@/lib/quiz/data/archetypes";
import { generateFingerprintHash } from "@/lib/fingerprint";
import {
  trackQuizStart,
  trackQuizStepView,
  trackQuizStepComplete,
  trackQuizComplete,
  trackQuizDropout,
} from "@/lib/analytics";
import type { QuizResults } from "@/lib/quiz/types";
import type { ArchetypePublic } from "@/lib/quiz/archetypes";
import type { CreateSessionResponse, SubmitQuizRequest, SubmitQuizResponse } from "@/lib/api/quiz";
import { cn } from "@/lib/utils";

interface QuizContainerProps {
  onComplete: (
    results: QuizResults,
    archetype: ArchetypePublic,
    resultId: string
  ) => void;
}

export function QuizContainer({ onComplete }: QuizContainerProps) {
  const {
    responses,
    currentPageQuestions,
    currentPage,
    totalPages,
    setResponse,
    setSessionId,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isLastPage,
    progress,
    clearProgress,
    state,
  } = useQuiz();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string>("");
  const sessionInitRef = useRef(false);
  const submitInFlightRef = useRef(false);

  // Analytics tracking refs
  const hasTrackedStartRef = useRef(false);
  const stepEnterTimeRef = useRef(Date.now());
  const quizStartTimeRef = useRef(0);
  const quizCompletedRef = useRef(false);
  const lastTrackedPageRef = useRef(-1);

  // Generate fingerprint and validate session on mount (runs once)
  useEffect(() => {
    if (sessionInitRef.current) return;
    sessionInitRef.current = true;

    async function initSession() {
      try {
        const fp = await generateFingerprintHash();
        setFingerprint(fp);

        // Validate session with server (pass existing client sessionId for resume)
        const res = await fetch("/api/quiz/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fingerprintHash: fp,
            existingSessionId: state.sessionId,
          }),
        });

        // Handle rate limiting - silently continue with existing session
        if (res.status === 429) {
          console.warn("Session creation rate limited");
          return;
        }

        if (res.ok) {
          const data = (await res.json()) as CreateSessionResponse;
          if (data.sessionId) {
            setSessionId(data.sessionId);
          }
        }
      } catch (err) {
        console.error("Session initialization failed:", err);
        // Continue with client-generated sessionId as fallback
      }
    }
    initSession();
  }, [state.sessionId, setSessionId]);

  // Track step views when page changes
  useEffect(() => {
    // Only track if this is a new page we haven't tracked yet
    if (currentPage !== lastTrackedPageRef.current) {
      lastTrackedPageRef.current = currentPage;
      stepEnterTimeRef.current = Date.now();
      trackQuizStepView({
        stepIndex: currentPage,
        totalSteps: totalPages,
      });
    }
  }, [currentPage, totalPages]);

  // Count answered questions for dropout tracking
  const answeredCount = Object.keys(responses).length;

  // Track dropout when user leaves before completing
  useFlushOnHide(() => {
    if (!quizCompletedRef.current && hasTrackedStartRef.current) {
      trackQuizDropout({
        lastStepIndex: currentPage,
        answeredCount,
        elapsedMs: Date.now() - quizStartTimeRef.current,
        reason: "page_hidden",
      });
    }
  });

  // Ref for the progress bar section to enable auto-scroll
  const progressRef = useRef<HTMLDivElement>(null);

  // Refs for each question to enable auto-scroll to next unanswered
  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-scroll to progress bar when page changes (after user clicks Next/Back)
  useEffect(() => {
    if (progressRef.current && currentPage > 0) {
      // Smooth scroll to progress bar section (including % Complete text)
      progressRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  const handleValueChange = useCallback(
    (questionId: string) => (value: number | string) => {
      // Track quiz start on first answer
      if (!hasTrackedStartRef.current) {
        hasTrackedStartRef.current = true;
        quizStartTimeRef.current = Date.now();
        trackQuizStart({
          entrySource: state.utmSource || "direct",
          quizVersion: "v1",
        });
      }

      setResponse(questionId, value);

      // Auto-scroll to the next unanswered question after answering
      // Use double rAF to wait for React re-render and animation start
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Find first unanswered EXCLUDING the one we just answered
          // (responses is stale in this closure, so we exclude questionId)
          const nextUnanswered = currentPageQuestions.find(
            (q) =>
              q.id !== questionId &&
              (responses[q.id] === undefined || responses[q.id] === null)
          );

          if (nextUnanswered) {
            const ref = questionRefs.current.get(nextUnanswered.id);
            ref?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    },
    [setResponse, currentPageQuestions, responses, state.utmSource]
  );

  // Wrap goToNext to track step completion
  const handleNext = useCallback(() => {
    // Track step completion before navigating
    const stepTime = Date.now() - stepEnterTimeRef.current;
    const answersOnStep = currentPageQuestions.filter(
      (q) => responses[q.id] !== undefined && responses[q.id] !== null
    ).length;

    trackQuizStepComplete({
      stepIndex: currentPage,
      stepTimeMs: stepTime,
      answersOnStep,
    });

    goToNext();
  }, [currentPage, currentPageQuestions, responses, goToNext]);

  const handleSubmit = useCallback(async () => {
    if (submitInFlightRef.current) return;
    submitInFlightRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Serialize answers for server-side scoring
      const answerMap = serializeAnswers(responses);

      // Calculate duration from FIRST ANSWER to submission (not page load)
      // This measures actual quiz-taking time, excluding idle time before starting
      const responseTimestamps = Object.values(responses)
        .map(r => r.timestamp)
        .filter((t): t is number => typeof t === "number");
      const firstAnswerTime = responseTimestamps.length > 0
        ? Math.min(...responseTimestamps)
        : Date.now();
      const durationSeconds = Math.round((Date.now() - firstAnswerTime) / 1000);

      const payload: SubmitQuizRequest = {
        sessionId: state.sessionId,
        fingerprintHash: fingerprint,
        answers: answerMap,
        durationSeconds,
        // UTM params captured at quiz start (from state, not current URL)
        utmSource: state.utmSource,
        utmMedium: state.utmMedium,
        utmCampaign: state.utmCampaign,
      };

      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Handle rate limiting specifically
        if (res.status === 429) {
          throw new Error(
            "You're submitting too quickly. Please wait a moment and try again."
          );
        }

        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
          errorCode?: string;
        };

        // Also check for rate limit in response body
        if (errorData.errorCode === "RATE_LIMITED") {
          throw new Error(
            "You're submitting too quickly. Please wait a moment and try again."
          );
        }

        throw new Error(errorData.error || "Server error");
      }

      const serverData = (await res.json()) as SubmitQuizResponse;

      if (
        serverData?.scores &&
        serverData.archetypeSlug &&
        serverData.resultId
      ) {
        const archetype = getArchetypeById(serverData.archetypeSlug);
        if (archetype) {
          // Mark quiz as completed to prevent dropout tracking
          quizCompletedRef.current = true;

          // Track quiz completion
          trackQuizComplete({
            totalDurationMs: Date.now() - quizStartTimeRef.current,
            archetypeId: serverData.archetypeSlug,
            quizVersion: "v1",
          });

          clearProgress();
          onComplete(
            serverData.scores as unknown as QuizResults,
            archetype,
            serverData.resultId
          );
          return;
        }
      }

      // Server returned invalid data
      throw new Error("Invalid server response");
    } catch (err) {
      console.error("Quiz submission failed", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      submitInFlightRef.current = false;
    }
  }, [responses, state.sessionId, state.utmSource, state.utmMedium, state.utmCampaign, fingerprint, clearProgress, onComplete]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      {/* 3-Step Info Cards - At the very top */}
      <div className="mb-8">
        <QuizStatement scrollAnchorRef={progressRef} />
      </div>

      <div>
        <QuizProgress
          currentPage={currentPage}
          totalPages={totalPages}
          overallProgress={progress}
        />
      </div>

      {/* Questions Section */}
      <div className="flex flex-1 items-start py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-16"
          >
            {/* Find the first unanswered question on this page (O(n) single pass) */}
            {(() => {
              const firstUnansweredIndex = currentPageQuestions.findIndex(
                (q) => responses[q.id] === undefined || responses[q.id] === null
              );
              return currentPageQuestions.map((question, index) => (
                <div
                  key={question.id}
                  ref={(el) => {
                    if (el) questionRefs.current.set(question.id, el);
                  }}
                  className={cn(
                    "w-full transition-opacity duration-300",
                    // Dim all questions except the first unanswered (current focus)
                    firstUnansweredIndex !== -1 &&
                      index !== firstUnansweredIndex &&
                      "opacity-40"
                  )}
                >
                  <QuizQuestion
                    question={question}
                    value={
                      question.type === "scenario"
                        ? (responses[question.id]?.selectedKey ?? null)
                        : (responses[question.id]?.value ?? null)
                    }
                    onValueChange={handleValueChange(question.id)}
                    disableAnimation={true}
                  />
                </div>
              ));
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {submitError}
        </div>
      )}

      <QuizNavigation
        canGoBack={canGoPrevious}
        canGoNext={canGoNext}
        isLastQuestion={isLastPage}
        onBack={goToPrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        className="pb-4"
      />
    </div>
  );
}
