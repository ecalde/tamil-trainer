import { describe, expect, it } from 'vitest'
import { aggregateSessionStats, estimatedRetention } from '@/lib/srs/scoring'
import type { WordProgress } from '@/lib/srs/types'
import { createInitialProgress } from '@/lib/srs/types'

function wp(partial: Partial<WordProgress>): WordProgress {
  const base = createInitialProgress('x', 0)
  return { ...base, ...partial }
}

describe('estimatedRetention', () => {
  it('stays within 0-1', () => {
    expect(estimatedRetention(createInitialProgress('a', 0))).toBeGreaterThanOrEqual(0)
    expect(estimatedRetention(createInitialProgress('a', 0))).toBeLessThanOrEqual(1)
  })
})

describe('aggregateSessionStats', () => {
  it('detects newly learned items', () => {
    const before = new Map<string, WordProgress>()
    const after = new Map<string, WordProgress>()
    const p1 = wp({ itemId: 'a', firstCorrectAt: 123, correctCount: 1 })
    after.set('a', p1)
    const stats = aggregateSessionStats(before, after)
    expect(stats.newlyLearned).toContain('a')
  })

  it('flags items with new misses', () => {
    const before = new Map<string, WordProgress>()
    before.set('a', wp({ itemId: 'a', incorrectCount: 0 }))
    const after = new Map<string, WordProgress>()
    after.set('a', wp({ itemId: 'a', incorrectCount: 1 }))
    const stats = aggregateSessionStats(before, after)
    expect(stats.needsReview).toContain('a')
  })
})
