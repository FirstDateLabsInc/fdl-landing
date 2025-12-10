"use client";

import { useState, useCallback } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactCategory = "media" | "investor" | "collaboration";
type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
}

const CATEGORY_OPTIONS: { value: ContactCategory; label: string }[] = [
  { value: "media", label: "Media & Press" },
  { value: "investor", label: "Investor Relations" },
  { value: "collaboration", label: "Collaboration & Partnerships" },
];

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    category: "media",
    message: "",
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setErrorMessage("");

      // Client-side validation
      if (formData.name.length < 2) {
        setStatus("error");
        setErrorMessage("Name must be at least 2 characters");
        return;
      }
      if (formData.message.length < 10) {
        setStatus("error");
        setErrorMessage("Message must be at least 10 characters");
        return;
      }

      try {
        const categoryLabel =
          CATEGORY_OPTIONS.find((c) => c.value === formData.category)?.label ||
          formData.category;

        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
            subject: `[${categoryLabel}] Contact from ${formData.name}`,
            from_name: formData.name,
            email: formData.email,
            category: categoryLabel,
            message: formData.message,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus("success");
          setFormData({ name: "", email: "", category: "media", message: "" });
        } else {
          setStatus("error");
          setErrorMessage(result.message || "Failed to send message");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    },
    [formData]
  );

  // Success state
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-green-50 px-6 py-12 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          Message Sent!
        </h3>
        <p className="mb-6 text-slate-600">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <Button
          variant="secondary"
          onClick={() => setStatus("idle")}
          className="gap-2"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={status === "loading"}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status === "loading"}
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Inquiry Type
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={status === "loading"}
          className={cn(
            "h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your inquiry..."
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          disabled={status === "loading"}
        />
      </div>

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-accent"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
