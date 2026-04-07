import type { WordProgress } from '@/lib/srs/types'
import { createInitialProgress } from '@/lib/srs/types'

const MS_PER_DAY = 86_400_000
const MIN_EASE = 1.3
const MAX_EASE = 2.6

export type Grade = 0 | 1 | 2 | 3 | 4 | 5

/**
 * SM-2 ease update. q < 3 is failure.
 * @see SuperMemo 2 algorithm (simplified)
 */
export function nextIntervalAndEase(
  repetitions: number,
  previousIntervalDays: number,
  ease: number,
  q: Grade,
): { repetitions: number; intervalDays: number; ease: number } {
  let nextEase =
    ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEase = Math.min(MAX_EASE, Math.max(MIN_EASE, nextEase))

  if (q < 3) {
    return { repetitions: 0, intervalDays: 1, ease: Math.max(MIN_EASE, ease - 0.2) }
  }

  const rep = repetitions + 1
  let interval: number
  if (rep === 1) {
    interval = 1
  } else if (rep === 2) {
    interval = 6
  } else {
    interval = Math.round(previousIntervalDays * nextEase)
  }
  interval = Math.min(365, Math.max(1, interval))
  return { repetitions: rep, intervalDays: interval, ease: nextEase }
}

function gradeFromCorrect(correct: boolean, usedHint: boolean): Grade {
  if (!correct) return 2
  if (usedHint) return 3
  return 5
}

export function scheduleNextReview(
  progress: WordProgress,
  correct: boolean,
  usedHint: boolean,
  now: number,
): WordProgress {
  const q = gradeFromCorrect(correct, usedHint)
  const { repetitions, intervalDays, ease } = nextIntervalAndEase(
    progress.repetitions,
    progress.intervalDays || 1,
    progress.ease,
    q,
  )

  const nextReviewAt = now + intervalDays * MS_PER_DAY

  const next: WordProgress = {
    ...progress,
    exposures: progress.exposures + 1,
    lastSeenAt: now,
    ease,
    repetitions,
    intervalDays,
    nextReviewAt,
    hintOrHesitationCount: progress.hintOrHesitationCount + (usedHint ? 1 : 0),
  }

  if (correct) {
    next.correctCount = progress.correctCount + 1
    next.streak = progress.streak + 1
    next.incorrectCount = progress.incorrectCount
    if (progress.firstCorrectAt === null) {
      next.firstCorrectAt = now
    } else {
      next.firstCorrectAt = progress.firstCorrectAt
    }
  } else {
    next.incorrectCount = progress.incorrectCount + 1
    next.streak = 0
    next.correctCount = progress.correctCount
    next.firstCorrectAt = progress.firstCorrectAt
    next.repetitions = 0
    next.intervalDays = 1
    next.nextReviewAt = now + MS_PER_DAY / 4
    next.ease = Math.max(MIN_EASE, progress.ease - 0.2)
  }

  return next
}

export function ensureProgress(itemId: string, existing: WordProgress | undefined, now: number) {
  return existing ?? createInitialProgress(itemId, now)
}

/** Urgency score for sorting review queue: higher = review sooner. */
export function reviewUrgency(p: WordProgress, now: number): number {
  const overdueMs = now - p.nextReviewAt
  const incorrectWeight = p.incorrectCount * 2
  const lowStreak = p.streak < 2 ? 1.5 : 1
  return overdueMs * lowStreak + incorrectWeight * MS_PER_DAY
}
