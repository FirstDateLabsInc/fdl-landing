# Quiz Results Page Redesign - Developer Guide

> **Purpose**: Step-by-step implementation guide for redesigning the quiz results page to feel "eerily accurate" using psychology-backed content and 16personalities-inspired UI.

## Overview

**Core Principle**: Archetype content is PRIMARY (the "oh wow" moment), measurements are SECONDARY (supporting data).

### Key Changes
- Replace generic `strengths[]` and `growthAreas[]` with behaviorally-specific 9-section content
- New 7-section page layout with sticky navigation sidebar
- Radar charts for multi-dimensional measurements
- All styling via design tokens (no hardcoded colors)

### Target Metrics
- Accuracy rating: 8-9/10 (vs current 5-6/10)
- App download rate: 18-22%
- Time reading results: 3+ minutes

---

## Phase 0: Environment Setup

### Step 0.1: Verify Working Environment
```bash
cd app
npm run dev
```
**Verify**: Dev server starts at localhost:3000 without errors.
**If fails**: Run `npm install` first.

### Step 0.2: Add New CSS Tokens (Optional)
**File**: `app/src/app/globals.css`

Add inside `:root { }` block if needed:

```css
  /* Radar chart specific colors (if chart-1 to chart-5 insufficient) */
  --chart-intimacy: oklch(0.75 0.12 350);
  --chart-boundaries: oklch(0.72 0.08 180);
```

**Verify**: No CSS parsing errors. Run `npm run lint`.

---

## Phase 1: Update Data Layer

### Step 1.1: Backup Current archetypes.ts
```bash
cp app/src/lib/quiz/archetypes.ts app/src/lib/quiz/archetypes.backup.ts
```
**Verify**: Backup file exists.

### Step 1.2: Update ArchetypeDefinition Interface
**File**: `app/src/lib/quiz/archetypes.ts`

Replace the current interface:

```typescript
// OLD:
export interface ArchetypeDefinition extends Archetype {
  id: string;
  strengths: string[];
  growthAreas: string[];
}
```

With:

```typescript
// NEW:
export interface ArchetypeDefinition extends Archetype {
  id: string;
  patternDescription: string;
  datingCycle: string[];
  rootCause: string;
  datingMeaning: {
    strengths: string[];
    challenges: string[];
  };
  redFlags: string[];
  coachingFocus: string[];
  callToActionCopy: string;
}
```

