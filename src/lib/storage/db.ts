import Dexie, { type Table } from 'dexie'
import type { WordProgress } from '@/lib/srs/types'
import type { StreakState } from '@/lib/streak'

export type AppSettings = {
  learnerLocale: 'en' | 'es'
  theme: 'light' | 'dark' | 'system'
}

export type MetaRow =
  | { key: 'streak'; value: StreakState }
  | { key: 'settings'; value: AppSettings }
  | { key: 'schemaVersion'; value: number }

class TamilTrainerDB extends Dexie {
  wordProgress!: Table<WordProgress, string>
  completedLessons!: Table<{ lessonId: string; completedAt: number }, string>
  meta!: Table<MetaRow, string>

  constructor() {
    super('tamil-trainer')
    this.version(1).stores({
      wordProgress: 'itemId',
      completedLessons: 'lessonId',
      meta: 'key',
    })
  }
}

export const db = new TamilTrainerDB()

export const DEFAULT_SETTINGS: AppSettings = {
  learnerLocale: 'en',
  theme: 'system',
}
