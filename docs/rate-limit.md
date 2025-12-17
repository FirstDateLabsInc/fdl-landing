---
title: Cloudflare Rate Limiting Plan
date: 2025-12-16
status: draft
scope: firstdatelabs.com (Cloudflare Workers + Next.js 16)
---

# Cloudflare Rate Limiting Plan (Next.js 16 on Workers)

## Goal

Protect DB-mutating/public API endpoints from abuse (spam, brute force, automated scraping) by applying **Cloudflare WAF Rate limiting rules** at the zone level, while keeping legitimate quiz flows smooth.

This repo deploys the Next.js app to Cloudflare Workers via `@opennextjs/cloudflare` and binds custom domains in `app/wrangler.jsonc`.

## What we are rate limiting

These endpoints are implemented as **POST** route handlers:

| Endpoint | Code location | Notes |
|---|---|---|
| `POST /api/quiz/session` | `app/src/app/api/quiz/session/route.ts` | Creates/validates anonymous session |
| `POST /api/quiz/complete` | `app/src/app/api/quiz/complete/route.ts` | Writes quiz results |
| `POST /api/quiz/email` | `app/src/app/api/quiz/email/route.ts` | Writes email to an existing quiz result |
| `POST /api/quiz/share` | `app/src/app/api/quiz/share/route.ts` | Mints a share slug |
| `POST /api/waitlist` | `app/src/app/api/waitlist/route.ts` | Inserts waitlist entry + sends email |

## Why WAF Rate Limiting (vs Worker in-memory)

Cloudflare advises against relying on mutable global state inside Workers for enforcement because isolates can be evicted/restarted. WAF Rate limiting rules run at the edge and persist across Worker restarts.

Docs:
- https://developers.cloudflare.com/waf/rate-limiting-rules/
- https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/
- https://developers.cloudflare.com/workers/reference/how-workers-works/

## Baseline thresholds (adjusted for Free plan)

Your Cloudflare Free plan only offers **10-second periods**. The rates below are adjusted proportionally:

| Path | Original | Adjusted (10 sec) | Action |
|---|---:|---:|---|
| `/api/quiz/session` | 10/min | **2 req/10sec** | Block |
| `/api/quiz/complete` | 5/min | **1 req/10sec** | Block |
| `/api/quiz/email` | 10/min | **2 req/10sec** | Block |
| `/api/quiz/share` | 10/min | **2 req/10sec** | Block |
| `/api/waitlist` | 5/min | **1 req/10sec** | Block |

## Recommended rule set (optimized)

To reduce rule count and keep the configuration maintainable, use **3 disjoint rules** (no overlapping matches → no double counting). This preserves the exact per-endpoint thresholds above.

### Rule A — Quiz auxiliary (10/min/IP)

**Match expression**
```txt
(http.request.method eq "POST") and
(
  http.request.uri.path eq "/api/quiz/session" or
  http.request.uri.path eq "/api/quiz/email" or
  http.request.uri.path eq "/api/quiz/share"
)
```

**Rate**
- Requests / Period: `10 / 60s`
- Mitigation timeout (duration): `60s`

### Rule B — Quiz submit (5/min/IP)

**Match expression**
```txt
(http.request.method eq "POST") and
(http.request.uri.path eq "/api/quiz/complete")
```

**Rate**
- Requests / Period: `5 / 60s`
- Mitigation timeout (duration): `60s`

### Rule C — Waitlist (5/min/IP)

**Match expression**
```txt
(http.request.method eq "POST") and
(http.request.uri.path eq "/api/waitlist")
```

**Rate**
- Requests / Period: `5 / 60s`
- Mitigation timeout (duration): `60s`

### Path matching note (trailing slashes)

The expressions above use exact path equality (`http.request.uri.path eq ...`) for clarity and speed. If you expect traffic with trailing slashes (for example `/api/waitlist/`), switch to a safer match:

```txt
starts_with(http.request.uri.path, "/api/waitlist")
```

Or use a regex match for an exact optional slash:
```txt
http.request.uri.path matches "^/api/waitlist/?$"
```

### Counting characteristics

Cloudflare rate limiting rules require **counting characteristics** (how the counter is keyed). Use:
- `IP Address` (and keep `Data center ID` if Cloudflare includes it by default for your plan).

Rationale:
- Simple and effective for these endpoints.
- Avoids reliance on spoofable client headers.

Docs: https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/

## Action behavior + response shape (important for UX)

