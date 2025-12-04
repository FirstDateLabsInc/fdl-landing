#!/usr/bin/env python3
"""
Quiz Scoring Validation Script

Independently validates all quiz scoring algorithms by:
1. Re-implementing scoring logic in Python
2. Running comprehensive test cases
3. Outputting JSON report

Usage: python validate_quiz_scoring.py [--json]
"""

import json
import sys
from typing import Dict, List, Optional, Tuple, Any

# =============================================================================
# CONSTANTS (matching questions.ts)
# =============================================================================

REVERSE_QUESTIONS = frozenset(['C2', 'C4', 'EA2', 'EA4', 'BA3'])

ATTACHMENT_QUESTIONS = {
    'secure': ['S1', 'S2', 'S3'],
    'anxious': ['AX1', 'AX2', 'AX3'],
    'avoidant': ['AV1', 'AV2', 'AV3'],
    'disorganized': ['D1', 'D2', 'D3'],
}
ATTACHMENT_ORDER = ['secure', 'anxious', 'avoidant', 'disorganized']

COMMUNICATION_QUESTIONS = {
    'passive': ['COM_PASSIVE_1', 'COM_PASSIVE_2'],
    'aggressive': ['COM_AGGRESSIVE_1', 'COM_AGGRESSIVE_2'],
    'passive_aggressive': ['COM_PAGG_1', 'COM_PAGG_2'],
    'assertive': ['COM_ASSERTIVE_1', 'COM_ASSERTIVE_2'],
}
COMMUNICATION_ORDER = ['passive', 'aggressive', 'passive_aggressive', 'assertive']
SCENARIO_KEY_MAP = {'A': 'passive', 'B': 'aggressive', 'C': 'passive_aggressive', 'D': 'assertive'}

CONFIDENCE_QUESTIONS = ['C1', 'C2', 'C3', 'C4', 'C5']
EMOTIONAL_QUESTIONS = ['EA1', 'EA2', 'EA3', 'EA4', 'EA5']
INTIMACY_COMFORT = ['IC1', 'IC2', 'IC3']
INTIMACY_BOUNDARY = ['BA1', 'BA2', 'BA3']

LOVE_LANGUAGE_QUESTIONS = {
    'words': ('LL1', 'LL2'),
    'time': ('LL3', 'LL4'),
    'service': ('LL5', 'LL6'),
    'gifts': ('LL7', 'LL8'),
    'touch': ('LL9', 'LL10'),
}
LOVE_LANGUAGE_ORDER = ['words', 'time', 'service', 'gifts', 'touch']

CONFIDENCE_THRESHOLD = 60
SCENARIO_BONUS = 25

# =============================================================================
# CORE FUNCTIONS
# =============================================================================

def normalize(raw: float) -> int:
    """Convert 1-5 scale to 0-100."""
    return round(((raw - 1) / 4) * 100)

def get_value(responses: Dict[str, int], qid: str) -> Optional[float]:
    """Get response value with reverse scoring applied."""
    if qid not in responses:
        return None
    val = responses[qid]
    return (6 - val) if qid in REVERSE_QUESTIONS else val

def average(values: List[float]) -> float:
    """Calculate average of non-empty list."""
    return sum(values) / len(values) if values else 0

# =============================================================================
# SCORING FUNCTIONS
# =============================================================================

def score_attachment(responses: Dict[str, int]) -> Dict[str, Any]:
    """Score attachment dimensions, return scores dict and primary."""
    scores = {}
    for dim in ATTACHMENT_ORDER:
        qids = ATTACHMENT_QUESTIONS[dim]
        values = [v for qid in qids if (v := get_value(responses, qid)) is not None]
        scores[dim] = normalize(average(values)) if values else 0

    # Primary: highest score, tie goes to first in order
    primary = max(ATTACHMENT_ORDER, key=lambda d: scores[d])
    return {'scores': scores, 'primary': primary}

