# Quiz Feature Gaps (Full-Stack)

Repo root: `/Users/zyy/Documents/GitHub/juliet-landing`

Last reviewed: 2025-12-12

This document lists the current gaps (bugs, missing wiring, spec drift, and safety/privacy mismatches) in the quiz feature across:
- Database schema: `docs/schema.sql`
- Next.js API routes: `app/src/app/api/quiz/*`, `app/src/app/api/waitlist/*`
- Frontend routes/components: `app/src/app/quiz/*`, `app/src/components/quiz/*`

Severity legend:
- **P0**: user-facing breakage / security or trust issue
- **P1**: high-impact functional gap
- **P2**: product/UX gap, or incomplete implementation
- **P3**: cleanup / tech-debt / doc drift

---

## P0 — Broken behavior / trust mismatches

### P0.1 — (Resolved) Archetype cards no longer navigate to `/quiz/results?id=...`

**Where**
- `app/src/components/archetypes/ArchetypeCard.tsx` (was a `Link`; now a non-interactive wrapper)
- `app/src/components/archetypes/ArchetypesGrid.tsx` (no longer passes `variant`)

**Previous implementation (cause)**

- `app/src/components/archetypes/ArchetypeCard.tsx` wrapped each card in a Next.js `Link` with `href` set to `/quiz/results?id=${btoa(archetype.id)}` (base64 of the archetype id).
- `/quiz/results` only renders localStorage results and ignores this `id` param, so users got bounced back to `/quiz` when no stored results existed.

**Why this happened**
- The code comment in `app/src/components/archetypes/ArchetypeCard.tsx` (“Logic to simulate encoded ID for URL”) indicates it was a placeholder/navigation experiment.
- `docs/quiz/dev-plan.md` also references an older sharing shape: `/quiz/results?id={hash}` (doc drift).

**Fix (current implementation)**

`app/src/components/archetypes/ArchetypeCard.tsx`:
```ts
13  export function ArchetypeCard({ archetype, className }: ArchetypeCardProps) {
14    return (
15      <div
16        className={cn(
17          "group relative flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2",
18          className
19        )}
20      >
```

`app/src/components/archetypes/ArchetypesGrid.tsx`:
```ts
60  {groupArchetypes.map((archetype) => (
61    <ArchetypeCard key={archetype.id} archetype={archetype} />
62  ))}
```

**Result**
- Clicking an archetype card does nothing (no navigation, no `resultId`/`?id=` URL changes).

---

### P0.2 — “100% private / stored locally / we don’t collect” copy conflicts with server persistence

**Where**
- `app/src/app/quiz/page.tsx` (quiz landing page: “100% private”)
- `app/src/app/quiz/results/page.tsx` (results page: “stored locally”, “We don’t collect or share”)
- `app/src/app/api/quiz/complete/route.ts` (always persists to Supabase `quiz_results` including raw answers)
- `docs/schema.sql` (DB stores `answers`, `fingerprint_hash`, attribution fields, etc.)

**Exact implementation**

`app/src/app/quiz/page.tsx`:
```ts
151  <div className="flex items-center gap-2">
152    <Lock className="h-4 w-4" />
153    <span>100% private</span>
154  </div>
```

`app/src/app/quiz/results/page.tsx`:
```ts
216  {/* Trust footer */}
217  <p className="mt-8 text-center text-sm text-slate-500">
218    Your results are stored locally on your device.
219    <br className="hidden sm:block" />
220    We don&apos;t collect or share your quiz data.
221  </p>
```

`app/src/app/api/quiz/complete/route.ts`:
```ts
75  // 2. Persist to Supabase using service role (bypasses RLS)
76  // RPC validates session internally and returns result UUID
77  const supabase = getSupabaseServer();
78  const { data: resultId, error } = await supabase.rpc("insert_quiz_result", {
79    p_session_id: sessionId,
80    p_archetype_slug: archetypeSlug,
81    p_scores: results,
82    p_answers: answers,
83    p_fingerprint_hash: fingerprintHash || null,
```

