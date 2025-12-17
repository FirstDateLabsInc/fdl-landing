const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  success: boolean;
  error?: string;
}

/**
 * Verify a Turnstile token server-side.
 * Per Cloudflare docs: Tokens are valid for 300 seconds (5 min) and single-use.
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not configured");
    // Fail open in development, fail closed in production
    return process.env.NODE_ENV === "development"
      ? { success: true }
      : { success: false, error: "Turnstile not configured" };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      const errorCodes = data["error-codes"] || [];
      console.error("Turnstile verification failed:", errorCodes);
      return {
        success: false,
        error: errorCodes.includes("timeout-or-duplicate")
          ? "Verification expired. Please try again."
          : "Verification failed. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Turnstile API error:", error);
    return { success: false, error: "Verification service unavailable" };
  }
}
