import { describe, it, expect } from 'vitest';
import {
  scoreAttachment,
  scoreCommunication,
  scoreConfidence,
  scoreEmotionalAvailability,
  scoreIntimacy,
  scoreLoveLanguages,
  calculateAllResults,
  isQuizComplete,
  getCompletionPercentage,
  mapToResponses,
  getResponseMap,
} from '../scoring';
import type { QuizResponse } from '../types';

// ============================================================================
// TEST UTILITIES
// ============================================================================

/** Create a response with timestamp */
function r(questionId: string, value: number, selectedKey?: string): QuizResponse {
  return { questionId, value, selectedKey, timestamp: Date.now() };
}

/** Create bulk responses from a map */
function bulkResponses(map: Record<string, number | string>): QuizResponse[] {
  return Object.entries(map).map(([id, val]) =>
    typeof val === 'string' ? r(id, 0, val) : r(id, val)
  );
}

// ============================================================================
// NORMALIZATION FORMULA VERIFICATION
// Math.round(((rawScore - 1) / 4) * 100)
// ============================================================================

describe('Normalization Formula', () => {
  // These tests verify the formula via scoreConfidence with single-question responses

  it('normalizes 1 → 0', () => {
    const responses = [r('C1', 1), r('C3', 1), r('C5', 1), r('C2', 5), r('C4', 5)];
    // C2, C4 reversed: 6-5=1, all values become 1, avg=1, normalize=0
    expect(scoreConfidence(responses)).toBe(0);
  });

  it('normalizes 5 → 100', () => {
    const responses = [r('C1', 5), r('C3', 5), r('C5', 5), r('C2', 1), r('C4', 1)];
    // C2, C4 reversed: 6-1=5, all values become 5, avg=5, normalize=100
    expect(scoreConfidence(responses)).toBe(100);
  });

  it('normalizes 3 → 50', () => {
    const responses = [r('C1', 3), r('C3', 3), r('C5', 3), r('C2', 3), r('C4', 3)];
    // C2, C4 reversed: 6-3=3, all values remain 3, avg=3, normalize=50
    expect(scoreConfidence(responses)).toBe(50);
  });

  it('normalizes 2 → 25 and 4 → 75', () => {
    // Test avg of 2: all questions = 2, reversed questions = 4 (6-4=2)
    const responses2 = [r('C1', 2), r('C3', 2), r('C5', 2), r('C2', 4), r('C4', 4)];
    expect(scoreConfidence(responses2)).toBe(25);

    // Test avg of 4: all questions = 4, reversed questions = 2 (6-2=4)
    const responses4 = [r('C1', 4), r('C3', 4), r('C5', 4), r('C2', 2), r('C4', 2)];
    expect(scoreConfidence(responses4)).toBe(75);
  });
});

// ============================================================================
// REVERSE SCORING VERIFICATION
// Formula: 6 - value (so 5→1, 4→2, 3→3, 2→4, 1→5)
// Reversed questions: C2, C4, EA2, EA4, BA3
// ============================================================================

describe('Reverse Scoring', () => {
  it('C2 and C4 are reversed in confidence scoring', () => {
    // If we give C2=5, C4=5 (without knowing about reverse),
    // they become 1 after reverse, lowering the average
    const responses = [r('C1', 5), r('C2', 5), r('C3', 5), r('C4', 5), r('C5', 5)];
    // After reverse: [5, 1, 5, 1, 5] → avg = 3.4 → normalize = 60
    expect(scoreConfidence(responses)).toBe(60);
  });

  it('EA2 and EA4 are reversed in emotional scoring', () => {
    const responses = [r('EA1', 5), r('EA2', 5), r('EA3', 5), r('EA4', 5), r('EA5', 5)];
    // After reverse: [5, 1, 5, 1, 5] → avg = 3.4 → normalize = 60
    expect(scoreEmotionalAvailability(responses)).toBe(60);
  });

  it('BA3 is reversed in intimacy boundary scoring', () => {
    const responses = [r('BA1', 5), r('BA2', 5), r('BA3', 5)];
    // After reverse BA3: [5, 5, 1] → avg = 3.67 → normalize = 67
    const result = scoreIntimacy(responses);
    expect(result.boundaries).toBe(67);
  });

  it('max boundary score requires BA3=1 (reversed to 5)', () => {
    const responses = [r('BA1', 5), r('BA2', 5), r('BA3', 1)];
    // After reverse BA3: [5, 5, 5] → avg = 5 → normalize = 100
    const result = scoreIntimacy(responses);
    expect(result.boundaries).toBe(100);
  });
});

