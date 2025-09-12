"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    CheckCircle,
    Globe,
    Lock,
    Mail,
    Phone,
    Shield
} from "lucide-react"
import { useState } from "react"

interface RegistrationData {
  // Step 1: Basic Account Info
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
  
  // Step 2: Personal Details
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  aadharNumber: string
  
  // Step 3: Medical Information
  bloodGroup: string
  height: string
  weight: string
  allergies: string[]
  chronicConditions: string[]
  currentMedications: string[]
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  
  // Step 4: Address & Preferences
  address: string
  city: string
  state: string
  pincode: string
  preferredLanguage: string
}

type RegistrationStep = 1 | 2 | 3 | 4

const commonAllergies = [
  "Penicillin",
  "Aspirin",
  "Peanuts",
  "Shellfish",
  "Dairy",
  "Eggs",
  "Soy",
  "Latex",
  "Dust mites",
  "Pollen"
]

const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Thyroid Disorder",
  "Kidney Disease",
  "Liver Disease",
  "Mental Health Conditions",
  "Epilepsy"
]

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
]

export function RegisterForm() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RegistrationData>({
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    aadharNumber: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    preferredLanguage: "en"
  })

  const updateFormData = (field: keyof RegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayUpdate = (field: keyof RegistrationData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      }
    })
  }

  const getProgressPercentage = () => {
    return (currentStep / 4) * 100
  }

  const validateStep = (step: RegistrationStep): boolean => {
    switch (step) {
      case 1:
        return !!(formData.phoneNumber && formData.email && formData.password && 
                 formData.confirmPassword && formData.password === formData.confirmPassword)
      case 2:
        return !!(formData.firstName && formData.lastName && formData.dateOfBirth && 
                 formData.gender && formData.aadharNumber)
      case 3:
        return !!(formData.emergencyContactName && formData.emergencyContactPhone && 
                 formData.emergencyContactRelation)
      case 4:
        return !!(formData.address && formData.city && formData.state && formData.pincode)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Redirect to dashboard after successful registration
    window.location.href = "/dashboard"
    setIsLoading(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary">Account Information</h3>
              <p className="text-sm text-muted-foreground">Create your secure account</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  type="tel"
                  className="pl-10 h-11"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  className="pl-10 h-11"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 h-11"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  className="pl-10 h-11"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  required
                />
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary">Personal Details</h3>
              <p className="text-sm text-muted-foreground">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="pl-10 h-11"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender *</Label>
              <RadioGroup 
                value={formData.gender} 
                onValueChange={(value) => updateFormData("gender", value)}
                className="flex space-x-6"
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

            <div className="space-y-2">
              <Label htmlFor="aadhar" className="text-sm font-medium">Aadhar Number *</Label>
              <Input
                id="aadhar"
                placeholder="1234 5678 9012"
                maxLength={12}
                value={formData.aadharNumber}
                onChange={(e) => updateFormData("aadharNumber", e.target.value)}
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary">Medical Information</h3>
              <p className="text-sm text-muted-foreground">Help us provide better care</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData("bloodGroup", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
                <Input
                  id="height"
                  placeholder="170"
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="70"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Known Allergies</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonAllergies.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={formData.allergies.includes(allergy)}
                      onCheckedChange={(checked) => handleArrayUpdate("allergies", allergy, checked as boolean)}
                    />
                    <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Chronic Conditions</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonConditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.chronicConditions.includes(condition)}
                      onCheckedChange={(checked) => handleArrayUpdate("chronicConditions", condition, checked as boolean)}
                    />
                    <Label htmlFor={condition} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-primary">Emergency Contact *</h4>
              <div className="space-y-2">
                <Label htmlFor="emergencyName" className="text-sm font-medium">Contact Name *</Label>
                <Input
                  id="emergencyName"
                  placeholder="Emergency contact name"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateFormData("emergencyContactName", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="emergencyPhone"
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => updateFormData("emergencyContactPhone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation" className="text-sm font-medium">Relationship *</Label>
                  <Select 
                    value={formData.emergencyContactRelation} 
                    onValueChange={(value) => updateFormData("emergencyContactRelation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary">Address & Preferences</h3>
              <p className="text-sm text-muted-foreground">Complete your profile</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
              <Input
                id="address"
                placeholder="House No., Street, Area"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-medium">PIN Code *</Label>
                <Input
                  id="pincode"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => updateFormData("pincode", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">State *</Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredLanguage" className="text-sm font-medium">Preferred Language</Label>
              <Select 
                value={formData.preferredLanguage} 
                onValueChange={(value) => updateFormData("preferredLanguage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Registration Summary</p>
                    <p className="text-muted-foreground mt-1">
                      You're all set! Click "Complete Registration" to create your eNabha account.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Government Header */}
      <div className="govt-header text-primary-foreground py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo/logo.png" alt="Government of India" className="h-8 w-8 govt-emblem" />
            <div>
              <h1 className="text-lg font-bold">eNabha</h1>
              <p className="text-xs opacity-90">Ministry of Health & Family Welfare, Government of India</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Globe className="h-3 w-3 mr-1" />
              भारत सरकार
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Progress Header */}
          <Card className="govt-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">Patient Registration</CardTitle>
              <CardDescription>Create your secure healthcare account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Step {currentStep} of 4</span>
                  <span>{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <Progress value={getProgressPercentage()} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Account</span>
                  <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Personal</span>
                  <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Medical</span>
                  <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Address</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card className="govt-card">
            <CardContent className="pt-6">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 mt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep(4) || isLoading}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{isLoading ? "Creating Account..." : "Complete Registration"}</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="govt-card bg-accent/5 border-accent">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-accent-foreground">Data Security & Privacy</p>
                  <p className="text-muted-foreground mt-1">
                    All information is encrypted and stored securely as per Government of India data protection standards. 
                    Your medical data will only be shared with authorized healthcare providers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => window.location.href = "/"}
              >
                Sign in here
              </Button>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>© {new Date().getFullYear()} Government of India. All rights reserved.</p>
            <p>Best viewed in Chrome, Firefox, Safari, Edge</p>
          </div>
        </div>
      </div>
    </div>
  )
}
