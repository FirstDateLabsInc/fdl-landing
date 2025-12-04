import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dating Personality Quiz | Juliet by First Date Labs",
  description:
    "Discover your dating personality type with our science-backed quiz. Understand your attachment style, communication patterns, and love languages in just 8 minutes.",
  openGraph: {
    title: "Dating Personality Quiz | Juliet",
    description:
      "Discover your dating personality type with our science-backed quiz.",
    type: "website",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fffdf6]">
      {children}
    </div>
  );
}