def score_communication(responses: Dict[str, int], scenario_key: Optional[str] = None) -> Dict[str, Any]:
    """Score communication styles with scenario bonus."""
    scores = {}
    for style in COMMUNICATION_ORDER:
        qids = COMMUNICATION_QUESTIONS[style]
        values = [v for qid in qids if (v := get_value(responses, qid)) is not None]
        scores[style] = normalize(average(values)) if values else 0

    # Apply scenario bonus
    if scenario_key and scenario_key in SCENARIO_KEY_MAP:
        style = SCENARIO_KEY_MAP[scenario_key]
        scores[style] = min(100, scores[style] + SCENARIO_BONUS)

    # Primary: highest score, tie goes to first in order
    primary = max(COMMUNICATION_ORDER, key=lambda s: scores[s])
    return {'scores': scores, 'primary': primary}

def score_confidence(responses: Dict[str, int]) -> int:
    """Score confidence (C2, C4 reversed)."""
    values = [v for qid in CONFIDENCE_QUESTIONS if (v := get_value(responses, qid)) is not None]
    return normalize(average(values)) if values else 0

def score_emotional(responses: Dict[str, int]) -> int:
    """Score emotional availability (EA2, EA4 reversed)."""
    values = [v for qid in EMOTIONAL_QUESTIONS if (v := get_value(responses, qid)) is not None]
    return normalize(average(values)) if values else 0

def score_intimacy(responses: Dict[str, int]) -> Dict[str, int]:
    """Score intimacy comfort and boundaries (BA3 reversed)."""
    comfort_vals = [v for qid in INTIMACY_COMFORT if (v := get_value(responses, qid)) is not None]
    boundary_vals = [v for qid in INTIMACY_BOUNDARY if (v := get_value(responses, qid)) is not None]
    return {
        'comfort': normalize(average(comfort_vals)) if comfort_vals else 0,
        'boundaries': normalize(average(boundary_vals)) if boundary_vals else 0,
    }

def score_love_languages(responses: Dict[str, int]) -> Dict[str, Any]:
    """Score love languages with give/receive breakdown."""
    scores = {}
    give_receive = {}

    for lang in LOVE_LANGUAGE_ORDER:
        give_qid, receive_qid = LOVE_LANGUAGE_QUESTIONS[lang]
        give_val = get_value(responses, give_qid)
        receive_val = get_value(responses, receive_qid)

        give_receive[lang] = {
            'give': normalize(give_val) if give_val else 0,
            'receive': normalize(receive_val) if receive_val else 0,
        }

        values = [v for v in [give_val, receive_val] if v is not None]
        scores[lang] = normalize(average(values)) if values else 0

    # Rank by combined score (stable sort, highest first)
    ranked = sorted(LOVE_LANGUAGE_ORDER, key=lambda l: scores[l], reverse=True)

    return {'ranked': ranked, 'scores': scores, 'giveReceive': give_receive}

def get_archetype(attachment: str, communication: str, confidence: int) -> str:
    """Determine archetype from attachment, communication, and confidence."""
    high_conf = confidence >= CONFIDENCE_THRESHOLD

    if attachment == 'secure':
        return 'confident-anchor' if (communication == 'assertive' or high_conf) else 'steady-connector'
    if attachment == 'anxious':
        return 'devoted-romantic' if high_conf else 'careful-romantic'
    if attachment == 'avoidant':
        return 'independent-spirit' if (high_conf or communication == 'assertive') else 'private-protector'
    if attachment == 'disorganized':
        return 'complex-soul' if high_conf else 'searching-soul'

    # Communication-based fallbacks
    return {
        'passive': 'diplomatic-dater',
        'aggressive': 'fiery-heart',
        'passive_aggressive': 'subtle-communicator',
        'assertive': 'clear-voice',
    }.get(communication, 'steady-connector')

# =============================================================================
# TEST FRAMEWORK
# =============================================================================

class TestResult:
    def __init__(self, name: str, passed: bool, expected: Any, actual: Any, details: str = ''):
        self.name = name
        self.passed = passed
        self.expected = expected
        self.actual = actual
        self.details = details

def run_test(name: str, expected: Any, actual: Any) -> TestResult:
    passed = expected == actual
    return TestResult(name, passed, expected, actual)

# =============================================================================
# TEST CASES
# =============================================================================

def test_normalization() -> List[TestResult]:
    """Test normalization formula."""
    results = []
    cases = [(1, 0), (2, 25), (3, 50), (4, 75), (5, 100)]
    for raw, expected in cases:
        actual = normalize(raw)
        results.append(run_test(f'normalize({raw})', expected, actual))
    return results

