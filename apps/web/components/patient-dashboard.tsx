"use client"
import { GovtHeader } from "@/components/govt-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Bell, Brain, Calendar, Clock, FileText, Grid3x3, HelpCircle, LogOut, Phone, Pill, Shield, Users, Video, Zap } from "lucide-react"
import { useState } from "react"

interface Consultation {
  id: string
  doctorName: string
  doctorSpecialty: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  type: "video" | "phone"
}

export function PatientDashboard() {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [consultations] = useState<Consultation[]>([
    {
      id: "1",
      doctorName: "Dr. Priya Sharma",
      doctorSpecialty: "General Medicine",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "upcoming",
      type: "video",
    },
    {
      id: "2",
      doctorName: "Dr. Rajesh Kumar",
      doctorSpecialty: "Cardiology",
      date: "2024-01-12",
      time: "2:30 PM",
      status: "completed",
      type: "video",
    },
  ])

  const upcomingConsultations = consultations.filter((c) => c.status === "upcoming")

  if (!t || !t.dashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Government Header */}
      <GovtHeader />

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">{t.dashboard.welcome}, Ramesh Kumar</h1>
              <p className="text-muted-foreground">Patient ID: HC001234 | Last Login: Today, 09:30 AM</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                {t.auth.signOut}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Important Notice */}
            <Card className="govt-card bg-accent/5 border-accent">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-accent-foreground">Government Health Advisory</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Regular health checkups are recommended. Book your consultation today for preventive care.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="govt-card">
              <CardHeader>
                <CardTitle className="text-primary">{t.dashboard.quickActions}</CardTitle>
                <CardDescription>{t.dashboard.accessHealthcareServices}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-4 transition-all duration-300 ${
                  isExpanded ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                }`}>
                  <Button
                    className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                    variant="outline"
                    onClick={() => (window.location.href = "/book-consultation")}
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-sm font-medium">{t.dashboard.bookConsultation}</span>
                  </Button>
                  <Button
                    className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                    variant="outline"
                    onClick={() => (window.location.href = "/health-records")}
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm font-medium">{t.dashboard.healthRecords}</span>
                  </Button>
                  <Button
                    className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                    variant="outline"
                    onClick={() => (window.location.href = "/pharmacy")}
                  >
                    <Pill className="h-6 w-6" />
                    <span className="text-sm font-medium">{t.dashboard.findMedicine}</span>
                  </Button>
                  <Button
                    className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                    variant="outline"
                    onClick={() => (window.location.href = "/symptom-checker")}
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-sm font-medium">{t.dashboard.symptomChecker}</span>
                  </Button>
                  
                  {/* Additional features shown when expanded */}
                  {isExpanded && (
                    <>
                      <Button
                        className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                        variant="outline"
                        onClick={() => (window.location.href = "/medicine")}
                      >
                        <Pill className="h-6 w-6" />
                        <span className="text-sm font-medium">Medicine Tracker</span>
                      </Button>
                      <Button
                        className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                        variant="outline"
                        onClick={() => (window.location.href = "/community-health")}
                      >
                        <Users className="h-6 w-6" />
                        <span className="text-sm font-medium">Community Health</span>
                      </Button>
                      <Button
                        className="h-24 flex-col space-y-2 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                        variant="outline"
                        onClick={() => (window.location.href = "/ambulance")}
                      >
                        <Zap className="h-6 w-6" />
                        <span className="text-sm font-medium">Emergency Services</span>
                      </Button>
                    </>
                  )}
                  
                  {/* See All Features / Collapse button */}
                  <Button
                    className="h-24 flex-col space-y-2 bg-secondary/10 border-secondary/20 hover:bg-secondary hover:text-secondary-foreground"
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <Grid3x3 className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {isExpanded ? "Show Less" : "See All Features"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Consultations */}
            <Card className="govt-card">
              <CardHeader>
                <CardTitle className="text-primary">{t.dashboard.upcomingConsultations}</CardTitle>
                <CardDescription>{t.dashboard.scheduledAppointments}</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingConsultations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {consultation.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{consultation.doctorName}</h4>
                            <p className="text-sm text-muted-foreground">{consultation.doctorSpecialty}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{consultation.date}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{consultation.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="govt-badge h-8 px-3 flex items-center">
                            {consultation.type === "video" ? (
                              <Video className="h-3 w-3 mr-1" />
                            ) : (
                              <Phone className="h-3 w-3 mr-1" />
                            )}
                            {consultation.type}
                          </Badge>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">
                            {t.dashboard.joinCall}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t.dashboard.noUpcomingConsultations}</p>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => (window.location.href = "/book-consultation")}
                    >
                      {t.dashboard.bookFirstConsultation}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Summary */}
            <Card className="govt-card">
              <CardHeader>
                <CardTitle className="text-primary">{t.dashboard.healthSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">120/80</div>
                    <div className="text-xs text-muted-foreground">BP (mmHg)</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">72</div>
                    <div className="text-xs text-muted-foreground">Heart Rate</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">68</div>
                    <div className="text-xs text-muted-foreground">Weight (kg)</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">170</div>
                    <div className="text-xs text-muted-foreground">Height (cm)</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  {t.dashboard.viewFullRecords}
                </Button>
              </CardContent>
            </Card>

            {/* Government Services */}
            <Card className="govt-card">
              <CardHeader>
                <CardTitle className="text-primary">Government Health Schemes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-medium text-sm">Ayushman Bharat</h4>
                  <p className="text-xs text-muted-foreground">Health insurance coverage</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-medium text-sm">Jan Aushadhi</h4>
                  <p className="text-xs text-muted-foreground">Affordable medicines</p>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                  View All Schemes
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="govt-card bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ambulance</span>
                  <Button variant="destructive" size="sm" className="text-xs">
                    Call 108
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Health Helpline</span>
                  <Button variant="destructive" size="sm" className="text-xs">
                    Call 1075
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
