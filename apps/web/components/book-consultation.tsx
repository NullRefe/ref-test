"use client"
import { GovtHeader } from "@/components/govt-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft, Calendar, Check, Clock, Phone, Star, Video } from "lucide-react"
import { useState } from "react"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  rating: number
  languages: string[]
  consultationFee: number
  availableSlots: string[]
  image?: string
}

interface BookingStep {
  step: "doctor-selection" | "time-selection" | "confirmation" | "success"
}

export function BookConsultation({ onClose }: { onClose?: () => void }) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState<BookingStep["step"]>("doctor-selection")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [consultationType, setConsultationType] = useState<"video" | "phone">("video")

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      experience: 8,
      rating: 4.8,
      languages: ["English", "Hindi", "Punjabi"],
      consultationFee: 500,
      availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
    },
    {
      id: "2",
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      experience: 12,
      rating: 4.9,
      languages: ["English", "Hindi"],
      consultationFee: 800,
      availableSlots: ["11:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
    },
    {
      id: "3",
      name: "Dr. Simran Kaur",
      specialty: "Pediatrics",
      experience: 6,
      rating: 4.7,
      languages: ["English", "Hindi", "Punjabi"],
      consultationFee: 600,
      availableSlots: ["10:00 AM", "12:00 PM", "02:30 PM", "04:00 PM"],
    },
  ]

  const availableDates = ["2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20"]

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setCurrentStep("time-selection")
  }

  const handleTimeSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setCurrentStep("confirmation")
  }

  const handleBooking = () => {
    // In a real app, this would make an API call to book the consultation
    setCurrentStep("success")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!t || !t.booking) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {currentStep !== "doctor-selection" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentStep === "time-selection") setCurrentStep("doctor-selection")
                  else if (currentStep === "confirmation") setCurrentStep("time-selection")
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.common.back}
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-serif font-bold">{t.booking.title}</h1>
              <p className="text-muted-foreground">{t.booking.subtitle}</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${currentStep === "doctor-selection" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "doctor-selection" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                1
              </div>
              <span className="text-sm font-medium">{t.booking.selectDoctor}</span>
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "time-selection" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "time-selection" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                2
              </div>
              <span className="text-sm font-medium">{t.booking.selectTime}</span>
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "confirmation" || currentStep === "success" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "confirmation" || currentStep === "success" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {currentStep === "success" ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <span className="text-sm font-medium">{t.booking.confirm}</span>
            </div>
          </div>
        </div>

        {/* Doctor Selection */}
        {currentStep === "doctor-selection" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold">{t.booking.availableDoctors}</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={consultationType === "video" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConsultationType("video")}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {t.booking.videoCall}
                </Button>
                <Button
                  variant={consultationType === "phone" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConsultationType("phone")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t.booking.phoneCall}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={`/placeholder.svg?height=64&width=64&query=doctor-${doctor.name}`} />
                          <AvatarFallback className="text-lg">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-serif font-semibold">{doctor.name}</h3>
                          <p className="text-muted-foreground">{doctor.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {doctor.experience} {t.booking.yearsExperience}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doctor.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">₹{doctor.consultationFee}</p>
                        <p className="text-sm text-muted-foreground">{t.booking.consultationFee}</p>
                        <Button className="mt-2" onClick={() => handleDoctorSelect(doctor)}>
                          {t.booking.selectDoctor}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {currentStep === "time-selection" && selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/placeholder.svg?height=48&width=48&query=doctor-${selectedDoctor.name}`} />
                <AvatarFallback>
                  {selectedDoctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-serif font-semibold">{selectedDoctor.name}</h2>
                <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-serif font-semibold mb-4">{t.booking.selectDate}</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {availableDates.map((date) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center"
                    onClick={() => setSelectedDate(date)}
                  >
                    <Calendar className="h-4 w-4 mb-1" />
                    <span className="text-xs">{formatDate(date).split(",")[0]}</span>
                    <span className="text-xs font-medium">{date.split("-")[2]}</span>
                  </Button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <h3 className="text-lg font-serif font-semibold mb-4">{t.booking.selectTime}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedDoctor.availableSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="flex items-center justify-center space-x-2"
                      onClick={() => handleTimeSelect(selectedDate, time)}
                    >
                      <Clock className="h-4 w-4" />
                      <span>{time}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation */}
        {currentStep === "confirmation" && selectedDoctor && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">{t.booking.confirmBooking}</CardTitle>
                <CardDescription>{t.booking.reviewDetails}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48&query=doctor-${selectedDoctor.name}`} />
                    <AvatarFallback>
                      {selectedDoctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                  </div>
                  <Badge variant="secondary">
                    {consultationType === "video" ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <Phone className="h-3 w-3 mr-1" />
                    )}
                    {consultationType === "video" ? t.booking.videoCall : t.booking.phoneCall}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{t.booking.date}</span>
                    </div>
                    <p className="text-sm">{formatDate(selectedDate)}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{t.booking.time}</span>
                    </div>
                    <p className="text-sm">{selectedTime}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <span className="font-medium">{t.booking.consultationFee}</span>
                  <span className="text-lg font-semibold">₹{selectedDoctor.consultationFee}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleBooking}>
                  {t.booking.confirmAndPay}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success */}
        {currentStep === "success" && selectedDoctor && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-green-600 mb-2">{t.booking.bookingConfirmed}</h2>
              <p className="text-muted-foreground">{t.booking.bookingSuccess}</p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold">{t.booking.appointmentDetails}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t.booking.doctor}</span>
                    <span className="text-sm font-medium">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t.booking.date}</span>
                    <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t.booking.time}</span>
                    <span className="text-sm font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t.booking.type}</span>
                    <span className="text-sm font-medium">
                      {consultationType === "video" ? t.booking.videoCall : t.booking.phoneCall}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => (window.location.href = "/dashboard")}>{t.booking.goToDashboard}</Button>
              <Button variant="outline" onClick={onClose}>
                {t.booking.bookAnother}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
