import {
  buildItemMap,
  type Curriculum,
  curriculumSchema,
  validateCurriculumReferences,
} from '@/content/schema'

export function parseCurriculum(data: unknown): Curriculum {
  const parsed = curriculumSchema.parse(data)
  validateCurriculumReferences(parsed)
  return parsed
}

/** Runtime check without throwing — for tests and defensive imports. */
export function safeParseCurriculum(data: unknown) {
  const r = curriculumSchema.safeParse(data)
  if (!r.success) return { ok: false as const, error: r.error }
  try {
    validateCurriculumReferences(r.data)
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : String(e),
    }
  }
  return { ok: true as const, data: r.data, itemMap: buildItemMap(r.data) }
}
