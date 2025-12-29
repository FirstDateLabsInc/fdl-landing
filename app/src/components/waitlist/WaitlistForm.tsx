"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Turnstile } from "@/components/ui/turnstile";
import { cn } from "@/lib/utils";
import { trackWaitlistStart, trackGenerateLead } from "@/lib/analytics";
import type {
  JoinWaitlistRequest,
  JoinWaitlistResponse,
} from "@/lib/api/waitlist";

const waitlistSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  /** Source identifier for tracking (e.g., 'web-hero', 'web-cta'). Defaults to 'web' */
  source?: string;
  quizResultId?: string;
  archetypeName?: string;
  archetypeEmoji?: string;
  className?: string;
  variant?: "default" | "inline";
}

export function WaitlistForm({
  source,
  quizResultId,
  archetypeName,
  archetypeEmoji,
  className,
  variant = "default",
}: WaitlistFormProps) {
  const isInline = variant === "inline";
  const idPrefix = isInline ? "hero-email" : "email";
  const formLocation = quizResultId ? "quiz_results" : source || "web";
  const hasTrackedStartRef = useRef(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "already-subscribed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  // Use key to reset Turnstile widget by forcing remount
  const [turnstileKey, setTurnstileKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  // Track when user first focuses on email field
  const handleEmailFocus = () => {
    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      trackWaitlistStart({ formLocation });
    }
  };

  const onSubmit = async (data: WaitlistFormData) => {
    setStatus("loading");
    setErrorMessage("");

    // Capture UTM params from URL
    const params = new URLSearchParams(window.location.search);

    const payload: JoinWaitlistRequest = {
      email: data.email,
      source: quizResultId ? "quiz" : (source || "web"),
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined,
      quizResultId,
      archetypeName,
      archetypeEmoji,
      turnstileToken: turnstileToken || undefined,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle rate limiting before parsing JSON
      if (res.status === 429) {
        setStatus("error");
        setErrorMessage(
          "Too many attempts. Please wait a minute and try again."
        );
        return;
      }

      const result: JoinWaitlistResponse = await res.json();

      if (result.success) {
        setStatus(result.isNew ? "success" : "already-subscribed");
        reset();
        // Track successful lead generation (no PII!)
        trackGenerateLead({
          formLocation,
          hasQuizResult: !!quizResultId,
          archetypeId: archetypeName,
        });
      } else {
        setStatus("error");
        // Reset turnstile on error so user can retry
        setTurnstileKey((k) => k + 1);
        setTurnstileToken("");
        // Handle rate limit from response body
        if (
          (result as { errorCode?: string }).errorCode === "RATE_LIMITED"
        ) {
          setErrorMessage(
            "Too many attempts. Please wait a minute and try again."
          );
        } else {
          setErrorMessage(result.error || "Something went wrong");
        }
      }
    } catch {
      setStatus("error");
      // Reset turnstile on error so user can retry
      setTurnstileKey((k) => k + 1);
      setTurnstileToken("");
      setErrorMessage("Network error. Please try again.");
    }
  };

  // Success state - new signup
  if (status === "success") {
    return (
      <div
        className={cn(
          "relative flex flex-col gap-2 rounded-2xl bg-card/85 p-4 shadow-soft sm:rounded-3xl sm:p-5 md:p-6",
          className
        )}
      >
        <p className="text-lg font-semibold text-foreground sm:text-xl">
          You&apos;re on the list!
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          {quizResultId
            ? "Check your inbox for your quiz results."
            : "Check your inbox for confirmation."}
        </p>
      </div>
    );
  }

  // Already subscribed state - returning user
  if (status === "already-subscribed") {
    return (
      <div
        className={cn(
          "relative flex flex-col gap-2 rounded-2xl bg-card/85 p-4 shadow-soft sm:rounded-3xl sm:p-5 md:p-6",
          className
        )}
      >
        <p className="text-lg font-semibold text-foreground sm:text-xl">
          {quizResultId
            ? "Check your inbox for your quiz results!"
            : "You&apos;re already on the list."}
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          {quizResultId
            ? "You're already on the early access list — we've saved your latest results."
            : "We&apos;ll notify you when we launch."}
        </p>
      </div>
    );
  }

  // Inline variant: single input, responsive container
  if (isInline) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("space-y-2", className)}
      >
        {/* Responsive container: stacks on mobile, inline on desktop */}
        <div
          className={cn(
            "flex items-center rounded-3xl bg-white shadow-soft sm:rounded-full",
            "flex-col gap-3 p-3",
            "sm:flex-row sm:gap-2 sm:p-1.5"
          )}
        >
          <Label htmlFor={idPrefix} className="sr-only">
            Email address
          </Label>
          <input
            id={idPrefix}
            type="email"
            placeholder="Enter your email..."
            className={cn(
              "h-10 flex-1 rounded-full bg-transparent px-5 text-base",
              "text-foreground placeholder:text-muted-foreground",
              "w-full focus:outline-none sm:w-auto",
              "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]"
            )}
            {...register("email")}
            onFocus={handleEmailFocus}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${idPrefix}-error` : undefined}
          />
          <Button
            type="submit"
            variant="primary"
            className={cn(
              "h-10 shrink-0 rounded-full px-4 text-base font-medium",
              "w-full sm:w-auto"
            )}
            disabled={status === "loading" || !turnstileToken}
          >
            {status === "loading" ? "Joining..." : "Get Early Access"}
          </Button>
        </div>

        {/* Turnstile widget */}
        <Turnstile
          key={turnstileKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          className="px-3"
        />

        {/* Error messages */}
        {errors.email && (
          <p id={`${idPrefix}-error`} className="px-4 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
        {status === "error" && (
          <p className="px-4 text-sm text-red-500">{errorMessage}</p>
        )}
      </form>
    );
  }

  // Default variant: standard stacked layout
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor={idPrefix} className="sr-only">
            Email address
          </Label>
          <Input
            id={idPrefix}
            type="email"
            placeholder="Enter your email"
            variant={errors.email ? "error" : "default"}
            {...register("email")}
            onFocus={handleEmailFocus}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${idPrefix}-error` : undefined}
          />
          {errors.email && (
            <p id={`${idPrefix}-error`} className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Turnstile
          key={turnstileKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === "loading" || !turnstileToken}
        >
          {status === "loading" ? "Joining..." : "Get Early Access"}
        </Button>
      </div>

      {status === "error" && (
        <p className="text-center text-sm text-red-500">{errorMessage}</p>
      )}
    </form>
  );
}