`docs/schema.sql`:
```sql
83  CREATE TABLE public.quiz_results (
...
89    fingerprint_hash TEXT,
...
93    scores JSONB NOT NULL CHECK (jsonb_typeof(scores) = 'object'),
94    answers JSONB NOT NULL CHECK (jsonb_typeof(answers) = 'object'),
```

**Why this is a gap**
- Product trust issue: the UI claims results are local/private, but the implementation sends answers to the backend and stores them in Supabase.
- Even if UUID access is “unguessable”, this is still collection and storage of quiz data server-side.

**Fix options**
- Align copy to reality (explain what is stored, for how long, and how links work), OR
- Make quiz scoring/persistence truly client-side (or opt-in) and stop calling `/api/quiz/complete`.

---

### P0.3 — Public access to saved results by UUID (no ownership/auth checks)

**Where**
- `app/src/app/api/quiz/result/[id]/route.ts` (public JSON fetch by result UUID)
- `app/src/app/quiz/results/[resultId]/page.tsx` (server-rendered results page fetches by UUID)

**Exact implementation**

`app/src/app/api/quiz/result/[id]/route.ts`:
```ts
44  // Public access via UUID - no ownership check needed
45  // UUID provides 122 bits of entropy (unguessable)
46  return NextResponse.json({
47    success: true,
48    result: {
49      id: data.id,
50      archetypeSlug: data.archetype_slug,
51      scores,
52      createdAt: data.created_at,
53    },
54  });
```

`app/src/app/quiz/results/[resultId]/page.tsx`:
```ts
60  // Fetch result from database
61  const supabase = getSupabaseServer();
62  const { data, error } = await supabase
63    .from("quiz_results")
64    .select("id, archetype_slug, scores, created_at")
65    .eq("id", resultId)
66    .single();
```

**Why this is a gap**
- If results are intended to be private-by-default, this is a privacy/security gap: anyone with the link can view results, and the API route returns the same.
- This also conflicts with “we don’t collect/share” messaging and with the schema’s RLS posture (see P1.3).

**Notes**
- If this is intentional (share-by-link), it should be documented in product copy and security review, and ideally use a separate “share token” with revocation support rather than the primary DB id.

---

## P1 — High-impact functional / data quality gaps

### P1.1 — Idempotency is wired end-to-end but ineffective (client always generates a new key)

**Where**
- `docs/schema.sql` (unique `idempotency_key`)
- `app/src/app/api/quiz/complete/route.ts` (accepts `idempotencyKey`)
- `app/src/components/quiz/QuizContainer.tsx` (always sends a new `crypto.randomUUID()`)

**Exact implementation**

`docs/schema.sql`:
```sql
114  idempotency_key TEXT UNIQUE,
```

`app/src/app/api/quiz/complete/route.ts`:
```ts
26  idempotencyKey: z.string().optional(),
...
86  p_idempotency_key: idempotencyKey || null,
```

`app/src/components/quiz/QuizContainer.tsx`:
```ts
133  const payload: SubmitQuizRequest = {
134    sessionId: state.sessionId,
135    fingerprintHash: fingerprint,
136    answers: answerMap,
137    idempotencyKey: crypto.randomUUID(),
138  };
```

**Why this is a gap**
- If a user double-clicks submit, retries after a network error, or re-submits the same answers, the “idempotency” key won’t deduplicate anything because it’s always fresh.
- This can inflate `quiz_results` and break funnel analytics.

**Fix options**
- Generate a stable idempotency key per completion attempt and persist it in localStorage/session state until success, OR derive it deterministically from `(sessionId + answers hash)`.

---

### P1.2 — Quiz attribution fields exist, but frontend never sends them (UTM/source/duration)

**Where**
- `docs/schema.sql` (fields + RPC parameters for `utm_*`, `duration_seconds`, `source`)
- `app/src/app/api/quiz/complete/route.ts` (accepts `utmSource/utmMedium/utmCampaign/durationSeconds`)
- `app/src/components/quiz/QuizContainer.tsx` (does not include those fields)
- `app/src/components/waitlist/WaitlistForm.tsx` (UTMs are only read at signup time, likely after UTMs are lost)

