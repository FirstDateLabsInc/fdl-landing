import { Resend } from "resend";

// Singleton pattern matching Supabase client
let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Use subdomain for email sending per Resend best practices
export const EMAIL_FROM = "First Date Labs <hello@updates.firstdatelabs.com>";

// Reply-To routes user replies to monitored inbox
export const EMAIL_REPLY_TO = "First Date Labs <hello@firstdatelabs.com>";
