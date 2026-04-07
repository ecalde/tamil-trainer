import type { Lesson, VocabularyItem } from '@/content/schema'
import type { LearnerLocale } from '@/lib/session/types'

export type ExerciseKind =
  | 'multiple_choice_meaning'
  | 'meaning_to_tamil'
  | 'transliteration_recognition'
  | 'word_matching'
  | 'fill_in_blank'
  | 'tap_order'

export type McExercise = {
  id: string
  kind: 'multiple_choice_meaning'
  itemId: string
  prompt: string
  options: { id: string; label: string }[]
  correctOptionId: string
}

export type MeaningToTamilExercise = {
  id: string
  kind: 'meaning_to_tamil'
  itemId: string
  prompt: string
  options: { id: string; labelTamil: string; labelTranslit: string }[]
  correctOptionId: string
}

export type TranslitRecognitionExercise = {
  id: string
  kind: 'transliteration_recognition'
  itemId: string
  transliteration: string
  tamil: string
  prompt: string
  options: { id: string; label: string }[]
  correctOptionId: string
}

export type WordMatchingExercise = {
  id: string
  kind: 'word_matching'
  pairs: { itemId: string; tamil: string; transliteration: string; meaning: string }[]
}

export type FillBlankExercise = {
  id: string
  kind: 'fill_in_blank'
  itemId: string
  prompt: string
  blankLabel: string
  options: { id: string; label: string }[]
  correctOptionId: string
}

export type TapOrderExercise = {
  id: string
  kind: 'tap_order'
  itemId: string
  prompt: string
  /** Tokens in correct order (lowercased). */
  targetTokens: string[]
  /** Shuffled for UI. */
  tokens: string[]
}

export type BuiltExercise =
  | McExercise
  | MeaningToTamilExercise
  | TranslitRecognitionExercise
  | WordMatchingExercise
  | FillBlankExercise
  | TapOrderExercise

