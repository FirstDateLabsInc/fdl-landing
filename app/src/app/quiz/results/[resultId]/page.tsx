import { notFound } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Sparkles } from "lucide-react";

import { ResultsContainer } from "@/components/quiz/results";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getArchetypeById } from "@/lib/quiz/archetypes";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("quiz_results")
    .select("archetype_slug")
    .eq("id", resultId)
    .single();

  if (!data) {
    return { title: "Result Not Found | Juliet" };
  }

  const archetype = getArchetypeById(data.archetype_slug);
  if (!archetype) {
    return { title: "Result Not Found | Juliet" };
  }

  return {
    title: `${archetype.name} | Dating Personality Quiz | Juliet`,
    description: archetype.summary,
    openGraph: {
      title: `I'm ${archetype.name} ${archetype.emoji}`,
      description: archetype.summary,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm ${archetype.name} ${archetype.emoji}`,
      description: archetype.summary,
    },
  };
}

export default async function SavedResultPage({ params }: Props) {
  const { resultId } = await params;

  // Validate UUID format to prevent unnecessary DB queries
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(resultId)) {
    notFound();
  }

  // Fetch result from database
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("quiz_results")
    .select("id, archetype_slug, scores, created_at")
    .eq("id", resultId)
    .single();

  if (error || !data) {
    notFound();
  }

  // Look up archetype from definitions
  const archetype = getArchetypeById(data.archetype_slug);
  if (!archetype) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ResultsContainer
        results={data.scores}
        archetype={archetype}
        quizResultId={resultId}
      />

      {/* Footer CTAs */}
      <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-center">
        <Button variant="secondary" asChild className="gap-2">
          <Link href="/quiz/questions">
            <RotateCcw className="h-4 w-4" />
            Take the Quiz
          </Link>
        </Button>

        <Button
          asChild
          className="gap-2 bg-[#f9d544] text-slate-900 hover:bg-[#ffe362]"
        >
          <Link href="/#waitlist">
            <Sparkles className="h-4 w-4" />
            Start with Juliet
          </Link>
        </Button>
      </div>

      {/* Info footer */}
      <p className="mt-8 text-center text-sm text-slate-500">
        This is a saved quiz result.
        <br className="hidden sm:block" />
        Want your own personalized results?{" "}
        <Link href="/quiz" className="text-[#f9d544] underline hover:no-underline">
          Take the quiz
        </Link>
      </p>
    </main>
  );
}
