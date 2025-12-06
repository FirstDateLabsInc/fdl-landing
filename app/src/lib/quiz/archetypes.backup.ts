/**
 * Quiz Archetype System
 *
 * Defines 16 personality archetypes based on quiz results.
 * Each archetype is determined by the 4×4 matrix of attachment style × communication style.
 */

import type { AttachmentDimension, CommunicationStyle, Archetype } from './types';

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

export interface ArchetypeDefinition extends Archetype {
  id: string;
  strengths: string[];
  growthAreas: string[];
}

const archetypes: ArchetypeDefinition[] = [
  // ========================================================================
  // SECURE ATTACHMENT (4 archetypes)
  // ========================================================================
  {
    id: 'golden-partner',
    name: 'The Golden Partner',
    emoji: '🐕',
    image: '/archetypes/golden-partner-goldenRetriever.png',
    summary:
      "Like a golden retriever, you're naturally warm, loyal, and approach relationships with genuine enthusiasm. Your secure foundation combined with assertive communication makes you an ideal partner who creates safety while expressing needs clearly.",
    strengths: [
      'Creates warm, welcoming relationship atmosphere',
      'Communicates needs clearly and kindly',
      'Handles conflict with grace and directness',
      'Provides consistent emotional support',
    ],
    growthAreas: [
      'May need to slow down for partners who need more processing time',
      'Could benefit from recognizing when others are not as naturally secure',
    ],
  },
  {
    id: 'gentle-peacekeeper',
    name: 'The Gentle Peacekeeper',
    emoji: '🕊️',
    image: '/archetypes/gentle-peacekeeper-dove.png',
    summary:
      'Like a peaceful dove, you bring harmony and tranquility to relationships. Your secure attachment provides stability, though your passive nature means you may sometimes prioritize peace over expressing your own needs.',
    strengths: [
      'Creates calm, drama-free relationship environment',
      'Naturally supportive and nurturing',
      'Adaptable and easy to be with',
      'Makes partners feel accepted unconditionally',
    ],
    growthAreas: [
      'Practice voicing your preferences more often',
      'Remember that expressing needs strengthens rather than threatens relationships',
      'Assert boundaries before resentment builds',
    ],
  },
  {
    id: 'direct-director',
    name: 'The Direct Director',
    emoji: '🦍',
    image: '/archetypes/direct-director-gorilla.png',
    summary:
      "Like a protective gorilla, you're a confident leader in relationships who takes charge while providing safety. Your secure base gives you emotional stability, though your direct approach can sometimes feel intense to others.",
    strengths: [
      'Takes decisive action in relationships',
      'Provides strong, protective presence',
      'Addresses problems head-on without avoidance',
      'Partners always know where they stand',
    ],
    growthAreas: [
      'Practice softening delivery while keeping directness',
      'Allow partners to lead sometimes',
      'Recognize when intensity overwhelms rather than helps',
    ],
  },
  {
    id: 'playful-tease',
    name: 'The Playful Tease',
    emoji: '🦊',
    image: '/archetypes/playful-tease-fox.png',
    summary:
      "Like a clever fox, you use humor and wit to navigate relationship dynamics. While you're fundamentally secure, you sometimes express frustrations indirectly through teasing or sarcasm rather than direct communication.",
    strengths: [
      'Keeps relationships fun and playful',
      'Uses humor to ease tension',
      'Quick-witted and engaging',
      'Emotionally stable at the core',
    ],
    growthAreas: [
      'Express frustrations directly rather than through jokes',
      'Ensure teasing lands as playful, not hurtful',
      'Practice direct communication when issues matter',
    ],
  },

  // ========================================================================
  // ANXIOUS ATTACHMENT (4 archetypes)
  // ========================================================================
  {
    id: 'open-book',
    name: 'The Open Book',
    emoji: '🐕‍🦺',
    image: '/archetypes/open-book-puppy.png',
    summary:
      "Like an eager puppy, you wear your heart on your sleeve with enthusiasm and expressiveness. You're not afraid to share your feelings, though your desire for reassurance can sometimes feel overwhelming to partners.",
    strengths: [
      'Openly expresses affection and feelings',
      'Creates space for emotional vulnerability',
      'Actively works on relationship issues',
      'Partners never doubt your investment',
    ],
    growthAreas: [
      'Practice self-soothing before seeking reassurance',
      'Balance emotional expression with giving space',
      'Trust that love does not require constant confirmation',
    ],
  },
  {
    id: 'selfless-giver',
    name: 'The Selfless Giver',
    emoji: '🐨',
    image: '/archetypes/selfless-giver-koala.png',
    summary:
      "Like a devoted koala, you cling to relationships with deep attachment and put others' needs first. Your generous nature is a gift, but you may sacrifice too much of yourself hoping it will secure love.",
    strengths: [
      'Deeply caring and attentive to partners',
      'Remembers every detail about loved ones',
      'Willing to go the extra mile',
      'Creates nurturing relationship atmosphere',
    ],
    growthAreas: [
      'Practice receiving as much as giving',
      'Assert your needs without guilt',
      'Build identity beyond relationship status',
      'Recognize that self-care is not selfish',
    ],
  },
  {
    id: 'fiery-pursuer',
    name: 'The Fiery Pursuer',
    emoji: '🐆',
    image: '/archetypes/fiery-pursuer-cheetah.png',
    summary:
      'Like a chasing cheetah, you pursue love with intensity and passion. When anxiety meets aggression, you may push too hard for connection, sometimes creating the very distance you fear.',
    strengths: [
      'Passionate and all-in when committed',
      'Fights for the relationship',
      'Does not let issues go unaddressed',
      'Highly emotionally engaged',
    ],
    growthAreas: [
      'Practice pause before pursuit',
      'Channel intensity into positive expressions',
      'Recognize when pushing drives partners away',
      'Develop patience with relationship pacing',
    ],
  },
  {
    id: 'mind-reader',
    name: 'The Mind Reader',
    emoji: '🦉',
    image: '/archetypes/mind-reader-owl.png',
    summary:
      "Like a watchful owl, you observe everything and expect partners to decode your unspoken needs. Your anxious attachment drives you to test relationships indirectly rather than stating what you want clearly.",
    strengths: [
      'Highly perceptive of relationship dynamics',
      'Notices subtleties others miss',
      'Deeply analytical about emotions',
      'Protective of relationship harmony',
    ],
    growthAreas: [
      'State needs directly instead of hinting',
      'Avoid testing partners to prove their love',
      'Trust that asking for what you want is okay',
      'Address issues when they are small',
    ],
  },

  // ========================================================================
  // AVOIDANT ATTACHMENT (4 archetypes)
  // ========================================================================
  {
    id: 'solo-voyager',
    name: 'The Solo Voyager',
    emoji: '🦅',
    image: '/archetypes/solo-voyager-eagle.png',
    summary:
      "Like a soaring eagle, you value your freedom and independence above all. You're confident in who you are and clear about your boundaries, though intimacy often feels like a threat to your autonomy.",
    strengths: [
      'Strong sense of self and identity',
      'Clear about personal boundaries',
      'Self-sufficient and capable',
      'Will not lose yourself in relationships',
    ],
    growthAreas: [
      'Practice letting others in without losing yourself',
      'Recognize that interdependence is not weakness',
      'Allow yourself to need and be needed',
      'Stay present when closeness triggers flight',
    ],
  },
  {
    id: 'quiet-ghost',
    name: 'The Quiet Ghost',
    emoji: '🐢',
    image: '/archetypes/quiet-ghost-turtle.png',
    summary:
      'Like a withdrawing turtle, you retreat into your shell when relationships feel too close or demanding. You avoid conflict and connection alike, often disappearing when things get emotionally intense.',
    strengths: [
      'Creates no drama or pressure',
      'Low-maintenance relationship presence',
      'Self-contained and peaceful',
      'Values quality over quantity in connection',
    ],
    growthAreas: [
      'Practice staying present during difficult conversations',
      'Communicate when you need space rather than vanishing',
      'Recognize withdrawal patterns before they damage bonds',
      'Build tolerance for emotional closeness gradually',
    ],
  },
  {
    id: 'iron-fortress',
    name: 'The Iron Fortress',
    emoji: '🦔',
    image: '/archetypes/iron-fortress-armadillo.png',
    summary:
      "Like an armored armadillo, you've built impenetrable defenses around your heart. You push others away with harsh words or cold distance, protecting yourself from the vulnerability that love requires.",
    strengths: [
      'Extremely self-reliant',
      'Clear boundaries that never waver',
      'Does not tolerate disrespect',
      'Protective of personal space',
    ],
    growthAreas: [
      'Recognize that armor keeps out love too',
      'Practice vulnerability in small steps',
      'Soften defensive reactions',
      'Understand that past hurts do not have to define future relationships',
    ],
  },
  {
    id: 'cool-mystery',
    name: 'The Cool Mystery',
    emoji: '🐈',
    image: '/archetypes/cool-mystery-cat.png',
    summary:
      'Like an aloof cat, you maintain emotional distance while keeping partners guessing. You express displeasure through coldness or withdrawal rather than words, creating an air of mystery that can feel like rejection.',
    strengths: [
      'Maintains healthy independence',
      'Does not create explosive conflict',
      'Intriguing and hard to read',
      'Values personal space and quiet',
    ],
    growthAreas: [
      'Express needs and frustrations directly',
      'Avoid silent treatment as a communication tool',
      'Let partners understand your emotional world',
      'Practice warmth even when it feels vulnerable',
    ],
  },

  // ========================================================================
  // DISORGANIZED ATTACHMENT (4 archetypes)
  // ========================================================================
  {
    id: 'self-aware-alchemist',
    name: 'The Self-Aware Alchemist',
    emoji: '🐙',
    image: '/archetypes/self-aware-alchemist-octopus.png',
    summary:
      "Like a complex octopus, you're highly intelligent and self-aware despite your chaotic attachment patterns. You can articulate what's happening inside you, even when your behavior contradicts your words.",
    strengths: [
      'Highly self-aware about patterns',
      'Can communicate complex emotions',
      'Actively working on growth',
      'Resilient despite challenges',
    ],
    growthAreas: [
      'Align actions with stated intentions',
      'Build consistency in relationship behaviors',
      'Use insight to change, not just understand, patterns',
      'Seek professional support for deeper healing',
    ],
  },
  {
    id: 'chameleon',
    name: 'The Chameleon',
    emoji: '🦎',
    image: '/archetypes/chameleon-chameleon.png',
    summary:
      "Like an adapting chameleon, you shift and change based on who you're with, losing yourself in the process. Your unpredictable attachment patterns combine with passivity to create constant shape-shifting in relationships.",
    strengths: [
      'Adaptable to different relationship dynamics',
      'Non-confrontational',
      'Open to going with the flow',
      'Can fit into various social situations',
    ],
    growthAreas: [
      'Develop consistent sense of self',
      'Practice having opinions and preferences',
      'Stop abandoning yourself for acceptance',
      'Build stable identity independent of partners',
    ],
  },
  {
    id: 'wild-storm',
    name: 'The Wild Storm',
    emoji: '🐂',
    image: '/archetypes/wild-storm-bull.png',
    summary:
      'Like a charging bull, your relationships are marked by intense, sometimes destructive energy. You cycle between craving closeness and pushing away with force, creating emotional whiplash for partners.',
    strengths: [
      'Deeply passionate when engaged',
      'Does not pretend emotions do not exist',
      'Fights for connection in your own way',
      'Capable of intense love',
    ],
    growthAreas: [
      'Learn emotional regulation techniques',
      'Pause before reacting in conflict',
      'Channel intensity into healthy expression',
      'Seek professional support for trauma healing',
    ],
  },
  {
    id: 'labyrinth',
    name: 'The Labyrinth',
    emoji: '🐍',
    image: '/archetypes/labyrinth-snake.png',
    summary:
      'Like a coiling snake, you are complex and hard to read, sending mixed signals that keep partners confused. Your contradictory attachment patterns express themselves through indirect, sometimes manipulative communication.',
    strengths: [
      'Complex emotional intelligence',
      'Protective of deepest vulnerabilities',
      'Observant of relationship dynamics',
      'Survives difficult emotional terrain',
    ],
    growthAreas: [
      'Communicate directly rather than through hints or tests',
      'Recognize manipulation patterns, even unintentional ones',
      'Build trust through consistency',
      'Work with a professional on attachment patterns',
    ],
  },
];

// ============================================================================
// ARCHETYPE MATRIX LOOKUP
// ============================================================================

/**
 * 4×4 matrix mapping: [attachment][communication] → archetype id
 */
const ARCHETYPE_MATRIX: Record<AttachmentDimension, Record<CommunicationStyle, string>> = {
  secure: {
    assertive: 'golden-partner',
    passive: 'gentle-peacekeeper',
    aggressive: 'direct-director',
    passive_aggressive: 'playful-tease',
  },
  anxious: {
    assertive: 'open-book',
    passive: 'selfless-giver',
    aggressive: 'fiery-pursuer',
    passive_aggressive: 'mind-reader',
  },
  avoidant: {
    assertive: 'solo-voyager',
    passive: 'quiet-ghost',
    aggressive: 'iron-fortress',
    passive_aggressive: 'cool-mystery',
  },
  disorganized: {
    assertive: 'self-aware-alchemist',
    passive: 'chameleon',
    aggressive: 'wild-storm',
    passive_aggressive: 'labyrinth',
  },
};

// ============================================================================
// ARCHETYPE LOOKUP FUNCTIONS
// ============================================================================

/**
 * Find archetype by ID with fallback
 */
function findArchetype(id: string): ArchetypeDefinition {
  const archetype = archetypes.find((a) => a.id === id);
  if (!archetype) {
    // Fallback to first archetype if not found
    return archetypes[0];
  }
  return archetype;
}

