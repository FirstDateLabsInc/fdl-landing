/**
 * TDD Tests: Reply-To Header for Waitlist Emails
 *
 * Tests that all outgoing emails include a Reply-To header
 * routing replies to hello@firstdatelabs.com
 *
 * Run with: npm run test:run -- __tests__/api/waitlist/email-reply-to.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies before imports
const mockEmailsSend = vi
  .fn()
  .mockResolvedValue({ data: { id: "email-123" }, error: null });
const mockRpc = vi.fn();

vi.mock("@/lib/email/resend", () => ({
  getResend: () => ({
    emails: {
      send: mockEmailsSend,
    },
  }),
  EMAIL_FROM: "First Date Labs <hello@updates.firstdatelabs.com>",
  EMAIL_REPLY_TO: "First Date Labs <hello@firstdatelabs.com>",
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    rpc: mockRpc,
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { archetype_slug: "fiery-pursuer" },
            error: null,
          }),
        })),
      })),
    })),
  }),
}));

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstileToken: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@react-email/render", () => ({
  render: vi.fn().mockResolvedValue("<html>Email content</html>"),
}));

import { POST } from "@/app/api/waitlist/route";

describe("POST /api/waitlist - Reply-To Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful waitlist signup
    mockRpc.mockResolvedValue({
      data: {
        success: true,
        id: "waitlist-123",
        is_new: true,
        unsubscribe_token: "unsub-token-123",
      },
      error: null,
    });
  });

  function createRequest(body: Record<string, unknown>): NextRequest {
    return {
      json: vi.fn().mockResolvedValue(body),
      headers: new Headers(),
    } as unknown as NextRequest;
  }

  describe("EMAIL_REPLY_TO Constant", () => {
    it("exports EMAIL_REPLY_TO constant from resend module", async () => {
      const { EMAIL_REPLY_TO } = await import("@/lib/email/resend");
      expect(EMAIL_REPLY_TO).toBe("First Date Labs <hello@firstdatelabs.com>");
    });
  });

  describe("Email Send Parameters", () => {
    it("includes replyTo field when sending waitlist confirmation email", async () => {
      const request = createRequest({
        email: "test@example.com",
        source: "web",
      });

      await POST(request);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: "First Date Labs <hello@firstdatelabs.com>",
        })
      );
    });

    it("includes replyTo field when sending quiz results email", async () => {
      const request = createRequest({
        email: "test@example.com",
        source: "quiz",
        quizResultId: "550e8400-e29b-41d4-a716-446655440000",
      });

      await POST(request);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: "First Date Labs <hello@firstdatelabs.com>",
        })
      );
    });

    it("sends email with all required fields including replyTo", async () => {
      const request = createRequest({
        email: "user@test.com",
        source: "web",
      });

      await POST(request);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "First Date Labs <hello@updates.firstdatelabs.com>",
          to: ["user@test.com"],
          subject: expect.any(String),
          html: expect.any(String),
          replyTo: "First Date Labs <hello@firstdatelabs.com>",
        })
      );
    });
  });

  describe("Email Failure Handling", () => {
    it("still succeeds when email send fails (email is non-critical)", async () => {
      mockEmailsSend.mockRejectedValue(new Error("Email service down"));

      const request = createRequest({
        email: "test@example.com",
        source: "web",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
