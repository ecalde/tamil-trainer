# Content schema

Curriculum data is defined in TypeScript (`src/content/seed/curriculum.ts`), parsed with **Zod** (`src/content/schema.ts`, `src/content/validate.ts`), and exposed as `curriculum` + `itemMap` from `src/content/index.ts`.

## `VocabularyItem`

| Field | Purpose |
| --- | --- |
| `id` | Stable kebab-case identifier referenced by lessons. |
| `tamil` | Tamil script (primary display). |
| `transliteration` | Latin transliteration for learners. |
| `englishMeaning` / `spanishMeaning` | Parallel glosses for EN/ES support. |
| `englishApproxPronunciation` / `spanishApproxPronunciation` | Friendly approximations — **not** narrow IPA. |
| `partOfSpeech` | Optional enum (`noun`, `verb`, `phrase`, …). |
| `tags` | Topic / function tags (e.g. `greetings`, `stage-1`). |
| `frequencyPriority` | Lower = introduce earlier within the long-term roadmap. |
| `difficulty` | 1–5 weight for scheduling emphasis. |
| `exampleSentence` | Optional Tamil + transliteration + EN/ES gloss. |
| `registerNote` | Politeness / register hints. |
| `audio` | Optional list of `{ url, label? }` pointing at **local** assets under `public/`. |
| `writing` | Reserved `{ enabled?: false }` hook for future Tamil **writing** drills without breaking readers. |

## `Lesson`

| Field | Purpose |
| --- | --- |
| `id` | Unique lesson id. |
| `stageId` | Groups lessons into roadmap stages. |
| `orderIndex` | Ordering within a stage. |
| `titleEn` / `titleEs` | Bilingual titles. |
| `descriptionEn` / `descriptionEs` | Learner-facing blurbs. |
| `newItemIds` | Vocabulary introduced in this lesson. |
| `exerciseTypes` | Allowed exercise kinds (superset; MVP uses a subset). |
| `estimatedMinutes` | Informational. |

## `Stage`

Stages bundle lessons for the path UI and documentation. `lessonIds` must reference real lessons.

## Validation

`parseCurriculum` ensures:

- Unique vocabulary ids.
- Unique lesson ids.
- All `newItemIds` exist.
- All stage `lessonIds` exist.

## Future: Tamil script writing

Add optional fields or expand `writing` once writing mode ships; keep backward compatibility by making new fields optional and defaulting display to existing `tamil` text.
