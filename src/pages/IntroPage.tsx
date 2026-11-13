import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'
import { stakeholderTags } from '../data/stakeholderTags'
import { axes } from '../data/axes'
import { questions, questionsForAxis } from '../data/questions'

export function IntroPage() {
  const navigate = useNavigate()
  const { reset, selectedStakeholderTags, setStakeholderTags, t, hasProgress, answers, declinedQuestions } = useQuiz()
  const done = Object.keys(answers).length + declinedQuestions.length
  // First axis with a statement still to answer; if none, the quiz is finished and continuing goes to results.
  const nextAxis = axes.find((a) => questionsForAxis(a.id).some((q) => answers[q.id] === undefined && !declinedQuestions.includes(q.id)))

  function handleStart() {
    navigate('/quiz/1')
  }

  function handleContinue() {
    navigate(nextAxis ? `/quiz/${nextAxis.number}` : '/results')
  }

  function toggleTag(tagId: string) {
    if (selectedStakeholderTags.includes(tagId)) {
      setStakeholderTags(selectedStakeholderTags.filter((id) => id !== tagId))
    } else {
      setStakeholderTags([...selectedStakeholderTags, tagId])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('worldview_atlas')}</span>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('intro_title')}</h1>
        <p className="text-gray-700 mb-4">{t('intro_subtitle')}</p>
        <p className="text-sm text-gray-500">{t('intro_notice')}</p>
      </div>

      <div className="mb-8">
        <p className="font-semibold mb-3 text-gray-700">
          Do any of these describe your relationship to AI? (optional, pick as many as apply)
        </p>
        <ul className="space-y-3">
          {stakeholderTags.map((tag) => (
            <li key={tag.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  aria-label={tag.name}
                  checked={selectedStakeholderTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>
                  <span className="font-semibold text-gray-800">{tag.name}</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="text-gray-600 text-sm">{tag.description}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        {hasProgress && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleContinue}
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {nextAxis ? 'Continue where you left off' : 'See your results'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {done} of {questions.length} statements answered. Your answers are saved in this browser only.
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            reset()
            handleStart()
          }}
          className={
            hasProgress
              ? 'px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition'
              : 'px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400'
          }
        >
          {hasProgress ? 'Start over' : t('start')}
        </button>
      </div>
    </div>
  )
}
