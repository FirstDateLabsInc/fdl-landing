# Tests

## Directory Structure

```
__tests__/
├── integration/          # Tests that require external services (Supabase, etc.)
│   └── claim-rpc.test.ts # claim_quizzes_by_email() RPC tests
└── README.md
```

## Running Tests

### Prerequisites

Ensure `.env.local` contains:
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_ANON_KEY=xxx
```

### Integration Tests

Run from the `app/` directory:

```bash
# Run all integration tests
npx tsx __tests__/integration/claim-rpc.test.ts

# Or use npm script (if configured)
npm run test:integration
```

## Test Descriptions

### `claim-rpc.test.ts`

Tests the `claim_quizzes_by_email()` Supabase RPC function which:
- Links anonymous quiz results to authenticated users
- Matches by email (case-insensitive)
- Clears email after claiming (allows retaking quiz)
- Sets `user_id` and `claimed_at` timestamp

| Test | Description |
|------|-------------|
| E7 | Unauthenticated call rejected |
| E1 | Insert test quiz result |
| E2 | Claim RPC returns success |
| E3 | Verify database state changes |
| E4 | Multiple results claimed at once |
| E5 | Idempotency (second call = 0) |
| E6 | Case-insensitive email matching |

## Adding New Tests

1. Create test file in appropriate directory (`integration/`, `unit/`, etc.)
2. Follow naming convention: `<feature>.test.ts`
3. Include JSDoc header with prerequisites and run instructions
4. Clean up test data after each run
