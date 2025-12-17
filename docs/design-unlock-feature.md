# Quiz “Unlock Full Report in App” — System Design

Date: 2025-12-12  
Status: Draft (design-only; no code changes in this doc)

## 0) Problem statement

We want an **unlock** mechanism that:

1) Attracts users via a web-hosted quiz (Next.js on Cloudflare Workers).  
2) Shows a **partially locked** results report on the website.  
3) Prompts users to **download the mobile app** (React Native Expo).  
4) Users **authenticate their email in the app**, using the **same email** they entered on the website.  
5) Once verified, the user’s full report becomes **unlocked** (in the app, and optionally viewable/shareable on the website).

We are using Supabase (Postgres + Auth + RLS) as the backend.

## 1) Goals / Non-goals

### Goals

- **Secure unlock**: only the person who proves ownership of the email can unlock.
- **Frictionless web**: no auth required on website to see partial results or to enter email.
- **App-driven unlock**: the app is the place where email verification happens.
- **Shareable**: after unlock, it is acceptable for the report to be shareable via URL (bearer link).
- **Least-privilege data exposure**: do not expose more than needed to locked users.
- **Works cross-device**: user can take quiz on desktop web, then unlock on mobile app.

### Non-goals (for this phase)

- Paid purchase/entitlements (Stripe / IAP). We will design for future extension but not implement now.
- Building quiz natively in the app. The quiz remains on the web and is embedded/linked from the app.

## 2) Current system inventory (what we already have)

### 2.1 Database schema (from `docs/schema.sql`)

Key tables:

- `public.anonymous_sessions`
  - Used for anonymous quiz taking (session UUID bound to fingerprint hash).
  - Expires after 30 days (cleanup job).

- `public.quiz_results`
  - Core quiz result row keyed by UUID.
  - Fields relevant to unlock:
    - `user_id UUID NULL` (Supabase Auth user)
    - `email TEXT NULL` (currently used for “view later” / claim by email)
    - `claimed_at TIMESTAMPTZ NULL`
    - `anonymous_session_id UUID NULL`
    - `fingerprint_hash TEXT NULL`

Key RPC functions:

- `verify_or_create_session(p_fingerprint, p_session_id)` → returns session UUID
- `insert_quiz_result(...)` → validates session and inserts row in `quiz_results`, returns result UUID
- `claim_quizzes_by_email()` → for authenticated users:
  - matches `quiz_results.email` to `auth.users.email`
  - sets `quiz_results.user_id = auth.uid()`, `claimed_at = NOW()`, **clears `quiz_results.email`**

Existing RLS (high level):

- Anonymous select policy exists, but most web access today uses a **service role** client in Next.js.
- Authenticated users can select `quiz_results` where `user_id = auth.uid()`.

### 2.2 Web routes (Next.js)

- `/quiz/questions` → takes quiz
- `/quiz/results` → local results view (from browser localStorage)
- `/quiz/results/[resultId]` → server-rendered result by UUID (public bearer link)

### 2.3 Important current limitation for “email capture”

There is an API endpoint `POST /api/quiz/email` that updates `quiz_results.email`, but it verifies ownership using `anonymous_session_id` (“sessionId”).

Current quiz completion flow clears the quiz state (which holds sessionId) and does not persist it in results localStorage. That means: **the results page cannot call `/api/quiz/email` unless we retain an ownership secret (sessionId or a one-time token) after quiz completion.**

This becomes a central design requirement for a secure unlock flow.

## 3) Unlock model (recommended)

### 3.1 State machine (derived from existing columns)

We should model **unlock** separately from **public sharing**.

Unlock controls whether the owner can access their full report (in the app).  
Sharing controls whether the full report is publicly viewable on the website.

Minimum columns to support this:

- `user_id` (already exists): owner/claimed
- `email` (already exists): pending claim
- `public_slug` (new): public share identifier (B2)

Proposed states:

- **LOCKED**: `user_id IS NULL AND email IS NULL AND public_slug IS NULL`
- **PENDING** (email collected, waiting for app verification): `user_id IS NULL AND email IS NOT NULL`
- **UNLOCKED (private)**: `user_id IS NOT NULL AND public_slug IS NULL`
- **SHAREABLE (public)**: `public_slug IS NOT NULL` (and should only be created when `user_id IS NOT NULL`)

This directly addresses the privacy trap: **unlocking does not automatically make a web URL public**.

### 3.2 Why `user_id` as the unlock source-of-truth is strong

- It is only set after Supabase Auth verification (email OTP / magic link) in the app.
- It naturally enables app-side reads via RLS (`results_select_authenticated`).
- It is compatible with “share unlocked report”:
  - public web route can choose to show full content only when `user_id` is set.

