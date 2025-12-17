# E2E Quiz Flow Test Plan

This document describes the end-to-end flow for quiz completion and report viewing, including verification checkpoints for manual testing.

## Overview

The quiz system has two distinct viewing modes:

1. **Preview Mode** (`/quiz/results/{id}`) - General report with gated content
2. **Full Report Mode** (`/quiz/p/{slug}`) - Complete report with all content unlocked

Security Model:
- Web users can only share **preview URLs** (general report)
- Full report sharing requires **authenticated + claimed quiz** via mobile app
- This prevents direct API calls from bypassing authentication

---

## Happy Path 1: Web User Completes Quiz

### Step 1: Session Creation

**Request:**
```http
POST /api/quiz/session
Content-Type: application/json

{
  "fingerprintHash": "abc123def456..."
}
```

**Expected Response (200):**
```json
{
  "sessionId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Verification:**
- [ ] `anonymous_sessions` table has new row with `id` = sessionId
- [ ] `fingerprint_hash` column matches input
- [ ] Same fingerprint returns same sessionId (idempotent)

---

### Step 2: Quiz Completion

**Request:**
```http
POST /api/quiz/complete
Content-Type: application/json

{
  "sessionId": "660e8400-e29b-41d4-a716-446655440001",
  "answers": {
    "q1": "a",
    "q2": "b",
    ...
  }
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "resultId": "550e8400-e29b-41d4-a716-446655440000",
  "archetypeSlug": "fiery-pursuer"
}
```

**Verification:**
- [ ] `quiz_results` table has new row with `id` = resultId
- [ ] `anonymous_session_id` = sessionId
- [ ] `archetype_slug` is a valid archetype
- [ ] `scores` contains attachment, communication, loveLanguages objects
- [ ] `public_slug` is NULL (not minted yet)
- [ ] `user_id` is NULL (not claimed yet)
- [ ] `claimed_at` is NULL

---

### Step 3: Email Capture (Optional)

**Request:**
```http
POST /api/quiz/email
Content-Type: application/json

{
  "email": "user@example.com",
  "resultId": "550e8400-e29b-41d4-a716-446655440000",
  "sessionId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Expected Response (200):**
```json
{
  "success": true
}
```

**Verification:**
- [ ] `quiz_results.email` = "user@example.com"
- [ ] Returns 403 if sessionId doesn't own resultId

---

### Step 4: Share (Preview URL Only)

**Request:**
```http
POST /api/quiz/share
Content-Type: application/json

{
  "resultId": "550e8400-e29b-41d4-a716-446655440000",
  "sessionId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "publicUrl": "https://firstdatelabs.com/quiz/results/550e8400-e29b-41d4-a716-446655440000",
  "created": false
}
```

**Verification:**
- [ ] Returns `/quiz/results/{id}` URL (NOT `/quiz/p/{slug}`)
- [ ] `created: false` (no slug was minted)
- [ ] `quiz_results.public_slug` remains NULL
- [ ] No RPC call to `create_or_get_share_slug`

---

### Step 5: View Preview Report

**Navigate to:** `/quiz/results/550e8400-e29b-41d4-a716-446655440000`

**Verification:**
- [ ] Page loads successfully (200)
- [ ] Shows archetype name and emoji
- [ ] Shows attachment style breakdown
- [ ] Shows communication style
- [ ] Shows love languages scores

**Gated Content (should be locked):**
- [ ] `ListGate` on Dating Cycle section (shows N of M items, lock badge)
- [ ] `SectionGate` on Dating Meaning section (blur overlay, unlock CTA)
- [ ] `ListGate` on Red Flags section (shows teaser, lock badge)

---

## Happy Path 2: Mobile App User Gets Full Report

### Prerequisites
- User has completed quiz on web (Steps 1-4 above)
- User's email is associated with quiz result

### Step 6: Mobile Login

**Supabase Auth:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123"
});
```

**Verification:**
- [ ] `auth.users` row exists for email
- [ ] Session token received
- [ ] `profiles` row created (via `handle_new_user` trigger)

---

### Step 7: Claim Quiz Results

**RPC Call:**
```typescript
const { data, error } = await supabase.rpc("claim_quizzes_by_email");
```

**Expected Response:**
```json
{
  "claimed_count": 1
}
```

**Verification:**
- [ ] `quiz_results.user_id` = auth.uid()
- [ ] `quiz_results.claimed_at` = NOW()
- [ ] `quiz_results.email` = NULL (cleared after claim)
- [ ] User owns the quiz result

---

### Step 8: Create Full Report Slug

**RPC Call:**
```typescript
import { nanoid } from "nanoid";

