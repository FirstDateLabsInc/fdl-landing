/**
 * Unit Tests: POST /api/quiz/share
 *
 * CRITICAL: Validates the security change where share endpoint
 * returns preview URL only (no public_slug minting).
 *
 * Security Context:
 *   - Web users can only share preview URLs (/quiz/results/{id})
 *   - Full report sharing requires authenticated + claimed quiz via mobile app
 *   - This prevents direct API calls from minting public_slug
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { POST } from "@/app/api/quiz/share/route";
import { TEST_UUIDS, INVALID_UUIDS } from "../../helpers/mocks";

describe("POST /api/quiz/share", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Set default env
    process.env.NEXT_PUBLIC_SITE_URL = "https://firstdatelabs.com";
  });

  // Helper to create mock request
  function createRequest(body: Record<string, unknown>): NextRequest {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  }

  describe("Input Validation", () => {
    it("returns 400 when resultId is missing", async () => {
      const request = createRequest({ sessionId: TEST_UUIDS.sessionId });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Missing required fields");
    });

    it("returns 400 when sessionId is missing", async () => {
      const request = createRequest({ resultId: TEST_UUIDS.resultId });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Missing required fields");
    });

    it("returns 400 when both fields are missing", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Missing required fields");
    });

    // Invalid UUIDs that are non-empty (empty strings trigger "Missing required fields" first)
    const invalidUuidFormats = [
      "not-a-uuid",
      "550e8400-e29b-41d4-a716", // too short
      "550e8400-e29b-41d4-a716-446655440000-extra", // too long
      "550e8400_e29b_41d4_a716_446655440000", // wrong separators
    ];

    it.each(invalidUuidFormats)(
      "returns 400 when resultId has invalid format: %s",
      async (invalidUuid) => {
        const request = createRequest({
          resultId: invalidUuid,
          sessionId: TEST_UUIDS.sessionId,
        });
        const response = await POST(request);
        const data = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe("Invalid ID format");
      }
    );

    it.each(invalidUuidFormats)(
      "returns 400 when sessionId has invalid format: %s",
      async (invalidUuid) => {
        const request = createRequest({
          resultId: TEST_UUIDS.resultId,
          sessionId: invalidUuid,
        });
        const response = await POST(request);
        const data = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe("Invalid ID format");
      }
    );
  });

  describe("Security: Preview URL Only (No Slug Minting)", () => {
    it("returns preview URL format /quiz/results/{resultId}", async () => {
      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.publicUrl).toBe(
        `https://firstdatelabs.com/quiz/results/${TEST_UUIDS.resultId}`
      );
    });

    it("returns created: false (no slug minted)", async () => {
      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(200);
      expect(data.created).toBe(false);
    });

    it("does NOT return /quiz/p/ format (full report URL)", async () => {
      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data.publicUrl).not.toContain("/quiz/p/");
      expect(data.publicUrl).toContain("/quiz/results/");
    });

    it("does NOT include public_slug in response", async () => {
      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).not.toHaveProperty("public_slug");
    });
  });

  describe("URL Construction", () => {
    it("uses NEXT_PUBLIC_SITE_URL for base URL", async () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://custom-domain.com";

      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data.publicUrl).toBe(
        `https://custom-domain.com/quiz/results/${TEST_UUIDS.resultId}`
      );
    });

    it("falls back to firstdatelabs.com when env not set", async () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;

      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data.publicUrl).toBe(
        `https://firstdatelabs.com/quiz/results/${TEST_UUIDS.resultId}`
      );
    });

    it("constructs valid URL with resultId preserved exactly", async () => {
      const specificResultId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
      const request = createRequest({
        resultId: specificResultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data.publicUrl).toContain(specificResultId);
    });
  });

  describe("Error Handling", () => {
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
  });

  describe("Response Structure", () => {
    it("returns expected response shape on success", async () => {
      const request = createRequest({
        resultId: TEST_UUIDS.resultId,
        sessionId: TEST_UUIDS.sessionId,
      });
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toEqual({
        success: true,
        publicUrl: expect.stringContaining("/quiz/results/"),
        created: false,
      });
    });

    it("returns expected response shape on validation error", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toEqual({
        success: false,
        error: expect.any(String),
      });
    });
  });
});

/**
 * Security Notes:
 *
 * This test validates that the share endpoint has been updated to:
 * 1. Return preview URL only (/quiz/results/{id}) - NOT full report URL (/quiz/p/{slug})
 * 2. NOT call create_or_get_share_slug RPC (no slug minting)
 * 3. NOT require Supabase client (pure URL construction)
 *
 * Full report sharing now requires:
 * 1. Authenticated user (mobile app login)
 * 2. Quiz result claimed (claim_quizzes_by_email called)
 * 3. Call to create_or_get_full_report_slug RPC from mobile app
 */
