// app/src/lib/quiz/data/archetypes/index.ts
// CLIENT-SAFE BARREL EXPORT
//
// ⚠️  WARNING: NEVER export from locked.server.ts or selectors.server.ts here!
//     This file is imported by client components.
//     Adding server-only exports will break the build.
//
// For server-only selectors, import directly from:
//   import { getFullArchetypeById } from "@/lib/quiz/data/archetypes/selectors.server";

export * from "./types";
export { archetypesPublic, archetypesPublic as archetypes } from "./public";
export { ARCHETYPE_MATRIX } from "./matrix";
export {
  getArchetype,
  getPublicArchetypeById,
  getAllPublicArchetypes,
  toArchetype,
  computeArchetypeByProbability,
  type ArchetypeResult,
  // Legacy aliases (deprecated)
  getArchetypeById,
  getAllArchetypes,
} from "./selectors";
