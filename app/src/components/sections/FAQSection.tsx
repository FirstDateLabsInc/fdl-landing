"use client";

import { useCallback, useRef } from "react";
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
import { trackFaqOpen, trackFaqClose } from "@/lib/analytics";

// Create FAQ ID from question (alphanumeric + underscore only)
function getFaqId(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40);
}

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();
  const openFaqRef = useRef<{ id: string; question: string; openedAt: number } | null>(null);

  // Handle accordion value change for tracking
  const handleValueChange = useCallback((value: string) => {
    // If there was a previously open FAQ, track its close
    if (openFaqRef.current) {
      const timeOpen = Date.now() - openFaqRef.current.openedAt;
      trackFaqClose({
        faqId: openFaqRef.current.id,
        timeOpenMs: timeOpen,
      });
      openFaqRef.current = null;
    }

    // If a new FAQ is being opened, track it
    if (value) {
      const faqId = getFaqId(value);
      trackFaqOpen({
        faqId,
        faqQuestion: value.slice(0, 100), // Truncate for GA4 param limit
      });
      openFaqRef.current = { id: faqId, question: value, openedAt: Date.now() };
    }
  }, []);

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
            Got questions? We&apos;ve got answers.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base md:text-lg">
            Here&apos;s what people ask before they start seeing results.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.05 }}
          className="mt-10 sm:mt-12"
        >
          <Accordion type="single" collapsible className="divide-y divide-border" onValueChange={handleValueChange}>
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
