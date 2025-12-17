# Quiz Results Page Data Inventory

**Purpose:** Complete catalog of all data displayed on quiz results page for redesign.

---

## 1. ARCHETYPE DATA (16 archetypes)

**Source:** `/app/src/lib/quiz/archetypes.ts`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., 'golden-partner') |
| `name` | string | Display name (e.g., "The Golden Partner") |
| `emoji` | string | Emoji icon (e.g., "🐕") |
| `image` | string | Image path (e.g., '/archetypes/golden-partner.png') |
| `summary` | string | One-line summary (max 150 chars) |
| `patternDescription` | string | Detailed pattern explanation paragraph |
| `datingCycle` | string[] | 4-6 step dating cycle process |
| `rootCause` | string | Why this pattern exists |
| `datingMeaning.strengths` | string[] | 5 strength traits |
| `datingMeaning.challenges` | string[] | 5 challenge areas |
| `redFlags` | string[] | 5 warning signs |
| `coachingFocus` | string[] | 5 growth focus areas |
| `callToActionCopy` | string | CTA button text |

---

## 2. QUIZ RESULTS DATA

**Source:** `/app/src/lib/quiz/types.ts` + `/app/src/lib/quiz/scoring.ts`

### Attachment Style
| Field | Type | Description |
|-------|------|-------------|
| `attachment.scores.secure` | number (0-100) | Secure attachment score |
| `attachment.scores.anxious` | number (0-100) | Anxious attachment score |
| `attachment.scores.avoidant` | number (0-100) | Avoidant attachment score |
| `attachment.scores.disorganized` | number (0-100) | Fearful attachment score |
| `attachment.primary` | string/string[]/'mixed' | Primary style(s) |

### Communication Style
| Field | Type | Description |
|-------|------|-------------|
| `communication.scores.passive` | number (0-100) | Passive style score |
| `communication.scores.aggressive` | number (0-100) | Aggressive style score |
| `communication.scores.passive_aggressive` | number (0-100) | Passive-aggressive score |
| `communication.scores.assertive` | number (0-100) | Assertive style score |
| `communication.primary` | string/string[]/'mixed' | Primary style(s) |

### Core Metrics
| Field | Type | Description |
|-------|------|-------------|
| `confidence` | number (0-100) | Dating confidence |
| `emotional` | number (0-100) | Emotional availability |
| `intimacy.comfort` | number (0-100) | Intimacy comfort level |
| `intimacy.boundaries` | number (0-100) | Boundary assertiveness |

### Love Languages (5 languages)
| Field | Type | Description |
|-------|------|-------------|
| `loveLanguages.ranked` | LoveLanguage[] | 5 languages ordered by score |
| `loveLanguages.scores[language]` | number (0-100) | Combined score per language |
| `loveLanguages.giveReceive[language].give` | number (0-100) | Giving score |
| `loveLanguages.giveReceive[language].receive` | number (0-100) | Receiving score |

**Languages:** words, time, service, gifts, touch

---

## 3. RADAR CHARTS DATA

### Overall Radar (6 dimensions)
**Source:** `/app/src/components/quiz/results/OverallRadarChart.tsx`

| Dimension | Data Source | Score Range |
|-----------|-------------|-------------|
| Attachment | Primary style name + score | 0-100 |
| Communication | Primary style name + score | 0-100 |
| Confidence | `results.confidence` | 0-100 |
| Emotional | `results.emotional` | 0-100 |
| Intimacy | `results.intimacy.comfort` | 0-100 |
| Boundaries | `results.intimacy.boundaries` | 0-100 |

### Category Radars (4 dimensions each)
- **Attachment Radar:** secure, anxious, avoidant, fearful
- **Communication Radar:** passive, aggressive, passive-aggressive, assertive

---

## 4. LOVE LANGUAGE INSIGHTS

**Source:** `/app/src/components/quiz/results/LoveLanguageSuggestions.tsx`

| Data | Description |
|------|-------------|
| Strong languages | Languages with score >= 70% |
| Improvement areas | Languages with score < 70% (give or receive) |
| Give tips | 3 actionable tips per language |
| Receive tips | 3 actionable tips per language |
| Insights | High/Moderate/Low insight text per language |

---

## 5. LABEL TRANSFORMATIONS

**Source:** `/app/src/lib/quiz/labels.ts`

### Score Detail Labels (based on thresholds)
| Metric | >= 70 | 40-69 | < 40 |
|--------|-------|-------|------|
| Confidence | High | Moderate | Building |
| Emotional | Open | Balanced | Reserved |
| Intimacy | Comfortable | Moderate | Cautious |
| Boundaries | Strong | Growing | Flexible |

