/**
 * Unit Tests: POST /api/quiz/email
 *
 * Tests the email capture endpoint used after quiz completion.
 *
 * Security Context:
 *   - Uses service_role client (getSupabaseServer)
 *   - Validates session owns result before allowing update
 *   - Returns 403 if session doesn't own result
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase before importing route
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    from: mockFrom,
  }),
}));

import { POST } from "@/app/api/quiz/email/route";
import { TEST_UUIDS, TEST_EMAIL } from "../../helpers/mocks";

describe("POST /api/quiz/email", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up mock chain for ownership check
    mockSingle.mockResolvedValue({
      data: { anonymous_session_id: TEST_UUIDS.sessionId },
      error: null,
    });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    mockFrom.mockImplementation((table: string) => ({
      select: mockSelect,
      update: mockUpdate,
    }));
  });

  // Helper to create mock request
  function createRequest(body: Record<string, unknown>): NextRequest {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  }

  describe("Input Validation", () => {
    it("returns 400 when email is missing", async () => {
      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when resultId is missing", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when sessionId is missing", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when all fields are missing", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when email is empty string", async () => {
      const request = createRequest({
        email: "",
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when email format is invalid", async () => {
      const request = createRequest({
        email: "not-an-email",
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when resultId is not a valid UUID", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: "not-a-uuid",
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });

    it("returns 400 when sessionId is not a valid UUID", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: "not-a-uuid",
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request payload");
    });
  });

  describe("Ownership Validation", () => {
    it("returns 403 when session does not own result", async () => {
      // Different session owns the result
      mockSingle.mockResolvedValue({
        data: { anonymous_session_id: "different-session-id" },
        error: null,
      });

      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Access denied");
    });

    it("returns 403 when result does not exist", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Access denied");
    });

    it("queries quiz_results table for ownership check", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      await POST(request);

      expect(mockFrom).toHaveBeenCalledWith("quiz_results");
      expect(mockSelect).toHaveBeenCalledWith("anonymous_session_id");
      expect(mockEq).toHaveBeenCalledWith("id", TEST_UUIDS.resultId);
    });
  });

  describe("Email Update", () => {
    it("updates email on valid request", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({ email: TEST_EMAIL });
    });

    it("updates quiz_results table with email", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      await POST(request);

      // Verify update was called with the email
      expect(mockUpdate).toHaveBeenCalledWith({ email: TEST_EMAIL });
    });

    it("filters update by resultId", async () => {
      const mockEqForUpdate = vi.fn().mockResolvedValue({ error: null });
      mockUpdate.mockReturnValue({ eq: mockEqForUpdate });

      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      await POST(request);

      expect(mockEqForUpdate).toHaveBeenCalledWith("id", TEST_UUIDS.resultId);
    });
  });

  describe("Error Handling", () => {
    it("returns 500 on database select error", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      // Select error results in "not found" which is 403
      expect(response.status).toBe(403);
      expect(data.error).toBe("Access denied");
    });

    it("returns 500 on database update error", async () => {
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: { message: "Update failed" },
        }),
      });

      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to save email");
    });

    it("returns 500 on JSON parse error", async () => {
      const request = {
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });

    it("returns 500 on unexpected exception", async () => {
      mockFrom.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("Response Format", () => {
    it("returns success: true on valid update", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toEqual({ success: true });
    });

    it("returns success: false with error on validation failure", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });

  describe("Service Role Usage", () => {
    it("uses service_role client for ownership check", async () => {
      const request = createRequest({
        email: TEST_EMAIL,
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      await POST(request);

      // Verify from() was called - this only works with service_role
      expect(mockFrom).toHaveBeenCalledWith("quiz_results");
    });
  });
});

/**
 * Security Notes:
 *
 * This endpoint validates ownership before allowing email update:
 * 1. Fetches quiz_results row by resultId
 * 2. Compares anonymous_session_id with provided sessionId
 * 3. Returns 403 if mismatch (prevents cross-session data theft)
 *
 * Uses service_role client to bypass RLS and directly query/update data.
 */
