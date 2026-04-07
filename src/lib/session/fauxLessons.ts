import type { ExerciseType, Lesson } from '@/content/schema'

const defaultExerciseTypes: ExerciseType[] = [
  'multiple_choice_meaning',
  'meaning_to_tamil',
  'transliteration_recognition',
  'word_matching',
  'fill_in_blank',
  'tap_order',
]

export function buildReviewLesson(itemIds: string[]): Lesson {
  return {
    id: 'internal-review-queue',
    stageId: 'stage-1',
    orderIndex: 999,
    titleEn: 'Review queue',
    titleEs: 'Cola de repaso',
    descriptionEn: 'Adaptive review for items that are due.',
    descriptionEs: 'Repaso adaptivo para ítems pendientes.',
    newItemIds: itemIds,
    exerciseTypes: [...defaultExerciseTypes],
    estimatedMinutes: 8,
  }
}

export function buildHardWordsLesson(itemIds: string[]): Lesson {
  return {
    id: 'internal-hard-words',
    stageId: 'stage-1',
    orderIndex: 998,
    titleEn: 'Hard words',
    titleEs: 'Palabras difíciles',
    descriptionEn: 'Extra practice for items you have missed recently.',
    descriptionEs: 'Práctica extra para lo que más ha costado.',
    newItemIds: itemIds,
    exerciseTypes: [...defaultExerciseTypes],
    estimatedMinutes: 8,
  }
}
