import { Link, useNavigate } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'
import { stakeholderTags } from '../data/stakeholderTags'
import { LanguageSelector } from '../components/LanguageSelector'

export function IntroPage() {
  const navigate = useNavigate()
  const { reset, selectedStakeholderTags, setStakeholderTags, t } = useQuiz()

  function handleStart() {
    navigate('/quiz/1')
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
        <LanguageSelector />
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
        <button
          type="button"
          onClick={() => {
            reset()
            handleStart()
          }}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {t('start')}
        </button>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Also in the Atlas</p>
        <Link
          to="/compass"
          className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="font-semibold text-gray-800">The Synthetic Compass</span>
          <span className="block text-sm text-gray-600 mt-1">
            120 statements on artificial minds: whether AI systems could have real experiences, how they should be treated, and what
            future intelligence should build. Three axes and 27 archetypes. In English only.
          </span>
        </Link>
      </div>
    </div>
  )
}