**Exact implementation**

`docs/schema.sql`:
```sql
101  -- ANALYTICS & ATTRIBUTION
102  source TEXT DEFAULT 'web',
103  utm_source TEXT,
104  utm_medium TEXT,
105  utm_campaign TEXT,
...
115  duration_seconds INT CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
```

`app/src/app/api/quiz/complete/route.ts`:
```ts
27  durationSeconds: z.number().positive().optional(),
29  utmSource: z.string().optional(),
30  utmMedium: z.string().optional(),
31  utmCampaign: z.string().optional(),
...
85  p_duration_seconds: durationSeconds || null,
87  p_utm_source: utmSource || null,
88  p_utm_medium: utmMedium || null,
89  p_utm_campaign: utmCampaign || null,
```

`app/src/components/quiz/QuizContainer.tsx`:
```ts
133  const payload: SubmitQuizRequest = {
134    sessionId: state.sessionId,
135    fingerprintHash: fingerprint,
136    answers: answerMap,
137    idempotencyKey: crypto.randomUUID(),
138  };
```

`app/src/components/waitlist/WaitlistForm.tsx`:
```ts
57  // Capture UTM params from URL
58  const params = new URLSearchParams(window.location.search);
...
63  utmSource: params.get("utm_source") || undefined,
64  utmMedium: params.get("utm_medium") || undefined,
65  utmCampaign: params.get("utm_campaign") || undefined,
```

**Why this is a gap**
- `quiz_results` likely has null `utm_*` and `duration_seconds` for most/all rows, undermining the schema’s funnel/attribution views.
- Waitlist UTMs are captured late; users often arrive with UTMs on `/quiz` but end up on `/quiz/results` without those query params, so attribution is lost.

**Fix options**
- Persist UTMs at first touch (e.g. localStorage/session) and send them with `/api/quiz/complete` and `/api/waitlist`.
- Compute `durationSeconds` from `state.startedAt` and send it.

---

### P1.3 — Schema’s “RLS + x-session-id header” model is not used (service role bypasses it)

**Where**
- `docs/schema.sql` (RLS policy `results_select_anon` expects `x-session-id`)
- `app/src/lib/supabase/server.ts` (always uses `SUPABASE_SERVICE_ROLE_KEY`)
- `app/src/app/api/quiz/*` and `app/src/app/quiz/results/[resultId]/page.tsx` (all DB access uses service role)

**Exact implementation**

`docs/schema.sql`:
```sql
208  CREATE POLICY "results_select_anon" ON quiz_results
209    FOR SELECT TO anon
210    USING (
211      anonymous_session_id::text =
212        current_setting('request.headers', true)::json->>'x-session-id'
213    );
```

`app/src/lib/supabase/server.ts`:
```ts
15  const url = process.env.SUPABASE_URL;
16  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
...
22  client = createClient(url, key, {
```

**Why this is a gap**
- The schema is designed to support session-bound anonymous reads via RLS headers, but the application does not exercise that path.
- Instead, the application relies on backend trust and (in some cases) “unguessable UUID” access, which is a different security posture than the schema’s stated intent.

**Related unused schema features**
`docs/schema.sql` includes helper functions that are not used by the app:
```sql
346  CREATE OR REPLACE FUNCTION claim_quizzes_by_email()
...
398  CREATE OR REPLACE FUNCTION get_results_by_fingerprint(p_fingerprint TEXT)
```

---

## P2 — Product/UX gaps and incomplete wiring

### P2.1 — Quiz session fallback comment is incorrect; quiz submit cannot succeed if session creation fails

**Where**
- `app/src/hooks/use-quiz.ts` (initial sessionId is empty string)
- `app/src/components/quiz/QuizContainer.tsx` (logs “fallback” but none exists)
- `app/src/app/api/quiz/complete/route.ts` (rejects empty sessionId)

**Exact implementation**

`app/src/hooks/use-quiz.ts`:
```ts
50  function generateSessionId(): string {
51    // Return empty string - server will provide the real UUID
52    return "";
53  }
```