**Verify**: `npm run lint` will fail at this point (expected - archetypes don't match interface yet).

### Step 1.3: Replace First Archetype (Golden Partner)
**File**: `app/src/lib/quiz/archetypes.ts`

Replace the first archetype object with the new structure:

```typescript
{
  id: 'golden-partner',
  name: 'The Golden Partner',
  emoji: '🐕',
  image: '/archetypes/golden-partner-goldenRetriever.png',
  summary:
    'You genuinely enjoy dating and people can feel it. You say what you want, handle disagreement calmly, and make partners feel safe. This is rare.',

  patternDescription: `You're that person who lights up when you meet someone interesting. You're genuinely enthusiastic about dating, comfortable saying "I like you," and you actually enjoy the work of relationships. Your friends probably say things like "You just know how to make people feel safe." And they're right.`,

  datingCycle: [
    'You meet someone → genuine interest (not performing, just authentic)',
    'You share openly → you don\'t play games or hold back',
    'They feel safe → because you ARE safe, consistently',
    'Things develop naturally → conflict happens but you handle it calmly',
    'The relationship either works or ends cleanly → either way, you bounce back'
  ],

  rootCause: `You have secure attachment at your core. You weren't sent mixed signals about love growing up, so you don't have to decode relationships or protect yourself defensively. This is genuinely rare and valuable.`,

  datingMeaning: {
    strengths: [
      'You can actually relax on dates (which makes dates feel natural, not stressful)',
      'You say what you want clearly without rehearsing',
      'When conflict happens, you address it rather than withdraw or explode',
      'Your partners feel chosen, not pursued',
      'You genuinely like people, which they can sense',
    ],
    challenges: [
      'You expect everyone to be as secure as you are',
      'When they\'re anxious or defensive or pull away, it can confuse you',
      'You might slow your pace trying to help them catch up, which can feel patronizing',
      'You can be surprised when partners have deep insecurities',
      'You may attract very insecure people who need constant reassurance',
    ],
  },

  redFlags: [
    'You\'re adapting your communication style too much trying to make partners comfortable',
    'You\'re being "the patient one" so often it starts to feel like a role',
    'Partners seem intimidated by how secure you are',
    'You\'re attracting people who need a lot of reassurance and it\'s draining',
    'You\'re dating someone significantly less secure and wondering why they\'re always anxious',
  ],

  coachingFocus: [
    'Recognizing when a partner\'s insecurity needs patience vs. when you should walk away',
    'Understanding different attachment styles so you stop being confused by anxious/avoidant behavior',
    'Dating people who are roughly as secure as you (so it\'s actually effortless)',
    'Avoiding the trap of being the "strong one" who rescues insecure partners',
    'Trusting your gut when something feels off, even if they seem nice',
  ],

  callToActionCopy: 'Get Coaching on Finding Your Match',
},
```

**Verify**: Run `npm run lint` - should still have errors for remaining 15 archetypes.

### Step 1.4: Replace All Remaining 15 Archetypes
**File**: `app/src/lib/quiz/archetypes.ts`

Copy each archetype from `/Users/zyy/Downloads/archetypes-updated-code.md`.

**Important**: Keep the original `image` paths from current archetypes.

Work through each in order:
1. gentle-peacekeeper (Secure + Passive)
2. direct-director (Secure + Aggressive)
3. playful-tease (Secure + Passive-Aggressive)
4. open-book (Anxious + Assertive)
5. selfless-giver (Anxious + Passive)
6. fiery-pursuer (Anxious + Aggressive)
7. mind-reader (Anxious + Passive-Aggressive)
8. solo-voyager (Avoidant + Assertive)
9. quiet-ghost (Avoidant + Passive)
10. iron-fortress (Avoidant + Aggressive)
11. cool-mystery (Avoidant + Passive-Aggressive)
12. self-aware-alchemist (Disorganized + Assertive)
13. chameleon (Disorganized + Passive)
14. wild-storm (Disorganized + Aggressive)
15. labyrinth (Disorganized + Passive-Aggressive)

**Verify after each**: Count archetypes (should be 16 total).
**Final verify**: `npm run lint` passes. `npm run dev` starts without errors.

### Step 1.5: Verify All Archetypes Load
```bash
npm run dev
```
Open browser: http://localhost:3000/quiz/results

**Verify**: Page loads without errors. Check browser console for type errors.
**If fails**: Check for missing commas, unescaped quotes in strings.

---

## Phase 2: Create UI Components

### Step 2.1: NumberedSection Component
**File**: `app/src/components/quiz/results/NumberedSection.tsx` (NEW)

```tsx
import { cn } from "@/lib/utils";

interface NumberedSectionProps {
  number: number;
  title: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function NumberedSection({
  number,
  title,
  id,
  children,
  className,
}: NumberedSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-muted-foreground">
          {number}
        </span>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}
```

**Verify**: `npm run lint` passes.

### Step 2.2: TraitGrid Component
**File**: `app/src/components/quiz/results/TraitGrid.tsx` (NEW)

```tsx
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TraitGridProps {
  items: string[];
  type: "strength" | "challenge";
  className?: string;
}

export function TraitGrid({ items, type, className }: TraitGridProps) {
  const Icon = type === "strength" ? Check : AlertTriangle;
  const iconColor = type === "strength" ? "text-green-600" : "text-amber-500";

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-xl bg-card p-4 shadow-soft"
        >
          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} />
          <p className="text-sm text-foreground">{item}</p>
        </div>
      ))}
    </div>
  );
}
```

**Verify**: `npm run lint` passes.

### Step 2.3: DatingCycleVisual Component
**File**: `app/src/components/quiz/results/DatingCycleVisual.tsx` (NEW)

```tsx
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatingCycleVisualProps {
  steps: string[];
  className?: string;
}

