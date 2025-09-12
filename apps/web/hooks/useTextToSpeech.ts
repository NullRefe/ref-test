"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface TextToSpeechOptions {
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

export interface TextToSpeechState {
  isSupported: boolean
  isSpeaking: boolean
  isPaused: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  error: string | null
}

export interface TextToSpeechControls {
  speak: (text: string, options?: TextToSpeechOptions) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setVoice: (voice: SpeechSynthesisVoice | null) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
  setVolume: (volume: number) => void
}

export function useTextToSpeech(): TextToSpeechState & TextToSpeechControls {
  const [isSupported] = useState(() => 
    typeof window !== 'undefined' && 'speechSynthesis' in window
  )
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rate, setRateState] = useState(1)
  const [pitch, setPitchState] = useState(1)
  const [volume, setVolumeState] = useState(1)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load available voices
  useEffect(() => {
    if (!isSupported) return

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
      
      // Auto-select the best voice for English with good pronunciation
      if (!selectedVoice && availableVoices.length > 0) {
        // Prefer native voices over network voices for better pronunciation
        const nativeEnglishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en') && voice.localService
        )
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en')
        )
        const allVoices = availableVoices
        
        const bestVoice = nativeEnglishVoices[0] || englishVoices[0] || allVoices[0]
        setSelectedVoice(bestVoice)
      }
    }

    loadVoices()
    
    // Some browsers load voices asynchronously
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [isSupported, selectedVoice])

  // Monitor speech synthesis status
  useEffect(() => {
    if (!isSupported) return

    const checkStatus = () => {
      setIsSpeaking(speechSynthesis.speaking)
      setIsPaused(speechSynthesis.paused)
    }

    const interval = setInterval(checkStatus, 100)
    return () => clearInterval(interval)
  }, [isSupported])

  const speak = useCallback((text: string, options?: TextToSpeechOptions) => {
    if (!isSupported) {
      setError('Text-to-speech is not supported in this browser')
      return
    }

    // Stop any current speech
    speechSynthesis.cancel()
    setError(null)

    try {
      // Remove markdown formatting for better speech
      const cleanText = text
        .replace(/[#*_`~]/g, '') // Remove markdown symbols
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
        .replace(/\n\s*\n/g, '. ') // Convert line breaks to periods
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()

      if (!cleanText) return

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utteranceRef.current = utterance

      // Apply voice and settings
      if (options?.voice || selectedVoice) {
        utterance.voice = options?.voice || selectedVoice
      }
      
      utterance.rate = options?.rate ?? rate
      utterance.pitch = options?.pitch ?? pitch  
      utterance.volume = options?.volume ?? volume
      
      // Set language for better pronunciation
      if (options?.lang) {
        utterance.lang = options.lang
      } else if (selectedVoice?.lang) {
        utterance.lang = selectedVoice.lang
      } else {
        utterance.lang = 'en-US' // Default to US English for best pronunciation
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        setError(null)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        utteranceRef.current = null
      }

      utterance.onerror = (event) => {
        setError(`Speech error: ${event.error}`)
        setIsSpeaking(false)
        setIsPaused(false)
        utteranceRef.current = null
      }

      utterance.onpause = () => {
        setIsPaused(true)
      }

      utterance.onresume = () => {
        setIsPaused(false)
      }

      // Start speaking
      speechSynthesis.speak(utterance)
    } catch (err) {
      setError(`Failed to start speech: ${err}`)
    }
  }, [isSupported, selectedVoice, rate, pitch, volume])

  const pause = useCallback(() => {
    if (isSupported && isSpeaking && !isPaused) {
      speechSynthesis.pause()
    }
  }, [isSupported, isSpeaking, isPaused])

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume()
    }
  }, [isSupported, isPaused])

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
    }
  }, [isSupported])

  const setVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setSelectedVoice(voice)
  }, [])

  const setRate = useCallback((newRate: number) => {
    setRateState(Math.max(0.1, Math.min(2, newRate)))
  }, [])

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(Math.max(0, Math.min(2, newPitch)))
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  return {
    // State
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    error,
    
    // Controls
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  }
}