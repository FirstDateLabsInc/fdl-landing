# Quiz Scoring Algorithm

## Normalization

```
normalize(raw) = round(((raw - 1) / 4) * 100)
```

| Raw | Normalized |
| --- | ---------- |
| 1   | 0          |
| 2   | 25         |
| 3   | 50         |
| 4   | 75         |
| 5   | 100        |

## Reverse Scoring

For questions **C2, C4, EA2, EA4, BA3**:

```
effectiveValue = 6 - rawValue
```

## Section Scoring

### A. Attachment (12 questions)

| Dimension    | Questions     |
| ------------ | ------------- |
| secure       | S1, S2, S3    |
| anxious      | AX1, AX2, AX3 |
| avoidant     | AV1, AV2, AV3 |
| disorganized | D1, D2, D3    |

```
score[dim] = normalize(average(questions))
primary = highest score (ties: secure > anxious > avoidant > disorganized)
```

### B. Communication (9 questions)

| Style              | Likert Questions                   | Scenario Key |
| ------------------ | ---------------------------------- | ------------ |
| passive            | COM_PASSIVE_1, COM_PASSIVE_2       | A            |
| aggressive         | COM_AGGRESSIVE_1, COM_AGGRESSIVE_2 | B            |
| passive_aggressive | COM_PAGG_1, COM_PAGG_2             | C            |
| assertive          | COM_ASSERTIVE_1, COM_ASSERTIVE_2   | D            |

```
score[style] = normalize(average(2 Likert questions))
score[scenario_style] = min(100, score[scenario_style] + 25)
primary = highest score
```

### C. Confidence (5 questions)

Questions: C1, **C2\***, C3, **C4\***, C5 (\*reversed)

```
confidence = normalize(average(all 5, with C2/C4 reversed))
```

### D. Emotional Availability (5 questions)

Questions: EA1, **EA2\***, EA3, **EA4\***, EA5 (\*reversed)

```
emotional = normalize(average(all 5, with EA2/EA4 reversed))
```

### E. Intimacy (6 questions)

| Subscale   | Questions           |
| ---------- | ------------------- |
| comfort    | IC1, IC2, IC3       |
| boundaries | BA1, BA2, **BA3\*** |

\*BA3 is reversed

```
comfort = normalize(average(IC1, IC2, IC3))
boundaries = normalize(average(BA1, BA2, 6-BA3))
```

### F. Love Languages (10 questions)

| Language | Give | Receive |
| -------- | ---- | ------- |
| words    | LL1  | LL2     |
| time     | LL3  | LL4     |
| service  | LL5  | LL6     |
| gifts    | LL7  | LL8     |
| touch    | LL9  | LL10    |

```
giveReceive[lang] = { give: normalize(give_q), receive: normalize(receive_q) }
combined[lang] = normalize(average(give_q, receive_q))
ranked = sort by combined (descending)
```

## Archetype

```
CONFIDENCE_THRESHOLD = 60

if secure:
    if assertive OR confidence >= 60: "confident-anchor"
    else: "steady-connector"

if anxious:
    if confidence >= 60: "devoted-romantic"
    else: "careful-romantic"

if avoidant:
    if confidence >= 60 OR assertive: "independent-spirit"
    else: "private-protector"

if disorganized:
    if confidence >= 60: "complex-soul"
    else: "searching-soul"
```

| Attachment   | Confidence < 60   | Confidence e 60    |
| ------------ | ----------------- | ------------------ |
| secure       | steady-connector  | confident-anchor   |
| anxious      | careful-romantic  | devoted-romantic   |
| avoidant     | private-protector | independent-spirit |
| disorganized | searching-soul    | complex-soul       |
