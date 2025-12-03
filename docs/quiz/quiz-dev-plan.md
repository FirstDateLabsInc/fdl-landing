# Quiz Feature - PRD & Architecture Document

## Product Requirements Document

### Overview
A personality and self-awareness quiz for Juliet (First Date Labs), helping users understand their dating personality through a premium, MBTI-style assessment experience.

### Key Metrics
- **Duration**: ~8-10 minutes
- **Questions**: 47-49 items across 6 sections
- **Question Types**: Likert scale (1-5) + scenario/multiple-choice

### User Decisions
| Decision | Choice |
|----------|--------|
| Authentication | Anonymous-first (login to save/share results) |
| Navigation | Minimal header (logo + exit during quiz) |
| Question Data | Client will provide full question set |
| Results Display | Cards + progress bars + radar chart |

---

## Quiz Sections

| Section | Items | Type | Measures |
|---------|-------|------|----------|
| Attachment Style | 12 | Likert | Secure, Anxious, Avoidant, Fearful |
| Communication Style | 9 | 8 Likert + 1 scenario | Direct, Analytical, Expressive, Amiable |
| Dating Confidence | 4-5 | Likert | 0-100 confidence score |
| Emotional Availability | 4-5 | Likert | 0-100 availability score |
| Sexual Attitudes & Intimacy | 8 | Likert | Openness, Boundaries, Style |
| Love Languages | 10 | Forced choice | Words, Acts, Gifts, Time, Touch |

---

## Technical Architecture

### Tech Stack Additions
```
New Dependencies:
├── @supabase/supabase-js    # Supabase client
├── @supabase/ssr            # Edge-compatible SSR helpers
└── @radix-ui/react-radio-group  # Accessible radio inputs
```

### File Structure
```
app/src/
├── app/quiz/
│   ├── page.tsx                    # Quiz landing/start page
│   ├── layout.tsx                  # Minimal header layout
│   ├── [sessionId]/
│   │   ├── page.tsx                # Main quiz flow
│   │   └── loading.tsx             # Loading skeleton
│   └── results/[sessionId]/
│       ├── page.tsx                # Results display
│       └── loading.tsx
│
├── components/
│   ├── quiz/
│   │   ├── QuizContainer.tsx       # State machine + orchestration
│   │   ├── QuizProgress.tsx        # Progress bar + section indicator
│   │   ├── QuizQuestion.tsx        # Question renderer
│   │   ├── QuizNavigation.tsx      # Back/Next/Skip buttons
│   │   ├── QuizIntro.tsx           # Section intro cards
│   │   ├── QuizHeader.tsx          # Minimal header (logo + exit)
│   │   └── results/
│   │       ├── ResultsContainer.tsx
│   │       ├── ResultCard.tsx
│   │       ├── ProfileSummary.tsx
│   │       ├── RadarChart.tsx      # Personality visualization
│   │       └── ShareResults.tsx
│   │
│   └── ui/
│       ├── radio-group.tsx         # NEW: Radix RadioGroup
│       ├── likert-scale.tsx        # NEW: 5-point scale
│       └── progress.tsx            # NEW: Progress bar
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Edge/server client
│   │   └── types.ts                # Generated DB types
│   │
│   └── quiz/
│       ├── types.ts                # Quiz TypeScript types
│       ├── scoring.ts              # Scoring algorithms
│       ├── archetypes.ts           # Result archetypes
│       └── constants.ts            # Quiz-specific constants
│
└── hooks/
    └── use-quiz-session.ts         # Quiz state management
```

---

## Database Schema (Supabase)

### Tables

```sql
-- 1. Quiz Sections
CREATE TABLE quiz_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- 'attachment-style'
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_minutes INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Quiz Questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES quiz_sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('likert', 'scenario')),
  order_index INTEGER NOT NULL,
  scoring_dimension TEXT,              -- 'anxious', 'secure', etc.
  reverse_scored BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Answer Options (for scenario questions)
CREATE TABLE quiz_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_value TEXT NOT NULL,          -- Maps to category
  order_index INTEGER NOT NULL
);

-- 4. Quiz Sessions
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,                        -- NULL for anonymous
  anonymous_id TEXT,                   -- localStorage ID
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  current_section_index INTEGER DEFAULT 0,
  current_question_index INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT false
);

-- 5. Quiz Responses
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id),
  response_value TEXT NOT NULL,        -- '1'-'5' or option_id
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, question_id)
);

-- 6. Quiz Results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,

  -- Attachment Style
  attachment_scores JSONB,             -- {secure: 78, anxious: 45, ...}
  attachment_primary TEXT,

  -- Communication Style
  communication_style TEXT,
  communication_scores JSONB,

  -- Confidence & Availability (0-100)
  dating_confidence_score INTEGER,
  emotional_availability_score INTEGER,

  -- Intimacy
  intimacy_scores JSONB,

  -- Love Languages (ranked array)
  love_languages_ranked JSONB,         -- ['time', 'words', ...]

  -- Profile
  profile_archetype TEXT,
  profile_summary TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_sessions_anonymous ON quiz_sessions(anonymous_id);
CREATE INDEX idx_responses_session ON quiz_responses(session_id);
CREATE INDEX idx_questions_section ON quiz_questions(section_id, order_index);
```

