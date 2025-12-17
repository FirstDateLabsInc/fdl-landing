# Quiz Feature Implementation Plan

## Overview
Build a premium MBTI-style dating personality quiz for Juliet (First Date Labs) with 47 questions across 6 sections, localStorage persistence, and a comprehensive results page with radar chart visualization.

---

## Implementation Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 | ✅ Complete | Blank quiz page + nav link |
| Phase 1.1 | ✅ Complete | Install `@radix-ui/react-radio-group` |
| Phase 1.2-1.4 | ✅ Complete | UI primitives (radio-group, likert-scale, progress) |
| Phase 1.3 | ✅ Complete | Quiz types (`lib/quiz/types.ts`) |
| Phase 2.1 | ✅ Complete | Scoring algorithms |
| Phase 2.2 | ✅ Complete | Archetype system |
| Phase 3.1-3.6 | ✅ Complete | Quiz flow components |
| Phase 4.1-4.5 | ✅ Complete | Results components |
| Phase 5.1-5.4 | ✅ Complete | Pages & routing |
| Phase 6 | 🔧 In Progress | Polish & testing |


## Design System Reference

### Color Tokens
Use these exact values throughout the quiz feature:

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Cream | `#fffdf6` | `bg-[#fffdf6]` | Page backgrounds |
| Gold | `#f9d544` | `bg-[#f9d544]` | Primary accent, selected states, progress bars |
| Purple | `#cab5d4` | `bg-[#cab5d4]` | Secondary accent, radar chart stroke |
| Yellow | `#ffe362` | `bg-[#ffe362]` | Hover states, highlights |
| Slate 900 | `--` | `text-slate-900` | Headings |
| Slate 600 | `--` | `text-slate-600` | Body text |
| Slate 500 | `--` | `text-slate-500` | Eyebrow text |

### Shadow Classes
Defined in `globals.css`:
- `.shadow-soft` → `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` — cards, buttons
- `.shadow-hover` → `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` — hover states

### Typography
- **Font**: Poppins (loaded via Next.js font system)
- **Weights**: 400 (body), 600 (semibold), 700 (headings)
- **Tracking**: `tracking-[0.35em]` for eyebrow text, `tracking-tight` for headings

### Component Patterns
Follow existing patterns in `app/src/components/ui/`:

1. **CVA (class-variance-authority)** — Define variants for components
2. **Radix UI primitives** — Use for accessible building blocks
3. **Motion (framer-motion)** — Animations with `useReducedMotion()` fallback
4. **forwardRef pattern** — All UI components forward refs

---

## Phase 1: UI Primitives

### Step 1.1: Install Dependencies
```bash
cd app && npm install @radix-ui/react-radio-group
```

### Step 1.2: Create Radio Group Component

**File:** `app/src/components/ui/radio-group.tsx`

**Requirements:**
- Wrap `@radix-ui/react-radio-group` with CVA styling
- Two variants: `default` (card-style options) and `compact` (inline options for scenarios)
- Focus visible ring: `ring-2 ring-[#f9d544] ring-offset-2`
- Selected state: gold background `bg-[#f9d544]`
- Follow `button.tsx` pattern for structure

**Props interface:**
```typescript
interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  variant?: 'default' | 'compact'
  className?: string
}
```

### Step 1.3: Create Likert Scale Component

**File:** `app/src/components/ui/likert-scale.tsx`

**Requirements:**
- 5 circular buttons in horizontal row
- Labels: "Strongly Disagree" (1) to "Strongly Agree" (5)
- Use RadioGroup internally for accessibility
- Selected state: gold fill `bg-[#f9d544]`, white text
- Unselected state: cream background `bg-[#fffdf6]`, slate border
- Keyboard navigation: arrow keys cycle through options
- Size: `w-10 h-10` circles on mobile, `w-12 h-12` on desktop

**Props interface:**
```typescript
interface LikertScaleProps {
  value: number | null
  onValueChange: (value: number) => void
  labels?: { low: string; high: string }
  className?: string
}
```

### Step 1.4: Create Progress Bar Component

**File:** `app/src/components/ui/progress.tsx`

**Requirements:**
- Thin horizontal bar: `h-2 rounded-full`
- Background: `bg-slate-200`
- Fill: `bg-[#f9d544]` (gold)
- Animated width: `transition-all duration-300 ease-out`
- Optional label showing percentage

