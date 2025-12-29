# Google Analytics 4 (GA4) Implementation

> Last updated: 2025-12
> Measurement ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Overview

This document details the GA4 event tracking implementation for the Juliet Landing website. The implementation tracks user engagement across the marketing funnel: landing page → quiz → results → waitlist signup.

## Architecture

```
app/src/lib/analytics/
├── index.ts          # Public exports
├── gtag.ts           # Core trackEvent with validation
├── events.ts         # All event tracking functions
├── constants.ts      # Event names, params, limits
├── types.ts          # TypeScript interfaces
└── utm.ts            # UTM parameter capture/storage

app/src/hooks/
├── use-page-views.ts          # Page view tracking
├── use-scroll-depth.ts        # Scroll milestone tracking
├── use-section-tracking.ts    # Section visibility & dwell
├── use-quiz-results-tracking.ts # Results page engagement
└── use-flush-on-hide.ts       # Data capture on page hide
```

---

## Events Summary

| Category | Event | GA4 Type | Purpose |
|----------|-------|----------|---------|
| **Page** | `page_view` | Recommended | Track page loads |
| **Page** | `scroll_depth` | Custom | Track scroll milestones |
| **Section** | `section_view` | Custom | Track section visibility |
| **Section** | `section_dwell` | Custom | Track time on sections |
| **CTA** | `cta_click` | Custom | Track button clicks |
| **Form** | `waitlist_start` | Custom | Track form engagement |
| **Form** | `generate_lead` | Recommended | Track form submissions |
| **FAQ** | `faq_open` | Custom | Track FAQ opens |
| **FAQ** | `faq_close` | Custom | Track FAQ closes |
| **Quiz** | `quiz_start` | Custom | Track quiz begins |
| **Quiz** | `quiz_step_view` | Custom | Track quiz progress |
| **Quiz** | `quiz_step_complete` | Custom | Track step completion |
| **Quiz** | `quiz_complete` | Custom | Track quiz finish |
| **Quiz** | `quiz_dropout` | Custom | Track abandonment |
| **Results** | `quiz_results_view` | Custom | Track results views |
| **Results** | `results_section_view` | Custom | Track section visibility |
| **Results** | `results_section_dwell` | Custom | Track section dwell |
| **Results** | `results_reading_complete` | Custom | Track full engagement |
| **Share** | `share` | Recommended | Track social shares |

---

## Event Details

### Page Events

#### `page_view`
Tracks page loads and client-side route changes.

| Parameter | Type | Example |
|-----------|------|---------|
| `page_title` | string | "Dating Personality Quiz" |
| `page_location` | string | "https://firstdatelabs.com/quiz" |
| `page_path` | string | "/quiz" |
| `page_type` | enum | landing, quiz_landing, quiz_questions, quiz_results, contact, other |
| `utm_source` | string? | "instagram" |
| `utm_medium` | string? | "cpc" |
| `utm_campaign` | string? | "launch_2024" |

**Trigger:** `usePageViews` hook on pathname change

---

#### `scroll_depth`
Tracks scroll milestones (25%, 50%, 75%, 90%).

| Parameter | Type | Example |
|-----------|------|---------|
| `percent_scrolled` | number | 50 |
| `page_type` | enum | "landing" |
| `page_path` | string | "/" |

**Trigger:** `useScrollDepth` hook, fires once per milestone per page

---

### Section Events

#### `section_view`
Fires when a section is visible for ≥2 seconds.

| Parameter | Type | Example |
|-----------|------|---------|
| `section_id` | string | "hero", "benefits", "faq" |
| `page_type` | enum | "landing" |
| `page_path` | string | "/" |

**Sections tracked on landing:**
- hero, social-proof, problem-solution, benefits, faq, waitlist

---

#### `section_dwell`
Fires when leaving a section if dwell time ≥3 seconds.

| Parameter | Type | Example |
|-----------|------|---------|
| `section_id` | string | "benefits" |
| `dwell_ms` | number | 12500 |
| `dwell_bucket` | enum | "10_30s" |
| `page_type` | enum | "landing" |

**Dwell buckets:** `0_3s`, `3_10s`, `10_30s`, `30s_plus`

---

### CTA Events

#### `cta_click`
Tracks button/link clicks.

