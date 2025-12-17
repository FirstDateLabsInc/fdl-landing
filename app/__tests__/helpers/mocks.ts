/**
 * Mock Factories for Unit Tests
 *
 * Provides mock implementations for Vitest unit tests.
 * Usage: vi.mock("@/lib/supabase/server", () => ({ getSupabaseServer: mockSupabaseServer }))
 */

import { vi, beforeEach, afterEach } from "vitest";

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
 * Mock quiz result data (DB row format)
 */
export function mockQuizResult(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    archetype_slug: "fiery-pursuer",
    scores: {
      attachment: {
        primary: "anxious",
        scores: { secure: 30, anxious: 80, avoidant: 40, disorganized: 20 },
      },
      communication: {
        primary: "assertive",
        scores: { passive: 30, aggressive: 20, passive_aggressive: 25, assertive: 70 },
      },
      confidence: 65,
      emotional: 72,
      intimacy: {
        comfort: 68,
        boundaries: 75,
      },
      loveLanguages: {
        ranked: ["time", "words", "touch", "service", "gifts"],
        scores: {
          words: 70,
          time: 90,
          service: 40,
          gifts: 30,
          touch: 60,
        },
        giveReceive: {
          words: { give: 75, receive: 65 },
          time: { give: 85, receive: 95 },
          service: { give: 45, receive: 35 },
          gifts: { give: 30, receive: 30 },
          touch: { give: 55, receive: 65 },
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
    id: "fiery-pursuer",
    name: "The Fiery Pursuer",
    emoji: "🔥",
    summary: "You love deeply and chase connection fearlessly",
    image: "/images/archetypes/fiery-pursuer.png",
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
    coachingFocus: [
      "Practice self-soothing techniques",
      "Build secure attachment patterns",
      "Learn to tolerate uncertainty",
    ],
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
      scores: { secure: 30, anxious: 80, avoidant: 40, disorganized: 20 },
    },
    communication: {
      primary: "assertive" as const,
      scores: { passive: 30, aggressive: 20, passive_aggressive: 25, assertive: 70 },
    },
    confidence: 65,
    emotional: 72,
    intimacy: {
      comfort: 68,
      boundaries: 75,
    },
    loveLanguages: {
      ranked: ["time", "words", "touch", "service", "gifts"] as ("words" | "time" | "service" | "gifts" | "touch")[],
      scores: {
        words: 70,
        time: 90,
        service: 40,
        gifts: 30,
        touch: 60,
      },
      giveReceive: {
        words: { give: 75, receive: 65 },
        time: { give: 85, receive: 95 },
        service: { give: 45, receive: 35 },
        gifts: { give: 30, receive: 30 },
        touch: { give: 55, receive: 65 },
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
      scores: { secure: 30, anxious: 80, avoidant: 40, disorganized: 20 },
    },
    communication: {
      primary: "assertive" as const,
      scores: { passive: 30, aggressive: 20, passive_aggressive: 25, assertive: 70 },
    },
    confidence: 65,
    emotional: 72,
    intimacy: {
      comfort: 68,
      boundaries: 75,
    },
    loveLanguages: {
      ranked: ["time", "words", "touch", "service", "gifts"] as ("words" | "time" | "service" | "gifts" | "touch")[],
      scores: {
        words: 70,
        time: 90,
        service: 40,
        gifts: 30,
        touch: 60,
      },
      giveReceive: {
        words: { give: 75, receive: 65 },
        time: { give: 85, receive: 95 },
        service: { give: 45, receive: 35 },
        gifts: { give: 30, receive: 30 },
        touch: { give: 55, receive: 65 },
      },
    },
  };
}
