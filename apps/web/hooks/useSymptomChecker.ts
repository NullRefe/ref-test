import { SpeechRecognition } from '@/lib/types/symptom-checker'
import { useEffect, useRef, useState } from 'react'

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const hadError = useRef(false)

  useEffect(() => {
    const SpeechRecognitionConstructor = 
      window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognitionConstructor) {
      setIsSupported(true)
      const recognition = new SpeechRecognitionConstructor()
      
      recognition.continuous = false
      recognition.lang = 'en-IN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript
        setTranscript(result)
      }

      recognition.onend = () => {
        setIsListening(false)
        if (!hadError.current) {
          setError(null)
        }
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        hadError.current = true
        setIsListening(false)
        
        if (event.error === 'no-speech') {
          setError("I didn't hear anything. Please try again.")
        } else if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please allow microphone permissions.")
        } else {
          setError("Sorry, a microphone error occurred.")
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = () => {
    if (!recognitionRef.current || isListening) return
    
    hadError.current = false
    setError(null)
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const resetTranscript = () => {
    setTranscript('')
    setError(null)
  }

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  }
}

export function useApiState<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (apiCall: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}