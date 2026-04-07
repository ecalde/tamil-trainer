import { create } from 'zustand'
import { db, DEFAULT_SETTINGS, type AppSettings } from '@/lib/storage/db'
import type { WordProgress } from '@/lib/srs/types'
import { createInitialProgress } from '@/lib/srs/types'
import { scheduleNextReview, ensureProgress, reviewUrgency } from '@/lib/srs/scheduler'
import type { StreakState } from '@/lib/streak'
import { computeNextStreak, localYmd } from '@/lib/streak'
import { curriculum } from '@/content'

type ProgressState = {
  hydrated: boolean
  words: Map<string, WordProgress>
  completedLessons: Set<string>
  streak: StreakState
  settings: AppSettings
  hydrate: () => Promise<void>
  recordAnswer: (itemId: string, correct: boolean, usedHint: boolean) => Promise<void>
  markLessonComplete: (lessonId: string) => Promise<void>
  isLessonUnlocked: (lessonId: string) => boolean
  getDueItemIds: (limit: number) => string[]
  getHardItemIds: (limit: number) => string[]
  setSettings: (s: Partial<AppSettings>) => Promise<void>
}

function orderedLessons() {
  return [...curriculum.lessons].sort((a, b) => {
    const sa = curriculum.stages.find((s) => s.id === a.stageId)?.orderIndex ?? 0
    const sb = curriculum.stages.find((s) => s.id === b.stageId)?.orderIndex ?? 0
    if (sa !== sb) return sa - sb
    return a.orderIndex - b.orderIndex
  })
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  hydrated: false,
  words: new Map(),
  completedLessons: new Set(),
  streak: { streak: 0, lastStudyYmd: null },
  settings: DEFAULT_SETTINGS,

  hydrate: async () => {
    const [wordRows, lessonRows, metaRows] = await Promise.all([
      db.wordProgress.toArray(),
      db.completedLessons.toArray(),
      db.meta.toArray(),
    ])

    const words = new Map<string, WordProgress>()
    for (const w of wordRows) {
      words.set(w.itemId, w)
    }

    const streakRow = metaRows.find((m) => m.key === 'streak') as
      | { key: 'streak'; value: StreakState }
      | undefined
    const settingsRow = metaRows.find((m) => m.key === 'settings') as
      | { key: 'settings'; value: AppSettings }
      | undefined

    set({
      hydrated: true,
      words,
      completedLessons: new Set(lessonRows.map((l) => l.lessonId)),
      streak: streakRow?.value ?? { streak: 0, lastStudyYmd: null },
      settings: settingsRow?.value ?? DEFAULT_SETTINGS,
    })
  },

  recordAnswer: async (itemId, correct, usedHint) => {
    const now = Date.now()
    const prev = get().words.get(itemId)
    const base = ensureProgress(itemId, prev, now)
    const next = scheduleNextReview(base, correct, usedHint, now)
    const words = new Map(get().words)
    words.set(itemId, next)
    set({ words })
    await db.wordProgress.put(next)
  },

  markLessonComplete: async (lessonId) => {
    const completed = new Set(get().completedLessons)
    completed.add(lessonId)
    const todayYmd = localYmd(new Date())
    const streak = computeNextStreak(get().streak, todayYmd)
    set({ completedLessons: completed, streak })
    await db.completedLessons.put({ lessonId, completedAt: Date.now() })
    await db.meta.put({ key: 'streak', value: streak })
  },

  isLessonUnlocked: (lessonId) => {
    const order = orderedLessons()
    const idx = order.findIndex((l) => l.id === lessonId)
    if (idx <= 0) return true
    const prev = order[idx - 1]
    return get().completedLessons.has(prev!.id)
  },

  getDueItemIds: (limit) => {
    const now = Date.now()
    const ids = [...get().words.entries()]
      .filter(([, p]) => p.nextReviewAt <= now)
      .sort((a, b) => reviewUrgency(b[1], now) - reviewUrgency(a[1], now))
      .map(([id]) => id)
    return ids.slice(0, limit)
  },

  getHardItemIds: (limit) => {
    const ranked = [...get().words.values()]
      .filter((p) => p.incorrectCount > 0)
      .sort((a, b) => b.incorrectCount - a.incorrectCount || a.streak - b.streak)
    return ranked.slice(0, limit).map((p) => p.itemId)
  },

  setSettings: async (s) => {
    const settings = { ...get().settings, ...s }
    set({ settings })
    await db.meta.put({ key: 'settings', value: settings })
  },
}))

export function getCurriculum() {
  return curriculum
}

export function getLessonById(id: string) {
  return curriculum.lessons.find((l) => l.id === id)
}

export function getItemById(id: string) {
  return curriculum.items.find((i) => i.id === id)
}

/** Ensure progress rows exist for items (no schedule side effects). */
export async function ensureItemsTracked(itemIds: string[]) {
  const now = Date.now()
  const words = new Map(useProgressStore.getState().words)
  const toPut: WordProgress[] = []
  for (const id of itemIds) {
    if (!words.has(id)) {
      const w = createInitialProgress(id, now)
      words.set(id, w)
      toPut.push(w)
    }
  }
  if (toPut.length) {
    useProgressStore.setState({ words })
    await Promise.all(toPut.map((w) => db.wordProgress.put(w)))
  }
}
