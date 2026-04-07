import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { useHydrate } from '@/hooks/useHydrate'
import { getItemById, useProgressStore } from '@/stores/progressStore'

export function HardWordsPage() {
  const hydrated = useHydrate()
  const words = useProgressStore((s) => s.words)
  const getHardItemIds = useProgressStore((s) => s.getHardItemIds)
  const hard = getHardItemIds(30)

  if (!hydrated) return <p className="text-zinc-500">Loading…</p>

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="sr-only">Tracked vocabulary entries: {words.size}</p>
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Hard words
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Words with recent misses surface here for extra retrieval practice — no shame, just more reps.
        </p>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {hard.length ? `${hard.length} items` : 'No misses tracked yet — keep practicing!'}
        </p>
        <Link
          to="/lesson/hard-words"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:brightness-110"
        >
          Practice hard words
        </Link>
      </Card>

      <ul className="space-y-2 text-left text-sm">
        {hard.map((id) => {
          const item = getItemById(id)
          if (!item) return null
          return (
            <li key={id} className="rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <span className="font-[family-name:var(--font-tamil)] text-lg">{item.tamil}</span>
              <span className="text-zinc-500"> · {item.transliteration}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