| Parameter | Type | Example |
|-----------|------|---------|
| `cta_id` | string | "navbar_cta", "quiz_cta" |
| `cta_text` | string | "Get Early Access" |
| `cta_location` | string | "navbar", "final_cta_section" |
| `section_id` | string? | "waitlist" |
| `page_type` | enum | "landing" |

**Components firing this:**
- `Navbar.tsx` - navbar CTA button
- `FinalCTASection.tsx` - quiz CTA link

---

### Form Events

#### `waitlist_start`
Fires when user focuses email input field.

| Parameter | Type | Example |
|-----------|------|---------|
| `form_location` | string | "web", "web-cta", "quiz_results" |

**Trigger:** `WaitlistForm.tsx` on email field focus (once per instance)

---

#### `generate_lead` (GA4 Recommended)
Fires on successful waitlist form submission.

| Parameter | Type | Example |
|-----------|------|---------|
| `form_location` | string | "quiz_results" |
| `has_quiz_result` | boolean | true |
| `archetype_id` | string? | "golden-partner" |

**Trigger:** `WaitlistForm.tsx` on successful submission

---

### FAQ Events

#### `faq_open`
Fires when user opens an FAQ accordion.

| Parameter | Type | Example |
|-----------|------|---------|
| `faq_id` | string | "howdoesitwork" (derived from question) |
| `faq_question` | string | "How does it work?" (truncated to 100 chars) |

---

#### `faq_close`
Fires when user closes an FAQ accordion.

| Parameter | Type | Example |
|-----------|------|---------|
| `faq_id` | string | "howdoesitwork" |
| `time_open_ms` | number | 5200 |

---

### Quiz Funnel Events

#### `quiz_start`
Fires on first answer submission (not on page load).

| Parameter | Type | Example |
|-----------|------|---------|
| `entry_source` | string | "instagram" or "direct" |
| `quiz_version` | string | "1.0" |

---

#### `quiz_step_view`
Fires when quiz page changes.

| Parameter | Type | Example |
|-----------|------|---------|
| `step_index` | number | 2 (0-based) |
| `total_steps` | number | 12 |

---

#### `quiz_step_complete`
Fires when moving to next step.

| Parameter | Type | Example |
|-----------|------|---------|
| `step_index` | number | 2 |
| `step_time_ms` | number | 8500 |
| `answers_on_step` | number | 4 |

---

#### `quiz_complete`
Fires on successful quiz submission.

| Parameter | Type | Example |
|-----------|------|---------|
| `total_duration_ms` | number | 180000 |
| `archetype_id` | string | "golden-partner" |
| `quiz_version` | string | "1.0" |

---

#### `quiz_dropout`
Fires when user leaves quiz before completing.

| Parameter | Type | Example |
|-----------|------|---------|
| `last_step_index` | number | 5 |
| `answered_count` | number | 20 |
| `progress_percent` | number | 42 |
| `elapsed_ms` | number | 90000 |
| `time_on_step_ms` | number | 15000 |
| `reason` | enum | "tab_hidden", "route_change", "page_close" |

**Trigger:** `useFlushOnHide` hook on visibility change or navigation

---

### Results Page Events

#### `quiz_results_view`
Fires when results page loads.

| Parameter | Type | Example |
|-----------|------|---------|
| `result_id` | string | "abc123-def456" |
| `archetype_id` | string | "golden-partner" |
| `view_mode` | enum | "owner", "shared" |

---

#### `results_section_view`
Fires when results section visible ≥2 seconds.

| Parameter | Type | Example |
|-----------|------|---------|
| `section_id` | string | "pattern", "red_flags", "coaching" |
| `gated` | boolean | true |
| `time_since_load_ms` | number | 5000 |

**Results sections:**
- pattern, score_insights, dating_meaning (gated), red_flags (gated), coaching, love_languages, share_results, full_picture

---

#### `results_section_dwell`
Fires when leaving results section if ≥3 seconds.

| Parameter | Type | Example |
|-----------|------|---------|
| `section_id` | string | "coaching" |
| `gated` | boolean | false |
| `dwell_ms` | number | 25000 |
| `dwell_bucket` | enum | "10_30s" |

---

#### `results_reading_complete`
Fires when user scrolls ≥80% AND active time ≥30 seconds.

