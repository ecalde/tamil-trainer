import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { curriculum } from '@/content'
import { useHydrate } from '@/hooks/useHydrate'
import { useProgressStore } from '@/stores/progressStore'
import { cn } from '@/lib/cn'

export function PathPage() {
  const hydrated = useHydrate()
  const completed = useProgressStore((s) => s.completedLessons)
  const isUnlocked = useProgressStore((s) => s.isLessonUnlocked)

  const lessons = [...curriculum.lessons].sort((a, b) => a.orderIndex - b.orderIndex)

  if (!hydrated) {
    return <p className="text-zinc-500">Loading…</p>
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Learn path
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Stage 1 focuses on greetings, politeness, people, places, core verbs, questions, and numbers.
        </p>
      </div>

      <ol className="relative space-y-4 border-l border-zinc-200 pl-6 dark:border-zinc-700">
        {lessons.map((lesson, i) => {
          const unlocked = isUnlocked(lesson.id)
          const done = completed.has(lesson.id)
          return (
            <li key={lesson.id} className="relative">
              <span className="absolute -left-[29px] top-3 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200">
                {i + 1}
              </span>
              <Card
                className={cn(
                  'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                  !unlocked && 'opacity-60',
                )}
              >
                <div>
                  <p className="text-sm text-zinc-500">{done ? 'Completed' : unlocked ? 'Ready' : 'Locked'}</p>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{lesson.titleEn}</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{lesson.descriptionEn}</p>
                </div>
                {unlocked ? (
                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:brightness-110"
                  >
                    {done ? 'Practice again' : 'Start'}
                  </Link>
                ) : (
                  <span className="text-sm text-zinc-500">Finish the previous lesson</span>
                )}
              </Card>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
