import { useState, useEffect } from 'react'
import { useQuiz } from '../state/QuizContext'
import { fetchElevenLabsTTS, playGlobalAudio, stopGlobalAudio, playBrowserTTS } from '../lib/tts'

interface AudioPlayerButtonProps {
  text: string
  questionId: number
}

export function AudioPlayerButton({ text, questionId }: AudioPlayerButtonProps) {
  const { ttsSettings, showSimplified } = useQuiz()
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Stop playing if this component is unmounted or the text changes
  useEffect(() => {
    return () => {
      if (status === 'playing' || status === 'loading') {
        stopGlobalAudio()
      }
    }
  }, [text, status])

  // Custom listener to react to global audio changes (in case another question plays, stopping this one)
  useEffect(() => {
    if (status === 'playing') {
      const handleGlobalStop = () => {
        setStatus('idle')
      }
      // Since tts.ts doesn't have a full event emitter, we can coordinate through window events
      window.addEventListener('global-audio-stopped', handleGlobalStop)
      return () => {
        window.removeEventListener('global-audio-stopped', handleGlobalStop)
      }
    }
  }, [status])

  async function handleTogglePlay() {
    if (status === 'playing' || status === 'loading') {
      stopGlobalAudio()
      window.dispatchEvent(new CustomEvent('global-audio-stopped'))
      setStatus('idle')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const audioUrl = await fetchElevenLabsTTS(text, ttsSettings, questionId, showSimplified)
      
      // Notify other players to stop
      window.dispatchEvent(new CustomEvent('global-audio-stopped'))

      playGlobalAudio(
        audioUrl,
        () => {
          setStatus('idle')
        },
        () => {
          setStatus('idle')
        }
      )
      setStatus('playing')
    } catch (err: any) {
      console.warn('ElevenLabs unavailable or API key missing, falling back to Web Speech API', err)
      
      // Stop ElevenLabs audio if playing, notify other buttons
      stopGlobalAudio()
      window.dispatchEvent(new CustomEvent('global-audio-stopped'))

      try {
        playBrowserTTS(
          text,
          () => {
            setStatus('idle')
          },
          () => {
            setStatus('idle')
          }
        )
        setStatus('playing')
      } catch (speechErr: any) {
        console.error('Speech synthesis failed', speechErr)
        setStatus('error')
        setErrorMessage('Speech synthesis is not supported on this browser.')
      }
    }
  }

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={handleTogglePlay}
        title={status === 'error' ? errorMessage : 'Read question aloud'}
        className={`p-2 rounded-full transition flex items-center justify-center border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          status === 'playing'
            ? 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700 animate-pulse'
            : status === 'loading'
            ? 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-400'
            : status === 'error'
            ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-500'
            : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-500'
        }`}
      >
        {status === 'loading' ? (
          // Spinner
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : status === 'playing' ? (
          // Stop / Pause Icon
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1.5" />
          </svg>
        ) : status === 'error' ? (
          // Alert / Warning Icon
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          // Speaker Icon
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {status === 'error' && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded p-2 shadow-lg z-50 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
