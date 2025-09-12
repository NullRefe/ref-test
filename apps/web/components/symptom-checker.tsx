"use client"

import { GovtHeader } from "@/components/govt-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ArrowLeft, ArrowRight, Brain, Calendar, CheckCircle, Phone, Video } from "lucide-react"
import { useState } from "react"

interface Symptom {
  id: string
  name: string
  severity: "mild" | "moderate" | "severe"
  duration: string
  description: string
}

interface Assessment {
  riskLevel: "low" | "moderate" | "high" | "emergency"
  primaryConditions: string[]
  recommendations: string[]
  urgency: string
  nextSteps: string[]
}

export function SymptomChecker() {
  const [currentStep, setCurrentStep] = useState(1)
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [formData, setFormData] = useState({
    primarySymptom: "",
    duration: "",
    severity: "",
    additionalSymptoms: [] as string[],
    age: "",
    gender: "",
    medicalHistory: "",
    currentMedications: "",
  })

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Sore throat",
    "Body ache",
    "Nausea",
    "Dizziness",
    "Chest pain",
    "Shortness of breath",
    "Stomach pain",
    "Fatigue",
    "Skin rash",
  ]

  const emergencySymptoms = [
    "Severe chest pain",
    "Difficulty breathing",
    "Severe bleeding",
    "Loss of consciousness",
    "Severe head injury",
    "Stroke symptoms",
  ]

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis with realistic delay for low-bandwidth optimization
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock AI assessment based on symptoms
    const mockAssessment: Assessment = {
      riskLevel:
        formData.severity === "severe" ||
        emergencySymptoms.some((s) => formData.primarySymptom.toLowerCase().includes(s.toLowerCase()))
          ? "high"
          : formData.severity === "moderate"
            ? "moderate"
            : "low",
      primaryConditions: getPossibleConditions(formData.primarySymptom),
      recommendations: getRecommendations(formData.primarySymptom, formData.severity),
      urgency: getUrgencyLevel(formData.primarySymptom, formData.severity),
      nextSteps: getNextSteps(formData.primarySymptom, formData.severity),
    }

    setAssessment(mockAssessment)
    setIsAnalyzing(false)
    setCurrentStep(4)
  }

  const getPossibleConditions = (symptom: string): string[] => {
    const symptomLower = symptom.toLowerCase()
    if (symptomLower.includes("fever") || symptomLower.includes("cough")) {
      return ["Common Cold", "Flu", "Respiratory Infection"]
    } else if (symptomLower.includes("headache")) {
      return ["Tension Headache", "Migraine", "Dehydration"]
    } else if (symptomLower.includes("stomach") || symptomLower.includes("nausea")) {
      return ["Gastritis", "Food Poisoning", "Indigestion"]
    }
    return ["General Illness", "Viral Infection"]
  }

  const getRecommendations = (symptom: string, severity: string): string[] => {
    const base = ["Rest and stay hydrated", "Monitor symptoms closely"]
    if (severity === "severe") {
      return ["Seek immediate medical attention", ...base]
    } else if (severity === "moderate") {
      return ["Consider consulting a doctor", ...base, "Take over-the-counter medication if needed"]
    }
    return [...base, "Use home remedies", "Consult doctor if symptoms worsen"]
  }

  const getUrgencyLevel = (symptom: string, severity: string): string => {
    if (severity === "severe" || emergencySymptoms.some((s) => symptom.toLowerCase().includes(s.toLowerCase()))) {
      return "Seek immediate medical attention"
    } else if (severity === "moderate") {
      return "Consult a doctor within 24-48 hours"
    }
    return "Monitor symptoms, consult if they worsen"
  }

  const getNextSteps = (symptom: string, severity: string): string[] => {
    const steps = ["Continue monitoring symptoms", "Maintain good hygiene"]
    if (severity === "severe") {
      return ["Call emergency services or visit hospital", "Do not delay medical care", ...steps]
    } else if (severity === "moderate") {
      return ["Book a consultation with a doctor", "Keep a symptom diary", ...steps]
    }
    return ["Try home remedies", "Rest and recover", ...steps]
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "emergency":
        return "bg-red-600"
      case "high":
        return "bg-red-500"
      case "moderate":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAdditionalSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        additionalSymptoms: [...prev.additionalSymptoms, symptom],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        additionalSymptoms: prev.additionalSymptoms.filter((s) => s !== symptom),
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-serif font-semibold">AI Symptom Checker</h1>
                <p className="text-sm text-muted-foreground">Get preliminary health assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 && "Primary Symptom"}
              {currentStep === 2 && "Additional Details"}
              {currentStep === 3 && "Personal Information"}
              {currentStep === 4 && "Assessment Results"}
            </span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Disclaimer */}
        {currentStep === 1 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Important Disclaimer</p>
                  <p className="text-yellow-700 mt-1">
                    This AI symptom checker provides preliminary guidance only and is not a substitute for professional
                    medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Primary Symptom */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">What is your main symptom?</CardTitle>
              <CardDescription>Describe your primary concern or symptom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="primary-symptom">Primary Symptom</Label>
                <Textarea
                  id="primary-symptom"
                  placeholder="Describe your main symptom (e.g., 'I have a severe headache that started this morning')"
                  value={formData.primarySymptom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, primarySymptom: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>How long have you had this symptom?</Label>
                <RadioGroup
                  value={formData.duration}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less-than-day" id="less-than-day" />
                    <Label htmlFor="less-than-day">Less than a day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-3-days" id="1-3-days" />
                    <Label htmlFor="1-3-days">1-3 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4-7-days" id="4-7-days" />
                    <Label htmlFor="4-7-days">4-7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more-than-week" id="more-than-week" />
                    <Label htmlFor="more-than-week">More than a week</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>How severe is this symptom?</Label>
                <RadioGroup
                  value={formData.severity}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">Mild - Doesn't interfere with daily activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate - Some interference with activities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">Severe - Significantly affects daily life</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!formData.primarySymptom || !formData.duration || !formData.severity}
                className="w-full"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Additional Symptoms */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Any additional symptoms?</CardTitle>
              <CardDescription>Select any other symptoms you're experiencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Common symptoms (select all that apply):</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.additionalSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleAdditionalSymptomChange(symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="flex-1">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Personal Information */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Personal Information</CardTitle>
              <CardDescription>Help us provide more accurate assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label htmlFor="medical-history">Medical History (Optional)</Label>
                <Textarea
                  id="medical-history"
                  placeholder="Any chronic conditions, allergies, or previous surgeries"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, medicalHistory: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="current-medications">Current Medications (Optional)</Label>
                <Textarea
                  id="current-medications"
                  placeholder="List any medications you're currently taking"
                  value={formData.currentMedications}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentMedications: e.target.value }))}
                />
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={analyzeSymptoms}
                  disabled={!formData.age || !formData.gender || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      Get Assessment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Assessment Results */}
        {currentStep === 4 && assessment && (
          <div className="space-y-6">
            {/* Risk Level */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Assessment Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`px-4 py-2 rounded-full text-white font-medium ${getRiskColor(assessment.riskLevel)}`}
                  >
                    {assessment.riskLevel.toUpperCase()} RISK
                  </div>
                  <div className="text-sm text-muted-foreground">{assessment.urgency}</div>
                </div>
              </CardContent>
            </Card>

            {/* Possible Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Possible Conditions</CardTitle>
                <CardDescription>Based on your symptoms, these conditions are possible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assessment.primaryConditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessment.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {assessment.riskLevel === "high" && (
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency Services
                    </Button>
                  )}
                  <Button className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Book Consultation with Doctor
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Save Assessment to Health Records
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Start Over */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1)
                  setAssessment(null)
                  setFormData({
                    primarySymptom: "",
                    duration: "",
                    severity: "",
                    additionalSymptoms: [],
                    age: "",
                    gender: "",
                    medicalHistory: "",
                    currentMedications: "",
                  })
                }}
                className="bg-transparent"
              >
                Start New Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
