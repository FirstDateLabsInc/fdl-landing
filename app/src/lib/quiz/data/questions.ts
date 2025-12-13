/**
 * Quiz Questions Data
 *
 * All 48 questions organized by section (including C6).
 * Source: docs/quiz/quiz-question.md
 */

import type { QuizSection, QuizQuestion } from "../types";

// ============================================================================
// SECTION A: ATTACHMENT STYLE (12 questions)
// ============================================================================

const attachmentQuestions: QuizQuestion[] = [
  // Secure (S1-S3)
  {
    id: 'S1',
    text: 'After few dates, I introduce the person I\'m seeing to my friends or social events.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'secure' },
  },
  {
    id: 'S2',
    text: 'When the person I am dating with say they need support, I usually call or meet them that day.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'secure' },
  },
  {
    id: 'S3',
    text: 'During conflicts, I keep talking or texting until we reach some kind of agreement.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'secure' },
  },

  // Anxious (AX1-AX3)
  {
    id: 'AX1',
    text: 'When they\'re out late and not responding, I repeatedly check my phone and send multiple messages or calls.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'anxious' },
  },
  {
    id: 'AX2',
    text: 'They go out with friends I don\'t know, I ask many detailed questions about what happened.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'anxious' },
  },
  {
    id: 'AX3',
    text: 'I reread our old chats or look back at our photos together to reassure myself that the person I am dating with still like me.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'anxious' },
  },

  // Avoidant (AV1-AV3)
  {
    id: 'AV1',
    text: 'If they message frequently or want to meet several days in a row, I slow down my replies or suggest spending less time together.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'avoidant' },
  },
  {
    id: 'AV2',
    text: 'When life gets stressful, I rarely update the person I\'m seeing and handle things alone.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'avoidant' },
  },
  {
    id: 'AV3',
    text: 'After a deep conversation, I usually wait longer than usual to plan the next date.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'avoidant' },
  },

  // Disorganized / Fearful (D1-D3)
  {
    id: 'D1',
    text: 'My communication frequency varies a lot—sometimes I\'m very present, other times I become quieter or cancel plans unexpectedly',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'disorganized' },
  },
  {
    id: 'D2',
    text: 'I sometimes agree to things that make the relationship more serious like a trip together, then later back out or avoid it because it suddenly feels like too much',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'disorganized' },
  },
  {
    id: 'D3',
    text: 'In conflicts, I often react with a lot of communication or emotion at first, and then later pull back or become less engaged with the same issue.',
    type: 'likert',
    scoring: { section: 'attachment', dimension: 'disorganized' },
  },
];

// ============================================================================
// SECTION B: COMMUNICATION STYLE (9 questions)
// ============================================================================

const communicationQuestions: QuizQuestion[] = [
  // Passive (COM_PASSIVE_1-2)
  {
    id: 'COM_PASSIVE_1',
    text: 'When I don\'t like their plan for a date (time, place, activity), I often say \'whatever you want\' instead of giving my real preference.',
    type: 'likert',
    scoring: { section: 'communication', style: 'passive' },
  },
  {
    id: 'COM_PASSIVE_2',
    text: 'When the person i am dating with cancel on me last minute, I usually reply with \'no worries!\' and drop it, even if I\'m annoyed.',
    type: 'likert',
    scoring: { section: 'communication', style: 'passive' },
  },

  // Aggressive (COM_AGGRESSIVE_1-2)
  {
    id: 'COM_AGGRESSIVE_1',
    text: 'In arguments, I often start talking much louder or sending long angry messages before I can stop myself.',
    type: 'likert',
    scoring: { section: 'communication', style: 'aggressive' },
  },
  {
    id: 'COM_AGGRESSIVE_2',
    text: 'I often say things like \'you always…\' or \'you never…\' in fights.',
    type: 'likert',
    scoring: { section: 'communication', style: 'aggressive' },
  },

  // Passive-Aggressive (COM_PAGG_1-2)
  {
    id: 'COM_PAGG_1',
    text: 'When I upset, I tell the whole story to my friends or family, but when the person i am dating with ask if I\'m okay I just say \'it\'s nothing.',
    type: 'likert',
    scoring: { section: 'communication', style: 'passive_aggressive' },
  },
  {
    id: 'COM_PAGG_2',
    text: 'If the person replies to me after a long time, I send messages like \'wow, you finally replied\' or \'busy person\' instead of just saying I was upset about the slow reply.',
    type: 'likert',
    scoring: { section: 'communication', style: 'passive_aggressive' },
  },

  // Assertive (COM_ASSERTIVE_1-2)
  {
    id: 'COM_ASSERTIVE_1',
    text: 'In disagreements, I describe what happened and suggest a specific change for next time.',
    type: 'likert',
    scoring: { section: 'communication', style: 'assertive' },
  },
  {
    id: 'COM_ASSERTIVE_2',
    text: 'if someone I\'m seeing makes a \'joke\' about me that hurts, I tell them directly and explain how I\'d like them to talk about me instead.',
    type: 'likert',
    scoring: { section: 'communication', style: 'assertive' },
  },

  // Scenario question (multiple choice)
  {
    id: 'COM_SCENARIO_1',
    text: 'You planned a date for Friday night. A few hours before, the person you\'re seeing sends a short message canceling with a vague excuse like "something came up, sorry." What do you most often do in this kind of situation?',
    type: 'scenario',
    scoring: { section: 'communication', style: 'passive' }, // default scoring target
    options: [
      {
        key: 'A',
        text: 'Reply with \'no worries :)\' and don\'t mention that you\'re disappointed.',
        scoring: { section: 'communication', style: 'passive' },
      },
      {
        key: 'B',
        text: 'Reply with angry, \'you always do this\' or \'don\'t bother asking me next time.\'',
        scoring: { section: 'communication', style: 'aggressive' },
      },
      {
        key: 'C',
        text: 'Reply that it\'s fine, but later ignore them or make sarcastic comments about them canceling.',
        scoring: { section: 'communication', style: 'passive_aggressive' },
      },
      {
        key: 'D',
        text: 'Tell them you\'re disappointed and ask to talk about how to handle plans or cancellations in the future.',
        scoring: { section: 'communication', style: 'assertive' },
      },
    ],
  },
];

