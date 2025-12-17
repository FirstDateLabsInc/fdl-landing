// app/src/lib/quiz/data/archetypes/selectors.server.ts
// SERVER-ONLY: Build fails if imported from client components
import "server-only";

import type { ArchetypeFull, ArchetypeLocked, ArchetypePublic } from "./types";
import { archetypesPublic } from "./public";
import { archetypesLocked } from "./locked.server";

/**
 * Get FULL archetype (public + locked) by ID.
 *
 * SERVER-ONLY: Use only in Server Components or API routes.
 * Build will fail if imported from a "use client" component.
 */
export function getFullArchetypeById(id: string): ArchetypeFull | undefined {
  const pub = archetypesPublic.find((a) => a.id === id);
  const locked = archetypesLocked[id];

  if (!pub || !locked) return undefined;

  return { ...pub, ...locked };
}

/**
 * Get ONLY locked content by archetype ID.
 *
 * SERVER-ONLY: Use only in Server Components or API routes.
 * Build will fail if imported from a "use client" component.
 */
export function getLockedContentById(id: string): ArchetypeLocked | undefined {
  return archetypesLocked[id];
}

/**
 * Get all FULL archetypes (public + locked).
 *
 * SERVER-ONLY: Use only in Server Components or API routes.
 * Build will fail if imported from a "use client" component.
 */
export function getAllFullArchetypes(): ArchetypeFull[] {
  return archetypesPublic.map((pub) => {
    const locked = archetypesLocked[pub.id];
    if (!locked) {
      throw new Error(`Missing locked content for archetype: ${pub.id}`);
    }
    return { ...pub, ...locked };
  });
}

/**
 * Merge public archetype with locked content.
 *
 * SERVER-ONLY: Use only in Server Components or API routes.
 */
export function mergeArchetypeWithLocked(
  pub: ArchetypePublic,
  locked: ArchetypeLocked
): ArchetypeFull {
  return { ...pub, ...locked };
}
