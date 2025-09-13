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
      
      // Convert base64 to blob and create audio URL
      const binaryString = atob(audioBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/wav' })
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