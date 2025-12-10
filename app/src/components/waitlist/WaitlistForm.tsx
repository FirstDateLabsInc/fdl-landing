"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  JoinWaitlistRequest,
  JoinWaitlistResponse,
} from "@/lib/api/waitlist";

const waitlistSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  quizResultId?: string;
  className?: string;
  variant?: "default" | "inline";
}

export function WaitlistForm({
  quizResultId,
  className,
  variant = "default",
}: WaitlistFormProps) {
  const isInline = variant === "inline";
  const idPrefix = isInline ? "hero-email" : "email";
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "already-subscribed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setStatus("loading");
    setErrorMessage("");

    // Capture UTM params from URL
    const params = new URLSearchParams(window.location.search);

    const payload: JoinWaitlistRequest = {
      email: data.email,
      source: "web",
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined,
      quizResultId,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: JoinWaitlistResponse = await res.json();

      if (result.success) {
        setStatus(result.isNew ? "success" : "already-subscribed");
        reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  // Success state - new signup
  if (status === "success") {
    return (
      <div
        className={cn(
          isInline
            ? "flex h-14 items-center rounded-full bg-primary/10 px-5 text-left sm:h-[60px]"
            : "text-center",
          className
        )}
      >
        <div>
          <p className="text-base font-medium text-foreground">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-muted-foreground">
            Check your inbox for confirmation.
          </p>
        </div>
      </div>
    );
  }

  // Already subscribed state - returning user
  if (status === "already-subscribed") {
    return (
      <div
        className={cn(
          isInline
            ? "flex h-14 items-center rounded-full bg-secondary/30 px-5 text-left sm:h-[60px]"
            : "text-center",
          className
        )}
      >
        <div>
          <p className="text-base font-medium text-foreground">
            You&apos;re already on the list!
          </p>
          <p className="text-sm text-muted-foreground">
            We&apos;ll notify you when we launch.
          </p>
        </div>
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
            "flex items-center rounded-full bg-white shadow-soft",
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
              "h-12 flex-1 rounded-full bg-transparent px-5 text-base",
              "text-foreground placeholder:text-muted-foreground",
              "w-full focus:outline-none sm:w-auto"
            )}
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${idPrefix}-error` : undefined}
          />
          <Button
            type="submit"
            variant="primary"
            className={cn(
              "h-12 shrink-0 rounded-full px-6 text-base font-medium",
              "w-full sm:w-auto"
            )}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Joining..." : "Get Notified"}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Button>
        </div>

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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${idPrefix}-error` : undefined}
          />
          {errors.email && (
            <p id={`${idPrefix}-error`} className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === "loading"}
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
