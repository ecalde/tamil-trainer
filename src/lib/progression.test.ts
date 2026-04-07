import { describe, expect, it } from 'vitest'
import { curriculum } from '@/content'

function orderedLessons() {
  return [...curriculum.lessons].sort((a, b) => {
    const sa = curriculum.stages.find((s) => s.id === a.stageId)?.orderIndex ?? 0
    const sb = curriculum.stages.find((s) => s.id === b.stageId)?.orderIndex ?? 0
    if (sa !== sb) return sa - sb
    return a.orderIndex - b.orderIndex
  })
}

describe('lesson progression', () => {
  it('has strictly ordered lessons within a stage', () => {
    const lessons = orderedLessons()
    for (let i = 1; i < lessons.length; i++) {
      expect(lessons[i]!.orderIndex).toBeGreaterThanOrEqual(lessons[i - 1]!.orderIndex)
    }
  })

  it('references only known vocabulary ids', () => {
    const ids = new Set(curriculum.items.map((i) => i.id))
    for (const l of curriculum.lessons) {
      for (const id of l.newItemIds) {
        expect(ids.has(id)).toBe(true)
      }
    }
  })
})
