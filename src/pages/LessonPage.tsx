import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Lesson } from '@/content/schema'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner'
import { itemMap, curriculum } from '@/content'
import { buildLessonExercises, collectItemIds, type BuiltExercise } from '@/lib/session/lessonSession'
import { aggregateSessionStats } from '@/lib/srs/scoring'
import type { WordProgress } from '@/lib/srs/types'
import {
  ensureItemsTracked,
  getLessonById,
  useProgressStore,
} from '@/stores/progressStore'
import { buildHardWordsLesson, buildReviewLesson } from '@/lib/session/fauxLessons'

type Phase = 'prep' | 'run' | 'summary'

export function LessonPage() {
  const { lessonId } = useParams()
  const hydrated = useProgressStore((s) => s.hydrated)
  const hydrate = useProgressStore((s) => s.hydrate)
  const getDueItemIds = useProgressStore((s) => s.getDueItemIds)
  const getHardItemIds = useProgressStore((s) => s.getHardItemIds)
  const learnerLocale = useProgressStore((s) => s.settings.learnerLocale)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const lesson = useMemo(() => {
    if (!lessonId) return undefined
    if (lessonId === 'review') {
      const ids = getDueItemIds(12)
      return buildReviewLesson(ids)
    }
    if (lessonId === 'hard-words') {
      const ids = getHardItemIds(12)
      return buildHardWordsLesson(ids)
    }
    return getLessonById(lessonId)
  }, [lessonId, getDueItemIds, getHardItemIds])

  const exercises = useMemo(() => {
    if (!lesson) return []
    const reviewIds =
      lessonId && lessonId !== 'review' && lessonId !== 'hard-words'
        ? getDueItemIds(4).filter((id) => !lesson.newItemIds.includes(id))
        : []
    return buildLessonExercises(lesson, itemMap, reviewIds, learnerLocale)
  }, [lesson, lessonId, learnerLocale, getDueItemIds])

  if (!hydrated || !lessonId) {
    return <p className="text-zinc-500">Loading…</p>
  }

  if (!lesson) {
    return (
      <Card>
        <p className="text-zinc-700 dark:text-zinc-200">Lesson not found.</p>
        <Link
          to="/path"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 font-medium text-white"
        >
          Back to path
        </Link>
      </Card>
    )
  }

  if (lesson.newItemIds.length === 0 && lessonId === 'review') {
    return (
      <Card className="space-y-3">
        <h1 className="text-xl font-semibold">Nothing due right now</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Great — your review queue is clear. Try a lesson or check back later.
        </p>
        <Link to="/path" className="text-[var(--color-accent)] underline">
          Return to learn path
        </Link>
      </Card>
    )
  }

  if (lesson.newItemIds.length === 0 && lessonId === 'hard-words') {
    return (
      <Card className="space-y-3">
        <h1 className="text-xl font-semibold">No hard words yet</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Misses will show up here with extra practice suggestions.
        </p>
        <Link to="/path" className="text-[var(--color-accent)] underline">
          Start a lesson
        </Link>
      </Card>
    )
  }

  return (
    <LessonSession
      key={lessonId}
      lessonId={lessonId}
      lesson={lesson}
      exercises={exercises}
    />
  )
}

function LessonSession({
  lessonId,
  lesson,
  exercises,
}: {
  lessonId: string
  lesson: Lesson
  exercises: BuiltExercise[]
}) {
  const recordAnswer = useProgressStore((s) => s.recordAnswer)
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete)
  const learnerLocale = useProgressStore((s) => s.settings.learnerLocale)

  const [phase, setPhase] = useState<Phase>('prep')
  const [index, setIndex] = useState(0)
  const snapshotBefore = useRef<Map<string, WordProgress>>(new Map())
  const [summary, setSummary] = useState<ReturnType<typeof aggregateSessionStats> | null>(null)

  useEffect(() => {
    if (lesson.newItemIds.length === 0) return
    void ensureItemsTracked(lesson.newItemIds)
  }, [lesson])

  const current = exercises[index]

  const onCompleteExercise = async (result: { correct: boolean; usedHint: boolean }) => {
    if (!current) return
    const ids = collectItemIds(current)
    for (const id of ids) {
      await recordAnswer(id, result.correct, result.usedHint)
    }
    if (index + 1 < exercises.length) {
      setIndex((i) => i + 1)
    } else {
      const after = useProgressStore.getState().words
      setSummary(aggregateSessionStats(snapshotBefore.current, after))
      setPhase('summary')
    }
  }

  const finishSession = async () => {
    if (lessonId === 'review' || lessonId === 'hard-words') return
    await markLessonComplete(lessonId)
  }

  if (phase === 'prep') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div>
          <p className="text-sm text-zinc-500">{curriculum.stages[0]?.titleEn}</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {lesson.titleEn}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">{lesson.descriptionEn}</p>
        </div>
        <Card className="space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            You will mix a handful of exercises with quick review. Hints are allowed — they count as softer
            repetitions in scheduling.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Pronunciation uses your browser voice when Tamil is available.</li>
            <li>Approximations are labeled; synthesis is never “perfect.”</li>
            <li>Retry this lesson anytime — there is no penalty.</li>
          </ul>
          <Button
            type="button"
            onClick={() => {
              snapshotBefore.current = new Map(useProgressStore.getState().words)
              setPhase('run')
            }}
          >
            Begin
          </Button>
        </Card>
      </div>
    )
  }

  if (phase === 'summary' && summary) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Session recap</h1>
        <Card className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">New first-correct</p>
            <p className="text-2xl font-semibold">{summary.newlyLearned.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Avg. retention est.</p>
            <p className="text-2xl font-semibold">{Math.round(summary.avgRetention * 100)}%</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Strongest items</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-200">{summary.strongest.join(', ') || '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Hardest items</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-200">{summary.hardest.join(', ') || '—'}</p>
          </div>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              void finishSession()
            }}
          >
            Save progress
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              snapshotBefore.current = new Map(useProgressStore.getState().words)
              setIndex(0)
              setPhase('run')
              setSummary(null)
            }}
          >
            Run again
          </Button>
          <Link
            to="/path"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-[var(--color-accent)] underline"
          >
            Back to path
          </Link>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <Card>
        <p>No exercises generated — try adding more vocabulary to this lesson.</p>
      </Card>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4 text-sm text-zinc-500">
        <span>
          Card {index + 1} / {exercises.length}
        </span>
        <span>{lesson.titleEn}</span>
      </div>
      <Card>
        <ExerciseRunner exercise={current} learnerLocale={learnerLocale} onComplete={onCompleteExercise} />
      </Card>
    </div>
  )
}