**Props interface:**
```typescript
interface ProgressProps {
  value: number // 0-100
  showLabel?: boolean
  className?: string
}
```

---

## Phase 2: Scoring & Archetypes

### Step 2.1: Create Scoring Module

**File:** `app/src/lib/quiz/scoring.ts`

**Requirements:**
Implement these 6 scoring functions using types from `types.ts`:

1. **`scoreAttachment(responses)`**
   - Input: responses for S1-S3, AX1-AX3, AV1-AV3, D1-D3
   - Calculate average score for each dimension (Secure, Anxious, Avoidant, Disorganized)
   - Return: `{ scores: { secure, anxious, avoidant, disorganized }, primary: 'secure' | 'anxious' | ... }`

2. **`scoreCommunication(responses)`**
   - Input: responses for COM_PASSIVE_1-2, COM_AGGRESSIVE_1-2, COM_PAGG_1-2, COM_ASSERTIVE_1-2, SCENARIO_1
   - Scenario response maps directly to style (A=passive, B=aggressive, C=passive-aggressive, D=assertive)
   - Scenario weight: 2x compared to Likert items
   - Return: `{ scores: { passive, aggressive, passiveAggressive, assertive }, primary: string }`

3. **`scoreConfidence(responses)`**
   - Input: responses for C1-C5
   - Reverse scoring for C2, C4 (6 - value)
   - Normalize to 0-100 scale
   - Return: `number`

4. **`scoreEmotionalAvailability(responses)`**
   - Input: responses for EA1-EA5
   - Reverse scoring for EA2, EA4
   - Normalize to 0-100 scale
   - Return: `number`

5. **`scoreIntimacy(responses)`**
   - Input: responses for IC1-IC3, BA1-BA3
   - Reverse scoring for BA3
   - Calculate two subscores: comfort (IC items) and boundaries (BA items)
   - Return: `{ comfort: number, boundaries: number }`

6. **`scoreLoveLanguages(responses)`**
   - Input: responses for LL1-LL10
   - Pair give/receive for each language
   - Rank by combined score
   - Return: `string[]` (sorted list of 5 languages)

7. **`calculateAllResults(responses)`**
   - Master function that calls all scoring functions
   - Also calls `getArchetype()` to determine archetype
   - Returns complete `QuizResults` object

### Step 2.2: Create Archetype System

**File:** `app/src/lib/quiz/archetypes.ts`

**Requirements:**

Define 12 archetypes based on:
- Primary attachment style (4 options)
- Communication style (4 options, but grouped)
- Confidence level (high/low threshold at 60)

**Example archetype structure:**
```typescript
interface Archetype {
  id: string
  name: string
  emoji: string
  summary: string
  strengths: string[]
  growthAreas: string[]
}
```

**Archetype examples:**
- "The Steady Connector" (Secure + Assertive + High Confidence)
- "The Careful Romantic" (Anxious + Passive + Low Confidence)
- "The Independent Spirit" (Avoidant + Assertive + High Confidence)

**Function:**
```typescript
export function getArchetype(
  attachment: AttachmentDimension,
  communication: CommunicationStyle,
  confidence: number
): Archetype
```

### Step 2.3: Update Quiz Index

**File:** `app/src/lib/quiz/index.ts`

Add exports for new modules:
```typescript
export * from './types'
export * from './questions'
export * from './scoring'
export * from './archetypes'
```

---

## Phase 3: Quiz Flow Components

### Step 3.1: Create Quiz Header

**File:** `app/src/components/quiz/QuizHeader.tsx`

**Requirements:**
- Sticky header: `sticky top-0 z-50`
- Background: `bg-[#fffdf6]/95 backdrop-blur-sm`
- Content: Logo text "First Date Labs" (left), Exit button (right)
- Exit button: ghost variant, confirms before leaving if quiz in progress
- Height: matches main navbar (`h-[4.5rem]`)

### Step 3.2: Create Quiz Progress Component

**File:** `app/src/components/quiz/QuizProgress.tsx`

**Requirements:**
- Uses Progress UI component from Step 1.4
- Section name display: `text-sm font-semibold tracking-[0.35em] text-slate-500 uppercase`
- Question counter: "Question 3 of 12"
- Overall progress percentage calculated from total questions answered

