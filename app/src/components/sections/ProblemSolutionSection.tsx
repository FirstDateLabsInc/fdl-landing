"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Check, ChevronRight, Sparkles } from "lucide-react"

import { problemSolution } from "@/lib/constants"
import cloudflareLoader from "@/lib/cloudflare-image-loader"

export function ProblemSolutionSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="problem-solution"
      aria-labelledby="problem-solution-heading"
      className="relative overflow-hidden"
    >
      {/* Full-width diagonal split container - taller on mobile due to stacked content */}
      <div className="relative min-h-[900px] sm:min-h-[850px] lg:min-h-[550px]">
        {/* Left side - Before (light purple) - full on mobile, half on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5fc] to-[#f3eef9] lg:inset-x-0">
          {/* Confused man image - fills entire Before section, hidden on mobile */}
          <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" style={{ right: '42%' }}>
            <Image
              src="/images/confuse.png"
              alt=""
              fill
              className="object-cover opacity-[0.08]"
              style={{ objectPosition: 'center center' }}
              sizes="(max-width: 1024px) 0vw, 60vw"
              loader={cloudflareLoader}
            />
            {/* Gradient fade on edges to blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f8f5fc]/80" />
          </div>
        </div>

        {/* Right side - After (warm yellow) - vertical gradient on mobile only */}
        <div 
          className="absolute inset-0 lg:hidden"
          style={{
            background: "linear-gradient(to bottom, transparent 45%, #fffbf0 55%)",
          }}
        />
        {/* Desktop diagonal gradient overlay - clipped to right side only */}
        <div 
          className="absolute inset-0 hidden lg:block"
          style={{
            clipPath: "polygon(52% 0, 100% 0, 100% 100%, 42% 100%)",
            background: "#fffbf0",
          }}
        >
          {/* Soft gradient edge for blending */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 0%, #fffbf0 15%)",
            }}
          />
          {/* Holding hands image - centered in After section */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[65%]">
            <Image
              src="/images/hand.png"
              alt=""
              fill
              className="object-cover opacity-[0.08]"
              style={{ objectPosition: 'center center' }}
              sizes="(max-width: 1024px) 0vw, 50vw"
              loader={cloudflareLoader}
            />
            {/* Gradient fade on edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fffbf0]/80 via-transparent to-[#fffbf0]/50" />
          </div>
        </div>

        {/* Content container */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-stretch gap-6 px-6 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:py-24">
          {/* Before content - left side */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -30 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 lg:pr-8"
          >
            <div className="max-w-md">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                Before
              </p>
              <h3 className="mb-8 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                Dating feels like a<br />
                <span className="text-purple-400">guessing game</span>
              </h3>
              <ul className="space-y-4">
                {problemSolution.oldWay.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex items-start gap-3 text-left"
                  >
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-purple-300" aria-hidden />
                    <span className="text-base text-black sm:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Center connector - gradient chevrons from purple to yellow */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex shrink-0 items-center justify-center gap-1 py-4 lg:py-0"
          >
            {/* Desktop: horizontal chevrons with gradient colors */}
            <div className="hidden items-center gap-0.5 lg:flex">
              <ChevronRight className="size-5 text-purple-300" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-5 text-purple-200" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-6 text-yellow-200" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-6 text-yellow-300" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-7 text-yellow-400" strokeWidth={2.5} aria-hidden />
            </div>
            {/* Mobile: vertical chevrons with gradient colors */}
            <div className="flex rotate-90 items-center gap-0.5 lg:hidden">
              <ChevronRight className="size-4 text-purple-300" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-5 text-purple-200" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-5 text-yellow-300" strokeWidth={2} aria-hidden />
              <ChevronRight className="size-6 text-yellow-400" strokeWidth={2.5} aria-hidden />
            </div>
          </motion.div>

          {/* After content - right side */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 30 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="flex-1 lg:pl-8"
          >
            <div className="max-w-md lg:ml-auto">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600">
                <Sparkles className="size-4" aria-hidden />
                After
              </p>
              <h3 className="mb-8 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                Every date becomes a<br />
                <span className="text-yellow-600">real opportunity</span>
              </h3>
              <ul className="space-y-4">
                {problemSolution.newWay.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                    className="flex items-start gap-3 text-left"
                  >
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 shadow-sm">
                      <Check className="size-3 text-white" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-base text-black sm:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolutionSection
