import { useEffect } from 'react'
import { useProgressStore } from '@/stores/progressStore'

export function useTheme() {
  const theme = useProgressStore((s) => s.settings.theme)

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      if (theme === 'dark') {
        root.classList.add('dark')
      } else if (theme === 'light') {
        root.classList.remove('dark')
      } else {
        const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', prefers)
      }
    }
    apply()
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => apply()
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [theme])
}
