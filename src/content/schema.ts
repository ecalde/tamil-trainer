import { z } from 'zod'

/** Safe relative URL under `public/` or site root (no arbitrary remote URLs in MVP). */
const safeAssetUrl = z
  .string()
  .max(512)
  .refine(
    (u) =>
      u.startsWith('/') ||
      u.startsWith('./') ||
      u.startsWith('../') ||
      u.startsWith('data:audio/'),
    'Audio URL must be a local path or data URL',
  )

export const partOfSpeechSchema = z.enum([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'particle',
  'interjection',
  'phrase',
  'determiner',
  'question',
  'number',
  'other',
])

export type PartOfSpeech = z.infer<typeof partOfSpeechSchema>

export const exampleSentenceSchema = z.object({
  tamil: z.string().min(1).max(500),
  transliteration: z.string().min(1).max(500),
  english: z.string().min(1).max(500),
  spanish: z.string().min(1).max(500),
})

export type ExampleSentence = z.infer<typeof exampleSentenceSchema>

export const audioSourceSchema = z.object({
  url: safeAssetUrl,
  label: z.string().max(120).optional(),
})

export type AudioSource = z.infer<typeof audioSourceSchema>

/**
 * One learnable unit. Tamil script lives in `tamil`; optional `tamilScriptAlt`
 * reserved for future orthography variants without breaking callers.
 */
export const vocabularyItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'Use kebab-case ids'),
  tamil: z.string().min(1).max(500),
  /** Latin transliteration (readable to English/Spanish speakers). */
  transliteration: z.string().min(1).max(500),
  englishMeaning: z.string().min(1).max(500),
  spanishMeaning: z.string().min(1).max(500),
  englishApproxPronunciation: z.string().min(1).max(500),
  spanishApproxPronunciation: z.string().min(1).max(500),
  partOfSpeech: partOfSpeechSchema.optional(),
  tags: z.array(z.string().min(1).max(64)).max(32),
  /** 1 = core conversational frequency; higher = introduce later. */
  frequencyPriority: z.number().int().min(1).max(10_000),
  /** 1 easiest — 5 hardest for scheduling weights. */
  difficulty: z.number().int().min(1).max(5),
  exampleSentence: exampleSentenceSchema.optional(),
  registerNote: z.string().max(500).optional(),
  audio: z.array(audioSourceSchema).max(8).optional(),
  /** Hook for future Tamil script writing drills without refactoring consumers. */
  writing: z
    .object({
      enabled: z.literal(false).optional(),
    })
    .optional(),
})

export type VocabularyItem = z.infer<typeof vocabularyItemSchema>

export const exerciseTypeSchema = z.enum([
  'multiple_choice_meaning',
  'audio_meaning',
  'meaning_to_tamil',
  'transliteration_recognition',
  'pronunciation_listen',
  'word_matching',
  'fill_in_blank',
  'tap_order',
  'adaptive_review',
  'hard_words_session',
])

export type ExerciseType = z.infer<typeof exerciseTypeSchema>

export const lessonSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9][a-z0-9-]*$/),
  stageId: z.string().min(1).max(64),
  orderIndex: z.number().int().min(0),
  titleEn: z.string().min(1).max(200),
  titleEs: z.string().min(1).max(200),
  descriptionEn: z.string().min(1).max(2000),
  descriptionEs: z.string().min(1).max(2000),
  /** Vocabulary item ids introduced in this lesson (subset of curriculum). */
  newItemIds: z.array(z.string()).min(1).max(200),
  /** Exercise types this lesson may use (MVP uses first 4–6). */
  exerciseTypes: z.array(exerciseTypeSchema).min(1).max(32),
  /** Estimated minutes for one pass (informational). */
  estimatedMinutes: z.number().min(1).max(120),
})

export type Lesson = z.infer<typeof lessonSchema>

export const stageSchema = z.object({
  id: z.string().min(1).max(64),
  orderIndex: z.number().int().min(0),
  titleEn: z.string().min(1).max(200),
  titleEs: z.string().min(1).max(200),
  summaryEn: z.string().min(1).max(2000),
  summaryEs: z.string().min(1).max(2000),
  lessonIds: z.array(z.string()).min(1).max(200),
})

export type Stage = z.infer<typeof stageSchema>

export const curriculumSchema = z.object({
  version: z.number().int().min(1),
  localeDefault: z.enum(['en', 'es']),
  items: z.array(vocabularyItemSchema).min(1),
  stages: z.array(stageSchema).min(1),
  lessons: z.array(lessonSchema).min(1),
})

export type Curriculum = z.infer<typeof curriculumSchema>

export function buildItemMap(curriculum: Curriculum): Map<string, VocabularyItem> {
  const map = new Map<string, VocabularyItem>()
  for (const item of curriculum.items) {
    if (map.has(item.id)) {
      throw new Error(`Duplicate vocabulary id: ${item.id}`)
    }
    map.set(item.id, item)
  }
  return map
}

export function validateCurriculumReferences(c: Curriculum): void {
  const ids = buildItemMap(c)
  const lessonIds = new Set<string>()
  for (const lesson of c.lessons) {
    if (lessonIds.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`)
    lessonIds.add(lesson.id)
    for (const itemId of lesson.newItemIds) {
      if (!ids.has(itemId)) {
        throw new Error(`Lesson ${lesson.id} references unknown item ${itemId}`)
      }
    }
  }
  for (const stage of c.stages) {
    for (const lid of stage.lessonIds) {
      if (!lessonIds.has(lid)) throw new Error(`Stage ${stage.id} references unknown lesson ${lid}`)
    }
  }
}