def test_reverse_scoring() -> List[TestResult]:
    """Test reverse scoring logic."""
    results = []

    # C2 reversed: raw 5 -> effective 1
    resp = {'C2': 5}
    actual = get_value(resp, 'C2')
    results.append(run_test('C2 reversed (5->1)', 1.0, actual))

    # Non-reversed: C1 raw 5 -> effective 5
    resp = {'C1': 5}
    actual = get_value(resp, 'C1')
    results.append(run_test('C1 not reversed (5->5)', 5.0, actual))

    # All reversed questions
    for qid in REVERSE_QUESTIONS:
        resp = {qid: 3}
        actual = get_value(resp, qid)
        results.append(run_test(f'{qid} reversed (3->3)', 3.0, actual))

    return results

def test_attachment() -> List[TestResult]:
    """Test attachment scoring."""
    results = []

    # All 5s -> all 100
    resp = {q: 5 for dim in ATTACHMENT_ORDER for q in ATTACHMENT_QUESTIONS[dim]}
    result = score_attachment(resp)
    for dim in ATTACHMENT_ORDER:
        results.append(run_test(f'attachment all 5s: {dim}', 100, result['scores'][dim]))

    # All 1s -> all 0
    resp = {q: 1 for dim in ATTACHMENT_ORDER for q in ATTACHMENT_QUESTIONS[dim]}
    result = score_attachment(resp)
    for dim in ATTACHMENT_ORDER:
        results.append(run_test(f'attachment all 1s: {dim}', 0, result['scores'][dim]))

    # Secure highest -> primary secure
    resp = {'S1': 5, 'S2': 5, 'S3': 5, 'AX1': 1, 'AX2': 1, 'AX3': 1,
            'AV1': 1, 'AV2': 1, 'AV3': 1, 'D1': 1, 'D2': 1, 'D3': 1}
    result = score_attachment(resp)
    results.append(run_test('attachment primary=secure', 'secure', result['primary']))

    # Tie -> first in order (secure)
    resp = {q: 3 for dim in ATTACHMENT_ORDER for q in ATTACHMENT_QUESTIONS[dim]}
    result = score_attachment(resp)
    results.append(run_test('attachment tie->secure', 'secure', result['primary']))

    # Mixed: S=5,4,3 avg=4->75
    resp = {'S1': 5, 'S2': 4, 'S3': 3, 'AX1': 3, 'AX2': 3, 'AX3': 3,
            'AV1': 1, 'AV2': 1, 'AV3': 1, 'D1': 1, 'D2': 1, 'D3': 1}
    result = score_attachment(resp)
    results.append(run_test('attachment mixed S=75', 75, result['scores']['secure']))
    results.append(run_test('attachment mixed AX=50', 50, result['scores']['anxious']))

    return results

def test_communication() -> List[TestResult]:
    """Test communication scoring with scenario bonus."""
    results = []

    # Base scores without scenario
    resp = {'COM_PASSIVE_1': 5, 'COM_PASSIVE_2': 5,
            'COM_AGGRESSIVE_1': 1, 'COM_AGGRESSIVE_2': 1,
            'COM_PAGG_1': 1, 'COM_PAGG_2': 1,
            'COM_ASSERTIVE_1': 1, 'COM_ASSERTIVE_2': 1}
    result = score_communication(resp)
    results.append(run_test('comm passive=100', 100, result['scores']['passive']))
    results.append(run_test('comm primary=passive', 'passive', result['primary']))

    # Scenario bonus +25
    resp = {'COM_PASSIVE_1': 3, 'COM_PASSIVE_2': 3,
            'COM_AGGRESSIVE_1': 3, 'COM_AGGRESSIVE_2': 3,
            'COM_PAGG_1': 3, 'COM_PAGG_2': 3,
            'COM_ASSERTIVE_1': 3, 'COM_ASSERTIVE_2': 3}
    result = score_communication(resp, 'A')
    results.append(run_test('comm scenario A: passive=75', 75, result['scores']['passive']))

    result = score_communication(resp, 'D')
    results.append(run_test('comm scenario D: assertive=75', 75, result['scores']['assertive']))

    # Cap at 100
    resp = {'COM_PASSIVE_1': 5, 'COM_PASSIVE_2': 5,
            'COM_AGGRESSIVE_1': 1, 'COM_AGGRESSIVE_2': 1,
            'COM_PAGG_1': 1, 'COM_PAGG_2': 1,
            'COM_ASSERTIVE_1': 1, 'COM_ASSERTIVE_2': 1}
    result = score_communication(resp, 'A')
    results.append(run_test('comm cap at 100', 100, result['scores']['passive']))

    # Each scenario key mapping
    resp = {'COM_PASSIVE_1': 1, 'COM_PASSIVE_2': 1,
            'COM_AGGRESSIVE_1': 1, 'COM_AGGRESSIVE_2': 1,
            'COM_PAGG_1': 1, 'COM_PAGG_2': 1,
            'COM_ASSERTIVE_1': 1, 'COM_ASSERTIVE_2': 1}
    for key, style in SCENARIO_KEY_MAP.items():
        result = score_communication(resp, key)
        results.append(run_test(f'comm scenario {key}->{style}=25', 25, result['scores'][style]))

    return results

