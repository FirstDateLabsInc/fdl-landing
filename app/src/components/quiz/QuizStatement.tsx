"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import cloudflareLoader from "@/lib/cloudflare-image-loader";

interface QuizStatementProps {
  className?: string;
}

export function QuizStatement({ className }: QuizStatementProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* MOBILE: Compact row layout (hidden on sm+) */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Step 1 - Compact Row */}
        <div className="flex items-start gap-3 rounded-lg border-l-4 border-[#4a9bb5] bg-white p-3 shadow-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f4fc]">
            <span className="text-sm font-semibold text-[#4a9bb5]">1</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Complete Quiz
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Answer honestly. If no romantic experience, imagine behavior with
              family/friends.
            </p>
          </div>
        </div>

        {/* Step 2 - Compact Row */}
        <div className="flex items-start gap-3 rounded-lg border-l-4 border-[#4a9b6b] bg-white p-3 shadow-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9]">
            <span className="text-sm font-semibold text-[#4a9b6b]">2</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              View Detailed Results
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Learn and know what your personality in relationship
            </p>
          </div>
        </div>

        {/* Step 3 - Compact Row */}
        <div className="flex items-start gap-3 rounded-lg border-l-4 border-[#9b6bab] bg-white p-3 shadow-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3e8f5]">
            <span className="text-sm font-semibold text-[#9b6bab]">3</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Unlock Your Potential
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Want full reports or tips? Download our app for personalized
              insights
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP: 3-Step Cards with larger illustrations (hidden on mobile) */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
        {/* Step 1: Complete Quiz */}
        <div className="group overflow-hidden rounded-xl border border-[#b8ddef]/30 bg-white shadow-sm transition-all hover:shadow-md">
          {/* Illustration Area */}
          <div className="relative h-28 w-full bg-gradient-to-br from-[#e8f4fc] to-[#d4ebf7] sm:h-32">
            <Image
              src="/walkthrough/step-1-quiz.svg"
              alt="Complete Quiz"
              fill
              className="object-contain p-2"
              loader={cloudflareLoader}
            />
          </div>

          {/* Content Area */}
          <div className="p-3">
            <div className="mb-1.5 inline-flex items-center rounded-full bg-[#4a9bb5] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              Step 1
            </div>
            <h3 className="mb-1 text-sm font-bold text-slate-900">
              Complete Quiz
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Answer honestly. If no romantic experience, imagine behavior with family/friends.
            </p>
          </div>
        </div>

        {/* Step 2: View Detailed Results */}
        <div className="group overflow-hidden rounded-xl border border-[#a8e4bc]/30 bg-white shadow-sm transition-all hover:shadow-md">
          {/* Illustration Area */}
          <div className="relative h-28 w-full bg-gradient-to-br from-[#e8f5e9] to-[#d4ecd6] sm:h-32">
            <Image
              src="/walkthrough/step-2-profile.svg"
              alt="View Detailed Results"
              fill
              className="object-contain p-2"
              loader={cloudflareLoader}
            />
          </div>

          {/* Content Area */}
          <div className="p-3">
            <div className="mb-1.5 inline-flex items-center rounded-full bg-[#4a9b6b] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              Step 2
            </div>
            <h3 className="mb-1 text-sm font-bold text-slate-900">
              View Detailed Results
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Learn and know what your personality in relationship
            </p>
          </div>
        </div>

        {/* Step 3: Unlock Your Potential */}
        <div className="group overflow-hidden rounded-xl border border-[#dcc8e4]/30 bg-white shadow-sm transition-all hover:shadow-md">
          {/* Illustration Area */}
          <div className="relative h-28 w-full bg-gradient-to-br from-[#f3e8f5] to-[#e8d4ec] sm:h-32">
            <Image
              src="/walkthrough/step-3-coaching.svg"
              alt="Unlock Your Potential"
              fill
              className="object-contain p-2"
              loader={cloudflareLoader}
            />
          </div>

          {/* Content Area */}
          <div className="p-3">
            <div className="mb-1.5 inline-flex items-center rounded-full bg-[#9b6bab] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              Step 3
            </div>
            <h3 className="mb-1 text-sm font-bold text-slate-900">
              Unlock Your Potential
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Want full reports or tips? Download our app for personalized insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
