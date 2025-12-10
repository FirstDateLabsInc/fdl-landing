"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Sparkles } from "lucide-react"

import { problemSolution } from "@/lib/constants"

export function ProblemSolutionSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="problem-solution"
      aria-labelledby="problem-solution-heading"
      className="bg-[#f9f3ff]/40 py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary-dark">
            The old way
          </p>
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-[0_25px_40px_-35px_rgba(15,23,42,0.35)]"
          >
            <ul className="space-y-4 text-base text-slate-600">
              {problemSolution.oldWay.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-left"
                >
                  <span className="mt-1 size-2 rounded-full bg-slate-300" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-secondary-dark">
            The new way
            <Sparkles className="size-4 text-[#f9d544]" aria-hidden />
          </p>
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="rounded-3xl border border-[#f9d544]/30 bg-[#fff8d2] p-8 shadow-[0_35px_55px_-30px_rgba(253,200,53,0.45)]"
          >
            <ul className="space-y-4 text-base text-slate-800">
              {problemSolution.newWay.map((item) => (
                <li key={item} className="flex items-start gap-4 text-left">
                  <ArrowRight className="mt-1 size-4 text-[#f9a544]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolutionSection
