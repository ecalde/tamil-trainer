import { useState } from 'react'
import { speakTamil } from '@/lib/pronunciation/speech'
import { Button } from '@/components/ui/button'

type Props = {
  tamil: string
  label?: string
}

export function PronunciationButton({ tamil, label = 'Play' }: Props) {
  const [busy, setBusy] = useState(false)

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={busy}
      onClick={() => {
        setBusy(true)
        speakTamil(tamil)
        window.setTimeout(() => setBusy(false), 1200)
      }}
    >
      {label}
    </Button>
  )
}