// ============================================================================
// SECTION C: DATING CONFIDENCE (6 questions)
// ============================================================================

const confidenceQuestions: QuizQuestion[] = [
  {
    id: 'C1',
    text: 'When I\'m interested in someone, I often start the chat or suggest having a date.',
    type: 'likert',
    scoring: { section: 'confidence' },
  },
  {
    id: 'C2',
    text: 'The person I\'m seeing invites me to meet their close friends or family, I often say no because I\'m not confident I\'ll make a good impression.',
    type: 'likert',
    scoring: { section: 'confidence' },
    reverse: true,
  },
  {
    id: 'C3',
    text: 'If a date feels awkward or doesn\'t go well, I still keep using dating apps or starting new conversations afterward.',
    type: 'likert',
    scoring: { section: 'confidence' },
  },
  {
    id: 'C4',
    text: 'On a date, when the conversation turns to my real life (my job, income, or family), I keep it surface-level or change the topic because I\'m worried the truth won\'t seem good enough.',
    type: 'likert',
    scoring: { section: 'confidence' },
    reverse: true,
  },
  {
    id: 'C5',
    text: 'I actively work on my dating skills (reading, practicing, or using a dating coach).',
    type: 'likert',
    scoring: { section: 'confidence' },
  },
  {
    id: 'C6',
    text: 'If someone puts real effort into preparing for dates (even using AI to practice), I\'m more interested in going out with them.',
    type: 'likert',
    scoring: { section: 'confidence' },
  },
];

// ============================================================================
// SECTION D: EMOTIONAL AVAILABILITY (5 questions)
// ============================================================================

const emotionalQuestions: QuizQuestion[] = [
  {
    id: 'EA1',
    text: 'Once I\'ve gone on a few dates with someone, I start sharing about work stress, family updates, or plans I care about, what I\'m really going on in my life.',
    type: 'likert',
    scoring: { section: 'emotional' },
  },
  {
    id: 'EA2',
    text: 'When I\'m under pressure for work or family, I mostly stick to light topics and hide what\'s really going on.',
    type: 'likert',
    scoring: { section: 'emotional' },
    reverse: true,
  },
  {
    id: 'EA3',
    text: 'If the person makes hurtful comment that upsets me, I eventually bring it up.',
    type: 'likert',
    scoring: { section: 'emotional' },
  },
  {
    id: 'EA4',
    text: 'When they start a talk about future and feelings, I often delay or dodge the topic.',
    type: 'likert',
    scoring: { section: 'emotional' },
    reverse: true,
  },
  {
    id: 'EA5',
    text: 'I say things like \'I like you\' or \'I miss you\' when that fits the situation.',
    type: 'likert',
    scoring: { section: 'emotional' },
  },
];

// ============================================================================
// SECTION E: INTIMACY & BOUNDARIES (6 questions)
// ============================================================================

const intimacyQuestions: QuizQuestion[] = [
  // Intimacy Comfort (IC1-IC3)
  {
    id: 'IC1',
    text: 'I\'m comfortable giving a hug or holding hands after a few dates,',
    type: 'likert',
    scoring: { section: 'intimacy', dimension: 'comfort' },
  },
  {
    id: 'IC2',
    text: 'I ask or talk with the perosn about what kinds of touch(kissing and cuddling) they like or don\'t like',
    type: 'likert',
    scoring: { section: 'intimacy', dimension: 'comfort' },
  },
  {
    id: 'IC3',
    text: 'On dates, I sometimes take the lead by reaching for their hand, leaning in for a hug, or sitting closer, instead of always waiting for them.',
    type: 'likert',
    scoring: { section: 'intimacy', dimension: 'comfort' },
  },

  // Boundary Assertiveness (BA1-BA3)
  {
    id: 'BA1',
    text: 'If we are kissing or cuddling and I don\'t want to go further, I say \'let\'s stop here\' or \'I\'m not ready to do more.',
    type: 'likert',
    scoring: { section: 'intimacy', dimension: 'boundary' },
  },
  {
    id: 'BA2',
    text: 'If one of us wants sex or physical intimacy much more often than the other, I bring it up and talk about how to handle it in a way that feels okay for both of us.',
    type: 'likert',
    scoring: { section: 'intimacy', dimension: 'boundary' },
  },
  {
    id: 'BA3',
    text: 'I continue physical or sexual activity mainly to avoid conflict or disappointing them.',
    type: 'likert',
    scoring: { section: 'intimacy', dimension: 'boundary' },
    reverse: true,
  },
];