### 3.3 Optional enhancement: add `unlock_method` (future)

Not required now, but recommended for extensibility:

- `unlock_method TEXT` (e.g., `app_email`, `purchase_stripe`, `admin_grant`)
- `unlocked_at` could reuse `claimed_at`

This keeps the system future-proof for actual purchases without redesigning.

## 4) Secure end-to-end flow

### 4.1 Web (quiz → partial results → email capture)

**Step A: User completes quiz on web**

- Web calls `/api/quiz/complete` with:
  - `sessionId` (anonymous session UUID)
  - `fingerprintHash`
  - `answers`
- Server writes `quiz_results` row and returns `resultId`.

**Step B: Web shows partial results + “Unlock in app”**

User sees the report in the order shown in `.playwright-mcp/quiz-results-final-order.png`, but specific sections are locked (see section 6).

**Step C: User enters email on results page**

We store the email to “bind” the result to an email address:

- `quiz_results.email = user_entered_email`
- (optional) also join waitlist, but **waitlist should not be relied upon for claim** (it is not verified).

**Critical security requirements**

1) The “set email on quiz result” operation must be protected so attackers cannot hijack someone else’s result by overwriting the email.  
2) The email should be **write-once (first-write-wins)** while the result is unclaimed to avoid “flip-flopping” and reduce abuse/edge cases.

Recommended: require an ownership secret that only the quiz taker has (see 5.2).

### 4.2 Mobile app (authenticate → claim → unlock)

**Step D: User downloads app and authenticates email**

Use Supabase Auth (email OTP or magic link). Email verification is the proof-of-ownership step.

**Step E: App calls `claim_quizzes_by_email()`**

After login, app executes RPC:

- Claims all results where `quiz_results.email == auth.users.email` and `user_id IS NULL`.
- Sets `user_id` and `claimed_at`, clears `email` for privacy.

**Step F: App reads results via RLS**

App fetches:

- `quiz_results` where `user_id = auth.uid()`, sorted by `created_at DESC` (or by deep-linked `resultId`).

### 4.3 Web share link behavior (optional but recommended)

**Step G: Result page by UUID**

To avoid “Unlocked ⇒ full report public by resultId”:

- `/quiz/results/[resultId]` should remain a **non-public preview** route:
  - shows free/locked sections regardless of unlock state
  - never escalates to “public full report” just because `user_id` became non-null

Public sharing should use a separate identifier:

- `/quiz/p/[publicSlug]` shows the **full report** (public)
  - only exists after the owner explicitly taps “Share” (creates `public_slug`)

This matches your requirement: “everyone can see the report only after the owner verifies email (unlock) and clicks Share.”

## 5) Protecting the “set email” step (most important security point)

If we let anyone set `quiz_results.email` using only `resultId`, an attacker who obtains a `resultId` could overwrite the email and later claim the result.

Even though UUIDs are unguessable, this is still a **hijack** vector if a user shares a locked report link before unlocking.

### 5.1 Threat model: “email overwrite hijack”

Attacker capabilities:

- Sees a locked report URL (`/quiz/results/<resultId>`) shared publicly.
- Calls an API to set `quiz_results.email = attacker@email.com`.
- Logs into the app with attacker@email.com (which they own), calls claim, unlocks.
- Now the original user cannot unlock using their email.

### 5.2 Recommended mitigation: require an ownership secret

We need an ownership secret that:

- is available immediately after quiz completion on web
- is not included in the share URL
- is hard for an attacker to guess

Best options:

**Option A: require `anonymous_session_id` (sessionId)**

- Require `sessionId` in the email capture request.
- Validate: `quiz_results.anonymous_session_id == sessionId`.
- This is exactly what the existing `/api/quiz/email` route already does.

Design implication:

- Do not discard sessionId at quiz completion; persist it (or a derived token) so the results page can submit email securely.

**Option B (recommended): issue a short-lived signed `emailUpdateToken`**

- On `/api/quiz/complete`, return an `emailUpdateToken`:
  - signed JWT containing `{ resultId, anonymous_session_id }`
  - short TTL (e.g., 15–60 minutes)
- Results page stores token in **memory or sessionStorage** (not in URL, not in localStorage) and uses it to set email.
- Server validates token signature + TTL and then performs an atomic “check-and-set” update.

Tradeoff:

- More complexity than Option A, but it avoids persisting the raw session secret and reduces the blast radius of any client-side compromise.

**Option C (not recommended): allow setting email by `resultId` only**

- Simplest but weakest. Acceptable only if you do not care about hijack risk.