| Parameter | Type | Example |
|-----------|------|---------|
| `time_on_results_ms` | number | 45000 |
| `sections_viewed_count` | number | 6 |
| `gated_sections_viewed` | number | 2 |

---

### Share Events

#### `share` (GA4 Recommended)
Fires when user shares results.

| Parameter | Type | Example |
|-----------|------|---------|
| `method` | enum | "copy_link", "twitter", "tiktok", "instagram", "native" |
| `content_type` | string | "quiz_result" |
| `archetype_id` | string | "golden-partner" |

**Trigger:** `ShareResults.tsx` on share button clicks

---

## UTM Attribution

All events automatically include UTM parameters when available.

### Capture Flow
```
1. User visits with UTM: ?utm_source=instagram&utm_medium=cpc&utm_campaign=launch
2. AnalyticsProvider calls captureUtmParams() on mount
3. UTM params stored in sessionStorage (key: "juliet-utm-params")
4. trackEvent() merges UTM into every event
```

### Fallback
If no `utm_source` in URL, captures `document.referrer` hostname as:
- `utm_source`: referrer hostname
- `utm_medium`: "referral"

### Storage
- Key: `juliet-utm-params`
- Scope: sessionStorage (persists across navigation, clears on tab close)
- First-touch only (doesn't overwrite existing attribution)

---

## Configuration

### Time Thresholds

| Threshold | Value | Purpose |
|-----------|-------|---------|
| Section view minimum | 2000ms | Prevents accidental scroll-by |
| Section dwell minimum | 3000ms | Filters trivial interactions |
| Results reading time | 30000ms | Indicates genuine engagement |
| Results scroll depth | 80% | Indicates content consumption |

### GA4 Validation Limits

| Limit | Value |
|-------|-------|
| Event name max length | 40 chars |
| Param name max length | 40 chars |
| Param value max length | 100 chars |
| Max params per event | 25 |

Invalid names throw in development, log error in production.

---

## Custom Dimensions (GA4 Configuration)

These custom dimensions must be registered in GA4 Admin → Custom definitions to appear in reports.

| # | Dimension | Parameter | Scope |
|---|-----------|-----------|-------|
| 1 | Archetype ID | `archetype_id` | Event |
| 2 | CTA ID | `cta_id` | Event |
| 3 | Dropout Reason | `reason` | Event |
| 4 | Dwell Bucket | `dwell_bucket` | Event |
| 5 | Dwell MS | `dwell_ms` | Event |
| 6 | FAQ ID | `faq_id` | Event |
| 7 | FAQ Question | `faq_question` | Event |
| 8 | Form Location | `form_location` | Event |
| 9 | Gated | `gated` | Event |
| 10 | Page Path | `page_path` | Event |
| 11 | Page Type | `page_type` | Event |
| 12 | Percent Scrolled | `percent_scrolled` | Event |
| 13 | Section ID | `section_id` | Event |
| 14 | Step Index | `step_index` | Event |
| 15 | View Mode | `view_mode` | Event |

---

## PII Protection

The implementation explicitly avoids sending PII:
- Email addresses never sent to GA4
- User names never sent (only archetype IDs)
- Result IDs are UUIDs, not identifiable
- Comments in code warn against PII collection

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/src/lib/analytics/events.ts` | All tracking functions |
| `app/src/lib/analytics/constants.ts` | Event names, params |
| `app/src/lib/analytics/gtag.ts` | Core trackEvent with validation |
| `app/src/lib/analytics/utm.ts` | UTM capture and storage |
| `app/src/hooks/use-quiz-results-tracking.ts` | Results page engagement |
| `app/src/components/waitlist/WaitlistForm.tsx` | Lead generation tracking |
| `app/src/components/quiz/QuizContainer.tsx` | Quiz funnel tracking |

---

## Database Attribution (Complementary)

In addition to GA4, UTM data is stored server-side:

```sql
-- quiz_results table
utm_source TEXT,
utm_medium TEXT,
utm_campaign TEXT

-- waitlist table
utm_source TEXT,
utm_medium TEXT,
utm_campaign TEXT

-- Analytics view
SELECT * FROM conversion_by_source;
```

Use database for definitive conversion attribution; use GA4 for behavioral insights and Google ecosystem integration.
