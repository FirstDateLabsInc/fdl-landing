import { ArchetypeDefinition } from "@/lib/quiz/archetypes";
import { ArchetypeCard } from "./ArchetypeCard";

interface ArchetypesGridProps {
  archetypes: ArchetypeDefinition[];
}

const GROUPS = [
  {
    id: "secure",
    title: "The Secure Connectors",
    description: "Anchored in trust, these archetypes build stable, lasting bonds naturally.",
    color: "bg-emerald-50/80",
    watermark: "Secure",
    ids: ["golden-partner", "gentle-peacekeeper", "direct-director", "playful-tease"],
    variant: "secure" as const,
  },
  {
    id: "anxious",
    title: "The Anxious Lovers",
    description: "Driven by a need for closeness, they love deeply but fear disconnection.",
    color: "bg-amber-50/80",
    watermark: "Anxious",
    ids: ["open-book", "selfless-giver", "fiery-pursuer", "mind-reader"],
    variant: "anxious" as const,
  },
  {
    id: "avoidant",
    title: "The Independent Spirits",
    description: "Valuing autonomy above all, they protect their freedom from perceived threats.",
    color: "bg-sky-50/80",
    watermark: "Avoidant",
    ids: ["solo-voyager", "quiet-ghost", "iron-fortress", "cool-mystery"],
    variant: "avoidant" as const,
  },
  {
    id: "disorganized",
    title: "The Complex Navigateurs",
    description: "Caught between desire and fear, they chart a complicated course to love.",
    color: "bg-purple-50/80",
    watermark: "Complex",
    ids: ["self-aware-alchemist", "chameleon", "wild-storm", "labyrinth"], 
    variant: "disorganized" as const,
  },
];

export function ArchetypesGrid({ archetypes }: ArchetypesGridProps) {
  return (
    <div className="flex flex-col">
      {GROUPS.map((group) => {
        const groupArchetypes = archetypes.filter((a) => group.ids.includes(a.id));
        
        if (groupArchetypes.length === 0) return null;

        return (
          <section 
            key={group.id} 
            id={group.id} 
            className={`relative overflow-hidden py-24 ${group.color}`}
          >
             {/* Watermark Background */}
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 text-9xl font-black uppercase text-white opacity-40 mix-blend-overlay blur-sm md:text-[12rem]">
              {group.watermark}
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 flex flex-col items-center text-center">
                <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl drop-shadow-sm">
                  {group.title}
                </h2>
                <p className="max-w-2xl text-xl font-medium text-slate-600">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {groupArchetypes.map((archetype) => (
                  <ArchetypeCard
                    key={archetype.id}
                    archetype={archetype}
                    variant={group.variant}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