Recommendation: **Option B** if you can implement it quickly; otherwise **Option A** but keep the `sessionId` only in-memory or `sessionStorage` (never `localStorage`) and accept that refreshing the results page may require re-taking the quiz to set email.

### 5.3 “First-write-wins” semantics (immutability until claim)

Even with ownership protection, the email write should be constrained to avoid flip-flopping and reduce support issues:

- Only allow setting email if `user_id IS NULL` (unclaimed).
- Prefer “first-write-wins”: only allow setting email if `email IS NULL`.
- Optional (UX): allow a short correction window (e.g., first 10 minutes after `created_at`) **but still require the same ownership secret**.
- Always treat “setting the same email again” as success (idempotent).

This logic should be enforced **atomically** (single DB statement / RPC), not as “read then update” in application code.

Example “check-and-set” update (conceptual):

```sql
-- Server extracts v_session_id from the emailUpdateToken (or accepts sessionId directly).
UPDATE quiz_results
SET email = $1
WHERE id = $2
  AND anonymous_session_id = $3
  AND user_id IS NULL
  AND (
    email IS NULL
    OR created_at > NOW() - INTERVAL '10 minutes' -- optional correction window
  );
```

### 5.4 Token storage guidance (minimize persistence)

Avoid putting any ownership secret in `localStorage`:

- `localStorage` is long-lived and accessible to any same-origin JavaScript (so a single XSS can steal it and reuse it later).
- Prefer **in-memory** (best) or **sessionStorage** (tab-scoped, cleared when tab closes) for short-lived workflow tokens.
- Do not place ownership tokens in URL query strings (they can leak via referrers/logs); if you must transport via URL, prefer fragment (`#...`) and immediately move into memory then clear the fragment.

## 6) What to lock on the results page (per your requirement)

From your instruction:

- Lock **Dating Cycle** (but keep high-level context visible).
- Lock **Understanding Your Scores** (keep % visible for free).
- Lock **Meaning + Next Steps** (e.g., strengths/challenges + coaching plan).
- Lock **When This Goes Wrong** (red flags).

### 6.1 Proposed section gating map

| Section (UI) | Free vs Locked | What remains visible in locked state |
|---|---|---|
| Hero (archetype + overall radar) | Free | Full (hook + radar). |
| “Your Dating Pattern” paragraph | Free | Full paragraph. |
| Dating Cycle visual | Locked (preview) | Show 1 step + blurred placeholders for the rest (no real text). |
| “Where This Comes From” | Free | Full paragraph (optional, can be preview-only if desired). |
| Dating Profile radar charts | Free | Full charts + labels (this is strong “value”). |
| Understanding Your Scores | Locked (partial) | Show the % bars and metric titles; hide interpretive label + strengths + growth text. |
| What This Means for Dating | Locked | Show the section header + 1 example bullet (optional) + lock overlay. |
| When This Goes Wrong | Locked | Header + lock overlay. |
| Your Coaching Focus (next steps) | Locked | Header + lock overlay (CTA becomes “Unlock in app”). |
| Love Languages | (decision) | If your goal is app installs, consider keeping ranking visible and locking tips. If not required, keep it free. |

### 6.2 UX states to support

- **LOCKED**: show lock overlays and a primary CTA: “Unlock in the app”.
- **PENDING** (email submitted): show confirmation and app download links + “Sign in with this email”.
- **UNLOCKED**: show full content; also show a share link/button.

## 7) Content security (important with archetype copy stored in TypeScript)

### 7.1 Key point

If locked archetype content is imported into a **client bundle**, it is not truly “locked” (users can inspect JS).

Today, the results UI uses client components for navigation/scrollspy; if we pass full archetype content down to the client, the locked text is effectively public.

### 7.2 Recommended architecture to keep lock meaningful

Split content into tiers and ensure locked tier is server-only:

- **Public tier** (safe to ship to client): `{ id, name, emoji, summary, image }`
- **Locked tier** (server-only): `datingCycle`, `datingMeaning`, `redFlags`, `coachingFocus`, detailed insights copy, etc.

Implementation approaches:

**Approach 1 (recommended now): server-enforced render**

- Render locked sections in a server component that checks `unlocked` first.
- Do not pass locked-tier strings into client components unless unlocked.

**Approach 2 (recommended long-term): move archetype content to DB**

- Create `archetype_content` table keyed by `archetype_slug` with versioning.
- Web and app both fetch identical content (no duplication).
- Unlock gating becomes pure API/data gating.

If we keep content in TS for now, enforce it by:

- importing locked-tier content only in server modules (Next.js `server-only` pattern).

