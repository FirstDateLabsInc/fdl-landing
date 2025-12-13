"use client";

import { useState, useCallback } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ContactCategory = "media" | "investor" | "collaboration";
type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
  honeypot: string;
}

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

const CATEGORY_OPTIONS: { value: ContactCategory; label: string }[] = [
  { value: "media", label: "Press" },
  { value: "investor", label: "Investors" },
  { value: "collaboration", label: "Partnerships" },
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
    honeypot: "",
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

      // Honeypot spam check - bots fill this hidden field
      if (formData.honeypot) {
        setStatus("success"); // Fake success to not alert the bot
        return;
      }

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
            subject: `Your ${categoryLabel} inquiry - First Date Labs`,
            from_name: "Yiyao from First Date Labs",
            replyto: formData.email,
            // Form fields (displayed in email body)
            From: formData.name,
            Email: formData.email,
            "Inquiry Type": categoryLabel,
            Message: formData.message,
          }),
        });

        const result = (await response.json()) as Web3FormsResponse;

        if (result.success) {
          setStatus("success");
          setFormData({ name: "", email: "", category: "media", message: "", honeypot: "" });
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
      {/* Honeypot field - hidden from humans, bots will fill it */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

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
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              category: value as ContactCategory,
            }))
          }
          disabled={status === "loading"}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        className="bg-primary text-primary-foreground hover:bg-accent w-full gap-2"
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
