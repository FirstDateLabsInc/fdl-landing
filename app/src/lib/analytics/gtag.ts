/**
 * Core gtag wrapper with GA4 validation and limit enforcement
 *
 * GA4 Constraints:
 * - Event name: 1-40 chars, start with letter, alphanumeric + underscore only
 * - Parameter name: 1-40 chars, start with letter, alphanumeric + underscore only
 * - Parameter value: max 100 chars (custom params only)
 * - Max 25 parameters per event
 */

import { GA4_STANDARD_PARAMS, GA4_LIMITS } from "./constants"

// Validation regex: must start with letter, only alphanumeric + underscore
const VALID_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/

/**
 * Validate event/param name against GA4 rules
 * In development: throws error for immediate feedback
 * In production: logs error and returns false
 */
function validateName(name: string, type: "event" | "param"): boolean {
  if (!VALID_NAME_REGEX.test(name)) {
    const msg = `[Analytics] Invalid ${type} name: "${name}". Must start with letter, contain only alphanumeric and underscore.`
    if (process.env.NODE_ENV === "development") {
      throw new Error(msg)
    }
    console.error(msg)
    return false
  }

  const maxLength =
    type === "event"
      ? GA4_LIMITS.EVENT_NAME_MAX_LENGTH
      : GA4_LIMITS.PARAM_NAME_MAX_LENGTH

  if (name.length > maxLength) {
    const msg = `[Analytics] ${type} name too long (${name.length}/${maxLength}): "${name}"`
    if (process.env.NODE_ENV === "development") {
      throw new Error(msg)
    }
    console.error(msg)
    return false
  }

  return true
}

/**
 * Validate and clean parameters
 * - Validates param names
 * - Truncates custom param values to 100 chars (preserves GA4 standard params)
 * - Limits to 25 params max
 */
function validateAndCleanParams(
  params: Record<string, unknown>
): Record<string, unknown> {
  const entries = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .slice(0, GA4_LIMITS.PARAM_COUNT_MAX)

  return Object.fromEntries(
    entries
      .filter(([key]) => validateName(key, "param"))
      .map(([key, value]) => {
        // Only truncate custom params, not GA4 standard params
        if (
          typeof value === "string" &&
          !GA4_STANDARD_PARAMS.has(key) &&
          value.length > GA4_LIMITS.PARAM_VALUE_MAX_LENGTH
        ) {
          return [key, value.slice(0, GA4_LIMITS.PARAM_VALUE_MAX_LENGTH)]
        }
        return [key, value]
      })
  )
}

/**
 * Track a GA4 event with validation
 *
 * @param eventName - Event name (must follow GA4 naming rules)
 * @param params - Event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  // SSR guard
  if (typeof window === "undefined" || !window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] (SSR/No gtag)", eventName, params)
    }
    return
  }

  // Validate event name
  if (!validateName(eventName, "event")) {
    return
  }

  // Clean and validate params
  const cleanParams = params ? validateAndCleanParams(params) : undefined

  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", eventName, cleanParams)
  }

  // Send to GA4
  window.gtag("event", eventName, cleanParams)
}

/**
 * Update consent state (for cookie banner integration)
 *
 * @param consentState - Consent state to update
 */
export function updateConsent(consentState: {
  analytics_storage?: "granted" | "denied"
  ad_storage?: "granted" | "denied"
}): void {
  if (typeof window === "undefined" || !window.gtag) {
    return
  }

  window.gtag("consent", "update", consentState)

  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics] Consent updated:", consentState)
  }
}

/**
 * Set user properties
 *
 * @param properties - User properties to set
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.gtag) {
    return
  }

  window.gtag("set", "user_properties", properties)
}
