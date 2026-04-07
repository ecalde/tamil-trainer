export type SpeakOptions = {
  /** BCP-47 or generic */
  preferredLang?: string
  rate?: number
}

let warnedNoTamilVoice = false

function pickTamilVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const ta = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('ta') ||
      v.name.toLowerCase().includes('tamil'),
  )
  return ta[0]
}

/**
 * Speak Tamil text using the Web Speech API. Falls back to best-effort voice.
 * Never claims accuracy; UI should label synthesis as approximate.
 */
export function speakTamil(text: string, opts: SpeakOptions = {}): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = opts.rate ?? 0.95

  const voices = window.speechSynthesis.getVoices()
  const tamil = pickTamilVoice(voices)
  if (tamil) {
    utter.voice = tamil
    utter.lang = tamil.lang
  } else {
    utter.lang = opts.preferredLang ?? 'ta-IN'
    if (!warnedNoTamilVoice && import.meta.env.DEV) {
      warnedNoTamilVoice = true
      console.info(
        '[tamil-trainer] No Tamil voice reported by the browser; using fallback lang.',
      )
    }
  }

  window.speechSynthesis.speak(utter)
}

export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    const run = () => resolve(synth.getVoices())
    const voices = synth.getVoices()
    if (voices.length) {
      run()
      return
    }
    synth.addEventListener('voiceschanged', run, { once: true })
  })
}

export function hasTamilVoice(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  return !!pickTamilVoice(window.speechSynthesis.getVoices())
}
