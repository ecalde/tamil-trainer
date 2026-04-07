import { Card } from '@/components/ui/card'

export function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        About the learning method
      </h1>
      <Card className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
        <p>
          Tamil Trainer is built around conversational usefulness: high-frequency spoken Tamil, small lesson
          batches, retrieval practice, interleaving review, and spaced repetition scheduling on the client.
        </p>
        <p>
          You will see immediate feedback, unlimited retries, and adaptive review that surfaces misses sooner
          while easing stable items. Hints are allowed; they nudge the scheduler toward gentler intervals.
        </p>
        <p>
          Pronunciation playback prefers local audio when available, otherwise browser speech synthesis. Voices
          differ by OS/browser — the app never claims synthesis is authoritative.
        </p>
        <p>
          Tamil script writing drills are planned; the data model already reserves space for future writing
          fields without breaking existing lessons.
        </p>
      </Card>
    </div>
  )
}
