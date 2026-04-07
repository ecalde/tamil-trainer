/** Calendar day in local timezone, YYYY-MM-DD */
export type DayYmd = string

export function localYmd(d: Date): DayYmd {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseYmd(s: DayYmd): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

function dayDiff(a: DayYmd, b: DayYmd): number {
  const ms = parseYmd(b).getTime() - parseYmd(a).getTime()
  return Math.round(ms / 86_400_000)
}

export type StreakState = {
  streak: number
  lastStudyYmd: DayYmd | null
}

export function computeNextStreak(prev: StreakState, todayYmd: DayYmd): StreakState {
  if (prev.lastStudyYmd === null) {
    return { streak: 1, lastStudyYmd: todayYmd }
  }
  if (prev.lastStudyYmd === todayYmd) {
    return prev
  }
  const gap = dayDiff(prev.lastStudyYmd, todayYmd)
  if (gap === 1) {
    return { streak: prev.streak + 1, lastStudyYmd: todayYmd }
  }
  return { streak: 1, lastStudyYmd: todayYmd }
}