### 7.3 Data minimization: define a “public result” shape

Row-Level Security (RLS) restricts **which rows** are visible, not which **columns** are returned. Also, server routes using a Supabase **service role** bypass RLS entirely. That means the safest approach is to design a strict “public surface” for results and never return private columns by accident.

Recommended options (defense in depth):

- **DB view/RPC (recommended):** create `quiz_results_public` (view or function) that exposes only:
  - `id`, `archetype_slug`, `scores`, `created_at`, plus `unlocked` (`user_id IS NOT NULL`)
  - optionally `has_email` (`email IS NOT NULL AND user_id IS NULL`) to support “pending” UI without exposing the email itself
  - never `answers`, `fingerprint_hash`, `anonymous_session_id`, `email`
- **Separate tables (strongest isolation):** store sensitive fields in `quiz_results_private` keyed by `result_id` and keep the public table clean.
- **App-layer guardrails (minimum):** never use `select("*")`; centralize result reads in one helper that returns a typed safe shape.

Implementation preference:

- Use the Supabase **anon** key for public reads from the `quiz_results_public` surface (view/RPC). Keep the **service role** key reserved for server-only writes and admin-only reads.

## 8) API surface (proposed)

### 8.1 Web: set email for a result (secure)

Preferred (token-based):

- `POST /api/quiz/email`
  - input: `{ resultId, email, emailUpdateToken }`
  - server validates `emailUpdateToken` signature + TTL and that it matches `resultId`
  - server performs atomic update (ideally via a DB RPC like `set_quiz_result_email(...)`):
    - only if `user_id IS NULL`
    - and (preferably) only if `email IS NULL` (or within correction window)
  - returns `{ success: true, state: "pending" }` or a typed error like `{ success: false, errorCode: "EMAIL_ALREADY_SET" }`

Fallback (session-based):

- `POST /api/quiz/email`
  - input: `{ resultId, sessionId, email }`
  - server validates ownership by `anonymous_session_id`
  - same atomic update semantics as above

### 8.2 Web: get unlock status for a result

To support client-side `/quiz/results` showing correct lock state:

- `GET /api/quiz/result/<id>/status`
  - returns `{ unlocked: boolean }` derived from `user_id IS NOT NULL`
  - (optional) also return `state: locked|pending|unlocked`

### 8.2.1 Web/app: create or revoke a share link (public_slug)

There are two “share” concepts:

1) **Preview share (no auth, no app)**  
   Anyone who completes the quiz can share their results immediately via:
   - `https://firstdatelabs.com/quiz/results/<resultId>` (partial/locked preview)

2) **Full report share (requires app unlock + explicit publish)**  
   Publishing the full report requires creating `public_slug` and sharing:
   - `https://firstdatelabs.com/quiz/p/<publicSlug>` (full report, public)

Because the website is unauthenticated, **only the authenticated owner** (in the app) should be able to publish/revoke the **full report** share link (`public_slug`):

- `POST /api/quiz/share`
  - auth: Supabase Auth (bearer token)
  - input: `{ resultId }`
  - server verifies `quiz_results.user_id == auth.uid()`
  - server sets `public_slug` if it is NULL (idempotent) and returns `{ publicUrl }`

Optional revoke/rotate:

- `DELETE /api/quiz/share`
  - auth: Supabase Auth
  - input: `{ resultId }`
  - clears `public_slug` (revoke), or rotates to a new random value (rotate)

Public read:

- `GET /quiz/p/<publicSlug>` (page route; not API)
  - server looks up result by `public_slug`
  - returns full report content

### 8.3 App: claim results after login

- Use Supabase client (authenticated) → `rpc('claim_quizzes_by_email')`
  - returns `{ success, claimed_count }`

### 8.4 App: fetch results

Authenticated selects:

- `select id, archetype_slug, scores, created_at, claimed_at from quiz_results where user_id = auth.uid()`

## 9) Deep linking / cross-platform “handoff”

We want the “unlock in app” CTA to be as low-friction as possible.

### 9.1 Minimum viable handoff

- Results page shows:
  - App Store + Play Store links
  - “After installing, sign in with `<email>` to unlock”

App after login:

- shows the most recent claimed quiz result automatically.

### 9.2 Better UX: deep link to a specific result

Use a link that contains `resultId` (safe, bearer ID) but not sessionId:

- `https://firstdatelabs.com/app/quiz-results/<resultId>`
  - If app installed: open app route `firstdatelabs://quiz-results/<resultId>`
  - Else: redirect to store, then app “finds latest result” after login (or deferred deep link if supported).