const newSlug = nanoid(21);
const { data, error } = await supabase.rpc("create_or_get_full_report_slug", {
  p_result_id: "550e8400-e29b-41d4-a716-446655440000",
  p_new_slug: newSlug
});
```

**Expected Response:**
```json
{
  "public_slug": "abc123xyz789def456ghi",
  "created": true
}
```

**Verification:**
- [ ] `quiz_results.public_slug` = generated slug
- [ ] `quiz_results.public_slug_created_at` = NOW()
- [ ] Second call returns same slug with `created: false` (idempotent)

**Error Cases:**
- [ ] Unauthenticated call returns `NOT_AUTHENTICATED` error
- [ ] Unclaimed quiz returns `ACCESS_DENIED_OR_NOT_CLAIMED` error
- [ ] Invalid slug format returns `INVALID_SLUG` error
- [ ] Non-owned result returns `ACCESS_DENIED_OR_NOT_CLAIMED` error

---

### Step 9: View Full Report

**Navigate to:** `/quiz/p/abc123xyz789def456ghi`

**Verification:**
- [ ] Page loads successfully (200)
- [ ] Shows ALL archetype content (no gates)

**Unlocked Content (should be visible):**
- [ ] Full Dating Cycle (all 5 steps visible)
- [ ] Full Dating Meaning (strengths + challenges)
- [ ] Full Red Flags list (all items visible)
- [ ] No blur overlays
- [ ] No lock badges
- [ ] No unlock CTAs

---

## Security Test Cases

### Permission Lockdown

| RPC Function | anon | authenticated | service_role |
|--------------|------|---------------|--------------|
| `verify_or_create_session` | ❌ | ❌ | ✅ |
| `insert_quiz_result` | ❌ | ❌ | ✅ |
| `create_or_get_share_slug` | ❌ | ❌ | ✅ |
| `join_waitlist` | ❌ | ❌ | ✅ |
| `get_quiz_preview` | ❌ | ❌ | ✅ |
| `get_quiz_by_public_slug` | ❌ | ❌ | ✅ |
| `claim_quizzes_by_email` | ❌ | ✅ | ✅ |
| `create_or_get_full_report_slug` | ❌ | ✅ | ✅ |

### RLS Policy Verification

**Removed (vulnerable):**
- `results_select_anon` - allowed header-spoofable access

**Active:**
- `results_select_authenticated` - `auth.uid() = user_id`
- `results_insert_authenticated` - `auth.uid() = user_id`

### Share Endpoint Security

| Scenario | Expected Behavior |
|----------|-------------------|
| Web user calls `/api/quiz/share` | Returns preview URL only |
| Direct API call with valid IDs | Returns preview URL only |
| Mobile app (authenticated + claimed) | Can call `create_or_get_full_report_slug` |
| Mobile app (authenticated, unclaimed) | RPC returns `ACCESS_DENIED_OR_NOT_CLAIMED` |
| Anon key calls `create_or_get_full_report_slug` | Permission denied |

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           WEB FLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Start Quiz                                                      │
│     POST /api/quiz/session ─────────────────────────────►           │
│     ◄───────────────────────────────────── { sessionId }            │
│                                                                     │
│  2. Complete Quiz                                                   │
│     POST /api/quiz/complete ────────────────────────────►           │
│     ◄───────────────────────────── { resultId, archetypeSlug }      │
│                                                                     │
│  3. Enter Email (optional)                                          │
│     POST /api/quiz/email ───────────────────────────────►           │
│     ◄────────────────────────────────────── { success: true }       │
│                                                                     │
│  4. Share (Preview Only)                                            │
│     POST /api/quiz/share ───────────────────────────────►           │
│     ◄───────────────────────── { publicUrl: /quiz/results/{id} }    │
│                                                                     │
│  5. View Preview Report                                             │
│     GET /quiz/results/{id} ─────────────────────────────►           │
│     ◄────────────────────────────────────── [GATED CONTENT]         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         MOBILE APP FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  6. Login                                                           │
│     supabase.auth.signIn() ─────────────────────────────►           │
│     ◄────────────────────────────────────── { session, user }       │
│                                                                     │
│  7. Claim Quiz                                                      │
│     supabase.rpc("claim_quizzes_by_email") ─────────────►           │
│     ◄────────────────────────────────────── { claimed_count }       │
│                                                                     │
│  8. Create Full Report Slug                                         │
│     supabase.rpc("create_or_get_full_report_slug") ─────►           │
│     ◄────────────────────────────────── { public_slug, created }    │
│                                                                     │
│  9. View Full Report                                                │
│     GET /quiz/p/{slug} ─────────────────────────────────►           │
│     ◄────────────────────────────────────── [FULL CONTENT]          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database State Transitions

### Quiz Result Lifecycle

```
┌───────────────────┐
│ Quiz Completed    │
│ (Web)             │
├───────────────────┤
│ user_id: NULL     │
│ claimed_at: NULL  │
│ public_slug: NULL │
│ email: NULL       │
└─────────┬─────────┘
          │ Email captured (optional)
          ▼
