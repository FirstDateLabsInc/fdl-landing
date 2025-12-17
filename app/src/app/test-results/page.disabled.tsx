// Disabled for production safety: rename back to `page.tsx` to re-enable locally.
"use client";

import { useCallback, useState } from "react";
import { getAllArchetypes, type ArchetypePublic, type ArchetypeFull } from "@/lib/quiz/archetypes";
import { ResultsContainer } from "@/components/quiz/results";
import { ArrowLeft } from "lucide-react";
import type { QuizResults } from "@/lib/quiz/types";

// Mock quiz results for testing - complete with all required fields
function createMockResults(
  attachment: "secure" | "anxious" | "avoidant" | "disorganized",
  communication: "assertive" | "passive" | "aggressive" | "passive_aggressive"
): QuizResults {
  return {
    attachment: {
      primary: attachment,
      scores: {
        secure: attachment === "secure" ? 80 : 20,
        anxious: attachment === "anxious" ? 80 : 20,
        avoidant: attachment === "avoidant" ? 80 : 20,
        disorganized: attachment === "disorganized" ? 80 : 20,
      },
    },
    communication: {
      primary: communication,
      scores: {
        assertive: communication === "assertive" ? 80 : 20,
        passive: communication === "passive" ? 80 : 20,
        aggressive: communication === "aggressive" ? 80 : 20,
        passive_aggressive: communication === "passive_aggressive" ? 80 : 20,
      },
    },
    confidence: 72,
    emotional: 68,
    intimacy: {
      comfort: 65,
      boundaries: 70,
    },
    loveLanguages: {
      ranked: ["time", "touch", "words", "service", "gifts"],
      scores: {
        words: 60,
        time: 85,
        service: 45,
        gifts: 30,
        touch: 75,
      },
      giveReceive: {
        words: { give: 55, receive: 65 },
        time: { give: 80, receive: 90 },
        service: { give: 50, receive: 40 },
        gifts: { give: 25, receive: 35 },
        touch: { give: 70, receive: 80 },
      },
    },
  };
}

// 4x4 Matrix mapping
const ARCHETYPE_MATRIX: {
  attachment: "secure" | "anxious" | "avoidant" | "disorganized";
  communication: "assertive" | "passive" | "aggressive" | "passive_aggressive";
  id: string;
}[][] = [
  // Secure row
  [
    { attachment: "secure", communication: "assertive", id: "golden-partner" },
    { attachment: "secure", communication: "passive", id: "gentle-peacekeeper" },
    { attachment: "secure", communication: "aggressive", id: "direct-director" },
    { attachment: "secure", communication: "passive_aggressive", id: "playful-tease" },
  ],
  // Anxious row
  [
    { attachment: "anxious", communication: "assertive", id: "open-book" },
    { attachment: "anxious", communication: "passive", id: "selfless-giver" },
    { attachment: "anxious", communication: "aggressive", id: "fiery-pursuer" },
    { attachment: "anxious", communication: "passive_aggressive", id: "mind-reader" },
  ],
  // Avoidant row
  [
    { attachment: "avoidant", communication: "assertive", id: "solo-voyager" },
    { attachment: "avoidant", communication: "passive", id: "quiet-ghost" },
    { attachment: "avoidant", communication: "aggressive", id: "iron-fortress" },
    { attachment: "avoidant", communication: "passive_aggressive", id: "cool-mystery" },
  ],
  // Disorganized row
  [
    { attachment: "disorganized", communication: "assertive", id: "self-aware-alchemist" },
    { attachment: "disorganized", communication: "passive", id: "chameleon" },
    { attachment: "disorganized", communication: "aggressive", id: "wild-storm" },
    { attachment: "disorganized", communication: "passive_aggressive", id: "labyrinth" },
  ],
];

const ATTACHMENT_LABELS = ["Secure", "Anxious", "Avoidant", "Disorganized"];
const COMMUNICATION_LABELS = ["Assertive", "Passive", "Aggressive", "Passive-Aggressive"];

export default function TestResultsPage() {
  const allArchetypes = getAllArchetypes();

  // Inline preview state
  // TODO(Phase 4): Change to ArchetypePublic when ResultsContainer supports gating
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypePublic | null>(null);
  const [mockResults, setMockResults] = useState<QuizResults | null>(null);

  const handlePreview = useCallback(
    (
      attachment: "secure" | "anxious" | "avoidant" | "disorganized",
      communication: "assertive" | "passive" | "aggressive" | "passive_aggressive",
      archetypeId: string
    ) => {
      const archetype = allArchetypes.find((a) => a.id === archetypeId);
      if (!archetype) return;

      // Set state for inline preview (no navigation needed)
      setSelectedArchetype(archetype);
      setMockResults(createMockResults(attachment, communication));
    },
    [allArchetypes]
  );

  const handleBack = useCallback(() => {
    setSelectedArchetype(null);
    setMockResults(null);
  }, []);

  // Inline preview mode: render ResultsContainer directly
  if (selectedArchetype && mockResults) {
    return (
      <main className="min-h-screen bg-background">
        {/* Floating Back Button */}
        <button
          onClick={handleBack}
          className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md transition-all hover:shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Matrix
        </button>

        {/* Archetype Badge */}
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md">
          <span className="text-xl">{selectedArchetype.emoji}</span>
          <span className="text-sm font-semibold text-slate-900">{selectedArchetype.name}</span>
        </div>

        {/* Actual Results Page */}
        {/* TODO(Phase 4): Remove cast when ResultsContainer supports ArchetypePublic + gating */}
        <ResultsContainer results={mockResults} archetype={selectedArchetype as ArchetypeFull} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Results Page Preview (Test Only)
        </h1>
        <p className="mb-6 text-slate-600">
          Click any archetype to preview the full results page with that archetype.
        </p>

        {/* 4x4 Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-sm font-medium text-slate-500"></th>
                {COMMUNICATION_LABELS.map((label) => (
                  <th
                    key={label}
                    className="p-2 text-center text-xs font-medium text-slate-500 sm:text-sm"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ARCHETYPE_MATRIX.map((row, rowIndex) => (
                <tr key={ATTACHMENT_LABELS[rowIndex]}>
                  <td className="p-2 text-xs font-medium text-slate-500 sm:text-sm">
                    {ATTACHMENT_LABELS[rowIndex]}
                  </td>
                  {row.map((cell) => {
                    const archetype = allArchetypes.find((a) => a.id === cell.id);
                    return (
                      <td key={cell.id} className="p-1 sm:p-2">
                        <button
                          onClick={() =>
                            handlePreview(cell.attachment, cell.communication, cell.id)
                          }
                          className="w-full rounded-lg bg-white p-2 text-left shadow transition-all hover:shadow-md hover:ring-2 hover:ring-[#f9d544] sm:p-3"
                        >
                          <div className="text-lg sm:text-xl">{archetype?.emoji}</div>
                          <div className="mt-1 text-xs font-semibold text-slate-900 sm:text-sm">
                            {archetype?.name}
                          </div>
                          <div className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                            {cell.id}
                          </div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Reminder */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Remember to delete this test page before deploying: app/src/app/test-results/page.tsx
        </p>
      </div>
    </main>
  );
}
