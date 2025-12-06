import { archetypes } from "@/lib/quiz/archetypes";
import { ArchetypesGrid } from "@/components/archetypes/ArchetypesGrid";

export const metadata = {
  title: "All Personality Archetypes | Juliet",
  description: "Explore the 16 dating archetypes and understand your relationship patterns.",
};

export default function AllArchetypesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Hero - Full Width */}
      <div className="bg-slate-900 py-32 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Meet the Archetypes
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-300 md:text-2xl">
            Juliet identifies 16 distinct dating patterns based on attachment theory. 
            Which one resonates with you?
          </p>
        </div>
      </div>

      {/* Grid Content - Full Width Sections */}
      <ArchetypesGrid archetypes={archetypes} />
      
      {/* Bottom CTA - Full Width */}
      <div className="bg-slate-50 py-32 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl">
            Don't know your archetype?
          </h2>
          <p className="mb-10 text-xl text-slate-600">
            Take the free 3-minute quiz to discover your pattern and get your personalized roadmap.
          </p>
          <a
            href="/"
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-lg font-bold text-slate-900 shadow-xl transition-transform hover:scale-105 hover:brightness-105"
          >
            Take the Quiz
          </a>
        </div>
      </div>
    </main>
  );
}
