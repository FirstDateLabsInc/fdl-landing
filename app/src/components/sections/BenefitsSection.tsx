"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { benefits } from "@/lib/constants"
import cloudflareLoader from "@/lib/cloudflare-image-loader"

export function BenefitsSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="relative overflow-hidden bg-[#fffbf5]"
    >
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#fef3c7]/30 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-[#fde68a]/20 blur-[100px]" />
      </div>

      {/* Background image - right side, height matches content */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 lg:w-[45%]">
        <Image
          src="/images/benefits-romantic.png"
          alt=""
          fill
          className="object-cover object-[center_25%] opacity-[0.9]"
          sizes="50vw"
          loader={cloudflareLoader}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:pr-[45%]">
        {/* Header - centered, elegant */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-yellow-600">
            Why Juliet
          </p>
          <h2
            id="benefits-heading"
            className="text-2xl font-light leading-relaxed tracking-tight text-slate-800 sm:text-3xl sm:leading-relaxed lg:text-4xl lg:leading-relaxed"
          >
            Everything you need for
            <br />
            <span className="mt-1 inline-block font-semibold text-yellow-500">the second date</span>
          </h2>
        </motion.div>

        {/* Numbered list - premium style */}
        <div className="space-y-0">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              {/* Top border line */}
              {index === 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent" />
              )}
              
              <div className="flex items-start gap-6 py-6 sm:gap-10 sm:py-8">
                {/* Large number */}
                <div className="shrink-0">
                  <span className="text-4xl font-extralight tracking-tight text-yellow-300 transition-colors duration-300 group-hover:text-yellow-500 sm:text-5xl lg:text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                    {benefit.title}
                  </h3>
                  <p className="max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
                    {benefit.description}
                  </p>
                </div>
              </div>
              
              {/* Bottom border line */}
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
