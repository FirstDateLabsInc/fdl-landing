"use client";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { Mail, Sparkles } from "lucide-react";
import { finalCtaContent } from "@/lib/constants";

interface QuizWaitlistSectionProps {
  quizResultId: string;
  archetypeName: string;
  archetypeEmoji: string;
  intent?: "claim" | "waitlist";
}

export function QuizWaitlistSection({
  quizResultId,
  archetypeName,
  archetypeEmoji,
  intent = "claim",
}: QuizWaitlistSectionProps) {
  const title =
    intent === "waitlist" ? finalCtaContent.headline : "Want the Full Picture?";
  const description =
    intent === "waitlist"
      ? finalCtaContent.subheadline
      : `Save your ${archetypeEmoji} ${archetypeName} results and get early access to in-depth analysis when we launch.`;

  return (
    <div className="from-primary/10 to-secondary/10 rounded-2xl bg-gradient-to-br via-white p-6 sm:p-8">
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <Mail className="text-primary h-6 w-6" />
        </div>

        {/* Heading */}
        <h3 className="text-foreground mb-2 text-xl font-semibold">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          {intent === "waitlist" ? (
            description
          ) : (
            <>
              Save your {archetypeEmoji}{" "}
              <span className="font-medium">{archetypeName}</span> results and
              get early access to in-depth analysis when we launch.
            </>
          )}
        </p>

        {/* Form */}
        {intent === "claim" ? (
          <WaitlistForm
            variant="inline"
            quizResultId={quizResultId}
            archetypeName={archetypeName}
            archetypeEmoji={archetypeEmoji}
          />
        ) : (
          <WaitlistForm variant="inline" />
        )}

        {/* Trust badge */}
        <p className="text-secondary-dark mt-4 flex items-start justify-center gap-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          Nail every first date. Join now to claim your early-bird offer.
        </p>
      </div>
    </div>
  );
}
