# Analytics Insights Guide

> What questions can we answer with our current GA4 + Database setup?

---

## 1. Marketing Attribution & ROI

| Question | Source | How to Access |
|----------|--------|---------------|
| Which campaign drove the most signups? | Database | `SELECT * FROM conversion_by_source ORDER BY waitlist_signups DESC` |
| Which traffic source has the highest quiz-to-app conversion? | Database | `SELECT utm_source, quiz_to_app_pct FROM conversion_by_source` |
| What's our cost per qualified lead by channel? | Database + Ad Platform | Join `conversion_by_source` with ad spend data |
| Are users from paid ads more engaged than organic traffic? | GA4 | Filter `scroll_depth`, `section_dwell` by `utm_medium` (cpc vs organic) |
| Which campaign produces users who read the full results? | GA4 | Filter `results_reading_complete` by `utm_campaign` |
| ROI by campaign (signups vs ad spend)? | Database + Ad Platform | `quiz_completions` and `waitlist_signups` per `utm_campaign` |

---

## 2. Landing Page Engagement

| Question | Source | How to Access |
|----------|--------|---------------|
| How far do users scroll? | GA4 | `scroll_depth` event, analyze `percent_scrolled` distribution |
| Which sections get the most attention? | GA4 | `section_dwell` event, compare `dwell_ms` by `section_id` |
| Where do users drop off on the landing page? | GA4 | Compare `section_view` counts across sections |
| Which CTAs get clicked most? | GA4 | `cta_click` event, group by `cta_id` |
| Do users read FAQs? Which ones? | GA4 | `faq_open` event, analyze `faq_id` frequency |
| How long do users spend reading FAQs? | GA4 | `faq_close` event, analyze `time_open_ms` |
| Are Instagram users more engaged than TikTok users? | GA4 | Compare `section_dwell` and `scroll_depth` by `utm_source` |

---

## 3. Quiz Funnel Performance

| Question | Source | How to Access |
|----------|--------|---------------|
| Quiz start rate (landing → quiz start)? | GA4 | `quiz_start` / `page_view` (page_type=quiz_landing) |
| Quiz completion rate? | GA4 | `quiz_complete` / `quiz_start` |
| Where do users drop out of the quiz? | GA4 | `quiz_dropout` event, analyze `last_step_index` distribution |
| Average time per quiz step? | GA4 | `quiz_step_complete` event, analyze `step_time_ms` |
| Which quiz step causes the most abandonment? | GA4 | `quiz_dropout` grouped by `last_step_index` |
| Why do users leave the quiz? | GA4 | `quiz_dropout` event, analyze `reason` (tab_hidden, route_change, page_close) |
| Total quiz completion time? | GA4 + Database | `quiz_complete.total_duration_ms` or `quiz_results.duration_seconds` |

---

## 4. Quiz Results Engagement

| Question | Source | How to Access |
|----------|--------|---------------|
| Do users actually read their results? | GA4 | `results_reading_complete` event count vs `quiz_results_view` |
| Which results sections get the most attention? | GA4 | `results_section_dwell` grouped by `section_id` |
| Are gated sections (dating_meaning, red_flags) driving interest? | GA4 | `results_section_view` filtered by `gated=true` |
| Do shared results get viewed? | GA4 | `quiz_results_view` where `view_mode=shared` |
| Time spent on results page? | GA4 | `results_reading_complete.time_on_results_ms` |
| Which archetype results drive most engagement? | GA4 | Cross-reference `archetype_id` with `results_section_dwell` |

---

## 5. Conversion Funnel (End-to-End)

| Question | Source | How to Access |
|----------|--------|---------------|
| Landing → Quiz → Results → Waitlist funnel? | Both | Combine GA4 events with `quiz_to_waitlist_funnel` view |
| Quiz-to-waitlist conversion rate? | Database | `SELECT quiz_to_waitlist_pct FROM quiz_to_waitlist_funnel` |
| Waitlist-to-app conversion rate? | Database | `SELECT quiz_signup_to_app_pct FROM quiz_to_app_funnel` |
| End-to-end quiz-to-app conversion? | Database | `SELECT quiz_to_app_pct FROM conversion_by_archetype` |
| Does quiz engagement predict conversion? | Both | Compare `results_reading_complete` users vs conversion in database |
| Time from quiz to waitlist signup? | Database | `SELECT hours_quiz_to_waitlist FROM time_to_conversion` |
| Time from signup to app download? | Database | `SELECT hours_waitlist_to_app FROM time_to_conversion` |

---

## 6. Archetype & Personality Insights

