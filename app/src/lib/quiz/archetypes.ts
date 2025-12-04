/**
 * Quiz Archetype System
 *
 * Defines personality archetypes based on quiz results.
 * Each archetype combines attachment style, communication style, and confidence level.
 */

import type { AttachmentDimension, CommunicationStyle, Archetype } from './types';

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

interface ArchetypeDefinition extends Archetype {
  id: string;
  strengths: string[];
  growthAreas: string[];
}

const archetypes: ArchetypeDefinition[] = [
  // SECURE ATTACHMENT
  {
    id: 'steady-connector',
    name: 'The Steady Connector',
    emoji: '🌟',
    summary:
      'You bring stability and warmth to relationships. You\'re comfortable with closeness and communicate your needs clearly, creating a safe space for genuine connection.',
    strengths: [
      'Naturally builds trust through consistent actions',
      'Balances independence with intimacy',
      'Handles conflict constructively',
      'Makes partners feel valued and secure',
    ],
    growthAreas: [
      'May need to practice patience with less secure partners',
      'Could benefit from recognizing your own needs more often',
    ],
  },
  {
    id: 'confident-anchor',
    name: 'The Confident Anchor',
    emoji: '⚓',
    summary:
      'You\'re a grounding presence in relationships with high self-assurance. Your secure attachment and confidence make you a natural at navigating dating with ease.',
    strengths: [
      'Radiates calm energy in dating situations',
      'Takes initiative without being pushy',
      'Recovers quickly from dating setbacks',
      'Creates stability for partners',
    ],
    growthAreas: [
      'Be mindful of partners who need more reassurance',
      'Stay open to feedback even when feeling confident',
    ],
  },

  // ANXIOUS ATTACHMENT
  {
    id: 'devoted-romantic',
    name: 'The Devoted Romantic',
    emoji: '💝',
    summary:
      'You love deeply and invest fully in relationships. Your emotional attunement makes you a caring partner, though you sometimes need reassurance of your worth.',
    strengths: [
      'Deeply attuned to partner\'s emotions',
      'Willing to put in effort for the relationship',
      'Values emotional connection highly',
      'Remembers important details about partners',
    ],
    growthAreas: [
      'Practice self-soothing when waiting for responses',
      'Build confidence independent of relationship status',
      'Trust that silence doesn\'t mean rejection',
    ],
  },
  {
    id: 'careful-romantic',
    name: 'The Careful Romantic',
    emoji: '🌸',
    summary:
      'You approach dating thoughtfully, seeking deep connection while managing anxiety about outcomes. Building confidence will help you show your wonderful qualities.',
    strengths: [
      'Thoughtful and intentional about dating',
      'Highly empathetic and caring',
      'Values authentic connection over casual dating',
      'Willing to be vulnerable',
    ],
    growthAreas: [
      'Work on trusting your instincts more',
      'Practice showing up authentically without overthinking',
      'Focus on enjoying the moment rather than predicting outcomes',
    ],
  },

  // AVOIDANT ATTACHMENT
  {
    id: 'independent-spirit',
    name: 'The Independent Spirit',
    emoji: '🦅',
    summary:
      'You value your autonomy and bring a refreshing self-sufficiency to relationships. Your challenge is letting others in while maintaining the independence you treasure.',
    strengths: [
      'Strong sense of self and boundaries',
      'Doesn\'t lose identity in relationships',
      'Low maintenance and flexible',
      'Values quality time over quantity',
    ],
    growthAreas: [
      'Practice staying engaged when feeling smothered',
      'Work on verbalizing affection more often',
      'Allow yourself to need your partner sometimes',
    ],
  },
  {
    id: 'private-protector',
    name: 'The Private Protector',
    emoji: '🛡️',
    summary:
      'You guard your heart carefully and need trust before opening up. This protectiveness served you well, but letting walls down gradually can deepen connections.',
    strengths: [
      'Self-reliant and resilient',
      'Selective about who gets close (high standards)',
      'Doesn\'t overwhelm partners with demands',
      'Calm under pressure',
    ],
    growthAreas: [
      'Challenge yourself to share feelings proactively',
      'Recognize when distance becomes a defense mechanism',
      'Practice leaning on others for support',
    ],
  },

  // DISORGANIZED ATTACHMENT
  {
    id: 'complex-soul',
    name: 'The Complex Soul',
    emoji: '🌊',
    summary:
      'You experience relationships intensely, sometimes pulled between wanting closeness and needing space. Understanding these patterns is your path to more stable connections.',
    strengths: [
      'Deeply passionate when committed',
      'Highly self-aware once patterns are recognized',
      'Resilient despite past challenges',
      'Capable of profound emotional depth',
    ],
    growthAreas: [
      'Develop consistent routines in communication',
      'Notice when hot-cold patterns emerge',
      'Work on regulating intense emotions before acting',
      'Consider therapy to understand attachment roots',
    ],
  },
  {
    id: 'searching-soul',
    name: 'The Searching Soul',
    emoji: '🔮',
    summary:
      'You\'re on a journey to understand your relationship patterns. Your inconsistent tendencies aren\'t flaws—they\'re signals pointing toward what you truly need.',
    strengths: [
      'Open to growth and self-discovery',
      'Authentic in showing complex emotions',
      'Seeking meaningful connections',
      'Not afraid of the hard questions',
    ],
    growthAreas: [
      'Build confidence through small wins',
      'Create predictability in your dating behaviors',
      'Practice communicating when feeling conflicted',
      'Seek support in understanding past influences',
    ],
  },

  // COMMUNICATION-FOCUSED ARCHETYPES
  {
    id: 'diplomatic-dater',
    name: 'The Diplomatic Dater',
    emoji: '🤝',
    summary:
      'You prefer keeping the peace in relationships, sometimes at the cost of your own needs. Learning to voice preferences kindly will strengthen your connections.',
    strengths: [
      'Easy-going and adaptable',
      'Creates harmonious dating experiences',
      'Good at reading social situations',
      'Avoids unnecessary drama',
    ],
    growthAreas: [
      'Practice stating preferences directly',
      'Recognize that healthy conflict can strengthen bonds',
      'Speak up when boundaries are crossed',
    ],
  },
  {
    id: 'fiery-heart',
    name: 'The Fiery Heart',
    emoji: '🔥',
    summary:
      'You feel things deeply and express yourself passionately. Channeling that intensity into constructive communication will help partners see your caring side.',
    strengths: [
      'Honest and direct about feelings',
      'Passionate and engaged',
      'Partners always know where they stand',
      'Fights for what matters',
    ],
    growthAreas: [
      'Practice pausing before responding in conflict',
      'Work on softening delivery while keeping honesty',
      'Listen fully before defending your position',
    ],
  },
  {
    id: 'subtle-communicator',
    name: 'The Subtle Communicator',
    emoji: '🎭',
    summary:
      'You express displeasure indirectly, often hoping partners will figure out what\'s wrong. Learning direct communication will reduce frustration on both sides.',
    strengths: [
      'Avoids explosive confrontations',
      'Notices relationship problems early',
      'Sensitive to partner\'s mistakes',
      'Creative in expressing feelings',
    ],
    growthAreas: [
      'Practice saying what you mean directly',
      'Address issues when they\'re small, not later',
      'Trust that partners want to know your real feelings',
    ],
  },
  {
    id: 'clear-voice',
    name: 'The Clear Voice',
    emoji: '✨',
    summary:
      'You excel at expressing your needs while respecting others. This healthy communication style is a huge asset in building lasting, honest relationships.',
    strengths: [
      'States needs and boundaries clearly',
      'Handles disagreements maturely',
      'Creates psychological safety for partners',
      'Models healthy communication',
    ],
    growthAreas: [
      'Remember that not everyone communicates as clearly',
      'Practice patience with partners learning to be assertive',
      'Stay open to different communication styles',
    ],
  },
];

