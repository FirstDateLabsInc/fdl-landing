"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/constants";
import cloudflareLoader from "@/lib/cloudflare-image-loader";

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 sm:py-20 md:py-24"
    >
      {/* Two images side by side - full width, responsive heights */}
      <div className="mb-8 grid grid-cols-2 gap-0 sm:mb-12">
        <div className="relative h-40 xs:h-52 sm:h-72 md:h-80 lg:h-96">
          <Image
            src="/images/faq-image-1.png"
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
            loader={cloudflareLoader}
          />
        </div>
        <div className="relative h-40 xs:h-52 sm:h-72 md:h-80 lg:h-96">
          <Image
            src="/images/faq-image-2.png"
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
            loader={cloudflareLoader}
          />
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2
            id="faq-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl"
          >
            Common questions
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base md:text-lg">
            Everything you need to know before you start practicing with Juliet.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.05 }}
          className="mt-10 sm:mt-12"
        >
          <Accordion type="single" collapsible className="divide-y divide-border">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question} className="border-none">
                <AccordionTrigger className="py-4 text-left text-base font-medium text-foreground hover:no-underline sm:py-5 sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground sm:pb-5 sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQSection;
