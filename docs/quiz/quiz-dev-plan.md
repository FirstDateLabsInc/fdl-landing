# Quiz Feature - Frontend Development Plan

## Overview

A personality and self-awareness quiz for Juliet (First Date Labs), helping users understand their dating personality through a premium, MBTI-style assessment experience.

**Questions Document**: [`docs/quiz/quiz-question.md`](./quiz-question.md)

---
### User Decisions
| Decision | Choice |
|----------|--------|
| Authentication | Anonymous-first (login to save/share results) |
| Navigation | Minimal header (logo + exit during quiz) |
| Question Data | Client will provide full question set |
| Results Display | Cards + progress bars + radar chart |

---

## Current Implementation Status

### Completed: Phase 0 - Route Setup

The following files have been created/modified to establish the quiz route:

| File | Status | Description |
|------|--------|-------------|
| `app/src/app/quiz/page.tsx` | **CREATED** | Blank quiz page (returns `null`) - establishes `/quiz` route |
| `app/src/lib/constants.ts` | **MODIFIED** | Added Quiz link to navigation (line 265) |

**File Details:**

**`app/src/app/quiz/page.tsx`** (new file)
```tsx
export default function QuizPage() {
  return null;
}
```
> Purpose: Establishes the `/quiz` route for navigation. Currently returns null (blank page) as a placeholder for future quiz landing page content.

**`app/src/lib/constants.ts`** (modified - line 265)
```typescript
links: [
  { label: "Home", href: "/" },
  { label: "Press", href: "/press" },
  { label: "Login", href: "/login" },
  { label: "Quiz", href: "/quiz" },  // ADDED
],
```
> Purpose: Adds "Quiz" link to the main navigation bar, making the quiz accessible from the navbar.

### Completed: Phase 1 (Partial) - Data Structure

The quiz data structure has been implemented with TypeScript interfaces and all 48 questions:

| File | Status | Description |
|------|--------|-------------|
| `app/src/lib/quiz/types.ts` | **CREATED** | TypeScript interfaces for quiz system |
| `app/src/lib/quiz/questions.ts` | **CREATED** | All 48 questions with scoring metadata |
| `app/src/lib/quiz/index.ts` | **CREATED** | Central exports for quiz library |

**File Details:**

**`app/src/lib/quiz/types.ts`** - Core type definitions:
- `AttachmentDimension`, `CommunicationStyle`, `LoveLanguage`, `IntimacyDimension` - Scoring dimensions
- `ScoringTarget` - Discriminated union for type-safe scoring per section
- `LikertQuestion`, `ScenarioQuestion` - Question type definitions with `reverse` flag support
- `QuizSection`, `QuizSession`, `QuizResponse` - Session and response tracking
- `QuizResults`, `AttachmentResult`, `CommunicationResult`, etc. - Result type definitions
- `StoredSession`, `StoredResults` - localStorage schema with version field

**`app/src/lib/quiz/questions.ts`** - Question data (48 questions):
- 6 sections: Attachment (12), Communication (9), Confidence (5), Emotional (5), Intimacy (6), Love Languages (10)
- Full question text from `quiz-question.md`
- Exports: `quizSections`, `allQuestions`, `totalQuestions`
- Helper functions: `getQuestionById()`, `getSectionById()`, `getSectionForQuestion()`

**`app/src/lib/quiz/index.ts`** - Central export:
```typescript
export * from './types';
export { quizSections, allQuestions, totalQuestions, getQuestionById, getSectionById, getSectionForQuestion } from './questions';
```

### Next Implementation Phase

Continue with **Phase 1: UI Components** - Create RadioGroup, LikertScale, and Progress UI primitives.

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Duration | ~8-10 minutes |
| Total Questions | 48 items across 6 sections |
| Question Types | Likert scale (1-5) + scenario/multiple-choice |
| State Management | localStorage (frontend-only for now) |

---

## Quiz Sections Summary

| Section | Items | Type | Measures |
|---------|-------|------|----------|
| A. Attachment Style | 12 | Likert | Secure, Anxious, Avoidant, Fearful |
| B. Communication Style | 9 | 8 Likert + 1 scenario | Passive, Aggressive, Passive-Aggressive, Assertive |
| C. Dating Confidence | 5-6 | Likert | 0-100 confidence score |
| D. Emotional Availability | 5 | Likert | 0-100 availability score |
| E. Sexual Attitudes & Intimacy | 6 | Likert | Intimacy Comfort, Boundary Assertiveness |
| F. Love Languages | 10 | Likert | Words, Acts, Gifts, Time, Touch |

