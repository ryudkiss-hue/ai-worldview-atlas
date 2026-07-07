import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'
import { ScenarioPage } from './pages/ScenarioPage'
import { ResultsPage } from './pages/ResultsPage'

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/quiz/:axisIndex" element={<AxisPage />} />
        <Route path="/scenarios" element={<ScenarioPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </QuizProvider>
  )
}

export default App
