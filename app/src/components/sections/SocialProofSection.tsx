"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/lib/constants"
import { cn } from "@/lib/utils"
import cloudflareLoader from "@/lib/cloudflare-image-loader"

const marqueeTestimonials = [...testimonials, ...testimonials]

export function SocialProofSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="social-proof"
      aria-labelledby="social-proof-heading"
      className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2
          id="social-proof-heading"
          className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
        >
          Proof Juliet coaching works in the real world
        </h2>
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          Everyday daters show up more confident, calm, and ready for the second
          date.
        </p>
      </div>

      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="flex gap-4 overflow-x-auto pb-4 md:hidden" role="list">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              delay={prefersReducedMotion ? 0 : index * 0.08}
              reduceMotion={!!prefersReducedMotion}
            />
          ))}
        </div>

        <div className="relative hidden overflow-hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fffdf6] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fffdf6] to-transparent" />

          <div
            className={cn(
              "grid grid-flow-col auto-cols-[minmax(320px,1fr)] gap-6",
              prefersReducedMotion
                ? ""
                : "animate-[testimonial-marquee_32s_linear_infinite] hover:[animation-play-state:paused]"
            )}
            role="list"
          >
            {marqueeTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
                delay={prefersReducedMotion ? 0 : (index % testimonials.length) * 0.08}
                reduceMotion={!!prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  delay = 0,
  reduceMotion = false,
}: {
  testimonial: (typeof testimonials)[number]
  delay?: number
  reduceMotion?: boolean
}) {
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="min-w-[260px] snap-center"
    >
      <Card className="h-full bg-white/80 p-8 shadow-[0_25px_50px_-25px_rgba(15,23,42,0.2)] backdrop-blur">
        <CardContent className="flex h-full flex-col gap-6">
          <div className="text-left text-lg font-medium leading-relaxed text-slate-800">
            “{testimonial.quote}”
          </div>
          <div className="mt-auto flex items-center gap-4">
            {testimonial.avatarImage ? (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={testimonial.avatarImage}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  loader={cloudflareLoader}
                />
              </div>
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-[#cab5d4]/40 text-base font-semibold text-slate-900">
                {testimonial.avatarInitials}
              </div>
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">
                {testimonial.name}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {testimonial.role} · {testimonial.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SocialProofSection