See [`quiz-question.md`](./quiz-question.md) for full question text and scoring dimensions.

---

## Technical Architecture

### Navigation Update

Add "Quiz" link to the main navigation bar next to "Login":

```typescript
// In app/src/lib/constants.ts → navigation.links (line ~261-265)
links: [
  { label: "Home", href: "/" },
  { label: "Press", href: "/press" },
  { label: "Login", href: "/login" },
  { label: "Quiz", href: "/quiz" },  // NEW - add after Login
],
```

### Tech Stack Additions
```
New Dependencies:
└── @radix-ui/react-radio-group  # Accessible radio inputs
```

### File Structure
```
app/src/
├── app/quiz/
│   ├── page.tsx                    # Quiz landing/start page
│   ├── layout.tsx                  # Minimal header layout
│   ├── questions/
│   │   └── page.tsx                # Main quiz flow (client component)
│   └── results/
│       └── page.tsx                # Results display
│
├── components/
│   ├── quiz/
│   │   ├── QuizContainer.tsx       # State machine + orchestration
│   │   ├── QuizProgress.tsx        # Progress bar + section indicator
│   │   ├── QuizQuestion.tsx        # Question renderer (Likert + Scenario)
│   │   ├── QuizNavigation.tsx      # Back/Next buttons
│   │   ├── QuizIntro.tsx           # Section intro cards
│   │   ├── QuizHeader.tsx          # Minimal header (logo + exit)
│   │   └── results/
│   │       ├── ResultsContainer.tsx
│   │       ├── ResultCard.tsx
│   │       ├── ProfileSummary.tsx
│   │       ├── RadarChart.tsx      # Personality visualization (SVG)
│   │       └── ShareResults.tsx
│   │
│   └── ui/
│       ├── radio-group.tsx         # NEW: Radix RadioGroup
│       ├── likert-scale.tsx        # NEW: 5-point scale
│       └── progress.tsx            # NEW: Progress bar
│
├── lib/
│   └── quiz/
│       ├── index.ts                # Central exports ✓ CREATED
│       ├── types.ts                # Quiz TypeScript types ✓ CREATED
│       ├── questions.ts            # Question data (48 questions) ✓ CREATED
│       ├── scoring.ts              # Scoring algorithms
│       └── archetypes.ts           # Result archetypes
│
└── hooks/
    └── use-quiz.ts                 # Quiz state management (localStorage)
```

---

## Component Specifications

### QuizContainer (Main Orchestrator)
```typescript
type QuizStatus =
  | 'intro'        // Section intro screen
  | 'question'     // Showing a question
  | 'completing'   // Calculating results
  | 'complete';    // Redirect to results

interface QuizState {
  status: QuizStatus;
  sections: QuizSection[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  responses: Record<string, number | string>; // questionId -> response
  progress: number; // 0-100
}
```

### LikertScale Component
```typescript
interface LikertScaleProps {
  value?: number;
  onValueChange: (value: number) => void;
  labels?: [string, string]; // ['Strongly Disagree', 'Strongly Agree']
  disabled?: boolean;
}
```
- 5 circular buttons in a row
- Selected state: gold fill (`#f9d544`)
- Keyboard: arrow keys to navigate
- Accessibility: aria-label for each point

### Progress Component
```typescript
interface ProgressProps {
  value: number;        // 0-100
  showLabel?: boolean;  // Show percentage
  sectionName?: string; // Current section name
}
```
- Thin horizontal bar (`h-2`)
- Gold fill with cream background
- Animated width transitions

### RadarChart Component
```typescript
interface RadarChartProps {
  dimensions: Array<{
    label: string;
    value: number; // 0-100
  }>;
  size?: number;
}
```
- SVG-based hexagon (6 dimensions)
- Gold fill with purple stroke
- Animated on mount

