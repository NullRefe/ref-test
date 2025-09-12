export interface CommonSymptom {
  english: string
  hindi: string
}

export interface TranslationResponse {
  language: string
  translation: string
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

export interface SymptomAnalysis {
  originalText: string
  translatedText: string
  detectedLanguage: string
  analysis: string
  translatedAnalysis: string
}

export interface WellnessGuide {
  day1: DayGuide
  day2: DayGuide
  day3: DayGuide
}

export interface DayGuide {
  hydration: string
  meal: string
  activity: string
  rest: string
}

export interface SpecialistInfo {
  type: string
  description: string
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: 'no-speech' | 'audio-capture' | 'not-allowed' | 'network' | 'aborted' | 'bad-grammar' | string
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}