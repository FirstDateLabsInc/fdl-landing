"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scrollama, Step } from "react-scrollama";

import Iphone15Pro from "@/components/ui/shadcn-io/iphone-15-pro";
import AnimatedIphone15Pro from "@/components/ui/shadcn-io/animated-iphone-15-pro";
import { walkthroughSteps } from "@/lib/constants";

export function MobileAppWalkthroughSection() {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);

  const onStepEnter = ({ data }: { data: number }) => {
    setCurrentStep(data);
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-background/60 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-semibold tracking-tight text-balance text-slate-900 sm:text-4xl"
          >
            How Juliet keeps you date-ready
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            A coaching loop that moves you from anxious to intentional in just a
            few minutes a day.
          </p>
        </div>

        {/* Desktop/Tablet Layout (≥768px) */}
        <div className="hidden md:grid md:grid-cols-[minmax(360px,420px)_1fr] md:gap-12 lg:grid-cols-[minmax(400px,500px)_1fr] lg:gap-16">
          {/* Left Column - Sticky iPhone */}
          <div className="sticky top-20 h-[640px] md:max-w-sm lg:max-w-none">
            <div className="flex h-full items-center justify-center">
              <AnimatedIphone15Pro
                src={walkthroughSteps[currentStep].image}
                className="h-[560px] w-auto lg:h-[640px]"
              />
            </div>
          </div>

          {/* Right Column - Scrollama Steps */}
          {/* Extra top margin keeps Step 1 aligned with the larger sticky phone */}
          <div className="md:mt-[9rem] lg:mt-[11rem]">
            <Scrollama offset={0.5} onStepEnter={onStepEnter}>
              {walkthroughSteps.map((step, index) => (
                <Step data={index} key={step.number}>
                  <div className="min-h-[400px] py-12">
                    <div className="flex items-start gap-6">
                      {/* Step Number Badge */}
                      <div className="shadow-soft flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-slate-900">
                        {step.number}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-2">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-base text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Step>
              ))}
            </Scrollama>
          </div>
        </div>

        {/* Mobile Layout (<768px) */}
        <div className="md:hidden">
          <div className="space-y-8">
            {walkthroughSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, y: 24 }
                }
                whileInView={
                  prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                  ease: "easeOut",
                }}
                className="shadow-soft overflow-hidden rounded-2xl border border-background/40 bg-background/80 p-6"
              >
                {/* iPhone Preview */}
                <div className="mb-6 flex justify-center">
                  <Iphone15Pro src={step.image} className="h-[400px] w-auto" />
                </div>

                {/* Step Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="shadow-soft flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-slate-900">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-base text-slate-600">{step.description}</p>


                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileAppWalkthroughSection;