`app/src/components/quiz/QuizContainer.tsx`:
```ts
76  } catch (err) {
77    console.error("Session initialization failed:", err);
78    // Continue with client-generated sessionId as fallback
79  }
```

`app/src/app/api/quiz/complete/route.ts`:
```ts
21  const SubmitQuizSchema = z.object({
22    sessionId: z.string().min(1),
```

**Why this is a gap**
- If `/api/quiz/session` fails (network error, backend down), `state.sessionId` stays `""`, and `/api/quiz/complete` will reject the submission (`min(1)`).
- The UI does not surface a clear “session could not be created” error state; it will fail on submit.

---

### P2.2 — “Coaching focus” CTA button is not wired to anything

**Where**
- `app/src/components/quiz/results/sections/CoachingFocusList.tsx`

**Exact implementation**
```ts
29  <button className="w-full rounded-lg bg-slate-900 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-slate-800">
30    {ctaText}
31  </button>
```

**Why this is a gap**
- The results page implies an action (get coaching / full report), but the button is a dead-end (no click handler, no link, no scroll).

---

### P2.3 — “Get Full Report” nav button can become a no-op (waitlist section is conditional)

**Where**
- `app/src/components/quiz/results/layout/ResultsNavSidebar.tsx` (button always scrolls to `full-picture`)
- `app/src/components/quiz/results/layout/ResultsContainer.tsx` (only renders `#full-picture` when `quizResultId` is set)

**Exact implementation**

`app/src/components/quiz/results/layout/ResultsNavSidebar.tsx`:
```ts
100  <button
101    onClick={() => handleClick("full-picture")}
102    className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
103  >
104    Get Full Report
105  </button>
```

`app/src/components/quiz/results/layout/ResultsContainer.tsx`:
```ts
302  {/* Waitlist Signup - Only show if we have a quiz result ID */}
303  {quizResultId && (
...
310    <div id="full-picture">
311      <QuizWaitlistSection ... />
312    </div>
...
318  )}
```

**Why this is a gap**
- In any scenario where `quizResultId` is missing (localStorage failure, legacy results payload, partial preview usage), the sidebar CTA scroll target does not exist.

---

### P2.4 — Results email says “saved” but does not include a retrieval link; schema mentions “signed tokens” but no token flow exists

**Where**
- `app/src/emails/QuizResultsEmail.tsx` (no results link)
- `docs/schema.sql` (design comment: “signed tokens” / “view later”)
- `app/src/app/api/waitlist/route.ts` (sends `QuizResultsEmail` without a result URL)

**Exact implementation**

`docs/schema.sql` (design intent):
```sql
10  ├── Email access: Backend (service_role) + signed tokens
17  ├── Email "view later": Signed JWT tokens validated by backend
```

`app/src/emails/QuizResultsEmail.tsx`:
```ts
44  <Text style={paragraph}>
45    Thanks for taking the quiz! Your results have been saved, and
46    you&apos;re now on our early access list.
47  </Text>
...
77  <Section style={footer}>
78    <Text style={footerText}>
79      You&apos;re receiving this email because you saved your quiz
80      results on First Date Labs.
81    </Text>
```

**Why this is a gap**
- Users receiving the email have no direct way to “view later” from the email (no `/quiz/results/[resultId]` link or signed-token link).
- Schema comments indicate a signed-token access path, but the app currently relies on localStorage and/or share-by-UUID.

---

### P2.5 — `/api/quiz/email` exists, but nothing calls it; `quiz_results.email` is not populated in the primary flow

**Where**
- `app/src/app/api/quiz/email/route.ts`
- `app/src/components/waitlist/WaitlistForm.tsx` + `app/src/app/api/waitlist/route.ts` (email captured via waitlist, not quiz_results)
- `docs/schema.sql` (`quiz_results.email` column)

**Exact implementation**

`app/src/app/api/quiz/email/route.ts`:
```ts
41  // Update email
42  const { error } = await supabase
43    .from("quiz_results")
44    .update({ email })
45    .eq("id", resultId);
```