def test_confidence() -> List[TestResult]:
    """Test confidence scoring with reverse scoring."""
    results = []

    # Max (C2,C4 need raw=1 to get effective=5)
    resp = {'C1': 5, 'C2': 1, 'C3': 5, 'C4': 1, 'C5': 5}
    results.append(run_test('confidence max=100', 100, score_confidence(resp)))

    # Min (C2,C4 need raw=5 to get effective=1)
    resp = {'C1': 1, 'C2': 5, 'C3': 1, 'C4': 5, 'C5': 1}
    results.append(run_test('confidence min=0', 0, score_confidence(resp)))

    # All 3s -> 50
    resp = {'C1': 3, 'C2': 3, 'C3': 3, 'C4': 3, 'C5': 3}
    results.append(run_test('confidence neutral=50', 50, score_confidence(resp)))

    # All raw 5s -> [5,1,5,1,5] avg=3.4 -> 60
    resp = {'C1': 5, 'C2': 5, 'C3': 5, 'C4': 5, 'C5': 5}
    results.append(run_test('confidence all raw 5=60', 60, score_confidence(resp)))

    # Empty
    results.append(run_test('confidence empty=0', 0, score_confidence({})))

    return results

def test_emotional() -> List[TestResult]:
    """Test emotional availability scoring."""
    results = []

    # Max (EA2,EA4 need raw=1)
    resp = {'EA1': 5, 'EA2': 1, 'EA3': 5, 'EA4': 1, 'EA5': 5}
    results.append(run_test('emotional max=100', 100, score_emotional(resp)))

    # Min (EA2,EA4 need raw=5)
    resp = {'EA1': 1, 'EA2': 5, 'EA3': 1, 'EA4': 5, 'EA5': 1}
    results.append(run_test('emotional min=0', 0, score_emotional(resp)))

    # All raw 5s -> 60
    resp = {'EA1': 5, 'EA2': 5, 'EA3': 5, 'EA4': 5, 'EA5': 5}
    results.append(run_test('emotional all raw 5=60', 60, score_emotional(resp)))

    return results

def test_intimacy() -> List[TestResult]:
    """Test intimacy scoring."""
    results = []

    # Max both (BA3 needs raw=1)
    resp = {'IC1': 5, 'IC2': 5, 'IC3': 5, 'BA1': 5, 'BA2': 5, 'BA3': 1}
    result = score_intimacy(resp)
    results.append(run_test('intimacy comfort=100', 100, result['comfort']))
    results.append(run_test('intimacy boundary=100', 100, result['boundaries']))

    # Min both (BA3 needs raw=5)
    resp = {'IC1': 1, 'IC2': 1, 'IC3': 1, 'BA1': 1, 'BA2': 1, 'BA3': 5}
    result = score_intimacy(resp)
    results.append(run_test('intimacy comfort=0', 0, result['comfort']))
    results.append(run_test('intimacy boundary=0', 0, result['boundaries']))

    # BA3=5 -> effective 1, avg [5,5,1]=3.67 -> 67
    resp = {'BA1': 5, 'BA2': 5, 'BA3': 5}
    result = score_intimacy(resp)
    results.append(run_test('intimacy BA3 reversed=67', 67, result['boundaries']))

    # Independent dimensions
    resp = {'IC1': 5, 'IC2': 5, 'IC3': 5, 'BA1': 1, 'BA2': 1, 'BA3': 5}
    result = score_intimacy(resp)
    results.append(run_test('intimacy independent comfort', 100, result['comfort']))
    results.append(run_test('intimacy independent boundary', 0, result['boundaries']))

    return results

