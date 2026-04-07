import { describe, expect, it } from 'vitest'
import { parseCurriculum } from '@/content/validate'
import { rawCurriculum } from '@/content/seed/curriculum'

describe('curriculum validation', () => {
  it('parses seed curriculum', () => {
    const c = parseCurriculum(rawCurriculum)
    expect(c.items.length).toBeGreaterThan(10)
    expect(c.lessons.length).toBeGreaterThan(0)
  })
})
