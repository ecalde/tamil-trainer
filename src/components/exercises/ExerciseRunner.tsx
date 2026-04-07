import { useMemo, useState, type ReactNode } from 'react'
import type { BuiltExercise } from '@/lib/session/lessonSession'
import { getItemById } from '@/stores/progressStore'
import { PronunciationButton } from '@/components/PronunciationButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

type Props = {
  exercise: BuiltExercise
  learnerLocale: 'en' | 'es'
  onComplete: (result: { correct: boolean; usedHint: boolean }) => void
}

export function ExerciseRunner({ exercise, learnerLocale, onComplete }: Props) {
  const [hint, setHint] = useState(false)
  const [locked, setLocked] = useState(false)

  const item = useMemo(() => {
    if (exercise.kind === 'word_matching') return null
    return getItemById(exercise.itemId)
  }, [exercise])

  const finish = (correct: boolean) => {
    if (locked) return
    setLocked(true)
    onComplete({ correct, usedHint: hint })
  }

  if (exercise.kind === 'multiple_choice_meaning') {
    if (!item) {
      return (
        <Card>
          <p className="text-sm text-red-600">Missing vocabulary item.</p>
        </Card>
      )
    }
    return (
      <McView
        prompt={exercise.prompt}
        options={exercise.options}
        item={item}
        hint={hint}
        onHint={() => setHint(true)}
        locked={locked}
        onPick={(id) => finish(id === exercise.correctOptionId)}
        learnerLocale={learnerLocale}
      />
    )
  }

  if (exercise.kind === 'transliteration_recognition') {
    return (
      <McView
        prompt={exercise.prompt}
        options={exercise.options}
        item={null}
        hint={hint}
        onHint={() => setHint(true)}
        locked={locked}
        onPick={(id) => finish(id === exercise.correctOptionId)}
        learnerLocale={learnerLocale}
        header={
          <div className="space-y-3 text-left">
            <p className="font-[family-name:var(--font-tamil)] text-3xl leading-snug text-zinc-900 dark:text-zinc-50">
              {exercise.tamil}
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">{exercise.transliteration}</p>
            <PronunciationButton tamil={exercise.tamil} />
          </div>
        }
        hintDetail={hint ? exercise.transliteration : undefined}
      />
    )
  }

  if (exercise.kind === 'meaning_to_tamil') {
    return (
      <div className="space-y-4 text-left">
        <p className="text-lg text-zinc-800 dark:text-zinc-100">{exercise.prompt}</p>
        <HintBar hint={hint} onHint={() => setHint(true)} learnerLocale={learnerLocale} />
        <div className="grid gap-2 sm:grid-cols-2">
          {exercise.options.map((o) => (
            <button
              key={o.id}
              type="button"
              disabled={locked}
              onClick={() => finish(o.id === exercise.correctOptionId)}
              className={cn(
                'rounded-xl border border-zinc-200 bg-white p-4 text-left text-sm shadow-sm transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600',
                locked && 'opacity-70',
              )}
            >
              <div className="font-[family-name:var(--font-tamil)] text-xl text-zinc-900 dark:text-zinc-50">
                {o.labelTamil}
              </div>
              <div className="text-xs text-zinc-500">{o.labelTranslit}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (exercise.kind === 'word_matching') {
    return (
      <WordMatchView
        exercise={exercise}
        hint={hint}
        onHint={() => setHint(true)}
        learnerLocale={learnerLocale}
        locked={locked}
        onDone={finish}
      />
    )
  }

  if (exercise.kind === 'fill_in_blank') {
    return (
      <div className="space-y-4 text-left">
        <p className="text-zinc-700 dark:text-zinc-200">{exercise.prompt}</p>
        <p className="rounded-xl bg-zinc-100 px-4 py-3 font-mono text-lg text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          {exercise.blankLabel}
        </p>
        <HintBar hint={hint} onHint={() => setHint(true)} learnerLocale={learnerLocale} />
        <div className="grid gap-2 sm:grid-cols-2">
          {exercise.options.map((o) => (
            <button
              key={o.id}
              type="button"
              disabled={locked}
              onClick={() => finish(o.id === exercise.correctOptionId)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (exercise.kind === 'tap_order') {
    return (
      <TapOrderView
        exercise={exercise}
        hint={hint}
        onHint={() => setHint(true)}
        learnerLocale={learnerLocale}
        locked={locked}
        onDone={finish}
      />
    )
  }

  return (
    <Card>
      <p className="text-sm text-zinc-600">Unsupported exercise in this build.</p>
      <Button className="mt-4" onClick={() => finish(true)}>
        Continue
      </Button>
    </Card>
  )
}

function HintBar({
  hint,
  onHint,
  learnerLocale,
}: {
  hint: boolean
  onHint: () => void
  learnerLocale: 'en' | 'es'
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" size="sm" variant="ghost" onClick={onHint}>
        {learnerLocale === 'es' ? 'Pista (cuenta para repaso)' : 'Hint (counts for review)'}
      </Button>
      {hint ? (
        <span className="text-xs text-zinc-500">
          {learnerLocale === 'es'
            ? 'Las pistas priorizan repetición espaciada.'
            : 'Hints prioritize spaced repetition review.'}
        </span>
      ) : null}
    </div>
  )
}

function McView({
  prompt,
  options,
  item,
  hint,
  onHint,
  locked,
  onPick,
  learnerLocale,
  header,
  hintDetail,
}: {
  prompt: string
  options: { id: string; label: string }[]
  item: ReturnType<typeof getItemById> | null
  hint: boolean
  onHint: () => void
  locked: boolean
  onPick: (id: string) => void
  learnerLocale: 'en' | 'es'
  header?: ReactNode
  hintDetail?: string
}) {
  return (
    <div className="space-y-4 text-left">
      {header ?? (
        <div className="space-y-3">
          {item ? (
            <>
              <p className="font-[family-name:var(--font-tamil)] text-3xl text-zinc-900 dark:text-zinc-50">
                {item.tamil}
              </p>
              <PronunciationButton tamil={item.tamil} />
            </>
          ) : null}
        </div>
      )}
      <p className="text-lg text-zinc-800 dark:text-zinc-100">{prompt}</p>
      <HintBar hint={hint} onHint={onHint} learnerLocale={learnerLocale} />
      {hint && item ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {item.transliteration} · {item.englishApproxPronunciation}
        </p>
      ) : null}
      {hint && hintDetail && !item ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{hintDetail}</p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={locked}
            onClick={() => onPick(o.id)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-900 shadow-sm hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-600"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function WordMatchView({
  exercise,
  hint,
  onHint,
  learnerLocale,
  locked,
  onDone,
}: {
  exercise: Extract<BuiltExercise, { kind: 'word_matching' }>
  hint: boolean
  onHint: () => void
  learnerLocale: 'en' | 'es'
  locked: boolean
  onDone: (correct: boolean) => void
}) {
  const [leftSel, setLeftSel] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, true>>({})
  /** Wrong meaning chosen (highlights that button in amber; correct matches use `matched` emerald). */
  const [wrongMeaningTap, setWrongMeaningTap] = useState<Record<string, true>>({})

  const rights = useMemo(() => shufflePairs(exercise.pairs), [exercise.pairs])
  const total = exercise.pairs.length

  return (
    <div className="space-y-4 text-left">
      <p className="text-lg text-zinc-800 dark:text-zinc-100">
        {learnerLocale === 'es'
          ? 'Empareja el tamil con su significado.'
          : 'Match Tamil to its meaning.'}
      </p>
      <HintBar hint={hint} onHint={onHint} learnerLocale={learnerLocale} />
      <p className="text-xs text-zinc-500">
        {Object.keys(matched).length}/{total}{' '}
        {learnerLocale === 'es' ? 'emparejados' : 'matched'}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          {exercise.pairs.map((p) => {
            const isMatched = !!matched[p.itemId]
            const isLeftActive = leftSel === p.itemId && !isMatched
            return (
              <button
                key={p.itemId}
                type="button"
                disabled={locked || isMatched}
                onClick={() => setLeftSel(p.itemId)}
                className={cn(
                  'w-full rounded-xl border-2 px-3 py-2 text-left font-[family-name:var(--font-tamil)] text-lg transition active:scale-[0.99]',
                  isMatched &&
                    'border-emerald-500/80 bg-emerald-950/40 text-emerald-50 ring-1 ring-emerald-500/35 dark:bg-emerald-950/35',
                  !isMatched &&
                    isLeftActive &&
                    'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-md',
                  !isMatched &&
                    !isLeftActive &&
                    'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50',
                )}
              >
                {p.tamil}
                <div
                  className={cn(
                    'text-xs font-sans',
                    isMatched && 'text-emerald-200/90',
                    !isMatched && isLeftActive && 'text-white/90',
                    !isMatched && !isLeftActive && 'text-zinc-500 dark:text-zinc-400',
                  )}
                >
                  {p.transliteration}
                </div>
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rights.map((p) => {
            const isMatched = !!matched[p.itemId]
            const wrongTap = !!wrongMeaningTap[p.itemId]
            return (
              <button
                key={`${p.itemId}-m`}
                type="button"
                disabled={locked || isMatched}
                onClick={() => {
                  if (!leftSel) return
                  if (leftSel === p.itemId) {
                    setMatched((m): Record<string, true> => {
                      const next: Record<string, true> = { ...m, [leftSel]: true }
                      if (Object.keys(next).length === total) {
                        queueMicrotask(() => onDone(true))
                      }
                      return next
                    })
                    setLeftSel(null)
                  } else {
                    setWrongMeaningTap((t) => ({ ...t, [p.itemId]: true }))
                    onDone(false)
                  }
                }}
                className={cn(
                  'w-full rounded-xl border-2 px-3 py-2 text-left text-sm font-medium transition active:scale-[0.99]',
                  isMatched &&
                    'border-emerald-400 bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300/40 dark:border-emerald-500 dark:bg-emerald-700',
                  !isMatched &&
                    wrongTap &&
                    'border-amber-400 bg-amber-500/15 text-amber-950 ring-1 ring-amber-400/50 dark:bg-amber-500/20 dark:text-amber-50 dark:ring-amber-400/40',
                  !isMatched &&
                    !wrongTap &&
                    'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900',
                )}
              >
                {p.meaning}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function shufflePairs<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function TapOrderView({
  exercise,
  hint,
  onHint,
  learnerLocale,
  locked,
  onDone,
}: {
  exercise: Extract<BuiltExercise, { kind: 'tap_order' }>
  hint: boolean
  onHint: () => void
  learnerLocale: 'en' | 'es'
  locked: boolean
  onDone: (correct: boolean) => void
}) {
  const [picked, setPicked] = useState<string[]>([])
  const remaining = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of exercise.tokens) counts[t] = (counts[t] ?? 0) + 1
    const used: Record<string, number> = {}
    for (const p of picked) used[p] = (used[p] ?? 0) + 1
    return exercise.tokens.filter((t) => (used[t] ?? 0) < (counts[t] ?? 0))
  }, [exercise.tokens, picked])

  const submit = () => {
    const ok =
      picked.length === exercise.targetTokens.length &&
      picked.every((p, i) => p === exercise.targetTokens[i])
    onDone(ok)
  }

  return (
    <div className="space-y-4 text-left">
      <p className="text-lg text-zinc-800 dark:text-zinc-100">{exercise.prompt}</p>
      <HintBar hint={hint} onHint={onHint} learnerLocale={learnerLocale} />
      {hint ? (
        <p className="text-xs text-zinc-500">
          {learnerLocale === 'es'
            ? 'Orden objetivo (transliteración en minúsculas).'
            : 'Target order (lowercase transliteration tokens).'}
        </p>
      ) : null}
      <div className="min-h-12 rounded-xl border border-dashed border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-600">
        {picked.join(' ') || '…'}
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((t, idx) => (
          <button
            key={`${t}-${idx}`}
            type="button"
            disabled={locked}
            onClick={() => setPicked((p) => [...p, t])}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" disabled={locked || picked.length === 0} onClick={() => setPicked([])}>
          {learnerLocale === 'es' ? 'Reiniciar' : 'Reset'}
        </Button>
        <Button
          type="button"
          disabled={locked || picked.length !== exercise.targetTokens.length}
          onClick={submit}
        >
          {learnerLocale === 'es' ? 'Comprobar' : 'Check'}
        </Button>
      </div>
    </div>
  )
}
