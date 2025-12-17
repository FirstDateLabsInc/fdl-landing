# Archetype Character Images Implementation

## Summary

16 archetype character images using 4×4 matrix (Attachment × Communication). Each archetype has an animal character PNG image displayed on results page.

---

## Image Location

Add 16 PNG files to this directory:

```
app/public/archetypes/
├── golden-partner-goldenRetriever.png
├── gentle-peacekeeper-dove.png
├── direct-director-gorilla.png
├── playful-tease-fox.png
├── open-book-puppy.png
├── selfless-giver-koala.png
├── fiery-pursuer-cheetah.png
├── mind-reader-owl.png
├── solo-voyager-eagle.png
├── quiet-ghost-turtle.png
├── iron-fortress-armadillo.png
├── cool-mystery-cat.png
├── self-aware-alchemist-octopus.png
├── chameleon-chameleon.png
├── wild-storm-bull.png
└── labyrinth-snake.png
```

**Naming convention:** `{archetype-id}-{animalCamelCase}.png`

---

## 4×4 Archetype Matrix

| | Assertive | Passive | Aggressive | Passive-Aggressive |
|---|-----------|---------|------------|-------------------|
| **Secure** | Golden Partner (Golden Retriever) | Gentle Peacekeeper (Dove) | Direct Director (Gorilla) | Playful Tease (Fox) |
| **Anxious** | Open Book (Puppy) | Selfless Giver (Koala) | Fiery Pursuer (Cheetah) | Mind Reader (Owl) |
| **Avoidant** | Solo Voyager (Eagle) | Quiet Ghost (Turtle) | Iron Fortress (Armadillo) | Cool Mystery (Cat) |
| **Disorganized** | Self-Aware Alchemist (Octopus) | Chameleon (Chameleon) | Wild Storm (Bull) | Labyrinth (Snake) |

---

## All 16 Archetypes Reference

| ID | Name | Animal | Filename |
|----|------|--------|----------|
| `golden-partner` | The Golden Partner | Golden Retriever | `golden-partner-goldenRetriever.png` |
| `gentle-peacekeeper` | The Gentle Peacekeeper | Dove | `gentle-peacekeeper-dove.png` |
| `direct-director` | The Direct Director | Gorilla | `direct-director-gorilla.png` |
| `playful-tease` | The Playful Tease | Fox | `playful-tease-fox.png` |
| `open-book` | The Open Book | Puppy | `open-book-puppy.png` |
| `selfless-giver` | The Selfless Giver | Koala | `selfless-giver-koala.png` |
| `fiery-pursuer` | The Fiery Pursuer | Cheetah | `fiery-pursuer-cheetah.png` |
| `mind-reader` | The Mind Reader | Owl | `mind-reader-owl.png` |
| `solo-voyager` | The Solo Voyager | Eagle | `solo-voyager-eagle.png` |
| `quiet-ghost` | The Quiet Ghost | Turtle | `quiet-ghost-turtle.png` |
| `iron-fortress` | The Iron Fortress | Armadillo | `iron-fortress-armadillo.png` |
| `cool-mystery` | The Cool Mystery | Cat | `cool-mystery-cat.png` |
| `self-aware-alchemist` | The Self-Aware Alchemist | Octopus | `self-aware-alchemist-octopus.png` |
| `chameleon` | The Chameleon | Chameleon | `chameleon-chameleon.png` |
| `wild-storm` | The Wild Storm | Bull | `wild-storm-bull.png` |
| `labyrinth` | The Labyrinth | Snake | `labyrinth-snake.png` |

---

## Image Specifications

- **Format:** PNG
- **Location:** `app/public/archetypes/`
- **Naming:** `{archetype-id}-{animalCamelCase}.png`
- **Recommended size:** 400×400px or larger for retina displays
- **Display size:** ~192×192px (h-48 w-48 in Tailwind)

---

## Implementation Status

Files modified:

| File | Change |
|------|--------|
| `app/src/lib/quiz/types.ts` | Added `image: string` to Archetype interface |
| `app/src/lib/quiz/archetypes.ts` | Complete rewrite: 16 archetypes + matrix lookup |
| `app/src/components/quiz/QuizContainer.tsx` | Removed `confidence` param from getArchetype() |
| `app/src/components/quiz/results/ProfileSummary.tsx` | Displays image with Next.js Image component |
| `app/src/app/quiz/results/page.tsx` | Updated stored archetype fields |
| `app/src/app/quiz/questions/page.tsx` | Added image field to localStorage storage |