export function collectItemIds(exercise: BuiltExercise): string[] {
  if (exercise.kind === 'word_matching') {
    return exercise.pairs.map((p) => p.itemId)
  }
  return [exercise.itemId]
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function pickDistractors(
  pool: VocabularyItem[],
  answer: VocabularyItem,
  n: number,
  rng: () => number,
): VocabularyItem[] {
  const others = pool.filter((p) => p.id !== answer.id)
  return shuffle(others, rng).slice(0, n)
}

function meaningLabel(item: VocabularyItem, locale: LearnerLocale) {
  return locale === 'es' ? item.spanishMeaning : item.englishMeaning
}

let stepCounter = 0
function eid() {
  stepCounter += 1
  return `ex-${stepCounter}`
}

export function buildLessonExercises(
  lesson: Lesson,
  itemsById: Map<string, VocabularyItem>,
  reviewItemIds: string[],
  locale: LearnerLocale,
  rng: () => number = Math.random,
): BuiltExercise[] {
  stepCounter = 0
  const newItems = lesson.newItemIds.map((id) => itemsById.get(id)).filter(Boolean) as VocabularyItem[]
  const reviewItems = reviewItemIds
    .map((id) => itemsById.get(id))
    .filter(Boolean) as VocabularyItem[]

  const poolIds = new Set<string>([...lesson.newItemIds, ...reviewItemIds])
  const pool = [...poolIds].map((id) => itemsById.get(id)).filter(Boolean) as VocabularyItem[]

  const steps: BuiltExercise[] = []

  // Multiple choice meaning — cover each new item once
  for (const item of shuffle(newItems, rng)) {
    const distractors = pickDistractors(pool, item, 3, rng)
    const options = shuffle(
      [
        { id: item.id, label: meaningLabel(item, locale) },
        ...distractors.map((d) => ({ id: d.id, label: meaningLabel(d, locale) })),
      ],
      rng,
    )
    steps.push({
      id: eid(),
      kind: 'multiple_choice_meaning',
      itemId: item.id,
      prompt: locale === 'es' ? '¿Qué significa esto?' : 'What does this mean?',
      options,
      correctOptionId: item.id,
    })
  }

  // Transliteration recognition — subset
  for (const item of shuffle(newItems, rng).slice(0, Math.min(4, newItems.length))) {
    const distractors = pickDistractors(pool, item, 3, rng)
    const options = shuffle(
      [
        { id: item.id, label: meaningLabel(item, locale) },
        ...distractors.map((d) => ({ id: d.id, label: meaningLabel(d, locale) })),
      ],
      rng,
    )
    steps.push({
      id: eid(),
      kind: 'transliteration_recognition',
      itemId: item.id,
      transliteration: item.transliteration,
      tamil: item.tamil,
      prompt:
        locale === 'es'
          ? 'Elige el significado que coincide con la transliteración.'
          : 'Pick the meaning that matches the transliteration.',
      options,
      correctOptionId: item.id,
    })
  }

  // Meaning → Tamil — subset
  for (const item of shuffle(newItems, rng).slice(0, Math.min(4, newItems.length))) {
    const distractors = pickDistractors(pool, item, 3, rng)
    const options = shuffle(
      [
        {
          id: item.id,
          labelTamil: item.tamil,
          labelTranslit: item.transliteration,
        },
        ...distractors.map((d) => ({
          id: d.id,
          labelTamil: d.tamil,
          labelTranslit: d.transliteration,
        })),
      ],
      rng,
    )
    steps.push({
      id: eid(),
      kind: 'meaning_to_tamil',
      itemId: item.id,
      prompt:
        locale === 'es'
          ? `Elige la opción en tamil para: “${item.spanishMeaning}”`
          : `Choose the Tamil that matches: “${item.englishMeaning}”`,
      options,
      correctOptionId: item.id,
    })
  }

  // Word matching — one card with up to 4 pairs
  const matchSubset = shuffle([...newItems, ...reviewItems], rng).slice(0, 4)
  if (matchSubset.length >= 2) {
    steps.push({
      id: eid(),
      kind: 'word_matching',
      pairs: matchSubset.map((it) => ({
        itemId: it.id,
        tamil: it.tamil,
        transliteration: it.transliteration,
        meaning: meaningLabel(it, locale),
      })),
    })
  }

  // Fill in the blank — simple cloze on transliteration
  const fb = shuffle(newItems, rng)[0]
  if (fb) {
    const tokens = fb.transliteration.split(/\s+/).filter(Boolean)
    if (tokens.length >= 2) {
      const blankIdx = Math.floor(rng() * tokens.length)
      const answerToken = tokens[blankIdx]!
      const masked = tokens.map((t, i) => (i === blankIdx ? '____' : t)).join(' ')
      const distractors = pickDistractors(pool, fb, 3, rng).map((d) => {
        const dt = d.transliteration.split(/\s+/)[0] ?? d.transliteration
        return dt
      })
      const optionTokens = shuffle([answerToken, ...distractors].slice(0, 4), rng)
      const correctIdx = optionTokens.findIndex((t) => t === answerToken)
      steps.push({
        id: eid(),
        kind: 'fill_in_blank',
        itemId: fb.id,
        prompt:
          locale === 'es'
            ? 'Completa la transliteración.'
            : 'Complete the transliteration.',
        blankLabel: masked,
        options: optionTokens.map((t, i) => ({ id: `tok-${i}`, label: t })),
        correctOptionId: `tok-${correctIdx}`,
      })
    }
  }

  // Tap order — one phrase
  const tap = shuffle(newItems, rng).find((it) => it.transliteration.split(/\s+/).length >= 2)
  if (tap) {
    const rawTok = tap.transliteration.split(/\s+/).map((t) => t.toLowerCase())
    const tokens = shuffle(rawTok, rng)
    steps.push({
      id: eid(),
      kind: 'tap_order',
      itemId: tap.id,
      prompt:
        locale === 'es'
          ? 'Toca las palabras en el orden correcto (transliteración).'
          : 'Tap the words in the correct order (transliteration).',
      targetTokens: rawTok,
      tokens,
    })
  }

  return shuffle(steps, rng)
}
