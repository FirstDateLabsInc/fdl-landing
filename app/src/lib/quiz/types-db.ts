import type {
  AttachmentDimension,
  CommunicationStyle,
  LoveLanguage,
} from "./types";

// Database-facing score shape: metrics only (no images/copy/UI payloads)
export interface DBScores {
  attachment: {
    primary: AttachmentDimension | AttachmentDimension[] | "mixed";
    scores: Record<AttachmentDimension, number>;
  };
  communication: {
    primary: CommunicationStyle | CommunicationStyle[] | "mixed";
    scores: Record<CommunicationStyle, number>;
  };
  confidence: number;
  emotional: number;
  intimacy: {
    comfort: number;
    boundaries: number;
  };
  loveLanguages: {
    ranked: LoveLanguage[];
    scores: Record<LoveLanguage, number>;
    giveReceive: Record<LoveLanguage, { give: number; receive: number }>;
  };
}
