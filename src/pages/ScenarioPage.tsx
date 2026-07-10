import { useNavigate } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import { useQuiz } from '../state/QuizContext'
import { LanguageSelector } from '../components/LanguageSelector'

export function ScenarioPage() {
  const navigate = useNavigate()
  const { scenarioAnswers, setScenarioAnswer, clearScenarioAnswers, t, tScenario } = useQuiz()

  function skipAndGoToResults() {
    clearScenarioAnswers()
    navigate('/results')
  }

  function submitAndGoToResults() {
    navigate('/results')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('worldview_atlas')}</span>
        <LanguageSelector />
      </div>

      <h2 className="text-2xl font-bold mb-2">{t('scenario_title') || "One More Thing (Optional)"}</h2>
      <p className="text-gray-600 mb-6">
        {t('scenario_subtitle') || "Eight quick gut-check questions. These don't change your score — they're just here to compare against it."}
      </p>
      <ul className="space-y-6">
        {scenarios.map((scenario) => (
          <li key={scenario.axisId}>
            <p className="mb-2 font-medium text-gray-800">{tScenario(scenario.axisId, 'prompt') || scenario.prompt}</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setScenarioAnswer(scenario.axisId, 'A')}
                className={`text-left px-3 py-2 rounded border transition ${
                  scenarioAnswers[scenario.axisId] === 'A' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tScenario(scenario.axisId, 'optionA') || scenario.optionA}
              </button>
              <button
                type="button"
                onClick={() => setScenarioAnswer(scenario.axisId, 'B')}
                className={`text-left px-3 py-2 rounded border transition ${
                  scenarioAnswers[scenario.axisId] === 'B' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tScenario(scenario.axisId, 'optionB') || scenario.optionB}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-between gap-2 mt-8">
        <button type="button" onClick={skipAndGoToResults} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition">
          {t('skip_scenarios') || "Skip for now"}
        </button>
        <button type="button" onClick={submitAndGoToResults} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition">
          {t('see_results') || "See My Results"}
        </button>
      </div>
    </div>
  )
}
