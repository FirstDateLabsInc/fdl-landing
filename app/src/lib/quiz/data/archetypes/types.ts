import type { Archetype } from "../../types";

export interface ArchetypeDefinition extends Archetype {
  id: string;
  patternDescription: string;
  datingCycle: string[];
  rootCause: string;
  datingMeaning: {
    strengths: string[];
    challenges: string[];
  };
  redFlags: string[];
  coachingFocus: string[];
  callToActionCopy: string;
}
