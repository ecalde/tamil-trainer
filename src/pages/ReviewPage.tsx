import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { useHydrate } from '@/hooks/useHydrate'
import { getItemById, useProgressStore } from '@/stores/progressStore'

export function ReviewPage() {
  const hydrated = useHydrate()
  const due = useProgressStore((s) => s.getDueItemIds(30))

  if (!hydrated) return <p className="text-zinc-500">Loading…</p>

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Review queue
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Items sorted by urgency from spaced repetition. Practice is infinite — repeat as often as you like.
        </p>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {due.length ? `${due.length} cards ready` : 'You are caught up for now.'}
          </p>
        </div>
        <Link
          to="/lesson/review"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:brightness-110"
        >
          Start review session
        </Link>
      </Card>

      <ul className="space-y-2 text-left text-sm">
        {due.map((id) => {
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