**Props interface:**
```typescript
interface QuizProgressProps {
  currentSection: string
  currentQuestionIndex: number
  totalQuestionsInSection: number
  overallProgress: number // 0-100
}
```

### Step 3.3: Create Quiz Question Component

**File:** `app/src/components/quiz/QuizQuestion.tsx`

**Requirements:**
- Renders both `likert` and `scenario` question types
- Question text: `text-2xl sm:text-3xl font-semibold text-slate-900 text-center`
- Likert questions: use LikertScale component
- Scenario questions: use RadioGroup with `compact` variant
- Motion animation: fade + slide on question change
- Respect `useReducedMotion()` preference

**Props interface:**
```typescript
interface QuizQuestionProps {
  question: QuizQuestion
  value: number | string | null
  onValueChange: (value: number | string) => void
}
```

### Step 3.4: Create Quiz Navigation Component

**File:** `app/src/components/quiz/QuizNavigation.tsx`

**Requirements:**
- Back button: ghost variant, hidden on first question
- Next button: primary variant (gold background), disabled until answer selected
- Submit button: replaces Next on last question, same styling
- Flex layout: `justify-between` on mobile, `justify-center gap-4` on desktop

**Props interface:**
```typescript
interface QuizNavigationProps {
  canGoBack: boolean
  canGoNext: boolean
  isLastQuestion: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}
```

### Step 3.5: Create Quiz State Hook

**File:** `app/src/hooks/use-quiz.ts`

**Requirements:**
- localStorage key: `juliet-quiz-state`
- State shape matches `QuizState` from types
- Functions:
  - `saveProgress(state)` — debounced, saves on each answer
  - `loadProgress()` — returns saved state or null
  - `clearProgress()` — removes saved state
  - `hasExistingProgress()` — check without loading full state
- Auto-save on each response change
- Handle corrupted localStorage gracefully (clear and start fresh)

**Return interface:**
```typescript
interface UseQuizReturn {
  state: QuizState
  responses: Record<string, number | string>
  setResponse: (questionId: string, value: number | string) => void
  goToNext: () => void
  goToPrevious: () => void
  getCurrentQuestion: () => QuizQuestion
  getProgress: () => number
  clearProgress: () => void
  hasExistingProgress: boolean
}
```

### Step 3.6: Create Quiz Container Component

**File:** `app/src/components/quiz/QuizContainer.tsx`

**Requirements:**
- Client component (`'use client'`)
- Orchestrates entire quiz flow using `use-quiz` hook
- Layout: centered container, max-width `max-w-2xl`
- Sections:
  - QuizProgress at top
  - QuizQuestion in center (flex-grow)
  - QuizNavigation at bottom
- Handles completion: calculates results, saves to localStorage, calls `onComplete` callback
- Min-height: `min-h-[calc(100vh-4.5rem)]` to fill screen below header

**Props interface:**
```typescript
interface QuizContainerProps {
  onComplete: (results: QuizResults) => void
  initialState?: QuizState // for resuming
}
```

---

## Phase 4: Results Components

### Step 4.1: Create Result Card Component

**File:** `app/src/components/quiz/results/ResultCard.tsx`

**Requirements:**
- Card wrapper: `bg-white rounded-2xl shadow-soft p-6`
- Title: `text-lg font-semibold text-slate-900`
- Supports multiple content types:
  - Simple score with progress bar
  - Multiple dimension breakdown (for attachment, communication)
  - Ranked list (for love languages)
- Gold accent bar on left edge: `border-l-4 border-[#f9d544]`

**Props interface:**
```typescript
interface ResultCardProps {
  title: string
  description?: string
  type: 'score' | 'dimensions' | 'ranked'
  data: ScoreData | DimensionData[] | RankedData[]
}
```

### Step 4.2: Create Profile Summary Component

**File:** `app/src/components/quiz/results/ProfileSummary.tsx`

**Requirements:**
- Hero card at top of results: larger, gradient accent
- Background: subtle gradient `bg-gradient-to-br from-[#fffdf6] to-[#f9d544]/10`
- Archetype emoji: `text-6xl`
- Archetype name: `text-3xl font-bold text-slate-900`
- Summary text: `text-lg text-slate-600`
- Strengths/growth areas as bullet lists

