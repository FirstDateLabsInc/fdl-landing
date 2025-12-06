"use client";

import Image from "next/image";
import cloudflareLoader from "@/lib/cloudflare-image-loader";

const archetypeImages = [
  { id: "chameleon", name: "The Chameleon", file: "chameleon-chameleon.png" },
  { id: "cool-mystery", name: "The Cool Mystery", file: "cool-mystery-cat.png" },
  { id: "iron-fortress", name: "The Iron Fortress", file: "iron-fortress-armadillo.png" },
  { id: "open-book", name: "The Open Book", file: "open-book-puppy.png" },
  { id: "self-aware-alchemist", name: "The Self-Aware Alchemist", file: "self-aware-alchemist-octopus.png" },
  { id: "selfless-giver", name: "The Selfless Giver", file: "selfless-giver-koala.png" },
  // Add more as they become available:
  // { id: "golden-partner", name: "The Golden Partner", file: "golden-partner-goldenRetriever.png" },
  // { id: "gentle-peacekeeper", name: "The Gentle Peacekeeper", file: "gentle-peacekeeper-dove.png" },
  // { id: "direct-director", name: "The Direct Director", file: "direct-director-gorilla.png" },
  // { id: "playful-tease", name: "The Playful Tease", file: "playful-tease-fox.png" },
  // { id: "fiery-pursuer", name: "The Fiery Pursuer", file: "fiery-pursuer-cheetah.png" },
  // { id: "mind-reader", name: "The Mind Reader", file: "mind-reader-owl.png" },
  // { id: "solo-voyager", name: "The Solo Voyager", file: "solo-voyager-eagle.png" },
  // { id: "quiet-ghost", name: "The Quiet Ghost", file: "quiet-ghost-turtle.png" },
  // { id: "wild-storm", name: "The Wild Storm", file: "wild-storm-bull.png" },
  // { id: "labyrinth", name: "The Labyrinth", file: "labyrinth-snake.png" },
];

export default function TestImagesPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Archetype Images Test Page
        </h1>
        <p className="mb-8 text-slate-600">
          Resize your browser to test responsive behavior. Images scale: 128px (mobile) → 160px (tablet) → 192px (desktop)
        </p>

        {/* Breakpoint Indicator */}
        <div className="mb-8 rounded-lg bg-white p-4 shadow">
          <p className="text-sm font-medium text-slate-700">Current Breakpoint:</p>
          <p className="text-lg font-bold">
            <span className="text-blue-600 sm:hidden">Mobile (&lt;640px) - 128px images</span>
            <span className="hidden text-green-600 sm:inline lg:hidden">Tablet (640-1024px) - 160px images</span>
            <span className="hidden text-purple-600 lg:inline">Desktop (&gt;1024px) - 192px images</span>
          </p>
        </div>

        {/* Images Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {archetypeImages.map((archetype) => (
            <div
              key={archetype.id}
              className="rounded-2xl bg-white p-5 shadow-lg"
            >
              <div className="text-center">
                {/* Responsive container matching ProfileSummary.tsx */}
                <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                  <Image
                    src={`/archetypes/${archetype.file}`}
                    alt={archetype.name}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                    className="object-contain"
                    loader={cloudflareLoader}
                    loading="eager"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                  {archetype.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{archetype.id}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Missing Images Notice */}
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">Missing Images (10 of 16):</p>
          <p className="mt-1 text-sm text-amber-700">
            golden-partner, gentle-peacekeeper, direct-director, playful-tease,
            fiery-pursuer, mind-reader, solo-voyager, quiet-ghost, wild-storm, labyrinth
          </p>
        </div>

        {/* Delete Reminder */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Remember to delete this test page before deploying: app/src/app/test-images/page.tsx
        </p>
      </div>
    </main>
  );
}
