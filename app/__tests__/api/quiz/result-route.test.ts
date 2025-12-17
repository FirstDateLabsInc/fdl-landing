/**
 * Unit Tests: GET /api/quiz/result/[id]
 *
 * Tests the quiz result fetch endpoint for preview/general report.
 *
 * Security Context:
 *   - Uses service_role client (getSupabaseServer)
 *   - Public access via UUID (no ownership check)
 *   - UUID provides 122 bits of entropy (unguessable)
 *   - Returns preview data only (archetype, scores)
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock parseDbScores before importing route
vi.mock("@/lib/quiz/utils/parse-db-scores", () => ({
  parseDbScores: vi.fn(),
}));

// Mock Supabase before importing route
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    from: mockFrom,
  }),
}));

import { GET } from "@/app/api/quiz/result/[id]/route";
import { parseDbScores } from "@/lib/quiz/utils/parse-db-scores";
import { TEST_UUIDS, createMockScores } from "../../helpers/mocks";

// Type for API response
interface ResultApiResponse {
  success?: boolean;
  error?: string;
  result?: {
    id: string;
    archetypeSlug: string;
    scores: ReturnType<typeof createMockScores>;
    createdAt: string;
  };
}

describe("GET /api/quiz/result/[id]", () => {
  const mockScores = createMockScores();
  const mockDbScores = { raw: "scores" }; // Simulated DB format
  const mockResult = {
    id: TEST_UUIDS.resultId,
    archetype_slug: "romantic-idealist",
    scores: mockDbScores,
    created_at: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up mock chain
    mockSingle.mockResolvedValue({
      data: mockResult,
      error: null,
    });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });

    // Mock parseDbScores to return valid scores
    (parseDbScores as ReturnType<typeof vi.fn>).mockReturnValue(mockScores);
  });

  // Helper to create mock request and params
  function createRequestWithParams(id: string): {
    request: NextRequest;
    params: Promise<{ id: string }>;
  } {
    return {
      request: {} as NextRequest,
      params: Promise.resolve({ id }),
    };
  }

  describe("Successful Response", () => {
    it("returns quiz result data for valid resultId", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as ResultApiResponse;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
    });

    it("includes archetype_slug in response", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as ResultApiResponse;

      expect(data.result?.archetypeSlug).toBe("romantic-idealist");
    });

    it("includes parsed scores in response", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as ResultApiResponse;

      expect(data.result?.scores).toEqual(mockScores);
      expect(parseDbScores).toHaveBeenCalledWith(mockDbScores);
    });

    it("includes id in response", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as ResultApiResponse;

      expect(data.result?.id).toBe(TEST_UUIDS.resultId);
    });

    it("includes createdAt in response", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as ResultApiResponse;

      expect(data.result?.createdAt).toBe("2024-01-01T00:00:00Z");
    });
  });

  describe("Database Query", () => {
    it("queries quiz_results table", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      await GET(request, { params });

      expect(mockFrom).toHaveBeenCalledWith("quiz_results");
    });

    it("selects only needed columns", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      await GET(request, { params });

      expect(mockSelect).toHaveBeenCalledWith("id, archetype_slug, scores, created_at");
    });

    it("filters by id", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      await GET(request, { params });

      expect(mockEq).toHaveBeenCalledWith("id", TEST_UUIDS.resultId);
    });

    it("expects single result", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      await GET(request, { params });

      expect(mockSingle).toHaveBeenCalled();
    });
  });

  describe("Not Found Handling", () => {
    it("returns 404 when result does not exist", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Result not found");
      expect(data.errorCode).toBe("NOT_FOUND");
    });

    it("returns 404 when database returns error", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Row not found" },
      });

      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.errorCode).toBe("NOT_FOUND");
    });

    it("returns 404 for non-existent UUID", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      mockSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      const { request, params } = createRequestWithParams(nonExistentId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(404);
    });
  });

  describe("Invalid Scores Handling", () => {
    it("returns 404 when scores fail to parse", async () => {
      (parseDbScores as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Result not found");
      expect(data.errorCode).toBe("NOT_FOUND");
    });

    it("returns 404 when scores are undefined", async () => {
      (parseDbScores as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });

      expect(response.status).toBe(404);
    });
  });

  describe("Error Handling", () => {
    it("returns 500 on unexpected exception", async () => {
      mockFrom.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });

    it("returns 500 when params resolution fails", async () => {
      const request = {} as NextRequest;
      const params = Promise.reject(new Error("Params error"));

      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("Response Format", () => {
    it("returns expected success response shape", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toEqual({
        success: true,
        result: {
          id: TEST_UUIDS.resultId,
          archetypeSlug: "romantic-idealist",
          scores: mockScores,
          createdAt: "2024-01-01T00:00:00Z",
        },
      });
    });

    it("returns expected error response shape", async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toEqual({
        success: false,
        error: "Result not found",
        errorCode: "NOT_FOUND",
      });
    });
  });

  describe("Public Access (No Ownership Check)", () => {
    it("does NOT check session ownership", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      await GET(request, { params });

      // Select should only include result fields, NOT anonymous_session_id for ownership
      expect(mockSelect).toHaveBeenCalledWith("id, archetype_slug, scores, created_at");
      expect(mockSelect).not.toHaveBeenCalledWith(
        expect.stringContaining("anonymous_session_id")
      );
    });

    it("allows access with only UUID (no session required)", async () => {
      // Request has no session info
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      const response = await GET(request, { params });

      expect(response.status).toBe(200);
    });
  });

  describe("Service Role Usage", () => {
    it("uses service_role client to query data", async () => {
      const { request, params } = createRequestWithParams(TEST_UUIDS.resultId);
      await GET(request, { params });

      // Verify from() was called - confirms service_role client usage
      expect(mockFrom).toHaveBeenCalledTimes(1);
    });
  });
});

/**
 * Security Notes:
 *
 * This endpoint provides PUBLIC access to quiz results via UUID.
 *
 * Security Model:
 * - UUID provides 122 bits of entropy (unguessable)
 * - No ownership check needed - if you have the UUID, you can view
 * - Returns preview/general report data only
 * - Does NOT return locked content (datingMeaning, redFlags details, etc.)
 *
 * Full report access requires:
 * 1. public_slug to exist (created by authenticated user)
 * 2. Viewing via /quiz/p/[publicSlug] route
 * 3. Uses get_quiz_by_public_slug RPC for full content
 */
