import { describe, expect, it } from 'vitest'
import { nextIntervalAndEase, scheduleNextReview, reviewUrgency } from '@/lib/srs/scheduler'
import { createInitialProgress } from '@/lib/srs/types'

describe('nextIntervalAndEase', () => {
  it('resets on low grades', () => {
    const r = nextIntervalAndEase(2, 6, 2.0, 2)
    expect(r.repetitions).toBe(0)
    expect(r.intervalDays).toBe(1)
  })

  it('expands intervals after early repetitions', () => {
    const first = nextIntervalAndEase(0, 0, 2.0, 5)
    expect(first.repetitions).toBe(1)
    expect(first.intervalDays).toBe(1)

    const second = nextIntervalAndEase(1, first.intervalDays, first.ease, 5)
    expect(second.repetitions).toBe(2)
    expect(second.intervalDays).toBe(6)
  })
})

describe('scheduleNextReview', () => {
  it('increments streak on correct answers', () => {
    const now = 1_000_000
    const p = createInitialProgress('a', now)
    const next = scheduleNextReview(p, true, false, now + 1000)
    expect(next.correctCount).toBe(1)
    expect(next.streak).toBe(1)
    expect(next.incorrectCount).toBe(0)
  })

  it('resets streak and schedules sooner on incorrect answers', () => {
    const now = 1_000_000
    const p = createInitialProgress('a', now)
    const warmed = scheduleNextReview(p, true, false, now + 1000)
    const fail = scheduleNextReview(warmed, false, false, now + 2000)
    expect(fail.streak).toBe(0)
    expect(fail.incorrectCount).toBe(1)
    expect(fail.nextReviewAt).toBeLessThan(warmed.nextReviewAt)
  })
})

describe('reviewUrgency', () => {
  it('ranks overdue items higher', () => {
    const now = 10_000_000
    const a = createInitialProgress('a', now)
    a.nextReviewAt = now - 1000
    const b = createInitialProgress('b', now)
    b.nextReviewAt = now + 100_000
    expect(reviewUrgency(a, now)).toBeGreaterThan(reviewUrgency(b, now))
  })
})
