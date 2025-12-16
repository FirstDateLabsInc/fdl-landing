/**
 * Mock Factories for Unit Tests
 *
 * Provides mock implementations for Vitest unit tests.
 * Usage: vi.mock("@/lib/supabase/server", () => ({ getSupabaseServer: mockSupabaseServer }))
 */

import { vi } from "vitest";

/**
 * Create a mock Supabase client for unit tests
 */
export function mockSupabaseServer(overrides: Record<string, unknown> = {}) {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  return vi.fn(() => ({
    from: vi.fn(() => mockQueryBuilder),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  }));
}

/**
 * Create a mock RPC response
 */
export function mockRpcResponse<T>(data: T, error: Error | null = null) {
  return { data, error };
}

/**
 * Create a mock query response
 */
export function mockQueryResponse<T>(data: T, error: Error | null = null) {
  return { data, error };
}

/**
 * Mock quiz result data
 */
export function mockQuizResult(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    archetype_slug: "fiery-pursuer",
    scores: {
      attachment: {
        primary: "anxious",
        scores: { secure: 3, anxious: 8, avoidant: 4, disorganized: 2 },
      },
      communication: {
        primary: "expressive",
        scores: { expressive: 7, receptive: 5, analytical: 4, intuitive: 6 },
      },
      loveLanguages: {
        primary: "quality-time",
        scores: {
          "quality-time": 9,
          "words-of-affirmation": 7,
          "physical-touch": 6,
          "acts-of-service": 4,
          gifts: 3,
        },
      },
    },
    answers: {},
    email: null,
    user_id: null,
    claimed_at: null,
    public_slug: null,
    public_slug_created_at: null,
    anonymous_session_id: "660e8400-e29b-41d4-a716-446655440001",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Mock archetype data (public portion)
 */
export function mockArchetypePublic(overrides: Record<string, unknown> = {}) {
  return {
    slug: "fiery-pursuer",
    name: "The Fiery Pursuer",
    emoji: "🔥",
    tagline: "You love deeply and chase connection fearlessly",
    patternDescription:
      "You tend to seek intense emotional connections quickly...",
    rootCause: "Your attachment style developed from early experiences...",
    coachingFocus: [
      "Practice self-soothing techniques",
      "Build secure attachment patterns",
      "Learn to tolerate uncertainty",
    ],
    callToActionCopy: "Ready to break the cycle?",
    datingCycleTeaser: [
      "You meet someone exciting",
      "Intensity builds quickly",
    ],
    datingCycleTotalCount: 5,
    redFlagsTeaser: ["Ignoring early warning signs"],
    redFlagsTotalCount: 4,
    ...overrides,
  };
}

/**
 * Mock archetype locked content
 */
export function mockArchetypeLocked(overrides: Record<string, unknown> = {}) {
  return {
    datingCycle: [
      "You meet someone exciting",
      "Intensity builds quickly",
      "Anxiety kicks in when they need space",
      "You pursue harder, they pull back",
      "The cycle repeats or ends painfully",
    ],
    redFlags: [
      "Ignoring early warning signs",
      "Confusing anxiety for chemistry",
      "Moving too fast too soon",
      "Losing yourself in relationships",
    ],
    datingMeaning: {
      strengths: [
        "Passionate and devoted partner",
        "Emotionally available",
        "Great communicator of needs",
      ],
      challenges: [
        "Can become overwhelming",
        "Struggles with partner's need for space",
        "May rush commitment",
      ],
    },
    ...overrides,
  };
}

/**
 * Mock quiz results data structure
 */
export function mockQuizResults(overrides: Record<string, unknown> = {}) {
  return {
    attachment: {
      primary: "anxious" as const,
      scores: { secure: 3, anxious: 8, avoidant: 4, disorganized: 2 },
    },
    communication: {
      primary: "expressive" as const,
      scores: { expressive: 7, receptive: 5, analytical: 4, intuitive: 6 },
    },
    loveLanguages: {
      primary: "quality-time" as const,
      scores: {
        "quality-time": 9,
        "words-of-affirmation": 7,
        "physical-touch": 6,
        "acts-of-service": 4,
        gifts: 3,
      },
    },
    ...overrides,
  };
}

/**
 * Mock NextRequest for API route tests
 */
export function mockNextRequest(
  body: Record<string, unknown>,
  options: { method?: string; headers?: Record<string, string> } = {}
) {
  return {
    method: options.method || "POST",
    json: vi.fn().mockResolvedValue(body),
    headers: new Headers(options.headers || {}),
    url: "http://localhost:3000/api/test",
  } as unknown as Request;
}

/**
 * Create mock for environment variables
 */
export function mockEnv(overrides: Record<string, string> = {}) {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SITE_URL: "https://firstdatelabs.com",
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
      SUPABASE_ANON_KEY: "test-anon-key",
      ...overrides,
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });
}

/**
 * UUID validation regex
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Nanoid slug validation regex (21 chars, URL-safe)
 */
export const NANOID_REGEX = /^[A-Za-z0-9_-]{21}$/;

/**
 * Valid test UUIDs
 */
export const TEST_UUIDS = {
  resultId: "550e8400-e29b-41d4-a716-446655440000",
  sessionId: "660e8400-e29b-41d4-a716-446655440001",
  userId: "770e8400-e29b-41d4-a716-446655440002",
};

/**
 * Invalid UUID formats for testing validation
 */
export const INVALID_UUIDS = [
  "not-a-uuid",
  "550e8400-e29b-41d4-a716", // too short
  "550e8400-e29b-41d4-a716-446655440000-extra", // too long
  "550e8400_e29b_41d4_a716_446655440000", // wrong separators
  "", // empty
];

/**
 * Valid test email
 */
export const TEST_EMAIL = "test@firstdatelabs.com";

/**
 * Valid fingerprint hash for testing
 */
export const VALID_FINGERPRINT = "abc123def456";

/**
 * Create mock scores object for testing
 */
export function createMockScores() {
  return {
    attachment: {
      primary: "anxious" as const,
      scores: { secure: 3, anxious: 8, avoidant: 4, disorganized: 2 },
    },
    communication: {
      primary: "expressive" as const,
      scores: { expressive: 7, receptive: 5, analytical: 4, intuitive: 6 },
    },
    loveLanguages: {
      primary: "quality-time" as const,
      scores: {
        "quality-time": 9,
        "words-of-affirmation": 7,
        "physical-touch": 6,
        "acts-of-service": 4,
        gifts: 3,
      },
    },
  };
}
