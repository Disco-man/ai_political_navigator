import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WorldMapPage from './pages/WorldMapPage'
import CountryPage from './pages/CountryPage'
import FigurePage from './pages/FigurePage'
import EventPage from './pages/EventPage'
import QuizModal from './components/QuizModal'
import { useAppStore } from './services/store'

function App() {
  const isQuizOpen = useAppStore((s) => s.isQuizOpen)
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<WorldMapPage />} />
        <Route path="/country/:countryId" element={<CountryPage />} />
        <Route path="/country/:countryId/event/:eventId" element={<EventPage />} />
        <Route path="/figure/:figureId" element={<FigurePage />} />
      </Routes>
      {isQuizOpen && <QuizModal />}
    </div>
  )
}

export default App
