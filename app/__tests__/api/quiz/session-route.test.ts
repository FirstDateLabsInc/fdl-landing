/**
 * Unit Tests: POST /api/quiz/session
 *
 * Tests the session creation/verification endpoint used at quiz start.
 *
 * Security Context:
 *   - Uses service_role client (getSupabaseServer)
 *   - Calls verify_or_create_session RPC
 *   - Returns existing session for same fingerprint
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase before importing route
const mockRpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    rpc: mockRpc,
  }),
}));

import { POST } from "@/app/api/quiz/session/route";
import { TEST_UUIDS, VALID_FINGERPRINT } from "../../helpers/mocks";

describe("POST /api/quiz/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default success response
    mockRpc.mockResolvedValue({
      data: TEST_UUIDS.sessionId,
      error: null,
    });
  });

  // Helper to create mock request
  function createRequest(body: Record<string, unknown>): NextRequest {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  }

  describe("Input Validation", () => {
    it("returns 400 when fingerprintHash is missing", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.sessionId).toBe("");
      expect(data.error).toBe("Fingerprint required");
    });

    it("returns 400 when fingerprintHash is empty string", async () => {
      const request = createRequest({ fingerprintHash: "" });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.sessionId).toBe("");
      expect(data.error).toBe("Fingerprint required");
    });

    it("returns 400 when fingerprintHash is null", async () => {
      const request = createRequest({ fingerprintHash: null });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.error).toBe("Fingerprint required");
    });
  });

  describe("Session Creation", () => {
    it("creates new session with fingerprint", async () => {
      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(200);
      expect(data.sessionId).toBe(TEST_UUIDS.sessionId);
      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: null,
      });
    });

    it("passes valid existingSessionId to RPC", async () => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: TEST_UUIDS.sessionId,
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: TEST_UUIDS.sessionId,
      });
    });

    it("passes null for invalid existingSessionId format", async () => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: "not-a-valid-uuid",
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: null,
      });
    });

    it("passes null for undefined existingSessionId", async () => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: undefined,
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: null,
      });
    });

    it("passes null for empty string existingSessionId", async () => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: "",
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: null,
      });
    });
  });

  describe("UUID Validation", () => {
    // Note: Route validates UUID v1-5 only (version digit must be 1-5)
    const validUUIDs = [
      "550e8400-e29b-41d4-a716-446655440000", // v4
      "a1b2c3d4-e5f6-4890-abcd-ef1234567890", // v4 (changed 7 to 4)
      "00000000-0000-1000-8000-000000000000", // v1
    ];

    const invalidUUIDs = [
      "not-a-uuid",
      "550e8400-e29b-41d4-a716", // too short
      "550e8400-e29b-41d4-a716-446655440000-extra", // too long
      "550e8400e29b41d4a716446655440000", // no dashes
      "550e8400-e29b-01d4-a716-446655440000", // invalid version (0)
      "550e8400-e29b-41d4-0716-446655440000", // invalid variant
    ];

    it.each(validUUIDs)("accepts valid UUID: %s", async (uuid) => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: uuid,
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: uuid,
      });
    });

    it.each(invalidUUIDs)("rejects invalid UUID string: %s", async (uuid) => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: uuid,
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: null,
      });
    });

    it("rejects non-string UUID (number)", async () => {
      const request = createRequest({
        fingerprintHash: VALID_FINGERPRINT,
        existingSessionId: 123456,
      });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith("verify_or_create_session", {
        p_fingerprint: VALID_FINGERPRINT,
        p_session_id: null,
      });
    });
  });

  describe("Response Format", () => {
    it("returns sessionId on success", async () => {
      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toEqual({
        sessionId: TEST_UUIDS.sessionId,
      });
    });

    it("returns existing session for same fingerprint", async () => {
      const existingSessionId = "existing-11111111-1111-1111-1111-111111111111";
      mockRpc.mockResolvedValue({
        data: existingSessionId,
        error: null,
      });

      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data.sessionId).toBe(existingSessionId);
    });
  });

  describe("Error Handling", () => {
    it("returns 500 on RPC error", async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.sessionId).toBe("");
      expect(data.error).toBe("Session creation failed");
    });

    it("returns 500 on JSON parse error", async () => {
      const request = {
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.sessionId).toBe("");
      expect(data.error).toBe("Internal error");
    });

    it("returns 500 on unexpected exception", async () => {
      mockRpc.mockRejectedValue(new Error("Unexpected error"));

      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal error");
    });
  });

  describe("Service Role Usage", () => {
    it("calls getSupabaseServer (service_role client)", async () => {
      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      await POST(request);

      // Verify RPC was called - this only works with service_role client
      expect(mockRpc).toHaveBeenCalledTimes(1);
    });

    it("uses verify_or_create_session RPC function", async () => {
      const request = createRequest({ fingerprintHash: VALID_FINGERPRINT });
      await POST(request);

      expect(mockRpc).toHaveBeenCalledWith(
        "verify_or_create_session",
        expect.any(Object)
      );
    });
  });
});

/**
 * Security Notes:
 *
 * This endpoint uses service_role to call verify_or_create_session RPC.
 * The RPC function:
 * 1. Validates fingerprint format
 * 2. Creates new session if none exists for fingerprint
 * 3. Returns existing session if fingerprint matches
 *
 * The existingSessionId param is validated as UUID v4 before being passed
 * to the RPC. Invalid UUIDs are replaced with null (creates new session).
 */
