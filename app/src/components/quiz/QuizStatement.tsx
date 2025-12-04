"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface QuizStatementProps {
  className?: string;
}

export function QuizStatement({ className }: QuizStatementProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* 3-Step Cards - Flat rectangular design */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Step 1: Complete Quiz */}
        <div className="group relative overflow-hidden rounded-xl border border-[#7eb5c0]/20 bg-gradient-to-br from-[#e8f6f8] via-white to-[#f0f9fa] p-4 shadow-sm transition-all hover:shadow-md">
          {/* Top bar accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#7eb5c0] to-[#5a9aa8]" />

          <div className="flex items-start gap-3">
            {/* Icon - enlarged illustration without container */}
            <svg viewBox="0 0 64 64" className="size-14 shrink-0" fill="none">
              {/* Paper/clipboard base */}
              <rect x="18" y="8" width="28" height="48" rx="3" fill="url(#clipboard-grad)" opacity="0.95"/>
              <rect x="20" y="6" width="24" height="6" rx="2" fill="#7eb5c0" opacity="0.9"/>

              <defs>
                <linearGradient id="clipboard-grad" x1="18" y1="8" x2="46" y2="56">
                  <stop offset="0%" stopColor="#7eb5c0"/>
                  <stop offset="100%" stopColor="#5a9aa8"/>
                </linearGradient>
              </defs>

              {/* Checkboxes with checkmarks */}
              <rect x="24" y="18" width="5" height="5" rx="1" fill="white" stroke="#e8f6f8" strokeWidth="1.5"/>
              <path d="M25.5 20.5 L26.5 21.5 L28.5 19.5" stroke="#5a9aa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              <rect x="24" y="28" width="5" height="5" rx="1" fill="white" stroke="#e8f6f8" strokeWidth="1.5"/>
              <path d="M25.5 30.5 L26.5 31.5 L28.5 29.5" stroke="#5a9aa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              <rect x="24" y="38" width="5" height="5" rx="1" fill="white" stroke="#e8f6f8" strokeWidth="1.5"/>
              <path d="M25.5 40.5 L26.5 41.5 L28.5 39.5" stroke="#5a9aa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Text lines */}
              <line x1="31" y1="20.5" x2="42" y2="20.5" stroke="white" strokeWidth="1.5" opacity="0.8"/>
              <line x1="31" y1="30.5" x2="42" y2="30.5" stroke="white" strokeWidth="1.5" opacity="0.8"/>
              <line x1="31" y1="40.5" x2="42" y2="40.5" stroke="white" strokeWidth="1.5" opacity="0.8"/>

              {/* Decorative sparkles */}
              <circle cx="50" cy="14" r="2" fill="white" opacity="0.9"/>
              <circle cx="52" cy="22" r="1.5" fill="white" opacity="0.7"/>
              <path d="M14 28 L15 31 L17 31 L15.5 33 L16 36 L14 34 L12 36 L12.5 33 L11 31 L13 31 Z" fill="white" opacity="0.6"/>
            </svg>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-1.5 inline-flex items-center rounded-full bg-[#7eb5c0] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
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
        </div>

        {/* Step 2: View Detailed Results */}
        <div className="group relative overflow-hidden rounded-xl border border-[#6fb894]/20 bg-gradient-to-br from-[#e8f7ed] via-white to-[#f0faf3] p-4 shadow-sm transition-all hover:shadow-md">
          {/* Top bar accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#6fb894] to-[#4a9975]" />

          <div className="flex items-start gap-3">
            {/* Icon - enlarged illustration without container */}
            <svg viewBox="0 0 64 64" className="size-14 shrink-0" fill="none">
              {/* Document base with gradient */}
              <rect x="14" y="8" width="36" height="48" rx="3" fill="url(#document-grad)" opacity="0.95"/>
              <path d="M14 12 L18 8 L50 8" fill="url(#document-grad)" opacity="0.95"/>

              <defs>
                <linearGradient id="document-grad" x1="14" y1="8" x2="50" y2="56">
                  <stop offset="0%" stopColor="#6fb894"/>
                  <stop offset="100%" stopColor="#4a9975"/>
                </linearGradient>
              </defs>

              {/* Bar chart - larger and more prominent */}
              <rect x="20" y="34" width="6" height="14" rx="1.5" fill="white" opacity="0.85"/>
              <rect x="28" y="30" width="6" height="18" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="36" y="32" width="6" height="16" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="44" y="28" width="6" height="20" rx="1.5" fill="white" opacity="0.8"/>

              {/* Chart grid lines */}
              <line x1="18" y1="28" x2="52" y2="28" stroke="white" strokeWidth="1" opacity="0.4"/>
              <line x1="18" y1="36" x2="52" y2="36" stroke="white" strokeWidth="1" opacity="0.4"/>
              <line x1="18" y1="44" x2="52" y2="44" stroke="white" strokeWidth="1" opacity="0.4"/>

              {/* Trend arrow - more prominent */}
              <path d="M20 18 L28 15 L36 16 L44 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M42 13 L44 13 L44 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Decorative sparkles */}
              <circle cx="54" cy="14" r="2" fill="white" opacity="0.9"/>
              <path d="M56 22 L56.8 24.5 L59 25 L56.8 25.5 L56 28 L55.2 25.5 L53 25 L55.2 24.5 Z" fill="white" opacity="0.85"/>
              <circle cx="10" cy="32" r="1.5" fill="white" opacity="0.7"/>
            </svg>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-1.5 inline-flex items-center rounded-full bg-[#6fb894] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
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
        </div>

        {/* Step 3: Unlock Your Potential */}
        <div className="group relative overflow-hidden rounded-xl border border-[#cab5d4]/20 bg-gradient-to-br from-[#f5eef9] via-white to-[#faf6fc] p-4 shadow-sm transition-all hover:shadow-md">
          {/* Top bar accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#cab5d4] to-[#a893b8]" />

          <div className="flex items-start gap-3">
            {/* Icon - enlarged illustration without container */}
            <svg viewBox="0 0 64 64" className="size-14 shrink-0" fill="none">
              {/* Smartphone base with gradient */}
              <rect x="16" y="6" width="32" height="52" rx="4" fill="url(#phone-grad)" opacity="0.95"/>
              <rect x="16" y="6" width="32" height="8" rx="2" fill="url(#phone-grad)" opacity="0.8"/>
              <circle cx="32" cy="54" r="2.5" fill="white" opacity="0.7"/>

              <defs>
                <linearGradient id="phone-grad" x1="16" y1="6" x2="48" y2="58">
                  <stop offset="0%" stopColor="#cab5d4"/>
                  <stop offset="100%" stopColor="#a893b8"/>
                </linearGradient>
              </defs>

              {/* Heart icon on screen - larger */}
              <path d="M32 26 C32 26, 29 22, 26 22 C23 22, 21 24, 21 26.5 C21 30, 24 33, 32 39 C40 33, 43 30, 43 26.5 C43 24, 41 22, 38 22 C35 22, 32 26, 32 26 Z" fill="white" opacity="0.9"/>

              {/* UI elements on phone - larger */}
              <rect x="22" y="44" width="20" height="2.5" rx="1.25" fill="white" opacity="0.5"/>
              <rect x="22" y="48" width="14" height="2.5" rx="1.25" fill="white" opacity="0.4"/>

              {/* Download arrow with circle - larger */}
              <circle cx="32" cy="18" r="4" fill="white" opacity="0.95"/>
              <path d="M32 15 L32 21 M29 19 L32 21 L35 19" stroke="#a893b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Magical sparkles and stars - larger and more prominent */}
              <path d="M8 22 L9 25.5 L12 26.5 L9 27.5 L8 31 L7 27.5 L4 26.5 L7 25.5 Z" fill="white" opacity="0.95"/>
              <path d="M54 32 L55 35.5 L58 36.5 L55 37.5 L54 41 L53 37.5 L50 36.5 L53 35.5 Z" fill="white" opacity="0.95"/>
              <circle cx="12" cy="42" r="2" fill="white" opacity="0.85"/>
              <circle cx="52" cy="20" r="1.5" fill="white" opacity="0.8"/>
              <path d="M56 46 L57 48.5 L59 49.5 L57 50.5 L56 53 L55 50.5 L53 49.5 L55 48.5 Z" fill="white" opacity="0.9"/>
            </svg>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-1.5 inline-flex items-center rounded-full bg-[#cab5d4] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
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
    </div>
  );
}
