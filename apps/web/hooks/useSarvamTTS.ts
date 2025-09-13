import { textToSpeech } from '@/lib/utils/sarvam-api'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useSarvamTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentAudioUrlRef = useRef<string | null>(null)

  // Cleanup function to revoke object URLs
  const cleanup = useCallback(() => {
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current)
      currentAudioUrlRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const speak = useCallback(async (text: string, language: string = 'hi') => {
    try {
      setError(null)
      setIsGenerating(true)
      
      // Clean up previous audio
      cleanup()
      
      // Generate audio using Sarvam AI
      const audioBase64 = await textToSpeech(text, language)
      
      // Validate that we received audio data
      if (!audioBase64 || typeof audioBase64 !== 'string') {
        throw new Error('No audio data received from Sarvam TTS API')
      }
      
      // Debug: Log the base64 response
      console.log('Received base64 data:', {
        length: audioBase64.length,
        firstChars: audioBase64.substring(0, 50),
        lastChars: audioBase64.substring(audioBase64.length - 50)
      })
      
      // Clean and validate base64 string
      let cleanedBase64 = audioBase64
      
      // Remove data URL prefix if present (e.g., "data:audio/wav;base64,")
      if (cleanedBase64.includes(',')) {
        cleanedBase64 = cleanedBase64.split(',')[1]
      }
      
      // Remove any whitespace, newlines, or invalid characters
      cleanedBase64 = cleanedBase64.replace(/[^A-Za-z0-9+/=]/g, '')
      
      // Validate base64 format
      if (!cleanedBase64 || cleanedBase64.length === 0) {
        throw new Error('Invalid or empty base64 audio data received')
      }
      
      // Add padding if necessary
      while (cleanedBase64.length % 4) {
        cleanedBase64 += '='
      }
      
      // Convert base64 to blob and create audio URL
      let binaryString: string
      try {
        binaryString = atob(cleanedBase64)
      } catch (error) {
        console.error('Failed to decode base64 audio data:', {
          error: error instanceof Error ? error.message : String(error),
          originalLength: audioBase64.length,
          cleanedLength: cleanedBase64.length,
          sample: cleanedBase64.substring(0, 100)
        })
        throw new Error('Invalid base64 audio data format')
      }
      
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Create audio blob (Sarvam API typically returns MP3 format)
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      currentAudioUrlRef.current = audioUrl
      
      // Create and configure audio element
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      // Set up event listeners
      audio.onloadstart = () => {
        setIsGenerating(false)
      }
      
      audio.onplay = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }
      
      audio.onpause = () => {
        setIsPaused(true)
      }
      
      audio.onended = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        cleanup()
      }
      
      audio.onerror = (event) => {
        console.error('Audio playback error:', event)
        setError('Audio playback failed')
        setIsSpeaking(false)
        setIsGenerating(false)
        setIsPaused(false)
        cleanup()
      }
      
      audio.oncanplaythrough = () => {
        setIsGenerating(false)
      }
      
      // Preload and play
      audio.preload = 'auto'
      await audio.play()
    } catch (error) {
      console.error('TTS Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Text-to-speech failed'
      setError(errorMessage)
      setIsGenerating(false)
      setIsSpeaking(false)
      setIsPaused(false)
      cleanup()
    }
  }, [cleanup])

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused && isSpeaking) {
      audioRef.current.play().catch((error) => {
        console.error('Resume playback error:', error)
        setError('Failed to resume playback')
      })
    }
  }, [isSpeaking])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsSpeaking(false)
    setIsPaused(false)
    cleanup()
  }, [cleanup])

  // Get current playback position (for progress indicators if needed)
  const getCurrentTime = useCallback(() => {
    return audioRef.current?.currentTime || 0
  }, [])

  const getDuration = useCallback(() => {
    return audioRef.current?.duration || 0
  }, [])

  return {
    isSpeaking,
    isPaused,
    isGenerating,
    error,
    speak,
    pause,
    resume,
    stop,
    cleanup,
    getCurrentTime,
    getDuration,
    isSupported: typeof window !== 'undefined' && !!window.Audio
  }
}