Use **Block** (docs: https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/#then-take-action) with a **custom JSON response** so clients that always call `res.json()` do not fail with “Network error”.

Recommended custom response:
- Status code: `429` (default for rate limiting)
- Content-Type: `application/json`
- Body (static):
```json
{"success":false,"error":"Too many requests. Please wait and try again.","errorCode":"RATE_LIMITED"}
```

Note:
- Cloudflare’s rule custom response is static per rule. Reuse the same JSON across all 3 rules to keep clients consistent.

## Dashboard implementation steps (zone-level)

> Applies to the `firstdatelabs.com` zone (covers both `firstdatelabs.com` and `www.firstdatelabs.com`).

Docs: https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/

1. Cloudflare Dashboard → select the **`firstdatelabs.com` zone**.
2. Go to **Security → WAF → Rate limiting rules**.
3. Create **Rule A**:
   - “When incoming requests match”: paste Rule A expression.
   - “Characteristics”: IP address (keep defaults).
   - “Also apply rate limiting to cached assets”: ON (API endpoints should not be cached, but counting all requests prevents edge cases).
   - “Rate”: 10 requests / 1 minute.
   - “Duration / mitigation timeout”: 1 minute.
   - “Action”: Block.
   - “Custom response”: JSON + 429 + body above.
4. Create **Rule B** with its expression + 5/min.
5. Create **Rule C** with its expression + 5/min.
6. Optional rollout safety:
   - Start rules in **Log** for 30–60 minutes (if available), confirm no false positives, then switch to **Block**.
7. Optional allowlist for team/testing:
   - Create an IP list (Cloudflare “WAF tools → Lists”) and add `and not ip.src in $team_ips` to each rule expression.

## Validation plan

### In Cloudflare
1. Security → **Events** (or WAF analytics) → filter for **Rate limiting** events.
2. Confirm events fire for `/api/quiz/*` and `/api/waitlist` when you burst requests.

### From a test machine (single IP)

Burst tests (example; adjust host):
```bash
# /api/waitlist should block after 5 in a minute
for i in {1..8}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST "https://firstdatelabs.com/api/waitlist" \
    -H "content-type: application/json" \
    --data '{"email":"test@example.com","source":"web"}'
done
```

Expected:
- First 5: `200` (or `4xx` if your app rejects payload)
- After limit: `429` with JSON body

### Product QA
1. Take quiz end-to-end on web.
2. Ensure normal flow does not hit limits (should be well under thresholds).
3. Confirm blocked responses show a reasonable message (not “Network error”).

### Local preview note

`npm run preview` runs the Worker locally (Wrangler) and will not exercise Cloudflare WAF. Validate WAF rate limiting on a real Cloudflare zone (production or a dedicated staging zone).

## Rollback plan

Fast rollback options (no deploy needed):
- Switch rule action from **Block → Log** (or disable the rule).
- Delete the 3 rules.

## Optional: Infrastructure-as-code (recommended for reproducibility)

If you want versioned reviewable rules (instead of manual-only), manage the zone ruleset in the `http_ratelimit` phase via Terraform.

Docs:
- https://developers.cloudflare.com/terraform/additional-configurations/rate-limiting-rules/
- https://developers.cloudflare.com/waf/rate-limiting-rules/create-api/

High-level approach:
1. Add a small `infra/` Terraform project (or integrate into existing infra repo).
2. Create a `cloudflare_ruleset` with `kind = "zone"` and `phase = "http_ratelimit"`.
3. Add 3 `rules { ... }` blocks matching Rules A/B/C.
4. Apply in staging first (if you have a staging zone), then production.

## Optional: Workers Rate Limiting binding (alternate approach)

Cloudflare also supports rate limiting directly inside Workers via a `ratelimit` binding (GA per Cloudflare changelog and Workers docs). This is useful when you need counters keyed by something other than IP (for example, session ID) or when you want to return endpoint-specific JSON.

Docs:
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

We are not choosing this by default because WAF rules are simpler, centralized, and don't require code changes, but it's a valid future upgrade if IP-based limiting becomes too coarse (NAT/mobile carrier IP sharing).

---

## Frontend 429 Handling (COMPLETED)

Frontend code has been updated to gracefully handle 429 rate limit responses.

### Files Modified

| File | Changes |
|------|---------|
| `app/src/components/quiz/QuizContainer.tsx` | Added 429 handling for quiz submission and session creation |
| `app/src/components/waitlist/WaitlistForm.tsx` | Added 429 handling for waitlist signup |

### QuizContainer.tsx Changes

**Quiz submission** (around line 148):
- Checks `res.status === 429` before parsing JSON
- Also checks `errorCode === "RATE_LIMITED"` in response body
- Shows user-friendly message: "You're submitting too quickly. Please wait a moment and try again."

**Session creation** (around line 71):
- Checks `res.status === 429`
- Silently continues with existing sessionId (no error shown to user)
- Logs warning to console for debugging

### WaitlistForm.tsx Changes

**Waitlist signup** (around line 79):
- Checks `res.status === 429` before parsing JSON
- Also checks `errorCode === "RATE_LIMITED"` in response body
- Shows user-friendly message: "Too many attempts. Please wait a minute and try again."

### User-Facing Error Messages

| Endpoint | Error Message |
|----------|---------------|
| Quiz Session | (Silent - falls back to existing session) |
| Quiz Complete | "You're submitting too quickly. Please wait a moment and try again." |
| Waitlist | "Too many attempts. Please wait a minute and try again." |

---

## Implementation Checklist

### Part A: Cloudflare Dashboard (Manual)
- [ ] Create rate limiting rules in Cloudflare Dashboard
- [ ] Use "Edit expression" link to add full expressions (including method)
- [ ] Enable all rules

### Part B: Frontend Code (COMPLETED)
- [x] Update `QuizContainer.tsx` with 429 handling
- [x] Update `WaitlistForm.tsx` with 429 handling
- [x] Lint passed

### Part C: Testing
- [ ] Test with rapid curl requests after enabling rules
- [ ] Verify 429 responses return correct JSON
- [ ] Confirm frontend shows user-friendly messages
