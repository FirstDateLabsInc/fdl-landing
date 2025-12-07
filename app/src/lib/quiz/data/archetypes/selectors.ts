import type {
  Archetype,
  AttachmentDimension,
  CommunicationStyle,
} from "../../types";
import type { ArchetypeDefinition } from "./types";
import { archetypes } from "./definitions";
import { ARCHETYPE_MATRIX } from "./matrix";

function findArchetype(id: string): ArchetypeDefinition {
  const archetype = archetypes.find((a) => a.id === id);
  if (!archetype) {
    return archetypes[0];
  }
  return archetype;
}

export function getArchetype(
  attachment: AttachmentDimension | AttachmentDimension[] | "mixed",
  communication: CommunicationStyle | CommunicationStyle[] | "mixed"
): ArchetypeDefinition {
  let attachmentKey: AttachmentDimension;
  if (Array.isArray(attachment)) {
    attachmentKey = attachment[0] ?? "secure";
  } else if (attachment === "mixed") {
    attachmentKey = "secure";
  } else {
    attachmentKey = attachment;
  }

  let communicationKey: CommunicationStyle;
  if (Array.isArray(communication)) {
    communicationKey = communication[0] ?? "assertive";
  } else if (communication === "mixed") {
    communicationKey = "assertive";
  } else {
    communicationKey = communication;
  }

  const id = ARCHETYPE_MATRIX[attachmentKey][communicationKey];
  return findArchetype(id);
}

export function getArchetypeById(id: string): ArchetypeDefinition | undefined {
  return archetypes.find((a) => a.id === id);
}

export function getAllArchetypes(): ArchetypeDefinition[] {
  return [...archetypes];
}

export function toArchetype(definition: ArchetypeDefinition): Archetype {
  return {
    name: definition.name,
    emoji: definition.emoji,
    summary: definition.summary,
    image: definition.image,
  };
}
