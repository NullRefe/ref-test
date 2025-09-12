"use client"

import type React from "react"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { languageNames, supportedLanguages } from "@/lib/i18n"
import { Globe, Heart, Lock, Mail, Phone, Shield, User } from "lucide-react"
import { useState } from "react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"patient" | "medical-staff">("patient")
  const [medicalRole, setMedicalRole] = useState<string>("")
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Redirect to dashboard after successful login
    window.location.href = "/dashboard"
    setIsLoading(false)
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
        <div className="w-full max-w-md space-y-6">
          {/* Official Notice */}
          <Card className="govt-card bg-accent/5 border-accent">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-accent-foreground">Official Government Service</p>
                  <p className="text-muted-foreground mt-1">
                    This is an official telemedicine platform by the Government of India. Your data is secure and
                    protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Card */}
          <Card className="govt-card">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-primary">{t.common.welcome} to eNabha</CardTitle>
              <CardDescription>National Telemedicine Service - Secure Healthcare Access</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={userType} onValueChange={(value) => setUserType(value as "patient" | "medical-staff")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="patient" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{t.auth.patient}</span>
                  </TabsTrigger>
                  <TabsTrigger value="medical-staff" className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Medical Staff</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="patient" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-phone" className="text-sm font-medium">
                        {t.auth.phoneNumber} *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient-phone"
                          placeholder="+91 98765 43210"
                          type="tel"
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-password" className="text-sm font-medium">
                        {t.auth.password} *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="patient-password" type="password" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium">
                        {t.auth.preferredLanguage}
                      </Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {languageNames[lang]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? `${t.auth.signIn}...` : t.auth.signInAsPatient}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="medical-staff" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-email" className="text-sm font-medium">
                        {t.auth.email} *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="staff-email"
                          placeholder="staff@hospital.gov.in"
                          type="email"
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-role" className="text-sm font-medium">
                        Role *
                      </Label>
                      <Select value={medicalRole} onValueChange={setMedicalRole} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="specialist">Specialist</SelectItem>
                          <SelectItem value="pharmacist">Pharmacist</SelectItem>
                          <SelectItem value="technician">Medical Technician</SelectItem>
                          <SelectItem value="administrator">Healthcare Administrator</SelectItem>
                          <SelectItem value="paramedic">Paramedic</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-password" className="text-sm font-medium">
                        {t.auth.password} *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="staff-password" type="password" className="pl-10 h-11" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? `${t.auth.signIn}...` : "Sign in as Medical Staff"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center space-y-3">
                <Button variant="link" className="text-sm text-primary">
                  {t.auth.needHelp}
                </Button>
                <div className="text-xs text-muted-foreground">
                  By signing in, you agree to the{" "}
                  <Button variant="link" className="text-xs p-0 h-auto text-primary">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="text-xs p-0 h-auto text-primary">
                    Privacy Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Card - Only show for patients */}
          {userType === "patient" && (
            <Card className="govt-card">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">{t.auth.newToHealthConnect}</p>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    onClick={() => window.location.href = "/register"}
                  >
                    {t.auth.registerNewAccount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
