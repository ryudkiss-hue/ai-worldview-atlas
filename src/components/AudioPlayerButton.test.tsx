import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AudioPlayerButton } from './AudioPlayerButton'
import { QuizProvider } from '../state/QuizContext'
import * as ttsUtils from '../lib/tts'

describe('AudioPlayerButton', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    // Reset stored settings in localStorage
    localStorage.clear()
    // Mock empty API key to ensure test is not affected by local .env files
    vi.stubEnv('VITE_ELEVENLABS_API_KEY', '')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('renders the speaker button by default', () => {
    render(
      <QuizProvider>
        <AudioPlayerButton text="Test statement text" questionId={100} />
      </QuizProvider>
    )
    expect(screen.getByRole('button', { name: 'Read question aloud' })).toBeInTheDocument()
  })

  it('shows an error state if clicked without an API key', async () => {
    render(
      <QuizProvider>
        <AudioPlayerButton text="Test statement text" questionId={100} />
      </QuizProvider>
    )
    const button = screen.getByRole('button', { name: 'Read question aloud' })
    fireEvent.click(button)

    // Should display the error message in the title/tooltip (fallback to SpeechSynthesis fails in JSDOM)
    await waitFor(() => {
      expect(button.getAttribute('title')).toContain('Speech synthesis is not supported')
    })
  })

  it('triggers speech fetch and plays audio when API key is provided', async () => {
    // Save fake API key
    localStorage.setItem(
      'elevenlabs_settings',
      JSON.stringify({
        apiKey: 'fake-api-key',
        voiceId: 'naGqKMAolPCi1s94J9jk',
        stability: 0.5,
        similarityBoost: 0.75,
        enabled: true,
      })
    )

    // Mock fetchElevenLabsTTS
    const fetchSpy = vi.spyOn(ttsUtils, 'fetchElevenLabsTTS').mockResolvedValue('blob:http://localhost/fake-audio')
    
    // Mock playGlobalAudio
    const playSpy = vi.spyOn(ttsUtils, 'playGlobalAudio').mockImplementation(async (url, onStop, onEnded) => {
      // simulate playing starts
    })

    render(
      <QuizProvider>
        <AudioPlayerButton text="Simple statement to read" questionId={100} />
      </QuizProvider>
    )

    const button = screen.getByRole('button', { name: 'Read question aloud' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        'Simple statement to read',
        expect.objectContaining({
          apiKey: 'fake-api-key',
          voiceId: 'naGqKMAolPCi1s94J9jk',
        }),
        100,
        false
      )
    })

    expect(playSpy).toHaveBeenCalled()
  })
})
