/**
 * UTM Parameter Tracking
 * Captures and stores UTM parameters for marketing attribution
 */

const UTM_STORAGE_KEY = "juliet-utm-params"

export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

/**
 * Capture UTM params from URL and store in sessionStorage.
 * Only captures on first page load to preserve original attribution.
 * Falls back to referrer for organic traffic.
 */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return

  // Only capture on first page load (don't overwrite existing attribution)
  if (sessionStorage.getItem(UTM_STORAGE_KEY)) return

  const params = new URLSearchParams(window.location.search)
  const utm: UtmParams = {}

  const source = params.get("utm_source")
  const medium = params.get("utm_medium")
  const campaign = params.get("utm_campaign")
  const content = params.get("utm_content")
  const term = params.get("utm_term")

  if (source) utm.utm_source = source
  if (medium) utm.utm_medium = medium
  if (campaign) utm.utm_campaign = campaign
  if (content) utm.utm_content = content
  if (term) utm.utm_term = term

  // Fallback: capture referrer for organic/referral traffic
  if (!source && document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer)
      const referrerHost = referrerUrl.hostname

      // Only capture if referrer is from different domain
      if (referrerHost !== window.location.hostname) {
        utm.utm_source = referrerHost
        utm.utm_medium = "referral"
      }
    } catch {
      // Invalid referrer URL, ignore
    }
  }

  // Only store if we have any attribution data
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm))
  }
}

/**
 * Get stored UTM params for inclusion in GA4 events.
 * Returns empty object if no UTM params captured.
 */
export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {}

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Clear stored UTM params (useful for testing)
 */
export function clearUtmParams(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(UTM_STORAGE_KEY)
}
