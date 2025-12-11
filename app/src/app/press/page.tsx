import { Newspaper, TrendingUp, Handshake } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

const CONTACT_CATEGORIES = [
  {
    icon: Newspaper,
    title: "Press",
  },
  {
    icon: TrendingUp,
    title: "Investors",
  },
  {
    icon: Handshake,
    title: "Partnerships",
  },
];

export default function PressPage() {
  return (
    <div className="bg-[#fffdf6]">
      <section className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-3xl px-4 pt-10 pb-14 sm:px-6 md:pt-12 md:pb-16 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Press
          </h1>
        </header>

        {/* Category pills - horizontal */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {CONTACT_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2"
            >
              <category.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-slate-700">
                {category.title}
              </span>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
