import { useEffect } from 'react'
import { useProgressStore } from '@/stores/progressStore'

export function useHydrate() {
  const hydrated = useProgressStore((s) => s.hydrated)
  const hydrate = useProgressStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return hydrated
}
