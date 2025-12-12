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
    ids: ["golden-partner", "gentle-peacekeeper", "direct-director", "playful-tease"],
  },
  {
    id: "anxious",
    title: "The Anxious Lovers",
    description: "Driven by a need for closeness, they love deeply but fear disconnection.",
    ids: ["open-book", "selfless-giver", "fiery-pursuer", "mind-reader"],
  },
  {
    id: "avoidant",
    title: "The Independent Spirits",
    description: "Valuing autonomy above all, they protect their freedom from perceived threats.",
    ids: ["solo-voyager", "quiet-ghost", "iron-fortress", "cool-mystery"],
  },
  {
    id: "disorganized",
    title: "The Complex Navigateurs",
    description: "Caught between desire and fear, they chart a complicated course to love.",
    ids: ["self-aware-alchemist", "chameleon", "wild-storm", "labyrinth"],
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
            className="py-10 sm:py-14"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
                <h2 className="mb-2 text-[1.5rem] font-semibold tracking-tight text-foreground sm:mb-2 sm:text-[1.65rem]">
                  {group.title}
                </h2>
                <p className="max-w-2xl text-[0.95rem] text-muted-foreground sm:text-base leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {groupArchetypes.map((archetype) => (
                  <ArchetypeCard
                    key={archetype.id}
                    archetype={archetype}
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
