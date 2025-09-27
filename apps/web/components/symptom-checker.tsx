"use client"

import { GovtHeader } from "@/components/govt-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSarvamSpeechRecognition } from "@/hooks/useSarvamSpeechRecognition"
import { useSarvamTTS } from "@/hooks/useSarvamTTS"
import { useApiState } from "@/hooks/useSymptomChecker"
import { SymptomAnalysis } from "@/lib/types/symptom-checker"
import {
  COMMON_SYMPTOMS,
  findSpecialistTypes,
  generateWellnessGuide,
  translateAndAnalyzeSymptoms
} from "@/lib/utils/gemini-api"
import { AlertTriangle, ArrowLeft, Loader2, Mic, MicOff, Pause, Play, Search, Sparkles, Volume2, VolumeX } from "lucide-react"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export function SymptomChecker() {
  const [symptomsText, setSymptomsText] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [extraResult, setExtraResult] = useState("")
  
  // Custom hooks
  const speechRecognition = useSarvamSpeechRecognition()
  const analysisApi = useApiState<SymptomAnalysis>()
  const wellnessApi = useApiState<string>()
  const specialistApi = useApiState<string>()
  const textToSpeech = useSarvamTTS()

  useEffect(() => {
    if (speechRecognition.transcript) {
      setSymptomsText(speechRecognition.transcript)
    }
  }, [speechRecognition.transcript])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechRecognition.cleanup()
      textToSpeech.cleanup()
    }
  }, [speechRecognition.cleanup, textToSpeech.cleanup])

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms(prev => [...prev, symptom])
    } else {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom))
    }
  }

  const handleSubmit = async () => {
    let combinedSymptoms = symptomsText.trim()
    
    if (selectedSymptoms.length > 0) {
      combinedSymptoms += (combinedSymptoms ? ", " : "") + selectedSymptoms.join(", ")
    }

    if (!combinedSymptoms) {
      return
    }

    setShowResults(true)
    setShowActions(false)
    setExtraResult("")

    try {
      console.log("Starting symptom analysis for:", combinedSymptoms)
      await analysisApi.execute(() => translateAndAnalyzeSymptoms(combinedSymptoms))
      console.log("Symptom analysis completed successfully")
      setShowActions(true)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      // The error will be handled by the analysisApi.error state
    }
  }

  const handleWellnessGuide = async () => {
    if (!analysisApi.data) return
    
    setExtraResult("")
    try {
      const result = await wellnessApi.execute(() => 
        generateWellnessGuide(
          analysisApi.data!.translatedText, 
          analysisApi.data!.detectedLanguage
        )
      )
      setExtraResult(result)
    } catch (error) {
      console.error("Error generating wellness guide:", error)
    }
  }

  const handleSpecialistSearch = async () => {
    if (!analysisApi.data) return
    
    setExtraResult("")
    try {
      const result = await specialistApi.execute(() => 
        findSpecialistTypes(
          analysisApi.data!.translatedText, 
          analysisApi.data!.detectedLanguage
        )
      )
      setExtraResult(result)
    } catch (error) {
      console.error("Error finding specialists:", error)
    }
  }

  // TTS Control Component
  const TTSControls = ({ text, language = 'hi', isCompact = false }: { 
    text: string; 
    language?: string;
    isCompact?: boolean 
  }) => {
    if (!textToSpeech.isSupported || !text.trim()) return null

    return (
      <div className={`flex items-center ${isCompact ? 'space-x-1' : 'space-x-2'}`}>
        {!textToSpeech.isSpeaking && !textToSpeech.isGenerating ? (
          <Button
            variant="ghost"
            size={isCompact ? "sm" : "default"}
            onClick={() => textToSpeech.speak(text, language)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Listen to this content"
          >
            <Volume2 className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${isCompact ? '' : 'mr-1'}`} />
            {!isCompact && <span className="text-sm">Listen</span>}
          </Button>
        ) : textToSpeech.isGenerating ? (
          <Button
            variant="ghost"
            size={isCompact ? "sm" : "default"}
            disabled
            className="text-blue-600"
          >
            <Loader2 className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} animate-spin ${isCompact ? '' : 'mr-1'}`} />
            {!isCompact && <span className="text-sm">Generating...</span>}
          </Button>
        ) : (
          <div className="flex items-center space-x-1">
            {textToSpeech.isPaused ? (
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "default"}
                onClick={textToSpeech.resume}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Resume playback"
              >
                <Play className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${isCompact ? '' : 'mr-1'}`} />
                {!isCompact && <span className="text-sm">Resume</span>}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "default"}
                onClick={textToSpeech.pause}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                title="Pause playback"
              >
                <Pause className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${isCompact ? '' : 'mr-1'}`} />
                {!isCompact && <span className="text-sm">Pause</span>}
              </Button>
            )}
            <Button
              variant="ghost"
              size={isCompact ? "sm" : "default"}
              onClick={textToSpeech.stop}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Stop playback"
            >
              <VolumeX className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${isCompact ? '' : 'mr-1'}`} />
              {!isCompact && <span className="text-sm">Stop</span>}
            </Button>
          </div>
        )}
        {textToSpeech.error && (
          <span className="text-xs text-red-500 ml-2" title={textToSpeech.error}>
            Audio Error
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button onClick ={ () => {window.location.href = "/dashboard" }} variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
            AI Symptom Checker
          </h1>
          <p className="text-muted-foreground">AI-powered health insights. Not a medical diagnosis.</p>
        </header>

        <main className="space-y-6">
          {/* Disclaimer */}
          <Card className="govt-card bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-destructive">Important Disclaimer</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This tool provides general information only and is not a substitute for professional medical advice. 
                    Please consult a doctor for any health concerns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Input Section */}
          <Card className="govt-card">
            <CardHeader>
              <CardTitle className="font-serif">Describe Your Symptoms</CardTitle>
              <CardDescription>
                Enter your symptoms in any language or select from common options below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="symptoms-text" className="text-sm font-medium mb-2">
                  Symptom Description
                </Label>
                <Textarea
                  id="symptoms-text"
                  rows={4}
                  className="w-full"
                  placeholder={
                    speechRecognition.error 
                      ? speechRecognition.error
                      : speechRecognition.isRecording 
                        ? "🎤 Recording... Please speak now" 
                        : "उदा. मुझे सिरदर्द और बुखार है... (e.g., I have a headache and fever...)"
                  }
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                />
              </div>
              
              {/* Voice Input Button - Positioned Below */}
              <div className="flex flex-col items-center">
                <Button
                  type="button"
                  variant={(speechRecognition.isRecording || speechRecognition.isProcessing) ? "destructive" : "outline"}
                  className={`h-16 w-16 rounded-full p-0 transition-all duration-200 ${
                    speechRecognition.isRecording 
                      ? 'animate-pulse shadow-lg shadow-destructive/25 bg-destructive text-destructive-foreground border-2 border-destructive'
                      : speechRecognition.isProcessing
                        ? 'animate-pulse bg-blue-500 text-white border-2 border-blue-500'
                        : 'hover:shadow-lg hover:scale-105 border-2 border-blue-500 hover:border-blue-600'
                  } ${!speechRecognition.isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={
                    !speechRecognition.isSupported 
                      ? "Speech recognition not supported in this browser"
                      : speechRecognition.isProcessing
                        ? "Processing speech..."
                        : speechRecognition.isRecording 
                          ? "Click to stop recording" 
                          : "Click to start voice input"
                  }
                  onClick={speechRecognition.isRecording ? speechRecognition.stopRecording : speechRecognition.startRecording}
                  disabled={!speechRecognition.isSupported || speechRecognition.isProcessing}
                >
                  {speechRecognition.isProcessing ? (
                    <Loader2 className="h-7 w-7 animate-spin" />
                  ) : speechRecognition.isRecording ? (
                    <MicOff className="h-7 w-7" />
                  ) : (
                    <Mic className="h-7 w-7" />
                  )}
                </Button>
                
                {/* Status Text */}
                <div className="mt-3 text-center">
                  {speechRecognition.isRecording && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-destructive font-medium">
                      <div className="animate-pulse h-2 w-2 bg-destructive rounded-full"></div>
                      <span>Recording audio...</span>
                    </div>
                  )}
                  {speechRecognition.isProcessing && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 font-medium">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Processing speech...</span>
                    </div>
                  )}
                  {!speechRecognition.isRecording && !speechRecognition.isProcessing && !speechRecognition.error && speechRecognition.isSupported && (
                    <span className="text-xs text-muted-foreground">Tap to speak</span>
                  )}
                  {speechRecognition.error && (
                    <div className="text-xs text-destructive max-w-xs">
                      {speechRecognition.error}
                    </div>
                  )}
                  {!speechRecognition.isSupported && (
                    <span className="text-xs text-muted-foreground">Voice input not available</span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3">Common Symptoms (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <div key={symptom.english} className="flex items-center space-x-2 p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors">
                      <Checkbox
                        id={symptom.english.toLowerCase().replace(/\s/g, '-')}
                        checked={selectedSymptoms.includes(symptom.english)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom.english, checked as boolean)}
                      />
                      <Label 
                        htmlFor={symptom.english.toLowerCase().replace(/\s/g, '-')}
                        className="cursor-pointer text-sm leading-tight"
                      >
                        {symptom.english} / {symptom.hindi}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={analysisApi.loading || (!symptomsText.trim() && selectedSymptoms.length === 0)}
                className="w-full"
                size="lg"
              >
                {analysisApi.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  'Analyze Symptoms'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          {showResults && (
            <Card className="govt-card border-2 border-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-serif text-blue-900">AI Analysis Results</CardTitle>
                    <CardDescription className="text-blue-700">
                      Comprehensive health assessment based on your symptoms
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {analysisApi.loading && (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <div className="relative">
                        <div className="h-16 w-16 border-4 border-blue-200 rounded-full mx-auto mb-6"></div>
                        <Loader2 className="h-16 w-16 animate-spin text-blue-500 absolute top-0 left-1/2 transform -translate-x-1/2" />
                      </div>
                      <p className="text-muted-foreground text-lg">Analyzing your symptoms...</p>
                      <p className="text-sm text-blue-600 mt-2">This may take a few seconds</p>
                    </div>
                  </div>
                )}
                
                {analysisApi.error && (
                  <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                      <p className="text-red-700 font-semibold text-lg">Analysis Error</p>
                    </div>
                    <p className="text-red-600 mb-4">
                      Sorry, we encountered an issue while analyzing your symptoms. This could be due to a temporary network issue or high server load.
                    </p>
                    <div className="flex items-center space-x-3 mb-4">
                      <Button 
                        onClick={handleSubmit}
                        variant="outline"
                        className="bg-white hover:bg-red-50 border-red-300 text-red-700"
                      >
                        Try Again
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowResults(false)
                          analysisApi.reset()
                        }}
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                      >
                        Go Back
                      </Button>
                    </div>
                    <details className="mt-3">
                      <summary className="text-sm text-red-500 cursor-pointer hover:text-red-700">
                        Technical Details
                      </summary>
                      <p className="text-xs text-red-400 mt-2 font-mono bg-red-100 p-2 rounded">
                        {analysisApi.error}
                      </p>
                    </details>
                  </div>
                )}
                
                {analysisApi.data && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-green-800">Health Assessment</h3>
                        </div>
                        <TTSControls 
                          text={analysisApi.data.translatedAnalysis} 
                          language={analysisApi.data.detectedLanguage === 'en' ? 'en' : 'hi'}
                        />
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-base">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            h1: ({children}) => <h1 className="text-xl font-bold mb-3 text-gray-900">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-semibold mb-2 text-gray-800">{children}</h2>,
                            h3: ({children}) => <h3 className="text-md font-medium mb-2 text-gray-800">{children}</h3>,
                            p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="ml-2">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                            code: ({children}) => <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                            pre: ({children}) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm">{children}</pre>
                          }}
                        >
                          {analysisApi.data.translatedAnalysis}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    {analysisApi.data.detectedLanguage && analysisApi.data.detectedLanguage !== 'en' && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Language Detected:</span> {analysisApi.data.detectedLanguage.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
              
          {/* Wellness and Specialist Features */}
          {showActions && analysisApi.data && (
            <Card className="govt-card">
              <CardHeader>
                <CardTitle className="font-serif text-center">Next Steps & Wellness Support</CardTitle>
                <CardDescription className="text-center">
                  Get personalized recommendations and find appropriate healthcare specialists
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleWellnessGuide}
                    disabled={wellnessApi.loading}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    {wellnessApi.loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Guide...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate 3-Day Wellness Guide
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSpecialistSearch}
                    disabled={specialistApi.loading}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    {specialistApi.loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Find Local Specialist Types
                      </>
                    )}
                  </Button>
                </div>
                
                {(wellnessApi.loading || specialistApi.loading) && (
                  <div className="flex justify-center py-4">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Processing request...</p>
                    </div>
                  </div>
                )}
                
                {extraResult && (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-800">Additional Information</h4>
                      <TTSControls 
                        text={extraResult} 
                        language={analysisApi.data?.detectedLanguage === 'en' ? 'en' : 'hi'}
                        isCompact={true} 
                      />
                    </div>
                    <div className="prose prose-sm max-w-none text-sm leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold mb-3 text-gray-900">{children}</h1>,
                          h2: ({children}) => <h2 className="text-md font-semibold mb-2 text-gray-800">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-medium mb-2 text-gray-800">{children}</h3>,
                          p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="ml-2">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-primary/40 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                          code: ({children}) => <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-xs">{children}</pre>
                        }}
                      >
                        {extraResult}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {(wellnessApi.error || specialistApi.error) && (
                  <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg mt-4">
                    <p className="text-destructive font-medium">Request Error</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {wellnessApi.error || specialistApi.error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