def test_love_languages() -> List[TestResult]:
    """Test love languages scoring."""
    results = []

    # Clear ranking
    resp = {'LL1': 5, 'LL2': 5, 'LL3': 4, 'LL4': 4, 'LL5': 3, 'LL6': 3,
            'LL7': 2, 'LL8': 2, 'LL9': 1, 'LL10': 1}
    result = score_love_languages(resp)
    results.append(run_test('love ranked order', ['words', 'time', 'service', 'gifts', 'touch'], result['ranked']))
    results.append(run_test('love words=100', 100, result['scores']['words']))
    results.append(run_test('love touch=0', 0, result['scores']['touch']))

    # Give/receive separate
    resp = {'LL1': 5, 'LL2': 1, 'LL3': 1, 'LL4': 5,
            'LL5': 3, 'LL6': 3, 'LL7': 3, 'LL8': 3, 'LL9': 3, 'LL10': 3}
    result = score_love_languages(resp)
    results.append(run_test('love words give=100', 100, result['giveReceive']['words']['give']))
    results.append(run_test('love words receive=0', 0, result['giveReceive']['words']['receive']))
    results.append(run_test('love time give=0', 0, result['giveReceive']['time']['give']))
    results.append(run_test('love time receive=100', 100, result['giveReceive']['time']['receive']))

    # Combined = normalize(avg(raw_give, raw_receive)) = normalize((5+1)/2) = normalize(3) = 50
    results.append(run_test('love words combined=50', 50, result['scores']['words']))

    return results

def test_archetype() -> List[TestResult]:
    """Test archetype determination."""
    results = []

    # Secure + high conf -> confident-anchor
    results.append(run_test('archetype secure+high', 'confident-anchor',
                           get_archetype('secure', 'passive', 70)))

    # Secure + assertive -> confident-anchor
    results.append(run_test('archetype secure+assertive', 'confident-anchor',
                           get_archetype('secure', 'assertive', 40)))

    # Secure + low + not assertive -> steady-connector
    results.append(run_test('archetype secure+low', 'steady-connector',
                           get_archetype('secure', 'passive', 50)))

    # Anxious + high -> devoted-romantic
    results.append(run_test('archetype anxious+high', 'devoted-romantic',
                           get_archetype('anxious', 'passive', 70)))

    # Anxious + low -> careful-romantic
    results.append(run_test('archetype anxious+low', 'careful-romantic',
                           get_archetype('anxious', 'passive', 50)))

    # Avoidant + high -> independent-spirit
    results.append(run_test('archetype avoidant+high', 'independent-spirit',
                           get_archetype('avoidant', 'passive', 70)))

    # Avoidant + assertive -> independent-spirit
    results.append(run_test('archetype avoidant+assertive', 'independent-spirit',
                           get_archetype('avoidant', 'assertive', 40)))

    # Avoidant + low + not assertive -> private-protector
    results.append(run_test('archetype avoidant+low', 'private-protector',
                           get_archetype('avoidant', 'passive', 50)))

    # Disorganized + high -> complex-soul
    results.append(run_test('archetype disorg+high', 'complex-soul',
                           get_archetype('disorganized', 'passive', 70)))

    # Disorganized + low -> searching-soul
    results.append(run_test('archetype disorg+low', 'searching-soul',
                           get_archetype('disorganized', 'passive', 50)))

    # Boundary: confidence=59 (low) vs 60 (high)
    results.append(run_test('archetype boundary 59', 'careful-romantic',
                           get_archetype('anxious', 'passive', 59)))
    results.append(run_test('archetype boundary 60', 'devoted-romantic',
                           get_archetype('anxious', 'passive', 60)))

    return results

