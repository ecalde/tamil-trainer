import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useProgressStore } from '@/stores/progressStore'
import { curriculum } from '@/content'
import { useHydrate } from '@/hooks/useHydrate'

export function HomePage() {
  const hydrated = useHydrate()
  const streak = useProgressStore((s) => s.streak.streak)
  const completed = useProgressStore((s) => s.completedLessons.size)
  const totalLessons = curriculum.lessons.length
  const progress = totalLessons ? completed / totalLessons : 0

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        Loading your progress…
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
          Conversation-first Tamil
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Learn spoken Tamil with calm, focused practice
        </h1>
        <p className="text-balance text-zinc-600 dark:text-zinc-300">
          Short lessons, adaptive review, and pronunciation support — built for English and Spanish
          speakers. No accounts required; your progress stays in this browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center gap-3 text-center">
          <ProgressRing value={progress} size={100} stroke={9} />
          <div>
            <p className="text-sm text-zinc-500">Stage 1 lessons</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {completed}/{totalLessons}
            </p>
          </div>
        </Card>
        <Card className="flex flex-col justify-center gap-1 text-center">
          <p className="text-sm text-zinc-500">Daily streak</p>
          <p className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">{streak}</p>
          <p className="text-xs text-zinc-500">Study days in a row</p>
        </Card>
        <Card className="flex flex-col justify-center gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Continue where you left off — retries are always unlimited.
          </p>
          <Link to="/path" className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 font-medium text-white shadow-sm hover:brightness-110">
            Open learn path
          </Link>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Today’s queues
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/review"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Review due
          </Link>
          <Link
            to="/hard-words"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Hard words
          </Link>
          <Link
            to="/vocabulary"
            className="inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Vocabulary bank
          </Link>
        </div>
      </Card>
    </div>
  )
}
