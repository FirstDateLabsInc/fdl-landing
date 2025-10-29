"use client";

import { useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { smoothScrollToHash } from "@/lib/utils";
import { heroContent } from "@/lib/constants";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const handleCtaClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      smoothScrollToHash(event);
    },
    []
  );

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-[-50%] h-[420px] w-full bg-gradient-to-t from-[#cab5d4]/30 via-transparent to-transparent blur-[90px]" />
      </div>

      <div className="mx-auto flex max-w-6xl items-start px-4 pt-10 pb-14 sm:px-6 md:pt-12 md:pb-16 lg:px-8">
        <div className="grid w-full items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-12">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start gap-6 text-left"
          >
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                {heroContent.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="max-w-[32ch] text-left text-3xl font-semibold leading-snug tracking-tight text-balance text-foreground sm:text-[2.625rem] lg:text-[2.75rem]"
              >
                {heroContent.title.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="max-w-xl text-left text-base leading-relaxed text-muted-foreground sm:text-lg">
                {heroContent.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button asChild className="min-w-[180px]">
                <Link
                  href={heroContent.primaryCta.href}
                  onClick={handleCtaClick}
                >
                  {heroContent.primaryCta.label}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="min-w-[180px] border border-border/60 bg-card/70 text-foreground backdrop-blur transition hover:bg-card"
              >
                <Link
                  href={heroContent.secondaryCta.href}
                  onClick={handleCtaClick}
                >
                  {heroContent.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-[320px] justify-center md:ms-auto md:max-w-[340px] md:justify-end"
          >
            <div className="relative h-[min(520px,70vh)] w-full overflow-hidden md:h-[min(560px,72vh)]">
              <Image
                src="/images/juliet-voice.png"
                alt="Juliet voice interface with conversation controls"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 80vw, 340px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
