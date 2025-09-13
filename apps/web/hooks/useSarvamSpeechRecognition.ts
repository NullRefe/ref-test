import { speechToText } from '@/lib/utils/sarvam-api'
import { useCallback, useRef, useState } from 'react'

export function useSarvamSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const recordingStartTimeRef = useRef<number>(0)

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null
      mediaRecorderRef.current.onstop = null
      mediaRecorderRef.current.onerror = null
      mediaRecorderRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setTranscript('')

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      streamRef.current = stream

      // Try to use the most compatible format for Sarvam API
      let recordingMimeType = ''
      const supportedFormats = [
        'audio/wav',
        'audio/webm',
        'audio/mp4',
        'audio/ogg'
      ]

      for (const format of supportedFormats) {
        if (MediaRecorder.isTypeSupported(format)) {
          recordingMimeType = format
          break
        }
      }

      const mediaRecorder = new MediaRecorder(stream, recordingMimeType ? { mimeType: recordingMimeType } : undefined)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const recordingDuration = Date.now() - recordingStartTimeRef.current
        setIsProcessing(true)
        setIsRecording(false)

        if (audioChunksRef.current.length === 0 || recordingDuration < 500) {
          setError(
            recordingDuration < 500
              ? 'Recording was too short. Please press and hold the button to record.'
              : 'No audio recorded. Please check microphone permissions and try again.'
          )
          setIsProcessing(false)
          cleanupStream()
          return
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm'
        })

        console.log('Audio blob created:', {
          type: audioBlob.type,
          size: audioBlob.size,
          mimeType: mediaRecorder.mimeType
        })

        try {
          const result = await speechToText(audioBlob)
          setTranscript(result.transcript || '')
          if (!result.transcript) {
            setError('No speech detected. Please try speaking more clearly.')
          }
        } catch (err) {
          console.error('STT Error:', err)
          const errorMessage = err instanceof Error ? err.message : 'Speech recognition failed'
          setError(errorMessage)
        } finally {
          setIsProcessing(false)
          cleanupStream()
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Recording failed. Please try again.')
        setIsRecording(false)
        setIsProcessing(false)
        cleanupStream()
      }

      mediaRecorder.start()
      recordingStartTimeRef.current = Date.now()
      setIsRecording(true)

    } catch (err) {
      console.error('Microphone access error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone permissions and try again.')
        } else if (err.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone and try again.')
        } else {
          setError(`Could not access microphone: ${err.message}`)
        }
      } else {
        setError('Could not access microphone. Please check permissions.')
      }
      cleanupStream()
    }
  }, [cleanupStream])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  // Main cleanup function for component unmount
  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    cleanupStream()
  }, [cleanupStream])


  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
    cleanup,
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
  }
}