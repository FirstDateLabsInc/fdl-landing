"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Users } from "lucide-react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { finalCtaContent } from "@/lib/constants";

export function FinalCTASection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="waitlist"
      aria-labelledby="final-cta-heading"
      className="relative isolate overflow-hidden py-20 sm:py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f7f1ff]/25 via-[#fffaf0]/70 to-[#fffaf0]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="space-y-6 sm:space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-secondary-dark">
            Early access
          </div>

          <div className="space-y-4 sm:space-y-5">
            <h2
              id="final-cta-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl"
            >
              {finalCtaContent.headline}
            </h2>
            <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
              {finalCtaContent.subheadline}
            </p>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-secondary-dark sm:text-sm">
              <Users className="size-4" aria-hidden />
              {finalCtaContent.socialProof}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <WaitlistForm variant="inline" />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground sm:text-base">
            <span>Want a preview of what we do?</span>
            <Link
              href={finalCtaContent.quizCta.href}
              className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary"
            >
              {finalCtaContent.quizCta.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTASection;
