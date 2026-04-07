# Learning method

Tamil Trainer optimizes for **real conversation** as early as possible: small batches of new words, immediate feedback, interleaved review, and **spaced repetition** on the client.

## Core ideas

1. **Spaced repetition** — Each vocabulary item tracks exposures, correctness, streak, ease, and next review time using an SM-2-inspired scheduler (`src/lib/srs/scheduler.ts`).
2. **Retrieval practice** — Exercises ask you to recall meanings, forms, and matches rather than passively reading.
3. **Frequency-first vocabulary** — Earlier items skew toward high-utility spoken Tamil; `frequencyPriority` orders long-term expansion.
4. **Communicative grouping** — Lessons cluster words that combine into mini-dialogues (greetings + responses + politeness).
5. **Gradual unlocking** — Completing a lesson unlocks the next; infinite retries are always allowed.
6. **Adaptive review** — Missed items return sooner; stable items stretch intervals. Hints count as softer grades for scheduling.
7. **Interleaving** — Lessons can mix a few due review items with new material (`buildLessonExercises`).
8. **Immediate feedback** — Each card reveals correctness right away; there is no penalty for repeating.
9. **Short loops** — Sessions are intentionally compact; recap summarizes strengths and weak spots.
10. **Progression** — Words → short phrases → dialogues as stages advance (roadmap in `docs/curriculum-roadmap.md`).

## Pronunciation

Playback prefers **local audio** when present. Otherwise the app uses **browser speech synthesis** and clearly labels it as **approximate**, because voices differ by OS/browser and Tamil voice availability varies.

Tamil script, transliteration, and EN/ES approximation strings are always visible so you can cross-check even without ideal audio.

## What “retention” means here

The “retention estimate” in stats is a **lightweight heuristic** from ease and streak — motivating feedback, not a clinical measurement.
