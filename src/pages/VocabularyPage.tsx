import { Card } from '@/components/ui/card'
import { PronunciationButton } from '@/components/PronunciationButton'
import { curriculum } from '@/content'
import { useHydrate } from '@/hooks/useHydrate'
import { useProgressStore } from '@/stores/progressStore'
import { estimatedRetention } from '@/lib/srs/scoring'

export function VocabularyPage() {
  const hydrated = useHydrate()
  const words = useProgressStore((s) => s.words)
  const locale = useProgressStore((s) => s.settings.learnerLocale)

  if (!hydrated) return <p className="text-zinc-500">Loading…</p>

  const items = [...curriculum.items].sort((a, b) => a.frequencyPriority - b.frequencyPriority)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Vocabulary bank
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Starter set with Tamil script, transliteration, and dual-language glosses. Approximate pronunciation
          guides are learning aids, not phonetic authority.
        </p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => {
          const p = words.get(item.id)
          const retention = p ? Math.round(estimatedRetention(p) * 100) : null
          return (
            <Card key={item.id} className="space-y-3 text-left">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-[family-name:var(--font-tamil)] text-2xl text-zinc-900 dark:text-zinc-50">
                    {item.tamil}
                  </p>
                  <p className="text-sm text-zinc-500">{item.transliteration}</p>
                </div>
                <PronunciationButton tamil={item.tamil} label="Play (browser voice)" />
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">English</p>
                  <p className="text-zinc-800 dark:text-zinc-100">{item.englishMeaning}</p>
                  <p className="text-xs text-zinc-500">~ {item.englishApproxPronunciation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Español</p>
                  <p className="text-zinc-800 dark:text-zinc-100">{item.spanishMeaning}</p>
                  <p className="text-xs text-zinc-500">~ {item.spanishApproxPronunciation}</p>
                </div>
              </div>
              {item.exampleSentence ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="font-medium text-zinc-800 dark:text-zinc-100">Example: </span>
                  {locale === 'es' ? item.exampleSentence.spanish : item.exampleSentence.english}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                    {t}
                  </span>
                ))}
                {retention !== null ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Retention est. {retention}%
                  </span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">Not practiced yet</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
