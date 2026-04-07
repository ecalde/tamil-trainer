import { describe, expect, it } from 'vitest'
import { scheduleNextReview } from '@/lib/srs/scheduler'
import { createInitialProgress } from '@/lib/srs/types'

describe('infinite retry friendliness', () => {
  it('allows repeated scheduling without throwing', () => {
    const now = Date.now()
    let p = createInitialProgress('w', now)
    for (let i = 0; i < 50; i++) {
      p = scheduleNextReview(p, i % 3 !== 0, i % 7 === 0, now + i * 1000)
    }
    expect(p.exposures).toBe(50)
  })
})