// ============================================================================
// ATTACHMENT SCORING
// 12 questions: S1-S3 (secure), AX1-AX3 (anxious), AV1-AV3 (avoidant), D1-D3 (disorganized)
// ============================================================================

describe('scoreAttachment', () => {
  it('returns all 100s when all questions are 5', () => {
    const responses = bulkResponses({
      S1: 5, S2: 5, S3: 5,
      AX1: 5, AX2: 5, AX3: 5,
      AV1: 5, AV2: 5, AV3: 5,
      D1: 5, D2: 5, D3: 5,
    });
    const result = scoreAttachment(responses);
    expect(result.scores.secure).toBe(100);
    expect(result.scores.anxious).toBe(100);
    expect(result.scores.avoidant).toBe(100);
    expect(result.scores.disorganized).toBe(100);
  });

  it('returns all 0s when all questions are 1', () => {
    const responses = bulkResponses({
      S1: 1, S2: 1, S3: 1,
      AX1: 1, AX2: 1, AX3: 1,
      AV1: 1, AV2: 1, AV3: 1,
      D1: 1, D2: 1, D3: 1,
    });
    const result = scoreAttachment(responses);
    expect(result.scores.secure).toBe(0);
    expect(result.scores.anxious).toBe(0);
    expect(result.scores.avoidant).toBe(0);
    expect(result.scores.disorganized).toBe(0);
  });

  it('identifies secure as primary when secure questions are highest', () => {
    const responses = bulkResponses({
      S1: 5, S2: 5, S3: 5,      // secure = 100
      AX1: 1, AX2: 1, AX3: 1,  // anxious = 0
      AV1: 1, AV2: 1, AV3: 1,  // avoidant = 0
      D1: 1, D2: 1, D3: 1,     // disorganized = 0
    });
    const result = scoreAttachment(responses);
    expect(result.primary).toBe('secure');
    expect(result.scores.secure).toBe(100);
  });

  it('identifies anxious as primary when anxious questions are highest', () => {
    const responses = bulkResponses({
      S1: 1, S2: 1, S3: 1,
      AX1: 5, AX2: 5, AX3: 5,
      AV1: 1, AV2: 1, AV3: 1,
      D1: 1, D2: 1, D3: 1,
    });
    const result = scoreAttachment(responses);
    expect(result.primary).toBe('anxious');
  });

  it('handles partial responses', () => {
    const responses = [r('S1', 5), r('S2', 5)]; // Only 2 secure questions
    const result = scoreAttachment(responses);
    expect(result.scores.secure).toBe(100); // avg(5,5) = 5 → 100
    expect(result.scores.anxious).toBe(0);  // no responses → 0
  });

  it('calculates mixed scores correctly', () => {
    // Secure: 5,4,3 → avg=4 → 75
    // Anxious: 3,3,3 → avg=3 → 50
    const responses = bulkResponses({
      S1: 5, S2: 4, S3: 3,
      AX1: 3, AX2: 3, AX3: 3,
      AV1: 1, AV2: 1, AV3: 1,
      D1: 1, D2: 1, D3: 1,
    });
    const result = scoreAttachment(responses);
    expect(result.scores.secure).toBe(75);
    expect(result.scores.anxious).toBe(50);
    expect(result.primary).toBe('secure');
  });

  it('returns mixed when all dimensions tie', () => {
    // All dimensions score equally → primary should be mixed
    const responses = bulkResponses({
      S1: 3, S2: 3, S3: 3,
      AX1: 3, AX2: 3, AX3: 3,
      AV1: 3, AV2: 3, AV3: 3,
      D1: 3, D2: 3, D3: 3,
    });
    const result = scoreAttachment(responses);
    expect(result.primary).toBe('mixed');
  });
});

