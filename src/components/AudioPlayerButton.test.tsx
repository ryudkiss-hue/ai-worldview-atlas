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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the speaker button by default', () => {
    render(
      <QuizProvider>
        <AudioPlayerButton text="Test statement text" questionId={1} />
      </QuizProvider>
    )
    expect(screen.getByRole('button', { name: 'Read question aloud' })).toBeInTheDocument()
  })

  it('shows an error state if clicked without an API key', async () => {
    render(
      <QuizProvider>
        <AudioPlayerButton text="Test statement text" questionId={1} />
      </QuizProvider>
    )
    const button = screen.getByRole('button', { name: 'Read question aloud' })
    fireEvent.click(button)

    // Should display the error message in the title/tooltip
    await waitFor(() => {
      expect(button.getAttribute('title')).toContain('API key is missing')
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
    const playSpy = vi.spyOn(ttsUtils, 'playGlobalAudio').mockImplementation((url, onStop, onEnded) => {
      // simulate playing starts
    })

    render(
      <QuizProvider>
        <AudioPlayerButton text="Simple statement to read" questionId={1} />
      </QuizProvider>
    )

    const button = screen.getByRole('button', { name: 'Read question aloud' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('Simple statement to read', expect.objectContaining({
        apiKey: 'fake-api-key',
        voiceId: 'naGqKMAolPCi1s94J9jk',
      }))
    })

    expect(playSpy).toHaveBeenCalled()
  })
})