// ============================================================================
// ARCHETYPE LOOKUP
// ============================================================================

/**
 * Confidence threshold for high vs low confidence
 */
const CONFIDENCE_THRESHOLD = 60;

/**
 * Get archetype based on attachment, communication, and confidence
 */
export function getArchetype(
  attachment: AttachmentDimension,
  communication: CommunicationStyle,
  confidence: number
): ArchetypeDefinition {
  const highConfidence = confidence >= CONFIDENCE_THRESHOLD;

  // Primary logic: attachment style + confidence level
  // Secondary factor: communication style for tie-breaking

  // Secure attachment
  if (attachment === 'secure') {
    if (communication === 'assertive' || highConfidence) {
      return findArchetype('confident-anchor');
    }
    return findArchetype('steady-connector');
  }

  // Anxious attachment
  if (attachment === 'anxious') {
    if (highConfidence) {
      return findArchetype('devoted-romantic');
    }
    return findArchetype('careful-romantic');
  }

  // Avoidant attachment
  if (attachment === 'avoidant') {
    if (highConfidence || communication === 'assertive') {
      return findArchetype('independent-spirit');
    }
    return findArchetype('private-protector');
  }

  // Disorganized attachment
  if (attachment === 'disorganized') {
    if (highConfidence) {
      return findArchetype('complex-soul');
    }
    return findArchetype('searching-soul');
  }

  // Communication-focused fallbacks (if attachment doesn't clearly dominate)
  if (communication === 'passive') {
    return findArchetype('diplomatic-dater');
  }
  if (communication === 'aggressive') {
    return findArchetype('fiery-heart');
  }
  if (communication === 'passive_aggressive') {
    return findArchetype('subtle-communicator');
  }
  if (communication === 'assertive') {
    return findArchetype('clear-voice');
  }

  // Default fallback
  return findArchetype('steady-connector');
}

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
  };
}

export type { ArchetypeDefinition };