┌───────────────────┐
│ Email Added       │
├───────────────────┤
│ user_id: NULL     │
│ claimed_at: NULL  │
│ public_slug: NULL │
│ email: "x@y.com"  │
└─────────┬─────────┘
          │ User logs in & claims (mobile app)
          ▼
┌───────────────────┐
│ Claimed           │
├───────────────────┤
│ user_id: uuid     │
│ claimed_at: NOW() │
│ public_slug: NULL │
│ email: NULL       │◄─── email cleared after claim
└─────────┬─────────┘
          │ User creates share link (mobile app)
          ▼
┌───────────────────┐
│ Full Report       │
│ Available         │
├───────────────────┤
│ user_id: uuid     │
│ claimed_at: ts    │
│ public_slug: slug │
│ email: NULL       │
└───────────────────┘
```

---

## Related Test Files

| File | Purpose |
|------|---------|
| `__tests__/api/quiz/session-route.test.ts` | Session creation unit tests |
| `__tests__/api/quiz/email-route.test.ts` | Email capture unit tests |
| `__tests__/api/quiz/share-route.test.ts` | Share endpoint security tests |
| `__tests__/api/quiz/result-route.test.ts` | Result fetch unit tests |
| `__tests__/integration/full-report-slug.test.ts` | Full report RPC tests |
| `__tests__/integration/permission-lockdown.test.ts` | Permission verification |
| `__tests__/components/gating/*.test.tsx` | UI gating component tests |
| `__tests__/components/results/*.test.tsx` | Results container tests |

---

## Running Tests

```bash
# Run all quiz API tests
npm run test -- --run __tests__/api/quiz/

# Run integration tests (requires Supabase connection)
npm run test:integration

# Run with coverage
npm run test -- --coverage __tests__/
```

---

## Troubleshooting

### "Permission denied" on RPC call
- Verify the function grant matches expected role
- Check if using correct Supabase client (anon vs service_role)
- API routes should use `getSupabaseServer()` (service_role)

### "ACCESS_DENIED_OR_NOT_CLAIMED" error
- Quiz result must have `user_id` set (claimed)
- Quiz result must have `claimed_at` set
- User must own the quiz result (`user_id = auth.uid()`)

### Share returns preview URL instead of full report URL
- This is expected behavior for web users
- Full report URLs require mobile app authentication
- Use `create_or_get_full_report_slug` RPC from authenticated client

### Gated content showing on full report page
- Check if `public_slug` exists in database
- Verify `/quiz/p/[slug]` route calls `get_quiz_by_public_slug` RPC
- Ensure `isFullView` prop is passed to ResultsContainer
