import { Card } from '@/components/ui/card'
import { curriculum } from '@/content'
import { useHydrate } from '@/hooks/useHydrate'
import { useProgressStore } from '@/stores/progressStore'
import { estimatedRetention } from '@/lib/srs/scoring'

export function StatsPage() {
  const hydrated = useHydrate()
  const words = useProgressStore((s) => s.words)
  const streak = useProgressStore((s) => s.streak.streak)
  const completed = useProgressStore((s) => s.completedLessons.size)

  if (!hydrated) return <p className="text-zinc-500">Loading…</p>

  const practiced = [...words.values()].filter((w) => w.exposures > 0).length
  const avgRetention =
    words.size === 0
      ? 0
      : [...words.values()].reduce((s, w) => s + estimatedRetention(w), 0) / words.size

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        Progress
      </h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Streak</p>
          <p className="text-3xl font-semibold">{streak}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Lessons completed</p>
          <p className="text-3xl font-semibold">
            {completed}/{curriculum.lessons.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Words touched</p>
          <p className="text-3xl font-semibold">
            {practiced}/{curriculum.items.length}
          </p>
        </Card>
      </div>
      <Card>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Average retention estimate</p>
        <p className="text-2xl font-semibold">{Math.round(avgRetention * 100)}%</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This is a lightweight heuristic from ease and streak — useful for motivation, not a clinical measure.
        </p>
      </Card>
    </div>
  )
}
