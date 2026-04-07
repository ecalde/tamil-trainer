import type { WordProgress } from '@/lib/srs/types'

/** Rough 0–1 retention estimate from ease and recent streak. */
export function estimatedRetention(p: WordProgress): number {
  const easeNorm = Math.min(1, (p.ease - 1.3) / (2.6 - 1.3))
  const streakNorm = Math.min(1, p.streak / 8)
  return Math.min(1, Math.max(0, 0.35 + 0.35 * easeNorm + 0.3 * streakNorm))
}

export type SessionWordStats = {
  itemId: string
  correctDelta: number
  incorrectDelta: number
}

export function aggregateSessionStats(
  before: Map<string, WordProgress>,
  after: Map<string, WordProgress>,
): {
  newlyLearned: string[]
  needsReview: string[]
  strongest: string[]
  hardest: string[]
  avgRetention: number
} {
  const newlyLearned: string[] = []
  const needsReview: string[] = []

  for (const [id, post] of after) {
    const pre = before.get(id)
    if (post.firstCorrectAt !== null && (!pre || pre.firstCorrectAt === null)) {
      newlyLearned.push(id)
    }
    if (post.incorrectCount > (pre?.incorrectCount ?? 0)) {
      needsReview.push(id)
    }
  }

  const ranked = [...after.values()].sort((a, b) => estimatedRetention(b) - estimatedRetention(a))
  const strongest = ranked.slice(0, 5).map((p) => p.itemId)

  const hardest = [...after.values()]
    .sort((a, b) => b.incorrectCount - a.incorrectCount || a.streak - b.streak)
    .slice(0, 5)
    .map((p) => p.itemId)

  const avgRetention =
    after.size === 0
      ? 0
      : [...after.values()].reduce((s, p) => s + estimatedRetention(p), 0) / after.size

  return { newlyLearned, needsReview, strongest, hardest, avgRetention }
}