`docs/schema.sql`:
```sql
107  -- EMAIL HANDLING
108  email TEXT CHECK (
```

**Why this is a gap**
- There is no frontend call site for `/api/quiz/email` (search shows no `/api/quiz/email` usage), so `quiz_results.email` remains null unless manually invoked.
- Email capture is effectively happening only in `waitlist`, which may be fine, but then the quiz_results email column + API route are dead code.

---

### P2.6 — Confidence/balanced signals are computed server-side but unused in the UI

**Where**
- `app/src/lib/quiz/data/archetypes/joint-probability.ts` (computes `confidence` and `isBalanced`)
- `app/src/app/api/quiz/complete/route.ts` (returns them)
- `app/src/components/quiz/QuizContainer.tsx` + `app/src/app/quiz/questions/page.tsx` (doesn’t store or render them)

**Exact implementation**

`app/src/app/api/quiz/complete/route.ts`:
```ts
71  // 1. Score quiz server-side
72  const { results, archetypeSlug, confidence, isBalanced } =
73    scoreQuizFromAnswers(answers);
...
115  scores: results,
116  confidence,
117  isBalanced,
```

**Why this is a gap**
- The scoring system provides useful nuance (blended profiles / low-confidence matches), but the frontend ignores it, so users may not get the intended “your result is blended” messaging.

---

## P3 — Cleanup / doc drift

### P3.1 — Test-only results preview route is still present and publicly routable

**Where**
- `app/src/app/test-results/page.tsx`

**Exact implementation**
```ts
210  {/* Delete Reminder */}
211  <p className="mt-8 text-center text-sm text-slate-400">
212    Remember to delete this test page before deploying: app/src/app/test-results/page.tsx
213  </p>
```

**Why this is a gap**
- The route is accessible in production builds unless removed; it exposes internal archetype IDs and a full results renderer for arbitrary selections.

---

### P3.2 — QuizHeader component exists but is not wired; global Navbar always renders

**Where**
- `app/src/components/quiz/QuizHeader.tsx` (exit-confirm header)
- `app/src/app/layout.tsx` (global `Navbar` renders for all routes)

**Exact implementation**

`app/src/app/layout.tsx`:
```ts
31  <div className="flex min-h-screen flex-col">
32    <Navbar />
33    <main className="flex-1">{children}</main>
34    <Footer />
35  </div>
```

**Why this is a gap**
- `QuizHeader` appears to have been built for a “minimal quiz header w/ exit confirm” pattern, but it isn’t used anywhere (no `<QuizHeader` references).
- If the intended UX is to keep the main Navbar during quiz, `QuizHeader.tsx` is dead code; if the intended UX is the minimal quiz header, wiring is missing.

---

### P3.3 — Stored results have `version` but no migrations; parsing is strict and can invalidate older saves

**Where**
- `app/src/app/quiz/results/page.tsx`

**Exact implementation**
```ts
18  interface StoredResults {
19    version: number;
...
47    // Look up full archetype - NO FALLBACK
...
50    // Validate archetype exists and has required new fields
51    if (!archetype?.patternDescription || !archetype?.datingCycle) {
52      console.error('[Quiz Results] Invalid archetype:', parsed.archetype.id);
53      return null;
54    }
```

**Why this is a gap**
- The `version` field is not used to migrate/handle older shapes.
- If archetype definitions evolve (or older localStorage payloads exist), results can fail to parse and force redirect back to `/quiz`.

---

### P3.4 — Documentation drift: share URL format in docs does not match implementation

**Where**
- `docs/quiz/dev-plan.md` (expects `/quiz/results?id={hash}`)
- Implementation uses `/quiz/results/[resultId]` and local results in `/quiz/results`

**Evidence**
- `docs/quiz/dev-plan.md`:
  - `- Share URL: /quiz/results?id={hash}`
- Code:
  - `app/src/app/quiz/results/page.tsx` builds `${origin}/quiz/results/${data.resultId}`
  - `app/src/app/quiz/results/[resultId]/page.tsx` serves saved results