Deferred deep linking can be done with a provider (Branch/Adjust). If you want to avoid vendors, stick to “open app → login → show latest”.

### 9.3 Redirect to the Next.js website for the full report

We will **not** render the report natively in the Expo app. The app’s job is:

1) authenticate the user’s email (Supabase Auth), and  
2) claim/unlock quiz rows via `claim_quizzes_by_email()`, then  
3) allow the owner to publish/share (optional), and redirect the user to the website:

- Preview (always safe, partial): `https://firstdatelabs.com/quiz/results/<resultId>`
- Full report (public, only after Share): `https://firstdatelabs.com/quiz/p/<publicSlug>`

This can be opened in:

- an in-app browser/WebView, or
- the system browser (simplest; fewer auth/token concerns).

Because the website’s **full report** is on a public share URL (`/quiz/p/<publicSlug>`), we do **not** need to pass Supabase auth tokens into the web context.

Tradeoff: once a share link is created, the report is not app-exclusive (which matches the “sharing is OK” policy). However, **unlocking alone does not publish** anything.

## 10) Privacy & data retention

### 10.1 Email handling

- Store `quiz_results.email` only for “pending unlock”.
- On claim, clear `quiz_results.email` (already implemented in `claim_quizzes_by_email()`).
- Waitlist emails are separate and long-lived; do not rely on them for claim.

### 10.2 Recommended cleanup

- Add a scheduled cleanup for stale pending emails (e.g., `email IS NOT NULL AND created_at < NOW() - INTERVAL '90 days' AND user_id IS NULL`).

## 11) Security checklist

- Protect “set email” with a short-lived signed token (preferred) or sessionId (fallback).
- Enforce first-write-wins (and unclaimed-only) in the database, atomically.
- Rate limit email submission endpoint (Cloudflare rate limit, or simple IP throttling).
- Never expose `answers` JSON or fingerprint in public endpoints.
- Treat `resultId` as a public **preview** identifier (it is OK to share), but avoid using it as a public **full-access** capability.
- Treat `public_slug` as the public “share token” (capability URL):
  - unguessable (random, high entropy)
  - revoke/rotate capable (clear/regenerate)
  - avoid leaking via referrers: set `Referrer-Policy: no-referrer` or `same-origin` on report pages
  - avoid indexing: `X-Robots-Tag: noindex, nofollow` on `/quiz/results/*` and `/quiz/p/*`
  - avoid caching confusion: `Cache-Control: no-store` at least on `/quiz/results/*` (preview)
- Avoid caching locked/unlocked content incorrectly:
  - serve `/quiz/results/[resultId]` as dynamic with `Cache-Control: no-store` until you explicitly manage cache invalidation.

## 12) Future: add real purchase/entitlements (optional extension)

If later you want “purchase to unlock on web/app”, add:

- `entitlements` table keyed by `user_id`:
  - `product_id`, `status`, `expires_at`, `source` (stripe/appstore/play)
- Unlock condition becomes:
  - `user_id IS NOT NULL AND entitlement_active = true`
  - and/or keep “app unlock” as a separate method.

This cleanly separates “verified identity” (user) from “paid access” (entitlement).

## 13) Implementation plan (phased; for later execution)

### Phase 1 (web lock UI + email capture)

- Persist an ownership secret after `/api/quiz/complete` (sessionId or signed token).
- Add email capture on results page:
  - write email to `quiz_results.email` via secure endpoint
  - transition UI to PENDING state

### Phase 2 (app claim + full report)

- App login with Supabase Auth.
- Call `claim_quizzes_by_email()`.
- Fetch claimed result and render full report.

### Phase 3 (web full report after unlock + sharing)

- `/quiz/results/[resultId]`: render full content only if `user_id IS NOT NULL`.
- Show share UI for unlocked reports.

## 14) Open questions

1) Should Love Languages remain free, partial, or locked?
2) Do we want unlocked reports to be permanently public by URL, or should sharing require an explicit “make public” toggle later?
3) How long should “pending email” remain stored before cleanup?
4) Do we need a “change email” flow before claim (typos)?
5) Do we want a true “private full report on web without sharing”? If yes, add an app-issued handoff token/cookie flow (more engineering).

## 15) References (security background)

- OWASP HTML5 Security Cheat Sheet (Web Storage): https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Authentication Cheat Sheet (sensitive actions / email changes): https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Forgot Password Cheat Sheet (referrer policy for URL tokens): https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- MDN Referer header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
- MDN Referrer-Policy header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
- PostgreSQL Row Security Policies (RLS): https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- PostgreSQL GRANT (column-level privileges): https://www.postgresql.org/docs/current/sql-grant.html
