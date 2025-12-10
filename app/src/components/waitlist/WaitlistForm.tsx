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
    "idle" | "loading" | "success" | "error"
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
        setStatus("success");
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

  if (status === "success") {
    return (
      <div
        className={cn(
          isInline
            ? "rounded-xl bg-primary/10 px-4 py-3 text-left"
            : "text-center",
          className
        )}
      >
        <p className="text-lg font-medium text-foreground">
          You&apos;re on the list!
        </p>
        <p className={cn("text-muted-foreground", isInline ? "mt-1" : "mt-2")}>
          Check your inbox for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(isInline ? "space-y-3" : "space-y-4", className)}
    >
      <div
        className={cn(
          isInline && "flex flex-col gap-3 sm:flex-row",
          !isInline && "space-y-4"
        )}
      >
        <div className={cn(isInline && "flex-1")}>
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
          className={cn(isInline ? "shrink-0 sm:min-w-[160px]" : "w-full")}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining..." : "Get Early Access"}
        </Button>
      </div>

      {status === "error" && (
        <p
          className={cn(
            "text-sm text-red-500",
            isInline ? "text-left" : "text-center"
          )}
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}