// ============================================================================
// SECTION F: LOVE LANGUAGES (10 questions)
// ============================================================================

const loveLanguageQuestions: QuizQuestion[] = [
  // Words of Affirmation (LL1-LL2)
  {
    id: 'LL1',
    text: 'When someone I\'m seeing has a important day(exam, interview, or show), I often send a message saying I\'m proud of them or I believe in them.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'words', direction: 'give' },
  },
  {
    id: 'LL2',
    text: 'Hearing them say things like \'I really like you\' or \'you did great\' makes me feel more loved than getting a gift.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'words', direction: 'receive' },
  },

  // Quality Time (LL3-LL4)
  {
    id: 'LL3',
    text: 'When I like someone, I often suggest simple plans where we can really talk, like a walk, coffee, or cooking together at home.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'time', direction: 'give' },
  },
  {
    id: 'LL4',
    text: 'When the person I\'m seeing is busy but still makes time to see me or prepare me with a surprise, I feel very close to them.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'time', direction: 'receive' },
  },

  // Acts of Service (LL5-LL6)
  {
    id: 'LL5',
    text: 'If the person I\'m seeing is stressed or busy, When I\'m at their place, I often just start helping with tidying up, washing dishes, or preparing food.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'service', direction: 'give' },
  },
  {
    id: 'LL6',
    text: 'When the person I\'m seeing takes care of like booking tickets, ordering food, or bringing sth i like, I feel especially cared for.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'service', direction: 'receive' },
  },

  // Gifts (LL7-LL8)
  {
    id: 'LL7',
    text: 'When I travel or see something that fits their taste, I like to buy it or send it to them, even if it\'s something small.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'gifts', direction: 'give' },
  },
  {
    id: 'LL8',
    text: 'I usually keep small things from someone I\'m seeing (like notes, tickets, or little gifts) for a long time instead of throwing them away quickly.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'gifts', direction: 'receive' },
  },

  // Physical Touch (LL9-LL10)
  {
    id: 'LL9',
    text: 'When I feel comfortable with someone I\'m seeing, I often move closer to them, like sitting side by side or lightly touching their arm or shoulder.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'touch', direction: 'give' },
  },
  {
    id: 'LL10',
    text: 'When I\'m close with someone I\'m seeing, being hugged or cuddling with them usually makes me feel more connected than just talking.',
    type: 'likert',
    scoring: { section: 'love_language', language: 'touch', direction: 'receive' },
  },
];

// ============================================================================
// QUIZ SECTIONS (grouped)
// ============================================================================

export const quizSections: QuizSection[] = [
  {
    id: 'attachment',
    title: 'Attachment Style',
    description: 'How you connect and relate in relationships',
    questions: attachmentQuestions,
  },
  {
    id: 'communication',
    title: 'Communication Style',
    description: 'How you express yourself in relationships',
    questions: communicationQuestions,
  },
  {
    id: 'confidence',
    title: 'Dating Confidence',
    description: 'Your comfort level in dating situations',
    questions: confidenceQuestions,
  },
  {
    id: 'emotional',
    title: 'Emotional Availability',
    description: 'Your openness to emotional connection',
    questions: emotionalQuestions,
  },
  {
    id: 'intimacy',
    title: 'Intimacy & Boundaries',
    description: 'Physical comfort and boundary setting',
    questions: intimacyQuestions,
  },
  {
    id: 'love_language',
    title: 'Love Languages',
    description: 'How you give and receive love',
    questions: loveLanguageQuestions,
  },
];

// ============================================================================
// EXPORTS
// ============================================================================

/** Flattened list of all questions for iteration/progress */
export const allQuestions: QuizQuestion[] = quizSections.flatMap((s) => s.questions);

/** Total number of questions */
export const totalQuestions = allQuestions.length; // 48

/** Get question by ID */
export function getQuestionById(id: string): QuizQuestion | undefined {
  return allQuestions.find((q) => q.id === id);
}

/** Get section by ID */
export function getSectionById(id: string): QuizSection | undefined {
  return quizSections.find((s) => s.id === id);
}

/** Get section for a question ID */
export function getSectionForQuestion(questionId: string): QuizSection | undefined {
  return quizSections.find((s) => s.questions.some((q) => q.id === questionId));
}