/**
 * Get archetype based on attachment style and communication style
 * Uses simple 4×4 matrix lookup
 */
export function getArchetype(
  attachment: AttachmentDimension | AttachmentDimension[] | 'mixed',
  communication: CommunicationStyle | CommunicationStyle[] | 'mixed'
): ArchetypeDefinition {
  // Handle array/mixed attachment - use first element or default to 'secure'
  let attachmentKey: AttachmentDimension;
  if (Array.isArray(attachment)) {
    attachmentKey = attachment[0] ?? 'secure';
  } else if (attachment === 'mixed') {
    attachmentKey = 'secure';
  } else {
    attachmentKey = attachment;
  }

  // Handle array/mixed communication - use first element or default to 'assertive'
  let communicationKey: CommunicationStyle;
  if (Array.isArray(communication)) {
    communicationKey = communication[0] ?? 'assertive';
  } else if (communication === 'mixed') {
    communicationKey = 'assertive';
  } else {
    communicationKey = communication;
  }

  const id = ARCHETYPE_MATRIX[attachmentKey][communicationKey];
  return findArchetype(id);
}

/**
 * Get archetype by ID
 */
export function getArchetypeById(id: string): ArchetypeDefinition | undefined {
  return archetypes.find((a) => a.id === id);
}

/**
 * Get all archetypes
 */
export function getAllArchetypes(): ArchetypeDefinition[] {
  return [...archetypes];
}

/**
 * Convert ArchetypeDefinition to base Archetype type
 */
export function toArchetype(definition: ArchetypeDefinition): Archetype {
  return {
    name: definition.name,
    emoji: definition.emoji,
    summary: definition.summary,
    image: definition.image,
  };
}