def test_integration() -> List[TestResult]:
    """Integration test matching existing TypeScript test."""
    results = []

    resp = {
        # Attachment
        'S1': 5, 'S2': 5, 'S3': 5, 'AX1': 1, 'AX2': 1, 'AX3': 1,
        'AV1': 1, 'AV2': 1, 'AV3': 1, 'D1': 1, 'D2': 1, 'D3': 1,
        # Communication
        'COM_PASSIVE_1': 1, 'COM_PASSIVE_2': 1,
        'COM_AGGRESSIVE_1': 1, 'COM_AGGRESSIVE_2': 1,
        'COM_PAGG_1': 1, 'COM_PAGG_2': 1,
        'COM_ASSERTIVE_1': 5, 'COM_ASSERTIVE_2': 5,
        # Confidence (reverse adjusted)
        'C1': 5, 'C2': 1, 'C3': 5, 'C4': 1, 'C5': 5,
        # Emotional (reverse adjusted)
        'EA1': 5, 'EA2': 1, 'EA3': 5, 'EA4': 1, 'EA5': 5,
        # Intimacy (reverse adjusted)
        'IC1': 5, 'IC2': 5, 'IC3': 5, 'BA1': 5, 'BA2': 5, 'BA3': 1,
        # Love Languages
        'LL1': 5, 'LL2': 5, 'LL3': 3, 'LL4': 3, 'LL5': 3, 'LL6': 3,
        'LL7': 3, 'LL8': 3, 'LL9': 3, 'LL10': 3,
    }

    att = score_attachment(resp)
    results.append(run_test('integration attachment primary', 'secure', att['primary']))
    results.append(run_test('integration attachment secure=100', 100, att['scores']['secure']))

    comm = score_communication(resp)
    results.append(run_test('integration comm primary', 'assertive', comm['primary']))

    results.append(run_test('integration confidence', 100, score_confidence(resp)))
    results.append(run_test('integration emotional', 100, score_emotional(resp)))

    intimacy = score_intimacy(resp)
    results.append(run_test('integration intimacy comfort', 100, intimacy['comfort']))
    results.append(run_test('integration intimacy boundary', 100, intimacy['boundaries']))

    love = score_love_languages(resp)
    results.append(run_test('integration love #1', 'words', love['ranked'][0]))

    return results

# =============================================================================
# MAIN
# =============================================================================

def run_all_tests() -> Tuple[int, int, List[TestResult]]:
    """Run all tests and return (passed, failed, results)."""
    all_results = []

    all_results.extend(test_normalization())
    all_results.extend(test_reverse_scoring())
    all_results.extend(test_attachment())
    all_results.extend(test_communication())
    all_results.extend(test_confidence())
    all_results.extend(test_emotional())
    all_results.extend(test_intimacy())
    all_results.extend(test_love_languages())
    all_results.extend(test_archetype())
    all_results.extend(test_integration())

    passed = sum(1 for r in all_results if r.passed)
    failed = len(all_results) - passed

    return passed, failed, all_results

def main():
    json_output = '--json' in sys.argv

    passed, failed, results = run_all_tests()

    if json_output:
        output = {
            'summary': {'total': len(results), 'passed': passed, 'failed': failed},
            'tests': [
                {'name': r.name, 'passed': r.passed, 'expected': r.expected, 'actual': r.actual}
                for r in results
            ]
        }
        print(json.dumps(output, indent=2))
    else:
        print(f"\n{'='*60}")
        print(f"QUIZ SCORING VALIDATION")
        print(f"{'='*60}\n")

        for r in results:
            status = '✅' if r.passed else '❌'
            print(f"{status} {r.name}")
            if not r.passed:
                print(f"   Expected: {r.expected}")
                print(f"   Actual:   {r.actual}")

        print(f"\n{'='*60}")
        print(f"TOTAL: {passed}/{len(results)} passed")
        if failed > 0:
            print(f"FAILED: {failed} tests")
        else:
            print("ALL TESTS PASSED ✅")
        print(f"{'='*60}\n")

    sys.exit(0 if failed == 0 else 1)

if __name__ == '__main__':
    main()