// ============================================================================
// COMMUNICATION SCORING
// 8 likert + 1 scenario
// Scenario bonus: +25 points to selected style (capped at 100)
// ============================================================================

describe('scoreCommunication', () => {
  it('scores likert questions correctly without scenario', () => {
    const responses = bulkResponses({
      COM_PASSIVE_1: 5, COM_PASSIVE_2: 5,
      COM_AGGRESSIVE_1: 1, COM_AGGRESSIVE_2: 1,
      COM_PAGG_1: 1, COM_PAGG_2: 1,
      COM_ASSERTIVE_1: 1, COM_ASSERTIVE_2: 1,
    });
    const result = scoreCommunication(responses);
    expect(result.scores.passive).toBe(100);
    expect(result.scores.aggressive).toBe(0);
    expect(result.primary).toBe('passive');
  });

  it('applies 25-point bonus for scenario selection A (passive)', () => {
    const responses = [
      ...bulkResponses({
        COM_PASSIVE_1: 3, COM_PASSIVE_2: 3,     // base = 50
        COM_AGGRESSIVE_1: 3, COM_AGGRESSIVE_2: 3,
        COM_PAGG_1: 3, COM_PAGG_2: 3,
        COM_ASSERTIVE_1: 3, COM_ASSERTIVE_2: 3,
      }),
      r('COM_SCENARIO_1', 0, 'A'), // selects passive
    ];
    const result = scoreCommunication(responses);
    expect(result.scores.passive).toBe(75); // 50 + 25
    expect(result.primary).toBe('passive');
  });

  it('applies 25-point bonus for scenario selection D (assertive)', () => {
    const responses = [
      ...bulkResponses({
        COM_PASSIVE_1: 3, COM_PASSIVE_2: 3,
        COM_AGGRESSIVE_1: 3, COM_AGGRESSIVE_2: 3,
        COM_PAGG_1: 3, COM_PAGG_2: 3,
        COM_ASSERTIVE_1: 3, COM_ASSERTIVE_2: 3,
      }),
      r('COM_SCENARIO_1', 0, 'D'), // selects assertive
    ];
    const result = scoreCommunication(responses);
    expect(result.scores.assertive).toBe(75); // 50 + 25
    expect(result.primary).toBe('assertive');
  });

  it('caps score at 100 when scenario bonus would exceed', () => {
    const responses = [
      ...bulkResponses({
        COM_PASSIVE_1: 5, COM_PASSIVE_2: 5,     // base = 100
        COM_AGGRESSIVE_1: 1, COM_AGGRESSIVE_2: 1,
        COM_PAGG_1: 1, COM_PAGG_2: 1,
        COM_ASSERTIVE_1: 1, COM_ASSERTIVE_2: 1,
      }),
      r('COM_SCENARIO_1', 0, 'A'), // +25 to passive
    ];
    const result = scoreCommunication(responses);
    expect(result.scores.passive).toBe(100); // capped at 100, not 125
  });

  it('maps scenario keys correctly: A=passive, B=aggressive, C=passive_aggressive, D=assertive', () => {
    // Test each key mapping
    const baseResponses = bulkResponses({
      COM_PASSIVE_1: 1, COM_PASSIVE_2: 1,
      COM_AGGRESSIVE_1: 1, COM_AGGRESSIVE_2: 1,
      COM_PAGG_1: 1, COM_PAGG_2: 1,
      COM_ASSERTIVE_1: 1, COM_ASSERTIVE_2: 1,
    });

    const resultA = scoreCommunication([...baseResponses, r('COM_SCENARIO_1', 0, 'A')]);
    expect(resultA.scores.passive).toBe(25); // 0 + 25

    const resultB = scoreCommunication([...baseResponses, r('COM_SCENARIO_1', 0, 'B')]);
    expect(resultB.scores.aggressive).toBe(25);

    const resultC = scoreCommunication([...baseResponses, r('COM_SCENARIO_1', 0, 'C')]);
    expect(resultC.scores.passive_aggressive).toBe(25);

    const resultD = scoreCommunication([...baseResponses, r('COM_SCENARIO_1', 0, 'D')]);
    expect(resultD.scores.assertive).toBe(25);
  });

  it('handles missing scenario response', () => {
    const responses = bulkResponses({
      COM_PASSIVE_1: 5, COM_PASSIVE_2: 5,
      COM_AGGRESSIVE_1: 1, COM_AGGRESSIVE_2: 1,
      COM_PAGG_1: 1, COM_PAGG_2: 1,
      COM_ASSERTIVE_1: 1, COM_ASSERTIVE_2: 1,
    });
    const result = scoreCommunication(responses);
    expect(result.scores.passive).toBe(100); // No bonus applied
  });
});

