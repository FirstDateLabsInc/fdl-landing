import { describe, it, expect } from 'vitest';
import { dbScoresSchema } from '../schemas';

const validScores = {
  attachment: {
    primary: 'secure',
    scores: {
      secure: 80,
      anxious: 20,
      avoidant: 10,
      disorganized: 5,
    },
  },
  communication: {
    primary: ['assertive', 'passive'],
    scores: {
      passive: 55,
      aggressive: 15,
      passive_aggressive: 25,
      assertive: 60,
    },
  },
  confidence: 72,
  emotional: 68,
  intimacy: {
    comfort: 65,
    boundaries: 70,
  },
  loveLanguages: {
    ranked: ['time', 'touch', 'words', 'service', 'gifts'],
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

describe('dbScoresSchema', () => {
  it('accepts a valid DBScores shape', () => {
    const parsed = dbScoresSchema.safeParse(validScores);
    expect(parsed.success).toBe(true);
  });

  it('rejects missing required dimension keys', () => {
    const invalid = {
      ...validScores,
      attachment: {
        ...validScores.attachment,
        scores: {
          ...validScores.attachment.scores,
          secure: undefined,
        },
      },
    };
    const parsed = dbScoresSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('rejects out-of-range numbers', () => {
    const invalid = { ...validScores, confidence: 150 };
    const parsed = dbScoresSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('accepts legacy mixed primary arrays of length 4', () => {
    const mixed = {
      ...validScores,
      attachment: {
        ...validScores.attachment,
        primary: ['secure', 'anxious', 'avoidant', 'disorganized'],
      },
    };
    const parsed = dbScoresSchema.safeParse(mixed);
    expect(parsed.success).toBe(true);
  });
});

