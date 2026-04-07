import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/cn'

const links = [
  { to: '/', label: 'Home' },
  { to: '/path', label: 'Learn' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/review', label: 'Review' },
  { to: '/hard-words', label: 'Hard words' },
  { to: '/stats', label: 'Stats' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'Method' },
] as const

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-zinc-950 dark:via-[var(--color-canvas-dark)] dark:to-[var(--color-canvas-dark)]">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-sm text-[var(--color-accent)]">
              த
            </span>
            Tamil Trainer
          </NavLink>
          <nav className="flex flex-wrap gap-1 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-2.5 py-1.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-[var(--color-accent)] text-white shadow-sm dark:bg-[var(--color-accent)] dark:text-white'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                  )
                }
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-200/80 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        Spoken Tamil practice · progress stays on this device ·{' '}
        <NavLink to="/about" className="underline">
          how it works
        </NavLink>
      </footer>
    </div>
  )
}
