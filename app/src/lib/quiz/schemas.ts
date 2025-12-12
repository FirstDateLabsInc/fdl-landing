import { z } from 'zod';

// Literal enums for DB score payload validation
const attachmentDimensionSchema = z.enum([
  'secure',
  'anxious',
  'avoidant',
  'disorganized',
]);

const communicationStyleSchema = z.enum([
  'passive',
  'aggressive',
  'passive_aggressive',
  'assertive',
]);

const loveLanguageSchema = z.enum([
  'words',
  'time',
  'service',
  'gifts',
  'touch',
]);

const percentSchema = z.number().finite().min(0).max(100);

const attachmentScoresSchema = z.object({
  secure: percentSchema,
  anxious: percentSchema,
  avoidant: percentSchema,
  disorganized: percentSchema,
});

const attachmentPrimarySchema = z.union([
  attachmentDimensionSchema,
  attachmentDimensionSchema.array().min(2).max(4),
  z.literal('mixed'),
]);

const communicationScoresSchema = z.object({
  passive: percentSchema,
  aggressive: percentSchema,
  passive_aggressive: percentSchema,
  assertive: percentSchema,
});

const communicationPrimarySchema = z.union([
  communicationStyleSchema,
  communicationStyleSchema.array().min(2).max(4),
  z.literal('mixed'),
]);

const loveLanguageScoresSchema = z.object({
  words: percentSchema,
  time: percentSchema,
  service: percentSchema,
  gifts: percentSchema,
  touch: percentSchema,
});

const giveReceiveSchema = z.object({
  give: percentSchema,
  receive: percentSchema,
});

const loveLanguagesSchema = z.object({
  ranked: loveLanguageSchema.array().min(1).max(5),
  scores: loveLanguageScoresSchema,
  giveReceive: z.object({
    words: giveReceiveSchema,
    time: giveReceiveSchema,
    service: giveReceiveSchema,
    gifts: giveReceiveSchema,
    touch: giveReceiveSchema,
  }),
});

export const dbScoresSchema = z.object({
  attachment: z.object({
    primary: attachmentPrimarySchema,
    scores: attachmentScoresSchema,
  }),
  communication: z.object({
    primary: communicationPrimarySchema,
    scores: communicationScoresSchema,
  }),
  confidence: percentSchema,
  emotional: percentSchema,
  intimacy: z.object({
    comfort: percentSchema,
    boundaries: percentSchema,
  }),
  loveLanguages: loveLanguagesSchema,
});

export type DBScoresPayload = z.infer<typeof dbScoresSchema>;