---

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LANDING (/quiz)                                          │
│    - Hero: "Discover Your Dating Personality"               │
│    - Benefits list (what you'll learn)                      │
│    - "~8 min • 48 questions • 100% private"                 │
│    - [Start Quiz] button → /quiz/questions                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. QUESTION (Likert type)                                   │
│    - Progress bar                                           │
│    - Section name + question counter                        │
│    - Question text (large, centered)                        │
│    - LikertScale (1-5)                                      │
│    - [← Back] [Next →] navigation                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. QUESTION (Scenario type - Communication only)            │
│    - Same header as Likert                                  │
│    - Scenario text                                          │
│    - RadioGroup with 4 options (cards)                      │
│    - [← Back] [Next →] navigation                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. COMPLETION (calculating)                                 │
│    - "Quiz Complete!" message                               │
│    - Animated loading indicator                             │
│    - "Calculating your personality profile..."              │
│    - Save to localStorage → Redirect to /quiz/results       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. RESULTS (/quiz/results)                                  │
│    - Profile archetype card (emoji + name + summary)        │
│    - Radar chart (6 dimensions)                             │
│    - Result cards grid:                                     │
│      • Attachment Style (with breakdown bars)               │
│      • Communication Style                                  │
│      • Dating Confidence (progress bar 0-100)               │
│      • Emotional Availability (progress bar 0-100)          │
│      • Intimacy Style                                       │
│      • Love Languages (ranked list)                         │
│    - [Share Results] [Retake Quiz]                          │
│    - [Start Practicing with Juliet] CTA                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Scoring Algorithms

### Attachment Style (12 items → 4 dimensions)

Questions mapped by dimension:
- **Secure**: S1, S2, S3
- **Anxious**: AX1, AX2, AX3
- **Avoidant**: AV1, AV2, AV3
- **Fearful/Disorganized**: D1, D2, D3

```typescript
function scoreAttachment(responses: Record<string, number>): AttachmentResult {
  const dimensions = {
    secure: ['S1', 'S2', 'S3'],
    anxious: ['AX1', 'AX2', 'AX3'],
    avoidant: ['AV1', 'AV2', 'AV3'],
    fearful: ['D1', 'D2', 'D3'],
  };

  const scores: Record<string, number> = {};

  for (const [dim, questionIds] of Object.entries(dimensions)) {
    const sum = questionIds.reduce((acc, id) => acc + (responses[id] || 3), 0);
    // Normalize: (avg - 1) * 25 = 0-100 scale
    scores[dim] = Math.round(((sum / 3) - 1) * 25);
  }

  const primary = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[0][0];

  return { scores, primary };
}
```

### Communication Style (9 items → 4 styles + scenario)

Questions mapped by style:
- **Passive**: COM_PASSIVE_1, COM_PASSIVE_2
- **Aggressive**: COM_AGGRESSIVE_1, COM_AGGRESSIVE_2
- **Passive-Aggressive**: COM_PAGG_1, COM_PAGG_2
- **Assertive**: COM_ASSERTIVE_1, COM_ASSERTIVE_2
- **Scenario**: Direct choice (A/B/C/D)

```typescript
function scoreCommunication(responses: Record<string, number | string>): CommunicationResult {
  const styles = {
    passive: ['COM_PASSIVE_1', 'COM_PASSIVE_2'],
    aggressive: ['COM_AGGRESSIVE_1', 'COM_AGGRESSIVE_2'],
    passiveAggressive: ['COM_PAGG_1', 'COM_PAGG_2'],
    assertive: ['COM_ASSERTIVE_1', 'COM_ASSERTIVE_2'],
  };

  const scores: Record<string, number> = {};

  for (const [style, questionIds] of Object.entries(styles)) {
    const sum = questionIds.reduce((acc, id) => acc + (responses[id] as number || 3), 0);
    scores[style] = Math.round(((sum / 2) - 1) * 25);
  }

  // Scenario response adds weight
  const scenario = responses['COM_SCENARIO'] as string;
  if (scenario) {
    const scenarioMap = { A: 'passive', B: 'aggressive', C: 'passiveAggressive', D: 'assertive' };
    scores[scenarioMap[scenario]] += 15;
  }

  const primary = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[0][0];

  return { scores, primary };
}
```

### Dating Confidence (5-6 items → 0-100 score)

Questions: C1, C2 (reverse), C3, C4 (reverse), C5, C6

```typescript
function scoreConfidence(responses: Record<string, number>): number {
  const reverseScored = ['C2', 'C4'];
  const questionIds = ['C1', 'C2', 'C3', 'C4', 'C5'];

  let sum = 0;
  for (const id of questionIds) {
    const value = responses[id] || 3;
    sum += reverseScored.includes(id) ? (6 - value) : value;
  }

  return Math.round(((sum / questionIds.length) - 1) * 25);
}
```

### Emotional Availability (5 items → 0-100 score)

Questions: EA1, EA2 (reverse), EA3, EA4 (reverse), EA5

```typescript
function scoreEmotionalAvailability(responses: Record<string, number>): number {
  const reverseScored = ['EA2', 'EA4'];
  const questionIds = ['EA1', 'EA2', 'EA3', 'EA4', 'EA5'];

  let sum = 0;
  for (const id of questionIds) {
    const value = responses[id] || 3;
    sum += reverseScored.includes(id) ? (6 - value) : value;
  }

  return Math.round(((sum / questionIds.length) - 1) * 25);
}
```

### Intimacy Style (6 items → 2 sub-scores)

- **Intimacy Comfort**: IC1, IC2, IC3
- **Boundary Assertiveness**: BA1, BA2, BA3 (reverse)

```typescript
function scoreIntimacy(responses: Record<string, number>): IntimacyResult {
  const comfortIds = ['IC1', 'IC2', 'IC3'];
  const boundaryIds = ['BA1', 'BA2', 'BA3'];

  const comfortSum = comfortIds.reduce((acc, id) => acc + (responses[id] || 3), 0);
  const comfortScore = Math.round(((comfortSum / 3) - 1) * 25);

  let boundarySum = 0;
  for (const id of boundaryIds) {
    const value = responses[id] || 3;
    boundarySum += id === 'BA3' ? (6 - value) : value;
  }
  const boundaryScore = Math.round(((boundarySum / 3) - 1) * 25);

  return { comfort: comfortScore, boundaries: boundaryScore };
}
```

### Love Languages (10 items → ranked list)

Questions: LL1-LL10 (2 per language: give + receive)

```typescript
function scoreLoveLanguages(responses: Record<string, number>): string[] {
  const languages = {
    words: ['LL1', 'LL2'],
    time: ['LL3', 'LL4'],
    acts: ['LL5', 'LL6'],
    gifts: ['LL7', 'LL8'],
    touch: ['LL9', 'LL10'],
  };

  const scores: Record<string, number> = {};

  for (const [lang, ids] of Object.entries(languages)) {
    scores[lang] = ids.reduce((acc, id) => acc + (responses[id] || 3), 0);
  }

  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([lang]) => lang);
}
```

### Profile Archetype

```typescript
const ARCHETYPES: Record<string, Archetype> = {
  'secure-assertive-high': {
    name: 'The Confident Connector',
    emoji: '🌟',
    summary: 'You bring authentic confidence to dating. Your secure attachment and assertive communication create genuine connections.'
  },
  'anxious-passive-medium': {
    name: 'The Devoted Seeker',
    emoji: '💝',
    summary: 'Your deep care for others drives your relationships. Building confidence in expressing needs will enhance your connections.'
  },
  'avoidant-assertive-high': {
    name: 'The Independent Spirit',
    emoji: '🦋',
    summary: 'You value autonomy while maintaining clear boundaries. Opening up gradually can deepen meaningful connections.'
  },
  // ... 12-16 combinations
};

function getArchetype(results: QuizResults): Archetype {
  const attachment = results.attachment.primary;
  const communication = results.communication.primary;
  const confidence = results.confidence >= 70 ? 'high' :
                     results.confidence >= 40 ? 'medium' : 'low';

  const key = `${attachment}-${communication}-${confidence}`;
  return ARCHETYPES[key] || ARCHETYPES['secure-assertive-medium']; // fallback
}
```

---

## Implementation Phases

### Phase 1: UI Components
**Goal**: Build reusable quiz UI primitives

**Tasks**:
1. Install dependency: `@radix-ui/react-radio-group`
2. Create `RadioGroup` component (Radix-based)
3. Create `LikertScale` component
4. Create `Progress` component
5. Create quiz types in `lib/quiz/types.ts`

**Files to create**:
- `app/src/components/ui/radio-group.tsx`
- `app/src/components/ui/likert-scale.tsx`
- `app/src/components/ui/progress.tsx`
- `app/src/lib/quiz/types.ts`

---

### Phase 2: Question Data & Scoring
**Goal**: Convert questions to code and implement scoring

**Tasks**:
1. Create question data structure from `quiz-question.md`
2. Implement all 6 scoring algorithms
3. Create archetype definitions
4. Add "Quiz" link to navigation (next to "Login" in navbar)

**Files to create**:
- `app/src/lib/quiz/questions.ts`
- `app/src/lib/quiz/scoring.ts`
- `app/src/lib/quiz/archetypes.ts`

**Files to modify**:
- `app/src/lib/constants.ts` - add `{ label: "Quiz", href: "/quiz" }` to `navigation.links` array after "Login"

---

### Phase 3: Quiz Flow Components
**Goal**: Build main quiz experience components

**Tasks**:
1. Create `QuizHeader` (minimal: logo + exit)
2. Create `QuizProgress` component
3. Create `QuizIntro` section intro
4. Create `QuizQuestion` component (Likert + Scenario)
5. Create `QuizNavigation` component
6. Create `QuizContainer` with state machine
7. Create `use-quiz.ts` hook (localStorage state)

**Files to create**:
- `app/src/components/quiz/QuizHeader.tsx`
- `app/src/components/quiz/QuizProgress.tsx`
- `app/src/components/quiz/QuizIntro.tsx`
- `app/src/components/quiz/QuizQuestion.tsx`
- `app/src/components/quiz/QuizNavigation.tsx`
- `app/src/components/quiz/QuizContainer.tsx`
- `app/src/hooks/use-quiz.ts`

---

### Phase 4: Results Components
**Goal**: Build results display

**Tasks**:
1. Create `ResultCard` component
2. Create `ProfileSummary` component
3. Create `RadarChart` component (SVG)
4. Create `ShareResults` component
5. Create `ResultsContainer` orchestrator

**Files to create**:
- `app/src/components/quiz/results/ResultCard.tsx`
- `app/src/components/quiz/results/ProfileSummary.tsx`
- `app/src/components/quiz/results/RadarChart.tsx`
- `app/src/components/quiz/results/ShareResults.tsx`
- `app/src/components/quiz/results/ResultsContainer.tsx`

---

### Phase 5: Pages & Routing
**Goal**: Create pages and wire everything together

**Tasks**:
1. Create quiz layout (`app/quiz/layout.tsx`)
2. Create quiz landing page (`/quiz`)
3. Create quiz questions page (`/quiz/questions`)
4. Create quiz results page (`/quiz/results`)

**Files to create**:
- `app/src/app/quiz/layout.tsx`
- `app/src/app/quiz/page.tsx`
- `app/src/app/quiz/questions/page.tsx`
- `app/src/app/quiz/results/page.tsx`

---

### Phase 6: Polish & Animations
**Goal**: Add animations and polish UX

**Tasks**:
1. Add Motion animations (page transitions, answer selection)
2. Add keyboard navigation (arrows for Likert)
3. Implement `useReducedMotion` support
4. Add error boundaries
5. Test on Cloudflare Workers (`npm run preview`)
6. Mobile responsiveness testing

**Files to modify**:
- All quiz components (add animations)

---

## Design Guidelines

Follow existing design system:
- **Colors**: cream `#fffdf6`, gold `#f9d544`, purple `#cab5d4`, yellow `#ffe362`
- **Shadows**: `shadow-soft`, `shadow-hover`
- **Borders**: Borderless design, use shadows for elevation
- **Corners**: `rounded-2xl` for cards, `rounded-full` for buttons
- **Typography**: Poppins font family
- **Animations**: Motion library with `useReducedMotion` support
- **Hover**: `-translate-y-0.5` lift effect

---

## Critical Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `lib/quiz/index.ts` | Central exports for quiz library | ✓ Done |
| `lib/quiz/types.ts` | TypeScript interfaces & type definitions | ✓ Done |
| `lib/quiz/questions.ts` | All 48 questions with IDs and metadata | ✓ Done |
| `lib/quiz/scoring.ts` | All scoring algorithms | Pending |
| `lib/quiz/archetypes.ts` | Result archetype definitions | Pending |
| `components/quiz/QuizContainer.tsx` | Main state machine & orchestration | Pending |
| `components/ui/likert-scale.tsx` | Core input for most questions | Pending |
| `hooks/use-quiz.ts` | State management with localStorage | Pending |
| `app/quiz/questions/page.tsx` | Main quiz flow page | Pending |
| `app/quiz/results/page.tsx` | Results display page | Pending |

---

## Next Steps

1. **Phase 1**: Create UI primitives (RadioGroup, LikertScale, Progress)
2. **Phase 2**: Convert questions to TypeScript and implement scoring
3. **Phase 3-6**: Build quiz flow, results, pages, and polish

---

## Future Enhancements (Post-MVP)

- [ ] Database integration (Supabase) for persistence
- [ ] User authentication to save/share results
- [ ] Session recovery for incomplete quizzes
- [ ] Analytics tracking
- [ ] A/B testing different question orders
