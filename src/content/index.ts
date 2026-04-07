import { buildItemMap } from '@/content/schema'
import { parseCurriculum } from '@/content/validate'
import { rawCurriculum } from '@/content/seed/curriculum'

export const curriculum = parseCurriculum(rawCurriculum)
export const itemMap = buildItemMap(curriculum)
