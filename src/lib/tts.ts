const ttsCache = new Map<string, string>()

export interface TTSSettings {
  apiKey: string
  voiceId: string
  stability: number
  similarityBoost: number
  enabled: boolean
}

export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  apiKey: '',
  voiceId: 'z9fAnlkpzviPZ1470tqW', // Glinda: warm, cheery, sweet, and light American female voice
  stability: 0.55,
  similarityBoost: 0.75,
  enabled: false,
}

export function getStoredTTSSettings(): TTSSettings {
  try {
    const saved = localStorage.getItem('elevenlabs_settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...DEFAULT_TTS_SETTINGS, ...parsed }
    }
  } catch (e) {
    console.error('Failed to load ElevenLabs settings', e)
  }

  // Fallback to Vite env variables for key/voice if present
  const envKey = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
  const envVoice = import.meta.env.VITE_ELEVENLABS_VOICE_ID || DEFAULT_TTS_SETTINGS.voiceId
  
  return {
    ...DEFAULT_TTS_SETTINGS,
    apiKey: envKey,
    voiceId: envVoice,
    enabled: !!envKey,
  }
}

export function saveStoredTTSSettings(settings: TTSSettings) {
  localStorage.setItem('elevenlabs_settings', JSON.stringify(settings))
}

export async function fetchElevenLabsTTS(
  text: string,
  settings: TTSSettings
): Promise<string> {
  const cacheKey = `${settings.voiceId}:${text}`
  if (ttsCache.has(cacheKey)) {
    return ttsCache.get(cacheKey)!
  }

  const apiKey = settings.apiKey.trim()
  if (!apiKey) {
    throw new Error('API key is missing. Please provide your ElevenLabs API key in settings.')
  }

  const voiceId = settings.voiceId.trim() || DEFAULT_TTS_SETTINGS.voiceId
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: settings.stability,
        similarity_boost: settings.similarityBoost,
      },
    }),
  })

  if (!response.ok) {
    let errorMessage = `ElevenLabs request failed: ${response.status} ${response.statusText}`
    try {
      const errJson = await response.json()
      if (errJson && errJson.detail && errJson.detail.message) {
        errorMessage = errJson.detail.message
      }
    } catch {
      // Ignored
    }
    throw new Error(errorMessage)
  }

  const blob = await response.blob()
  const audioUrl = URL.createObjectURL(blob)
  ttsCache.set(cacheKey, audioUrl)
  return audioUrl
}

let activeAudio: HTMLAudioElement | null = null
let activeStopCallback: (() => void) | null = null

export function stopGlobalAudio() {
  if (activeAudio) {
    try {
      activeAudio.pause()
    } catch (e) {
      // Ignored
    }
    activeAudio = null
  }
  if (activeStopCallback) {
    try {
      activeStopCallback()
    } catch (e) {
      // Ignored
    }
    activeStopCallback = null
  }
}

export function playGlobalAudio(audioUrl: string, onStop: () => void, onEnded: () => void) {
  stopGlobalAudio()

  const audio = new Audio(audioUrl)
  activeAudio = audio
  activeStopCallback = onStop

  audio.addEventListener('ended', () => {
    onEnded()
    if (activeAudio === audio) {
      activeAudio = null
      activeStopCallback = null
    }
  })

  audio.play().catch((err) => {
    console.error('Playback failed', err)
    onEnded()
    if (activeAudio === audio) {
      activeAudio = null
      activeStopCallback = null
    }
  })
}

