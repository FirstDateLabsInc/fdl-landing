import type { AttachmentDimension, CommunicationStyle } from "../../types";

export const ARCHETYPE_MATRIX: Record<
  AttachmentDimension,
  Record<CommunicationStyle, string>
> = {
  secure: {
    assertive: "golden-partner",
    passive: "gentle-peacekeeper",
    aggressive: "direct-director",
    passive_aggressive: "playful-tease",
  },
  anxious: {
    assertive: "open-book",
    passive: "selfless-giver",
    aggressive: "fiery-pursuer",
    passive_aggressive: "mind-reader",
  },
  avoidant: {
    assertive: "solo-voyager",
    passive: "quiet-ghost",
    aggressive: "iron-fortress",
    passive_aggressive: "cool-mystery",
  },
  disorganized: {
    assertive: "self-aware-alchemist",
    passive: "chameleon",
    aggressive: "wild-storm",
    passive_aggressive: "labyrinth",
  },
};