| Question | Source | How to Access |
|----------|--------|---------------|
| Which archetype is most common? | Database | `SELECT most_common_archetype FROM quiz_completion_stats` |
| Which archetype converts best to waitlist? | Database | `SELECT archetype_slug, quiz_to_waitlist_pct FROM conversion_by_archetype` |
| Which archetype converts best to app download? | Database | `SELECT archetype_slug, quiz_to_app_pct FROM conversion_by_archetype` |
| Do certain archetypes share results more? | GA4 | `share` event grouped by `archetype_id` |
| Do certain archetypes spend more time on results? | GA4 | `results_reading_complete.time_on_results_ms` by `archetype_id` |
| Archetype distribution over time? | Database | `SELECT archetype_slug, created_at FROM quiz_results` |

---

## 7. Sharing & Virality

| Question | Source | How to Access |
|----------|--------|---------------|
| How often do users share results? | GA4 | `share` event count / `quiz_results_view` count |
| Which share method is most popular? | GA4 | `share` event grouped by `method` (copy_link, twitter, tiktok, instagram, native) |
| Do shared links get clicked? | GA4 | `quiz_results_view` where `view_mode=shared` |
| Which archetypes get shared most? | GA4 | `share` event grouped by `archetype_id` |
| Does sharing drive new quiz starts? | GA4 | Track referrer patterns to quiz page |

---

## 8. Form & Lead Generation

| Question | Source | How to Access |
|----------|--------|---------------|
| Form engagement rate? | GA4 | `waitlist_start` / `page_view` (pages with forms) |
| Form completion rate? | GA4 | `generate_lead` / `waitlist_start` |
| Which form location converts best? | GA4 | `generate_lead` grouped by `form_location` (web, web-cta, quiz_results) |
| Do quiz-takers convert better than direct visitors? | Database | Compare `quiz_driven_signups` vs `direct_signups` in `quiz_to_waitlist_funnel` |
| Reactivation rate (unsubscribed → re-subscribed)? | Database | Track `status` changes in `waitlist` table |

---

## 9. Growth & Trends

| Question | Source | How to Access |
|----------|--------|---------------|
| Daily quiz completions? | Database | `SELECT * FROM daily_quiz_conversions` |
| Weekly/monthly growth rate? | Database | Compare `signups_7d` and `signups_30d` in `waitlist_stats` |
| Conversion trend over time? | Database | `daily_quiz_to_waitlist_pct` from `daily_quiz_conversions` |
| Seasonality patterns? | Database | Analyze `daily_quiz_conversions` by day of week |
| Campaign launch impact? | Both | Spike analysis in `daily_quiz_conversions` + GA4 traffic data |

---

## 10. User Quality Signals

| Question | Source | How to Access |
|----------|--------|---------------|
| Do engaged users convert better? | GA4 + Database | Correlate `scroll_depth >= 90%` users with conversion |
| Do FAQ readers convert better? | GA4 + Database | Correlate `faq_open` users with `generate_lead` |
| Does reading gated sections predict conversion? | GA4 | `results_section_view` (gated=true) → `generate_lead` |
| High-intent user signals? | GA4 | Users with `results_reading_complete` + multiple `section_dwell` events |
| Low-intent user signals? | GA4 | `quiz_dropout` with `reason=tab_hidden` at early steps |

---

## Quick Reference: Key Metrics Dashboard

### Daily Health Check
```sql
-- Database
SELECT * FROM waitlist_stats;
SELECT * FROM quiz_completion_stats;
SELECT * FROM daily_quiz_conversions LIMIT 7;
```

### GA4 Key Events to Monitor
- `quiz_start` → `quiz_complete` ratio (completion rate)
- `quiz_dropout` by `last_step_index` (friction points)
- `results_reading_complete` count (engagement quality)
- `generate_lead` by `form_location` (conversion by touchpoint)

### Weekly Campaign Review
```sql
-- Database
SELECT utm_source, utm_campaign, quiz_completions, quiz_to_app_pct
FROM conversion_by_source
WHERE quiz_completions > 10
ORDER BY quiz_to_app_pct DESC;
```

---

## Data Source Summary

| Data Type | Best Source | Why |
|-----------|-------------|-----|
| Conversion counts | Database | 100% accurate, no sampling |
| Behavioral engagement | GA4 | Rich event data, segmentation |
| Attribution (conversions) | Database | Definitive, owned data |
| Attribution (behavior) | GA4 | Session-level + event-level |
| Funnel analysis | Both | GA4 for micro-funnels, DB for macro |
| Time-series trends | Database | `daily_quiz_conversions` view |
| User segmentation | GA4 | Audiences, custom dimensions |
| A/B test results | Both | GA4 for behavior, DB for conversions |