export function DatingCycleVisual({ steps, className }: DatingCycleVisualProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {steps.map((step, index) => (
        <div key={index}>
          <div className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-soft">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-muted-foreground">
              {index + 1}
            </span>
            <p className="text-sm text-foreground">{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Verify**: `npm run lint` passes.

### Step 2.4: RedFlagsList Component
**File**: `app/src/components/quiz/results/RedFlagsList.tsx` (NEW)

```tsx
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedFlagsListProps {
  items: string[];
  className?: string;
}

export function RedFlagsList({ items, className }: RedFlagsListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 rounded-lg border border-red-100 bg-red-50/50 p-3"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-foreground">{item}</p>
        </li>
      ))}
    </ul>
  );
}
```

**Verify**: `npm run lint` passes.

### Step 2.5: CoachingFocusList Component
**File**: `app/src/components/quiz/results/CoachingFocusList.tsx` (NEW)

```tsx
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoachingFocusListProps {
  items: string[];
  ctaText: string;
  className?: string;
}

export function CoachingFocusList({ items, ctaText, className }: CoachingFocusListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-lg bg-primary/5 p-3"
          >
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">{item}</p>
          </li>
        ))}
      </ul>
      <button className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-shadow hover:shadow-hover">
        {ctaText}
      </button>
    </div>
  );
}
```

**Verify**: `npm run lint` passes.

### Step 2.6: ResultsNavSidebar Component
**File**: `app/src/components/quiz/results/ResultsNavSidebar.tsx` (NEW)

```tsx
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ArchetypeDefinition } from "@/lib/quiz/archetypes";

interface Section {
  id: string;
  number: number;
  title: string;
}

interface ResultsNavSidebarProps {
  archetype: ArchetypeDefinition;
  sections: Section[];
  activeSection: string;
  className?: string;
}

const SECTIONS: Section[] = [
  { id: "pattern", number: 1, title: "The Pattern" },
  { id: "root-cause", number: 2, title: "Root Cause" },
  { id: "dating-meaning", number: 3, title: "What It Means" },
  { id: "red-flags", number: 4, title: "Red Flags" },
  { id: "coaching", number: 5, title: "Coaching Focus" },
  { id: "profile", number: 6, title: "Dating Profile" },
  { id: "love-languages", number: 7, title: "Love Languages" },
];

export function ResultsNavSidebar({
  archetype,
  sections = SECTIONS,
  activeSection,
  className,
}: ResultsNavSidebarProps) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      className={cn(
        "sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl bg-background/80 p-5 shadow-soft backdrop-blur lg:block",
        className
      )}
    >
      {/* Archetype Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full bg-primary/10">
          <Image
            src={archetype.image}
            alt={archetype.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Your type is</p>
        <h3 className="font-semibold text-foreground">{archetype.name}</h3>
        <p className="text-2xl">{archetype.emoji}</p>
      </div>

      {/* Section Links */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On This Page
        </p>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">
                {section.number}
              </span>
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          Get the App
        </button>
        <button className="w-full rounded-lg border border-muted px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
          Share Results
        </button>
      </div>
    </aside>
  );
}

export { SECTIONS };
```

**Verify**: `npm run lint` passes.

### Step 2.7: MobileFloatingNav Component
**File**: `app/src/components/quiz/results/MobileFloatingNav.tsx` (NEW)

```tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./ResultsNavSidebar";

interface MobileFloatingNavProps {
  activeSection: string;
  className?: string;
}

export function MobileFloatingNav({ activeSection, className }: MobileFloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 lg:hidden", className)}>
      {/* Bottom Sheet */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-4 bottom-20 rounded-2xl bg-background/95 p-4 shadow-hover backdrop-blur">
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleClick(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-sm">
                    {section.number}
                  </span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-hover"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-primary-foreground" />
        )}
      </button>
    </div>
  );
}
```

**Verify**: `npm run lint` passes.

### Step 2.8: Update Index Exports
**File**: `app/src/components/quiz/results/index.ts` (UPDATE)

Add new exports:

```typescript
export { NumberedSection } from "./NumberedSection";
export { TraitGrid } from "./TraitGrid";
export { DatingCycleVisual } from "./DatingCycleVisual";
export { RedFlagsList } from "./RedFlagsList";
export { CoachingFocusList } from "./CoachingFocusList";
export { ResultsNavSidebar, SECTIONS } from "./ResultsNavSidebar";
export { MobileFloatingNav } from "./MobileFloatingNav";

// Existing exports
export { ResultsContainer } from "./ResultsContainer";
export { ProfileSummary } from "./ProfileSummary";
export { CategoryRadarChart } from "./CategoryRadarChart";
export { OverallRadarChart } from "./OverallRadarChart";
export { LoveLanguageSuggestions } from "./LoveLanguageSuggestions";
export { ShareResults } from "./ShareResults";
```

**Verify**: All imports resolve. `npm run lint` passes.

---

## Phase 3: Refactor ResultsContainer

### Step 3.1: Backup Current ResultsContainer
```bash
cp app/src/components/quiz/results/ResultsContainer.tsx app/src/components/quiz/results/ResultsContainer.backup.tsx
```

### Step 3.2: Add Scroll Tracking Hook
**File**: `app/src/components/quiz/results/ResultsContainer.tsx`

Add imports at the top:

```tsx
import { useState, useEffect } from "react";
import { NumberedSection } from "./NumberedSection";
import { TraitGrid } from "./TraitGrid";
import { DatingCycleVisual } from "./DatingCycleVisual";
import { RedFlagsList } from "./RedFlagsList";
import { CoachingFocusList } from "./CoachingFocusList";
import { ResultsNavSidebar, SECTIONS } from "./ResultsNavSidebar";
import { MobileFloatingNav } from "./MobileFloatingNav";
```

Add inside the component, after the existing `useMemo` hooks:

```tsx
// Track active section for sidebar
const [activeSection, setActiveSection] = useState("pattern");

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );

  SECTIONS.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) observer.observe(element);
  });

  return () => observer.disconnect();
}, []);
```

**Verify**: `npm run lint` passes. No console errors.

### Step 3.3: Update JSX Structure
**File**: `app/src/components/quiz/results/ResultsContainer.tsx`

Replace the return statement with new 7-section layout. See the full implementation in the plan file at `~/.claude/plans/luminous-gathering-waffle.md` (lines 1024-1200).

Key sections:
1. **Pattern Recognition** - patternDescription + DatingCycleVisual
2. **Root Cause** - rootCause paragraph
3. **Dating Meaning** - TraitGrid for strengths + challenges
4. **Red Flags** - RedFlagsList
5. **Coaching Focus** - CoachingFocusList with CTA
6. **Dating Profile** - Radar charts (existing components)
7. **Love Languages** - LoveLanguageSuggestions (existing)

**Verify**:
1. `npm run lint` passes
2. `npm run dev` - page renders
3. All 7 sections visible
4. Sidebar appears on desktop (>1024px)
5. Floating button appears on mobile

---

## Phase 4: Final Testing & Verification

### Step 4.1: Run Lint
```bash
cd app && npm run lint
```
**Verify**: Zero warnings, zero errors.

### Step 4.2: Run Dev Server
```bash
npm run dev
```
Open http://localhost:3000 and navigate to quiz results.

**Verify**:
- [ ] Hero section shows archetype name, image, emoji
- [ ] All 7 numbered sections render
- [ ] Dating cycle shows 5-6 steps with arrows
- [ ] Strengths show with green checkmarks
- [ ] Challenges show with amber warnings
- [ ] Red flags show with red icons
- [ ] Coaching focus shows with lightbulb icons
- [ ] CTA button shows correct text
- [ ] Radar charts display correctly
- [ ] Sidebar scrollspy highlights active section
- [ ] Mobile floating nav works

### Step 4.3: Test All 16 Archetypes
Manually test each archetype by modifying test data or using the quiz flow.

**Verify**: Each archetype displays unique content in all sections.

### Step 4.4: Run Preview Build
```bash
npm run preview
```
**Verify**: Build succeeds. Wrangler server starts. Page works in preview.

### Step 4.5: Mobile Testing
Use browser dev tools to test at 375px, 768px widths.

**Verify**:
- [ ] Sidebar hidden on mobile
- [ ] Floating nav button visible
- [ ] Bottom sheet opens on tap
- [ ] Section links scroll correctly
- [ ] All content readable

---

## Troubleshooting Guide

### "Property X does not exist on type ArchetypeDefinition"
**Cause**: Interface mismatch between types.ts and archetypes.ts
**Fix**: Ensure ArchetypeDefinition in archetypes.ts includes all new fields

### "Cannot read properties of undefined (reading 'map')"
**Cause**: Missing array field (datingCycle, redFlags, etc.)
**Fix**: Check the specific archetype object for missing fields

### "Module not found: Can't resolve './ComponentName'"
**Cause**: Component not created or export missing
**Fix**: Create component file, add to index.ts export

### Radar chart colors wrong
**Cause**: Hardcoded hex values instead of CSS variables
**Fix**: Use `var(--primary)` format in accentColor/fillColor props

### Scrollspy not working
**Cause**: Section IDs don't match SECTIONS array
**Fix**: Ensure id prop in NumberedSection matches SECTIONS[].id

### Mobile nav not visible
**Cause**: z-index conflict or hidden by parent
**Fix**: Check z-50 class is present, no overflow:hidden on parents

---

## Design Token Reference

### Existing Tokens (use these)

| Token | CSS Variable | Tailwind Class | Usage |
|-------|--------------|----------------|-------|
| Background | `--background` | `bg-background` | Page background, cream color |
| Primary | `--primary` | `bg-primary`, `text-primary` | Gold accent, CTA buttons, highlights |
| Secondary | `--secondary` | `bg-secondary`, `text-secondary` | Purple accent, secondary elements |
| Accent | `--accent` | `bg-accent` | Yellow accent, hover states |
| Muted Foreground | `--muted-foreground` | `text-muted-foreground` | Subtle text, section numbers |
| Chart Colors | `--chart-1` to `--chart-5` | `text-chart-1` etc. | Radar chart colors |
| Shadow Soft | `--shadow-soft` | `shadow-soft` | Card shadows, subtle elevation |
| Shadow Hover | `--shadow-hover` | `shadow-hover` | Hover state elevation |

### Token Usage Guidelines

- **NEVER** use hardcoded hex values in components
- Cards: `bg-card shadow-soft rounded-xl`
- CTA Buttons: `bg-primary text-primary-foreground`
- Section Numbers: `bg-primary/20 text-muted-foreground`
- Sidebar: `bg-background/80 backdrop-blur`
- Icons: `text-muted-foreground` (subtle), `text-primary` (emphasis)

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `/Users/zyy/Downloads/archetypes-updated-code.md` | Complete 16 archetype content ready to copy |
| `app/src/lib/quiz/archetypes.ts` | Main file to update with new interface |
| `app/src/components/quiz/results/ResultsContainer.tsx` | Main component to refactor |
| `~/.claude/plans/luminous-gathering-waffle.md` | Full implementation plan with complete code |

---

## Page Structure (Visual Reference)

```
┌─────────────────────────────────────────────────────────────┐
│  HERO: Archetype Name + Animal Image + Hook Summary         │
├─────────────────────────────────────┬───────────────────────┤
│                                     │ STICKY SIDEBAR        │
│  1. The Pattern You Recognize       │ ─────────────────────│
│     - patternDescription text       │ [Animal Avatar]       │
│     - Dating Cycle (5-6 steps)      │ Your type is:         │
│                                     │ Golden Partner 🐕     │
│  2. Where This Comes From           │ ─────────────────────│
│     - rootCause paragraph           │ ON THIS PAGE          │
│                                     │ 1. Pattern            │
│  3. What This Means for Dating      │ 2. Root Cause         │
│     - ✓ Strengths (grid)            │ 3. Strengths          │
│     - ✗ Challenges (grid)           │ 4. Red Flags          │
│                                     │ 5. Coaching           │
│  4. When This Goes Wrong            │ 6. Profile            │
│     - Red flags list                │ 7. Love Languages     │
│                                     │ ─────────────────────│
│  5. Your Coaching Focus             │ [Get the App]         │
│     - Coaching items + CTA          │ [Share Results]       │
│                                     │                       │
│  6. Your Dating Profile             │                       │
│     - Radar charts                  │                       │
│                                     │                       │
│  7. Love Languages                  │                       │
│     - Top languages with tips       │                       │
└─────────────────────────────────────┴───────────────────────┘
```

**Mobile**: Sidebar becomes floating button (bottom-right) that opens a bottom sheet with section links.
