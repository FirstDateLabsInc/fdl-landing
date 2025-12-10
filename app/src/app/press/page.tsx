import { Newspaper, TrendingUp, Handshake } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

const CONTACT_CATEGORIES = [
  {
    icon: Newspaper,
    title: "Media & Press",
    description: "Interview requests, press inquiries, and media coverage",
  },
  {
    icon: TrendingUp,
    title: "Investor Relations",
    description: "Investment opportunities and partnership discussions",
  },
  {
    icon: Handshake,
    title: "Collaborations",
    description: "Business development and strategic partnerships",
  },
];

export default function PressPage() {
  return (
    <div className="bg-[#fffdf6]">
      <section className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            Press
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Have a media inquiry, investment question, or partnership proposal?
            We&apos;d love to hear from you.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Category cards */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">
              How can we help?
            </h2>
            <div className="space-y-4">
              {CONTACT_CATEGORIES.map((category) => (
                <div
                  key={category.title}
                  className="flex gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct email fallback */}
            <p className="pt-4 text-sm text-slate-500">
              Prefer email? Reach us directly at{" "}
              <a
                href="mailto:hello@firstdatelabs.com"
                className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                hello@firstdatelabs.com
              </a>
            </p>
          </div>

          {/* Right: Contact form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-lg font-medium text-slate-900">
              Send us a message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
