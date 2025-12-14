"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { heroContent } from "@/lib/constants";
import cloudflareLoader from "@/lib/cloudflare-image-loader";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10">
        {/* Background image with fade effect */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background.png"
            alt=""
            fill
            className="object-cover object-[center_15%] opacity-[0.75]"
            priority
            sizes="100vw"
            loader={cloudflareLoader}
          />
          {/* Gradient overlay to fade the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        </div>
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
              <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white">
                {heroContent.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="max-w-[32ch] text-left text-4xl font-semibold leading-snug tracking-tight text-balance text-white sm:text-[3rem] lg:text-[3rem]"
              >
                {heroContent.title.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="max-w-xl text-left text-lg leading-relaxed text-white/90 sm:text-xl">
                {heroContent.description}
              </p>
            </div>

            <div className="mt-8 w-full max-w-md">
              <WaitlistForm variant="inline" />
              <p className="text-white/80 mt-3 flex items-center gap-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Nail every first date. Join now to claim your early-bird offer.
              </p>
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
                loader={cloudflareLoader}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
