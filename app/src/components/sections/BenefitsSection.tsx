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
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#fef3c7]/30 blur-[80px] sm:h-96 sm:w-96 sm:blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-52 w-52 rounded-full bg-[#fde68a]/20 blur-[60px] sm:h-80 sm:w-80 sm:blur-[100px]" />
      </div>

      {/* Mobile: Image at top */}
      <div className="relative mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:hidden">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-2xl shadow-lg"
        >
          <Image
            src="/images/romantic.png"
            alt="Romantic couple"
            fill
            className="object-cover object-[center_15%]"
            sizes="(max-width: 768px) 90vw, 0vw"
            loader={cloudflareLoader}
          />
        </motion.div>
      </div>

      {/* Desktop: Background image - right side */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[45%] md:block lg:w-[42%]">
        <Image
          src="/images/romantic.png"
          alt=""
          fill
          className="object-cover object-[center_10%] opacity-[0.9]"
          sizes="(max-width: 768px) 0vw, 45vw"
          loader={cloudflareLoader}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 md:pr-[50%] lg:px-8 lg:pr-[45%]">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 text-center sm:mb-12"
        >
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-yellow-600 sm:mb-3 sm:text-xs sm:tracking-[0.3em]">
            Why Juliet
          </p>
          <h2
            id="benefits-heading"
            className="text-xl font-bold leading-relaxed tracking-tight text-slate-800 sm:text-2xl md:text-3xl lg:text-4xl lg:leading-relaxed"
          >
            Everything you need for
            <br />
            <span className="mt-0.5 inline-block font-bold text-yellow-500 sm:mt-1">the second date</span>
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
              
              <div className="flex items-start gap-4 py-4 sm:gap-6 sm:py-6 md:gap-10 md:py-8">
                {/* Large number */}
                <div className="shrink-0">
                  <span className="text-3xl font-extralight tracking-tight text-yellow-300 transition-colors duration-300 group-hover:text-yellow-500 sm:text-4xl md:text-5xl lg:text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-0.5 sm:pt-1">
                  <h3 className="mb-1 text-base font-bold tracking-tight text-slate-800 sm:mb-2 sm:text-lg md:text-xl lg:text-2xl">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 sm:text-base md:max-w-lg lg:text-lg">
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