// ============================================================================
// CONFIDENCE SCORING
// Questions: C1, C2 (rev), C3, C4 (rev), C5
// ============================================================================

describe('scoreConfidence', () => {
  it('returns 100 when all questions effective value is 5', () => {
    // C2, C4 need raw value 1 to become 5 after reverse
    const responses = [r('C1', 5), r('C2', 1), r('C3', 5), r('C4', 1), r('C5', 5)];
    expect(scoreConfidence(responses)).toBe(100);
  });

  it('returns 0 when all questions effective value is 1', () => {
    // C2, C4 need raw value 5 to become 1 after reverse
    const responses = [r('C1', 1), r('C2', 5), r('C3', 1), r('C4', 5), r('C5', 1)];
    expect(scoreConfidence(responses)).toBe(0);
  });

  it('returns 0 for empty responses', () => {
    expect(scoreConfidence([])).toBe(0);
  });

  it('handles partial responses', () => {
    const responses = [r('C1', 5), r('C3', 5)]; // Only 2 questions
    expect(scoreConfidence(responses)).toBe(100);
  });
});

// ============================================================================
// EMOTIONAL AVAILABILITY SCORING
// Questions: EA1, EA2 (rev), EA3, EA4 (rev), EA5
// ============================================================================

describe('scoreEmotionalAvailability', () => {
  it('returns 100 when all questions effective value is 5', () => {
    const responses = [r('EA1', 5), r('EA2', 1), r('EA3', 5), r('EA4', 1), r('EA5', 5)];
    expect(scoreEmotionalAvailability(responses)).toBe(100);
  });

  it('returns 0 when all questions effective value is 1', () => {
    const responses = [r('EA1', 1), r('EA2', 5), r('EA3', 1), r('EA4', 5), r('EA5', 1)];
    expect(scoreEmotionalAvailability(responses)).toBe(0);
  });

  it('returns 0 for empty responses', () => {
    expect(scoreEmotionalAvailability([])).toBe(0);
  });
});

// ============================================================================
// INTIMACY SCORING
// Comfort: IC1, IC2, IC3
// Boundary: BA1, BA2, BA3 (rev)
// ============================================================================