---

## Component Specifications

### QuizContainer (Main Orchestrator)
```typescript
// State machine states
type QuizStatus =
  | 'loading'      // Fetching questions
  | 'intro'        // Section intro screen
  | 'question'     // Showing a question
  | 'completing'   // Calculating results
  | 'complete';    // Redirect to results

// Core state
interface QuizState {
  status: QuizStatus;
  sessionId: string;
  sections: QuizSection[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  responses: Map<string, string>;
  progress: number; // 0-100
}
```

### LikertScale Component
```typescript
interface LikertScaleProps {
  value?: string;
  onValueChange: (value: string) => void;
  labels?: [string, string]; // ['Strongly Disagree', 'Strongly Agree']
  disabled?: boolean;
}
```
- 5 circular buttons in a row
- Selected state: gold fill (#f9d544)
- Keyboard: arrow keys to navigate
- Accessibility: aria-label for each point

### Progress Component
```typescript
interface ProgressProps {
  value: number;        // 0-100
  showLabel?: boolean;  // Show percentage
  showSection?: string; // Current section name
}
```
- Thin horizontal bar (h-2)
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
- SVG-based pentagon/hexagon
- Gold fill with purple stroke
- Animated on mount

---

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LANDING (/quiz)                                          │
│    - Hero: "Discover Your Dating Personality"               │
│    - Benefits list (what you'll learn)                      │
│    - "~8 min • 47 questions • 100% private"                 │
│    - [Start Quiz] button                                    │
│    └── Creates session → Redirects to /quiz/[sessionId]    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SECTION INTRO (between each section)                     │
│    - Progress bar (28% complete)                            │
│    - Section icon + title                                   │
│    - Brief description                                      │
│    - "9 questions • ~2 min"                                 │
│    - [Continue] button                                      │
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
│ 4. QUESTION (Scenario type)                                 │
│    - Same header as Likert                                  │
│    - Scenario text                                          │
│    - RadioGroup with 3-4 options (cards)                    │
│    - [← Back] [Next →] navigation                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. COMPLETION (calculating)                                 │
│    - "Quiz Complete!" message                               │
│    - Animated loading indicator                             │
│    - "Calculating your personality profile..."              │
│    └── POST results → Redirect to /quiz/results/[id]       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. RESULTS (/quiz/results/[sessionId])                      │
│    - Profile archetype card (emoji + name + summary)        │
│    - Radar chart (6 dimensions)                             │
│    - Result cards grid:                                     │
│      • Attachment Style (with breakdown)                    │
│      • Communication Style                                  │
│      • Dating Confidence (progress bar)                     │
│      • Emotional Availability (progress bar)                │
│      • Intimacy Style                                       │
│      • Love Languages (ranked list)                         │
│    - [Share Results] [Sign up to save]                      │
│    - [Start Practicing with Juliet] CTA                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Scoring Algorithms

### Attachment Style (12 items → 4 dimensions)
```typescript
function scoreAttachment(responses: Response[]): AttachmentResult {
  const scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };

  // Each dimension has 3 questions
  // Average responses (1-5) and normalize to 0-100
  for (const r of responses) {
    const value = r.reverse_scored ? (6 - r.value) : r.value;
    scores[r.dimension] += value;
  }

  // Normalize: (avg - 1) * 25 = 0-100 scale
  Object.keys(scores).forEach(k => {
    scores[k] = ((scores[k] / 3) - 1) * 25;
  });

  const primary = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[0][0];

  return { scores, primary };
}
```

### Love Languages (10 items → ranked list)
```typescript
function scoreLoveLanguages(responses: Response[]): string[] {
  const counts = { words: 0, acts: 0, gifts: 0, time: 0, touch: 0 };

  // Each response selects a love language
  responses.forEach(r => counts[r.value]++);

  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .map(([lang]) => lang);
}
```

### Profile Archetype
```typescript
const ARCHETYPES = {
  'secure-direct-high': {
    name: 'The Confident Connector',
    emoji: '🌟',
    summary: 'You bring authentic confidence to dating...'
  },
  'anxious-expressive-medium': {
    name: 'The Passionate Seeker',
    emoji: '💫',
    summary: 'Your emotional depth creates meaningful...'
  },
  // ... 12-16 combinations
};

function getArchetype(results: Results): Archetype {
  const attachment = results.attachment_primary;
  const communication = results.communication_style;
  const confidence = results.dating_confidence_score >= 70 ? 'high' :
                     results.dating_confidence_score >= 40 ? 'medium' : 'low';

  return ARCHETYPES[`${attachment}-${communication}-${confidence}`];
}
```

---

## Implementation Phases

### Phase 1: Foundation (3-4 days)
**Goal**: Set up Supabase and base infrastructure

**Tasks**:
1. Create Supabase project, configure env vars in `wrangler.jsonc`
2. Create database schema (run migrations)
3. Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `@radix-ui/react-radio-group`
4. Create Supabase clients (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
5. Generate TypeScript types from DB schema
6. Add "Quiz" link to navigation in `constants.ts`

**Files to create/modify**:
- `app/wrangler.jsonc` - add SUPABASE_URL, SUPABASE_ANON_KEY
- `app/package.json` - add dependencies
- `app/src/lib/supabase/client.ts` - browser client
- `app/src/lib/supabase/server.ts` - edge client
- `app/src/lib/supabase/types.ts` - DB types
- `app/src/lib/constants.ts` - add quiz nav link

---

### Phase 2: UI Components (2-3 days)
**Goal**: Build reusable quiz UI primitives

**Tasks**:
1. Create `RadioGroup` component (Radix-based)
2. Create `LikertScale` component
3. Create `Progress` component
4. Create quiz types in `lib/quiz/types.ts`
5. Test components in isolation

**Files to create**:
- `app/src/components/ui/radio-group.tsx`
- `app/src/components/ui/likert-scale.tsx`
- `app/src/components/ui/progress.tsx`
- `app/src/lib/quiz/types.ts`

---

### Phase 3: Quiz Flow (3-4 days)
**Goal**: Build main quiz experience

**Tasks**:
1. Create `QuizContainer` with state management
2. Create `QuizHeader` (minimal: logo + exit)
3. Create `QuizProgress` component
4. Create `QuizQuestion` component
5. Create `QuizNavigation` component
6. Create `QuizIntro` section intro
7. Create `use-quiz-session.ts` hook
8. Create quiz layout (`app/quiz/layout.tsx`)

**Files to create**:
- `app/src/app/quiz/layout.tsx`
- `app/src/components/quiz/QuizContainer.tsx`
- `app/src/components/quiz/QuizHeader.tsx`
- `app/src/components/quiz/QuizProgress.tsx`
- `app/src/components/quiz/QuizQuestion.tsx`
- `app/src/components/quiz/QuizNavigation.tsx`
- `app/src/components/quiz/QuizIntro.tsx`
- `app/src/hooks/use-quiz-session.ts`

---

### Phase 4: Pages & Data Flow (2-3 days)
**Goal**: Create pages and wire up Supabase

**Tasks**:
1. Create quiz landing page (`/quiz`)
2. Create quiz session page (`/quiz/[sessionId]`)
3. Implement session creation (anonymous ID from localStorage)
4. Implement question fetching from Supabase
5. Implement response saving (debounced)
6. Implement session recovery (resume incomplete quiz)

**Files to create**:
- `app/src/app/quiz/page.tsx`
- `app/src/app/quiz/[sessionId]/page.tsx`
- `app/src/app/quiz/[sessionId]/loading.tsx`

---

### Phase 5: Results & Scoring (3-4 days)
**Goal**: Calculate and display results

**Tasks**:
1. Implement scoring algorithms (`lib/quiz/scoring.ts`)
2. Create archetype definitions (`lib/quiz/archetypes.ts`)
3. Create `ResultsContainer` component
4. Create `ResultCard` component
5. Create `ProfileSummary` component
6. Create `RadarChart` component (SVG)
7. Create results page (`/quiz/results/[sessionId]`)
8. Implement share functionality

**Files to create**:
- `app/src/lib/quiz/scoring.ts`
- `app/src/lib/quiz/archetypes.ts`
- `app/src/components/quiz/results/ResultsContainer.tsx`
- `app/src/components/quiz/results/ResultCard.tsx`
- `app/src/components/quiz/results/ProfileSummary.tsx`
- `app/src/components/quiz/results/RadarChart.tsx`
- `app/src/components/quiz/results/ShareResults.tsx`
- `app/src/app/quiz/results/[sessionId]/page.tsx`
- `app/src/app/quiz/results/[sessionId]/loading.tsx`

---

### Phase 6: Data Seeding & Polish (2-3 days)
**Goal**: Add real questions and polish UX

**Tasks**:
1. Seed all 47-49 questions into Supabase
2. Add Motion animations (page transitions, answer selection)
3. Add keyboard navigation (arrows for Likert)
4. Implement `useReducedMotion` support
5. Add error boundaries
6. Test on Cloudflare Workers (`npm run preview`)
7. Performance optimization (lazy loading)

**Files to modify**:
- Supabase dashboard or seed script
- All quiz components (add animations)

---

## Environment Variables

Add to `wrangler.jsonc`:
```jsonc
{
  "vars": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://xxx.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbG..."
  }
}
```

For local development, create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

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

| File | Purpose |
|------|---------|
| `lib/supabase/server.ts` | Edge-compatible Supabase client |
| `components/quiz/QuizContainer.tsx` | Main state machine & orchestration |
| `components/ui/likert-scale.tsx` | Core input for most questions |
| `lib/quiz/scoring.ts` | All scoring algorithms |
| `app/quiz/[sessionId]/page.tsx` | Main quiz flow page |
| `app/quiz/results/[sessionId]/page.tsx` | Results display page |

---

## Next Steps

1. **Client provides**: Full question list (47-49 questions with sections, types, and scoring dimensions)
2. **Developer starts**: Phase 1 - Supabase setup
3. **Parallel work**: Designer can review UI mockups based on flow diagrams above
