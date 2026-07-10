export interface TTSSettings {
  apiKey: string
  voiceId: string
  stability: number
  similarityBoost: number
  enabled: boolean
}

export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  apiKey: '',
  voiceId: 'naGqKMAolPCi1s94J9jk', // Charlotte: warm, cheery, sweet, and light American female voice
  stability: 0.55,
  similarityBoost: 0.75,
  enabled: false,
}

const CACHE_NAME = 'elevenlabs-tts-cache-v1'
const ttsCache = new Map<string, string>()

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

export async function clearPersistentTTSCache(): Promise<boolean> {
  ttsCache.clear()
  if (typeof caches !== 'undefined') {
    try {
      return await caches.delete(CACHE_NAME)
    } catch (e) {
      console.error('Failed to delete persistent TTS cache', e)
    }
  }
  return false
}

export async function fetchElevenLabsTTS(
  text: string,
  settings: TTSSettings,
  questionId?: number,
  isSimplified?: boolean
): Promise<string> {
  // 1. Try local pre-generated file first (if questionId is provided)
  if (questionId !== undefined) {
    const base = import.meta.env.BASE_URL || '/'
    const typeStr = isSimplified ? 'simp' : 'std'
    // Normalize path slashes
    const basePathNormalized = base.endsWith('/') ? base : `${base}/`
    const localPath = `${basePathNormalized}audio/q_${questionId}_${typeStr}.mp3`
    
    try {
      const checkRes = await fetch(localPath, { method: 'HEAD' })
      if (checkRes.ok) {
        return localPath // Success, use pre-generated file!
      }
    } catch (e) {
      // Fallback
    }
  }

  const cacheKey = `${settings.voiceId}:${settings.stability}:${settings.similarityBoost}:${text}`
  
  // 2. Check in-memory cache
  if (ttsCache.has(cacheKey)) {
    return ttsCache.get(cacheKey)!
  }

  // 3. Check browser persistent Cache Storage (if available)
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE_NAME)
      const fakeUrl = `https://tts.local/${encodeURIComponent(cacheKey)}`
      const cachedResponse = await cache.match(fakeUrl)
      if (cachedResponse) {
        const blob = await cachedResponse.blob()
        const audioUrl = URL.createObjectURL(blob)
        ttsCache.set(cacheKey, audioUrl)
        return audioUrl
      }
    } catch (e) {
      console.warn('Persistent cache match failed, falling back to network', e)
    }
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
      model_id: 'eleven_multilingual_v2',
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
  
  // Save in-memory cache
  ttsCache.set(cacheKey, audioUrl)

  // Save to persistent Cache Storage (if available)
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE_NAME)
      const fakeUrl = `https://tts.local/${encodeURIComponent(cacheKey)}`
      await cache.put(
        fakeUrl,
        new Response(blob, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': blob.size.toString(),
          },
        })
      )
    } catch (e) {
      console.warn('Failed to store audio in persistent Cache Storage', e)
    }
  }

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