describe('scoreIntimacy', () => {
  it('returns both comfort and boundary scores', () => {
    const responses = [
      r('IC1', 5), r('IC2', 5), r('IC3', 5),
      r('BA1', 5), r('BA2', 5), r('BA3', 1), // BA3 reversed to 5
    ];
    const result = scoreIntimacy(responses);
    expect(result.comfort).toBe(100);
    expect(result.boundaries).toBe(100);
  });

  it('returns 0 for both when all questions are 1', () => {
    const responses = [
      r('IC1', 1), r('IC2', 1), r('IC3', 1),
      r('BA1', 1), r('BA2', 1), r('BA3', 5), // BA3 reversed to 1
    ];
    const result = scoreIntimacy(responses);
    expect(result.comfort).toBe(0);
    expect(result.boundaries).toBe(0);
  });

  it('handles missing questions for one dimension', () => {
    const responses = [r('IC1', 5), r('IC2', 5), r('IC3', 5)];
    const result = scoreIntimacy(responses);
    expect(result.comfort).toBe(100);
    expect(result.boundaries).toBe(0); // No boundary questions
  });

  it('calculates dimensions independently', () => {
    const responses = [
      r('IC1', 5), r('IC2', 5), r('IC3', 5), // comfort = 100
      r('BA1', 1), r('BA2', 1), r('BA3', 5), // boundary = 0 (BA3 rev→1)
    ];
    const result = scoreIntimacy(responses);
    expect(result.comfort).toBe(100);
    expect(result.boundaries).toBe(0);
  });
});

// ============================================================================
// LOVE LANGUAGES SCORING
// 5 languages × 2 questions (give/receive) = 10 questions
// ============================================================================

describe('scoreLoveLanguages', () => {
  it('ranks languages by combined score (highest first)', () => {
    const responses = bulkResponses({
      LL1: 5, LL2: 5,   // words = 100
      LL3: 4, LL4: 4,   // time = 75
      LL5: 3, LL6: 3,   // service = 50
      LL7: 2, LL8: 2,   // gifts = 25
      LL9: 1, LL10: 1,  // touch = 0
    });
    const result = scoreLoveLanguages(responses);
    expect(result.ranked).toEqual(['words', 'time', 'service', 'gifts', 'touch']);
    expect(result.scores.words).toBe(100);
    expect(result.scores.touch).toBe(0);
  });

  it('tracks give and receive separately', () => {
    const responses = bulkResponses({
      LL1: 5, LL2: 1,   // words: give=100, receive=0
      LL3: 1, LL4: 5,   // time: give=0, receive=100
      LL5: 3, LL6: 3,
      LL7: 3, LL8: 3,
      LL9: 3, LL10: 3,
    });
    const result = scoreLoveLanguages(responses);
    expect(result.giveReceive.words).toEqual({ give: 100, receive: 0 });
    expect(result.giveReceive.time).toEqual({ give: 0, receive: 100 });
  });

  it('combined score is average of give and receive', () => {
    const responses = bulkResponses({
      LL1: 5, LL2: 1,   // words: (100+0)/2 avg raw = (5+1)/2 = 3 → 50
      LL3: 3, LL4: 3,
      LL5: 3, LL6: 3,
      LL7: 3, LL8: 3,
      LL9: 3, LL10: 3,
    });
    const result = scoreLoveLanguages(responses);
    expect(result.scores.words).toBe(50);
  });

  it('handles missing responses for a language', () => {
    const responses = bulkResponses({
      LL3: 5, LL4: 5,   // time = 100
      LL5: 3, LL6: 3,
      LL7: 3, LL8: 3,
      LL9: 3, LL10: 3,
    });
    // LL1, LL2 missing → words = 0
    const result = scoreLoveLanguages(responses);
    expect(result.scores.words).toBe(0);
    expect(result.scores.time).toBe(100);
  });
});

// ============================================================================
// CALCULATE ALL RESULTS (Integration)
// ============================================================================

