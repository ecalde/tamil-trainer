import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AboutPage } from '@/pages/AboutPage'
import { HardWordsPage } from '@/pages/HardWordsPage'
import { HomePage } from '@/pages/HomePage'
import { LessonPage } from '@/pages/LessonPage'
import { PathPage } from '@/pages/PathPage'
import { ReviewPage } from '@/pages/ReviewPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { StatsPage } from '@/pages/StatsPage'
import { VocabularyPage } from '@/pages/VocabularyPage'
import { useTheme } from '@/hooks/useTheme'

function ThemedRoutes() {
  useTheme()
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="path" element={<PathPage />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="hard-words" element={<HardWordsPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return <ThemedRoutes />
}
