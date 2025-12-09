/**
 * Generate a SHA-256 hash of browser characteristics for session binding.
 * This creates a semi-stable fingerprint that helps detect session hijacking
 * while being privacy-conscious (no tracking across sites).
 */
export async function generateFingerprintHash(): Promise<string> {
  // Collect browser characteristics
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join("|");

  try {
    // Hash using Web Crypto API (available in all modern browsers)
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(data)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert to hex string
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback for Safari Private Mode or environments without crypto.subtle
    // Use a simple hash function as fallback
    console.warn("crypto.subtle unavailable, using fallback fingerprint");
    return generateFallbackHash(data);
  }
}

/**
 * Simple djb2-based hash for fallback when crypto.subtle is unavailable.
 * Produces a 64-character hex string to match SHA-256 output length.
 */
function generateFallbackHash(str: string): string {
  let hash1 = 5381;
  let hash2 = 52711;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }

  // Combine hashes and pad to 64 chars (matching SHA-256 hex length)
  const combined =
    Math.abs(hash1).toString(16).padStart(8, "0") +
    Math.abs(hash2).toString(16).padStart(8, "0") +
    Date.now().toString(16).padStart(12, "0");

  // Pad remaining chars to reach 64
  return combined.padEnd(64, "0");
}
