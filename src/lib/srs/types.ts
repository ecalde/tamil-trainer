export type WordProgress = {
  itemId: string
  exposures: number
  correctCount: number
  incorrectCount: number
  streak: number
  lastSeenAt: number
  /** SM-2-like ease factor, typically 1.3–2.5 */
  ease: number
  /** Unix ms when this item should be reviewed again */
  nextReviewAt: number
  hintOrHesitationCount: number
  /** First time user answered correctly (for "new words learned" stats). */
  firstCorrectAt: number | null
  /** Successful repetition count for SM-2 interval steps */
  repetitions: number
  /** Last scheduled interval in days (after last successful graded review). */
  intervalDays: number
}

export function createInitialProgress(itemId: string, now: number): WordProgress {
  return {
    itemId,
    exposures: 0,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    lastSeenAt: now,
    ease: 2.0,
    nextReviewAt: now,
    hintOrHesitationCount: 0,
    firstCorrectAt: null,
    repetitions: 0,
    intervalDays: 0,
  }
}
