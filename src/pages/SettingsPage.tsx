import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHydrate } from '@/hooks/useHydrate'
import { useProgressStore } from '@/stores/progressStore'

export function SettingsPage() {
  const hydrated = useHydrate()
  const settings = useProgressStore((s) => s.settings)
  const setSettings = useProgressStore((s) => s.setSettings)

  if (!hydrated) return <p className="text-zinc-500">Loading…</p>

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>

      <Card className="space-y-4 text-left">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Learner language</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Prompts and hints prefer this language when both are available.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant={settings.learnerLocale === 'en' ? 'primary' : 'secondary'}
              onClick={() => void setSettings({ learnerLocale: 'en' })}
            >
              English
            </Button>
            <Button
              type="button"
              variant={settings.learnerLocale === 'es' ? 'primary' : 'secondary'}
              onClick={() => void setSettings({ learnerLocale: 'es' })}
            >
              Español
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Theme</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <Button
                key={t}
                type="button"
                variant={settings.theme === t ? 'primary' : 'secondary'}
                onClick={() => void setSettings({ theme: t })}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="text-left text-sm text-zinc-600 dark:text-zinc-300">
        <p>
          Audio uses local assets when present, otherwise browser speech synthesis. Tamil voices vary by device;
          the UI labels synthesis as approximate.
        </p>
      </Card>
    </div>
  )
}