**Props interface:**
```typescript
interface ProfileSummaryProps {
  archetype: Archetype
}
```

### Step 4.3: Create Radar Chart Component

**File:** `app/src/components/quiz/results/RadarChart.tsx`

**Requirements:**
- Pure SVG implementation (no external charting library)
- 6-point hexagon for dimensions:
  - Attachment Security
  - Communication Assertiveness
  - Dating Confidence
  - Emotional Availability
  - Intimacy Comfort
  - Boundary Assertiveness
- Styling:
  - Background grid: `stroke-slate-200`
  - Data polygon: `fill-[#f9d544]/30 stroke-[#cab5d4] stroke-2`
  - Labels: positioned outside hexagon
- Motion animation: polygon draws in on mount
- Size: `w-full max-w-md aspect-square`
- Responsive: scales with container

**Props interface:**
```typescript
interface RadarChartProps {
  dimensions: { label: string; value: number }[] // 6 items, 0-100 each
  animated?: boolean
}
```

### Step 4.4: Create Share Results Component

**File:** `app/src/components/quiz/results/ShareResults.tsx`

**Requirements:**
- Share URL: `/quiz/results?id={hash}` (hash of results for sharing)
- Copy link button: uses `navigator.clipboard.writeText()`
- Social buttons (placeholder icons for now): Twitter, LinkedIn
- Success toast on copy (use existing toast pattern if available)

**Props interface:**
```typescript
interface ShareResultsProps {
  shareUrl: string
}
```

### Step 4.5: Create Results Container Component

**File:** `app/src/components/quiz/results/ResultsContainer.tsx`

**Requirements:**
- Client component
- Loads results from localStorage key `juliet-quiz-results`
- If no results, redirect to `/quiz`
- Layout: responsive grid
  - Mobile: single column
  - Desktop: ProfileSummary + RadarChart top row, ResultCards in 2-column grid below
- Staggered animation: cards reveal sequentially on mount

**Props interface:**
```typescript
interface ResultsContainerProps {
  results?: QuizResults // optional, loads from localStorage if not provided
}
```

---

## Phase 5: Pages & Routing

### Step 5.1: Create Quiz Layout

**File:** `app/src/app/quiz/layout.tsx`

**Requirements:**
- Minimal layout without main navbar
- Uses QuizHeader component
- Background: `bg-[#fffdf6]`
- Wraps children in main element

```typescript
export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fffdf6] min-h-screen">
      <QuizHeader />
      <main>{children}</main>
    </div>
  )
}
```

### Step 5.2: Update Quiz Landing Page

**File:** `app/src/app/quiz/page.tsx`

**Current:** Returns `null`

