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
  const blobMimeTypeRef = useRef<string>('audio/webm')
  const recordingStartTimeRef = useRef<number>(0)
  const dataRequestIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setTranscript('') // Clear previous transcript
      
      // Debug browser support
      console.log('MediaRecorder supported:', typeof MediaRecorder !== 'undefined')
      console.log('getUserMedia supported:', !!navigator.mediaDevices?.getUserMedia)
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      
      streamRef.current = stream
      
      // Try MP4 first as it's more universally supported by APIs
      let recordingMimeType = 'audio/mp4'
      blobMimeTypeRef.current = 'audio/mp4'
      
      if (!MediaRecorder.isTypeSupported(recordingMimeType)) {
        // Try webm without codec specification
        recordingMimeType = 'audio/webm'
        blobMimeTypeRef.current = 'audio/webm'
        if (!MediaRecorder.isTypeSupported(recordingMimeType)) {
          // Try wav
          recordingMimeType = 'audio/wav'
          blobMimeTypeRef.current = 'audio/wav'
          if (!MediaRecorder.isTypeSupported(recordingMimeType)) {
            recordingMimeType = '' // Use browser default
            blobMimeTypeRef.current = 'audio/mp4'
          }
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, recordingMimeType ? { mimeType: recordingMimeType } : undefined)
      
      audioChunksRef.current = []
      recordingStartTimeRef.current = Date.now()
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('Audio data received:', event.data.size, 'bytes', 'Type:', event.data.type)
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log('Total chunks so far:', audioChunksRef.current.length)
        }
      }

      mediaRecorder.onstart = () => {
        console.log('MediaRecorder started successfully')
        audioChunksRef.current = [] // Reset chunks when starting
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Recording failed. Please try again.')
        setIsRecording(false)
        setIsProcessing(false)
      }
      
      mediaRecorder.onstop = async () => {
        const recordingDuration = Date.now() - recordingStartTimeRef.current
        setIsProcessing(true)
        
        try {
          // Create audio blob from recorded chunks first
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: blobMimeTypeRef.current
          })
          
          // Check if we have any audio chunks
          if (audioChunksRef.current.length === 0) {
            console.error('No audio chunks collected. MediaRecorder may not be working properly.')
            console.log('Recording duration was:', recordingDuration + 'ms')
            setError('No audio recorded. Please check microphone permissions and try again.')
            setIsProcessing(false)
            return
          }
          
          // Only check if we have actual audio data - no duration restrictions
          if (audioBlob.size < 20) { // Minimal threshold for completely empty recordings
            setError('Audio recording appears to be empty. Please try speaking and try again.')
            setIsProcessing(false)
            return
          }
          
          // If we have any meaningful audio data, proceed regardless of duration
          console.log('Audio validation passed - proceeding with transcription')
          
          console.log('Recording complete:', { 
            type: audioBlob.type, 
            size: audioBlob.size, 
            duration: recordingDuration + 'ms',
            chunksCount: audioChunksRef.current.length,
            chunkSizes: audioChunksRef.current.map(chunk => chunk.size)
          })
          
          // Send to Sarvam API for transcription
          const result = await speechToText(audioBlob)
          setTranscript(result.transcript || '')
          
          if (!result.transcript) {
            setError('No speech detected. Please try speaking more clearly.')
          }
        } catch (error) {
          console.error('STT Error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Speech recognition failed'
          setError(errorMessage)
        } finally {
          setIsProcessing(false)
          // Clean up stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
          }
        }
      }
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Recording failed. Please try again.')
        setIsRecording(false)
        setIsProcessing(false)
      }
      
      mediaRecorderRef.current = mediaRecorder
      
      // Start recording with timeslice to ensure data collection
      mediaRecorder.start(1000) // Collect data every 1 second
      setIsRecording(true)
      
      // Set up periodic data requests as backup
      dataRequestIntervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try {
            mediaRecorderRef.current.requestData()
            console.log('Requested data during recording')
          } catch (error) {
            console.warn('Could not request data during recording:', error)
          }
        }
      }, 2000) // Request data every 2 seconds as backup
      
      console.log('MediaRecorder started, state:', mediaRecorder.state)
    } catch (error) {
      console.error('Microphone access error:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone permissions and try again.')
        } else if (error.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone and try again.')
        } else {
          setError(`Could not access microphone: ${error.message}`)
        }
      } else {
        setError('Could not access microphone. Please check permissions.')
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping MediaRecorder, state:', mediaRecorderRef.current.state)
      
      // Request any pending data before stopping
      if (mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.requestData() // Force data collection
        } catch (error) {
          console.warn('Could not request data:', error)
        }
        
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
          }
        }, 50) // Small delay to ensure data is collected
      }
      
      setIsRecording(false)
    }
    
    // Clean up interval
    if (dataRequestIntervalRef.current) {
      clearInterval(dataRequestIntervalRef.current)
      dataRequestIntervalRef.current = null
    }
    
    // Clean up stream after a short delay
    setTimeout(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }, 100)
  }, [isRecording])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  // Clean up on unmount
  const cleanup = useCallback(() => {
    if (isRecording) {
      stopRecording()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (dataRequestIntervalRef.current) {
      clearInterval(dataRequestIntervalRef.current)
      dataRequestIntervalRef.current = null
    }
  }, [isRecording, stopRecording])

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