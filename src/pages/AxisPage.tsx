import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questions, questionsForAxis } from '../data/questions'
import { useQuiz } from '../state/QuizContext'
import { ProgressBar } from '../components/ProgressBar'
import { AxisHorizonGroup } from '../components/AxisHorizonGroup'
import { clearPersistentTTSCache } from '../lib/tts'

export function AxisPage() {
  const { axisIndex } = useParams<{ axisIndex: string }>()
  const navigate = useNavigate()
  const {
    answers,
    setAnswer,
    declinedQuestions,
    declineQuestion,
    questionOrder,
    showSimplified,
    setShowSimplified,
    ttsSettings,
    setTtsSettings,
    t,
    tAxis,
  } = useQuiz()

  const [showTtsPanel, setShowTtsPanel] = useState(false)

  const index = Number(axisIndex)
  const axis = axes.find((a) => a.number === index)

  if (!axis) {
    return <p>Unknown axis.</p>
  }

  const allQuestions = questionsForAxis(axis.id)
  const order = questionOrder[axis.id]
  const byId = new Map(allQuestions.map((q) => [q.id, q]))
  const t1Questions = order.t1.map((id) => byId.get(id)!)
  const t2Questions = order.t2.map((id) => byId.get(id)!)
  const allAnswered = allQuestions.every((q) => answers[q.id] !== undefined || declinedQuestions.includes(q.id))
  const answeredCount = Object.keys(answers).length + declinedQuestions.length

  function goNext() {
    if (index === 8) {
      navigate('/scenarios')
    } else {
      navigate(`/quiz/${index + 1}`)
    }
  }

  function goBack() {
    if (index === 1) {
      navigate('/')
    } else {
      navigate(`/quiz/${index - 1}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProgressBar
        current={answeredCount}
        total={questions.length}
        label={`${t('axis') || 'Axis'} ${index} of 8 · ${t('question') || 'Question'} ${answeredCount} of ${questions.length}`}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
        <h2 className="text-2xl font-bold">{tAxis(axis.id, 'name')}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full select-none transition border border-gray-200">
            <input
              type="checkbox"
              checked={showSimplified}
              onChange={(e) => setShowSimplified(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-semibold select-none">{t('simple_reading')}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowTtsPanel(!showTtsPanel)}
            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border text-sm font-semibold transition ${
              showTtsPanel
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{t('voice_settings')}</span>
          </button>
        </div>
      </div>

      {showTtsPanel && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="font-bold text-gray-800 text-sm">{t('voice_settings')}</h4>
            <button
              type="button"
              onClick={() => setShowTtsPanel(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
            >
              {t('close') || 'Close'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                placeholder="Paste ElevenLabs API key..."
                value={ttsSettings.apiKey}
                onChange={(e) => setTtsSettings({ ...ttsSettings, apiKey: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Voice ID</label>
              <input
                type="text"
                placeholder="Voice ID..."
                value={ttsSettings.voiceId}
                onChange={(e) => setTtsSettings({ ...ttsSettings, voiceId: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Stability: {Math.round(ttsSettings.stability * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={ttsSettings.stability * 100}
                onChange={(e) => setTtsSettings({ ...ttsSettings, stability: Number(e.target.value) / 100 })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Clarity / Similarity: {Math.round(ttsSettings.similarityBoost * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={ttsSettings.similarityBoost * 100}
                onChange={(e) => setTtsSettings({ ...ttsSettings, similarityBoost: Number(e.target.value) / 100 })}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-500 leading-normal flex-1">
              To use this feature, add your personal API Key from{' '}
              <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                elevenlabs.io
              </a>
              . The default Voice ID is set to <strong>Charlotte</strong> (a warm, sweet, light American voice).
            </p>
            <button
              type="button"
              onClick={async () => {
                await clearPersistentTTSCache()
                alert('All cached speech files cleared!')
              }}
              className="text-xs text-red-600 hover:text-red-800 underline font-semibold focus:outline-none whitespace-nowrap self-start sm:self-center"
            >
              {t('clear_cache')}
            </button>
          </div>
        </div>
      )}

      <AxisHorizonGroup
        title={t('horizon_t1') || "Right Now (Next 2-5 Years)"}
        questions={t1Questions}
        answers={answers}
        declinedQuestions={declinedQuestions}
        onAnswer={setAnswer}
        onDecline={declineQuestion}
        showSimplified={showSimplified}
      />
      <AxisHorizonGroup
        title={t('horizon_t2') || "Looking Ahead (20-50 Years)"}
        questions={t2Questions}
        answers={answers}
        declinedQuestions={declinedQuestions}
        onAnswer={setAnswer}
        onDecline={declineQuestion}
        showSimplified={showSimplified}
      />
      <div className="flex flex-wrap justify-between gap-2 mt-6">
        <button type="button" onClick={goBack} className="px-4 py-2 rounded border border-gray-300">
          {t('back')}
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!allAnswered}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('next')}
        </button>
      </div>
    </div>
  )
}