**Update to:**
- Hero section with heading "Discover Your Dating Personality"
- Subheading explaining quiz value
- Stats row: "~8 min • 47 questions • 100% private"
- Benefits list (what they'll learn about themselves)
- Primary CTA button: "Start Quiz" → `/quiz/questions`
- If existing progress detected, show "Resume Quiz" option
- Design: centered layout, cream background, gold accent on CTA

### Step 5.3: Create Quiz Questions Page

**File:** `app/src/app/quiz/questions/page.tsx`

**Requirements:**
- Client component (`'use client'`)
- Renders QuizContainer
- On completion callback:
  - Save results to localStorage (`juliet-quiz-results`)
  - Clear quiz progress (`juliet-quiz-state`)
  - Redirect to `/quiz/results` using `router.push()`

### Step 5.4: Create Quiz Results Page

**File:** `app/src/app/quiz/results/page.tsx`

**Requirements:**
- Renders ResultsContainer
- If no results in localStorage, redirect to `/quiz`
- Footer CTAs:
  - "Retake Quiz" → clears results, goes to `/quiz`
  - "Share Results" → triggers ShareResults component
  - "Start with Juliet" → goes to `/#waitlist`

---

## Phase 6: Polish & Testing

### Step 6.1: Add Motion Animations

**Files to update:** QuizQuestion, QuizContainer, ResultsContainer, RadarChart

**Animation specs:**
- Question transitions: `opacity: 0→1, y: 20→0` over 300ms
- Answer selection: `scale: 1→1.05→1` over 150ms
- Results cards: staggered `opacity: 0→1` with 100ms delay between cards
- Radar chart: polygon path draws from center outward over 800ms

**All animations must:**
- Use `useReducedMotion()` from framer-motion
- Skip or reduce when user prefers reduced motion

### Step 6.2: Add Accessibility Features

**Requirements:**
- All interactive elements have `focus-visible` rings
- RadioGroup and LikertScale support arrow key navigation
- ARIA labels on progress bar, buttons, form elements
- Focus moves to new question after navigation
- Screen reader announces section changes

### Step 6.3: Add Error Handling

**Requirements:**
- Error boundary around QuizContainer
- Graceful localStorage error handling (try/catch, clear if corrupted)
- Fallback UI if results fail to load
- Console warnings for development debugging

### Step 6.4: Testing Checklist

Before marking feature complete:

```
[ ] npm run lint passes with 0 warnings
[ ] npm run preview works (builds and serves via Wrangler)
[ ] Quiz flow works end-to-end (all 48 questions)
[ ] Results display correctly with all components
[ ] Mobile viewport (375px) layout looks correct
[ ] Keyboard-only navigation works throughout
[ ] localStorage persistence works (refresh mid-quiz, resume)
[ ] Reduced motion preference is respected
[ ] Exit quiz confirmation appears when in progress
```

---

## File Creation Summary

### Files Already Created (4)
```
app/src/app/quiz/page.tsx          ← Needs content (currently returns null)
app/src/lib/quiz/types.ts          ← Complete
app/src/lib/quiz/questions.ts      ← Complete
app/src/lib/quiz/index.ts          ← Needs additional exports
app/src/lib/constants.ts           ← Quiz nav link added
```

### Files to Create (19)
```
app/src/
├── app/quiz/
│   ├── layout.tsx                 ← Phase 5.1
│   ├── questions/page.tsx         ← Phase 5.3
│   └── results/page.tsx           ← Phase 5.4
├── components/
│   ├── quiz/
│   │   ├── QuizContainer.tsx      ← Phase 3.6
│   │   ├── QuizHeader.tsx         ← Phase 3.1
│   │   ├── QuizProgress.tsx       ← Phase 3.2
│   │   ├── QuizQuestion.tsx       ← Phase 3.3
│   │   ├── QuizNavigation.tsx     ← Phase 3.4
│   │   └── results/
│   │       ├── ResultsContainer.tsx  ← Phase 4.5
│   │       ├── ResultCard.tsx        ← Phase 4.1
│   │       ├── ProfileSummary.tsx    ← Phase 4.2
│   │       ├── RadarChart.tsx        ← Phase 4.3
│   │       └── ShareResults.tsx      ← Phase 4.4
│   └── ui/
│       ├── radio-group.tsx        ← Phase 1.2
│       ├── likert-scale.tsx       ← Phase 1.3
│       └── progress.tsx           ← Phase 1.4
├── hooks/
│   └── use-quiz.ts                ← Phase 3.5
└── lib/quiz/
    ├── scoring.ts                 ← Phase 2.1
    └── archetypes.ts              ← Phase 2.2
```

---

## Recommended Implementation Order

Execute phases in this exact order to ensure dependencies are satisfied:

1. **Phase 1.1** — Install `@radix-ui/react-radio-group`
2. **Phase 1.2-1.4** — Create UI primitives (radio-group → likert-scale → progress)
3. **Phase 2.1-2.2** — Create scoring and archetype modules
4. **Phase 3.5** — Create `use-quiz` hook (needed before components)
5. **Phase 3.1-3.4** — Create quiz flow components (header → progress → question → navigation)
6. **Phase 3.6** — Create QuizContainer (depends on all above)
7. **Phase 4.1-4.4** — Create result components (card → summary → radar → share)
8. **Phase 4.5** — Create ResultsContainer
9. **Phase 5.1** — Create quiz layout
10. **Phase 5.2** — Update quiz landing page
11. **Phase 5.3-5.4** — Create questions and results pages
12. **Phase 6** — Polish, animations, and testing

---

## Key Architecture Decisions

- **localStorage-first**: No backend required for MVP; results stored client-side
- **State machine pattern**: QuizContainer manages all state transitions cleanly
- **CVA + Radix patterns**: Consistent with existing UI components in codebase
- **Motion animations**: Premium feel with mandatory accessibility fallbacks
- **Progress auto-save**: Users can resume interrupted quizzes seamlessly