### Display Labels
- **Attachment:** secure → "Secure", anxious → "Anxious", avoidant → "Avoidant", disorganized → "Fearful"
- **Communication:** passive → "Passive", aggressive → "Aggressive", passive_aggressive → "Passive-Aggressive", assertive → "Assertive"
- **Love Languages:** words → "Words of Affirmation", time → "Quality Time", service → "Acts of Service", gifts → "Receiving Gifts", touch → "Physical Touch"

---

## 6. PAGE SECTIONS HIERARCHY (with Data Locations)

### HERO
**Component:** `components/quiz/results/ArchetypeHero.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Archetype name | `archetype.name` | `lib/quiz/archetypes.ts` |
| Emoji | `archetype.emoji` | `lib/quiz/archetypes.ts` |
| Summary | `archetype.summary` | `lib/quiz/archetypes.ts` |
| Archetype image | `archetype.image` | `lib/quiz/archetypes.ts` |
| Overall radar (6 dims) | `results.*` | `components/quiz/results/OverallRadarChart.tsx` |

---

### THE PATTERN YOU RECOGNIZE
**Component:** `components/quiz/results/ResultsContainer.tsx` + `DatingCycleVisual.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Pattern description | `archetype.patternDescription` | `lib/quiz/archetypes.ts` |
| Dating cycle steps | `archetype.datingCycle[]` | `lib/quiz/archetypes.ts` |

---

### WHERE THIS COMES FROM
**Component:** `components/quiz/results/ResultsContainer.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Root cause explanation | `archetype.rootCause` | `lib/quiz/archetypes.ts` |

---

### WHAT THIS MEANS FOR DATING
**Component:** `components/quiz/results/TraitGrid.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Strengths (5 items) | `archetype.datingMeaning.strengths[]` | `lib/quiz/archetypes.ts` |
| Challenges (5 items) | `archetype.datingMeaning.challenges[]` | `lib/quiz/archetypes.ts` |

---

### WHEN THIS GOES WRONG
**Component:** `components/quiz/results/RedFlagsList.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Red flags (5 items) | `archetype.redFlags[]` | `lib/quiz/archetypes.ts` |

---

### YOUR COACHING FOCUS
**Component:** `components/quiz/results/CoachingFocusList.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Focus areas (5 items) | `archetype.coachingFocus[]` | `lib/quiz/archetypes.ts` |
| CTA button text | `archetype.callToActionCopy` | `lib/quiz/archetypes.ts` |

---

### YOUR DATING PROFILE
**Component:** `components/quiz/results/CategoryRadarChart.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Attachment radar (4 dims) | `results.attachment.scores` | `lib/quiz/types.ts` |
| Communication radar (4 dims) | `results.communication.scores` | `lib/quiz/types.ts` |

---

### YOUR LOVE LANGUAGES
**Component:** `components/quiz/results/LoveLanguageSuggestions.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Strong languages list | `results.loveLanguages.ranked` (score >= 70) | `lib/quiz/types.ts` |
| Areas to grow | `results.loveLanguages.giveReceive[lang]` (score < 70) | `lib/quiz/types.ts` |
| Give/Receive tips | `LANGUAGE_CONFIG[lang].giveTips/receiveTips` | `LoveLanguageSuggestions.tsx:44-170` |
| Pro tip | Hardcoded in component | `LoveLanguageSuggestions.tsx` |

---

### SHARE RESULTS
**Component:** `components/quiz/results/ResultsContainer.tsx`

| Element | Data Source | File |
|---------|-------------|------|
| Share functionality | Browser share API | `ResultsContainer.tsx` |

---

## 7. KEY FILES

| File | Purpose |
|------|---------|
| `lib/quiz/archetypes.ts` | 16 archetype definitions |
| `lib/quiz/types.ts` | TypeScript interfaces |
| `lib/quiz/scoring.ts` | Result calculations |
| `lib/quiz/labels.ts` | Label formatting |
| `components/quiz/results/ResultsContainer.tsx` | Main orchestrator |
| `components/quiz/results/ArchetypeHero.tsx` | Hero + overall radar |
| `components/quiz/results/OverallRadarChart.tsx` | 6-dim radar |
| `components/quiz/results/CategoryRadarChart.tsx` | 4-dim radars |
| `components/quiz/results/LoveLanguageSuggestions.tsx` | Love language section |

---

## 8. DATA COUNTS SUMMARY

| Category | Count |
|----------|-------|
| Archetypes | 16 |
| Archetype fields | 13 |
| Attachment dimensions | 4 |
| Communication dimensions | 4 |
| Core metrics | 4 |
| Love languages | 5 |
| Total quiz result fields | ~30+ |
| Radar chart dimensions | 6 (overall) + 4+4 (category) |
