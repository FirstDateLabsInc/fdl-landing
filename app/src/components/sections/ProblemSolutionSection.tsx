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
      {/* Full-width diagonal split container */}
      <div className="relative min-h-[600px] sm:min-h-[650px] lg:min-h-[550px]">
        {/* Left side - Before (light purple) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5fc] to-[#f3eef9]">
          {/* Confused man image - right side with gradient fade */}
          <div className="pointer-events-none absolute inset-y-0 right-[45%] w-[55%]">
            <Image
              src="/images/confuse.png"
              alt=""
              fill
              className="object-cover object-right opacity-[0.08]"
              sizes="55vw"
              loader={cloudflareLoader}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5fc] via-transparent to-transparent" />
          </div>
        </div>

        {/* Right side - After (warm yellow) with soft diagonal gradient blend */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 0%, transparent 40%, #fffbf0 50%, #fffbf0 100%)",
          }}
        >
          {/* Holding hands image - centered in After section */}
          <div className="pointer-events-none absolute inset-y-0 left-[55%] w-[40%]">
            <Image
              src="/images/hand.png"
              alt=""
              fill
              className="object-cover object-center opacity-[0.12]"
              sizes="40vw"
              loader={cloudflareLoader}
            />
            {/* Gradient fade on both sides */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fffbf0] via-transparent to-[#fffbf0]" />
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
              <h3 className="mb-8 text-2xl font-semibold tracking-tight text-slate-700 sm:text-3xl">
                Dating feels like a<br />
                <span className="text-purple-300">guessing game</span>
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
                    <span className="text-base text-slate-500 sm:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Center connector - elegant chevrons */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="hidden shrink-0 items-center gap-1 lg:flex"
          >
            <ChevronRight className="size-5 text-yellow-300" strokeWidth={2} aria-hidden />
            <ChevronRight className="size-6 text-yellow-400" strokeWidth={2} aria-hidden />
            <ChevronRight className="size-7 text-yellow-500" strokeWidth={2.5} aria-hidden />
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
              <h3 className="mb-8 text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
                Every date becomes a<br />
                <span className="text-yellow-500">real opportunity</span>
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
                    <span className="text-base text-slate-700 sm:text-lg">{item}</span>
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
