import { notFound } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Sparkles } from "lucide-react";

import { ResultsContainer } from "@/components/quiz/results";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getPublicArchetypeById } from "@/lib/quiz/archetypes";
import { getFullArchetypeById } from "@/lib/quiz/data/archetypes/selectors.server";
import { parseDbScores } from "@/lib/quiz/utils/parse-db-scores";
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
    return { title: "Result Not Found | First Date Labs" };
  }

  const archetype = getPublicArchetypeById(data.archetype_slug);
  if (!archetype) {
    return { title: "Result Not Found | First Date Labs" };
  }

  return {
    title: `${archetype.name} | Dating Personality Quiz | First Date Labs`,
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

  const scores = parseDbScores(data.scores);
  if (!scores) {
    notFound();
  }

  // Look up full archetype (server-only) for rendering
  const archetype = getFullArchetypeById(data.archetype_slug);
  if (!archetype) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)]">
      <ResultsContainer
        results={scores}
        archetype={archetype}
        quizResultId={resultId}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        {/* Footer CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-center">
          <Button variant="secondary" asChild className="gap-2">
            <Link href="/quiz/questions">
              <RotateCcw className="h-4 w-4" />
              Take the Quiz
            </Link>
          </Button>

          <Button asChild variant="primary" className="gap-2">
            <Link href="/#waitlist">
              <Sparkles className="h-4 w-4" />
              Start with First Date Labs
            </Link>
          </Button>
        </div>

        {/* Info footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          This is a saved quiz result.
          <br className="hidden sm:block" />
          Want your own personalized results?{" "}
          <Link href="/quiz" className="text-primary underline hover:no-underline">
            Take the quiz
          </Link>
        </p>
      </div>
    </main>
  );
}