describe('calculateAllResults', () => {
  it('returns complete QuizResults object with all sections', () => {
    const responses = bulkResponses({
      // Attachment
      S1: 5, S2: 5, S3: 5, AX1: 1, AX2: 1, AX3: 1,
      AV1: 1, AV2: 1, AV3: 1, D1: 1, D2: 1, D3: 1,
      // Communication
      COM_PASSIVE_1: 1, COM_PASSIVE_2: 1,
      COM_AGGRESSIVE_1: 1, COM_AGGRESSIVE_2: 1,
      COM_PAGG_1: 1, COM_PAGG_2: 1,
      COM_ASSERTIVE_1: 5, COM_ASSERTIVE_2: 5,
      // Confidence (with reverse adjustment)
      C1: 5, C2: 1, C3: 5, C4: 1, C5: 5,
      // Emotional (with reverse adjustment)
      EA1: 5, EA2: 1, EA3: 5, EA4: 1, EA5: 5,
      // Intimacy (with reverse adjustment)
      IC1: 5, IC2: 5, IC3: 5, BA1: 5, BA2: 5, BA3: 1,
      // Love Languages
      LL1: 5, LL2: 5, LL3: 3, LL4: 3, LL5: 3, LL6: 3,
      LL7: 3, LL8: 3, LL9: 3, LL10: 3,
    });

    const result = calculateAllResults(responses);

    expect(result.attachment.primary).toBe('secure');
    expect(result.attachment.scores.secure).toBe(100);
    expect(result.communication.primary).toBe('assertive');
    expect(result.confidence).toBe(100);
    expect(result.emotional).toBe(100);
    expect(result.intimacy.comfort).toBe(100);
    expect(result.intimacy.boundaries).toBe(100);
    expect(result.loveLanguages.ranked[0]).toBe('words');
  });
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

describe('isQuizComplete', () => {
  it('returns false for empty responses', () => {
    expect(isQuizComplete([])).toBe(false);
  });

  it('returns false for partial responses', () => {
    const responses = [r('S1', 5), r('S2', 5)];
    expect(isQuizComplete(responses)).toBe(false);
  });

  it('returns true when all 48 questions answered', () => {
    // Create responses for all question IDs (48 total)
    const allIds = [
      'S1', 'S2', 'S3', 'AX1', 'AX2', 'AX3', 'AV1', 'AV2', 'AV3', 'D1', 'D2', 'D3',
      'COM_PASSIVE_1', 'COM_PASSIVE_2', 'COM_AGGRESSIVE_1', 'COM_AGGRESSIVE_2',
      'COM_PAGG_1', 'COM_PAGG_2', 'COM_ASSERTIVE_1', 'COM_ASSERTIVE_2', 'COM_SCENARIO_1',
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
      'EA1', 'EA2', 'EA3', 'EA4', 'EA5',
      'IC1', 'IC2', 'IC3', 'BA1', 'BA2', 'BA3',
      'LL1', 'LL2', 'LL3', 'LL4', 'LL5', 'LL6', 'LL7', 'LL8', 'LL9', 'LL10',
    ];
    const responses = allIds.map(id =>
      id === 'COM_SCENARIO_1' ? r(id, 0, 'D') : r(id, 3)
    );
    expect(isQuizComplete(responses)).toBe(true);
  });
});

describe('getCompletionPercentage', () => {
  it('returns 0 for empty responses', () => {
    expect(getCompletionPercentage([])).toBe(0);
  });

  it('calculates percentage correctly', () => {
    // 48 total questions, so 48 responses = 100%
    const responses = Array.from({ length: 48 }, (_, i) => r(`Q${i}`, 3));
    expect(getCompletionPercentage(responses)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    // 1 out of 48 = 2.08% → rounds to 2%
    expect(getCompletionPercentage([r('S1', 5)])).toBe(2);
  });
});

describe('mapToResponses and getResponseMap', () => {
  it('converts map to responses and back', () => {
    const original = { S1: 5, S2: 4, COM_SCENARIO_1: 'D' };
    const responses = mapToResponses(original);
    const backToMap = getResponseMap(responses);

    expect(backToMap.S1).toBe(5);
    expect(backToMap.S2).toBe(4);
    expect(backToMap.COM_SCENARIO_1).toBe('D');
  });

  it('handles scenario questions with selectedKey', () => {
    const responses = mapToResponses({ COM_SCENARIO_1: 'B' });
    expect(responses[0].selectedKey).toBe('B');
    expect(responses[0].value).toBe(0);
  });
});
