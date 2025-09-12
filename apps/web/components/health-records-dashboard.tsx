"use client"

import { GovtHeader } from "@/components/govt-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Activity,
    ArrowLeft,
    Calendar,
    Download,
    FileText,
    Heart,
    Pill,
    TestTube,
    User,
    Wifi,
    WifiOff,
} from "lucide-react"
import { useEffect, useState } from "react"

interface MedicalRecord {
  id: string
  type: "consultation" | "prescription" | "test" | "vaccination"
  title: string
  date: string
  doctor: string
  summary: string
  details?: string
  attachments?: string[]
}

interface VitalSigns {
  bloodPressure: string
  heartRate: string
  temperature: string
  weight: string
  height: string
  lastUpdated: string
}

export function HealthRecordsDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    weight: "68 kg",
    height: "170 cm",
    lastUpdated: "2024-01-15",
  })

  useEffect(() => {
    // Simulate offline/online detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load sample data (in real app, this would sync from server/local storage)
    const sampleRecords: MedicalRecord[] = [
      {
        id: "1",
        type: "consultation",
        title: "General Checkup",
        date: "2024-01-15",
        doctor: "Dr. Priya Sharma",
        summary: "Routine health checkup. Patient reports feeling well. Blood pressure normal.",
        details:
          "Patient presented for routine checkup. No acute complaints. Physical examination normal. Advised to continue current medications and follow up in 3 months.",
      },
      {
        id: "2",
        type: "prescription",
        title: "Blood Pressure Medication",
        date: "2024-01-15",
        doctor: "Dr. Priya Sharma",
        summary: "Amlodipine 5mg once daily for blood pressure control",
        details: "Amlodipine 5mg tablet - Take one tablet daily in the morning. Continue for 3 months.",
      },
      {
        id: "3",
        type: "test",
        title: "Blood Test Results",
        date: "2024-01-10",
        doctor: "Dr. Rajesh Kumar",
        summary: "Complete blood count and lipid profile - All values within normal range",
        details:
          "Hemoglobin: 13.5 g/dL (Normal)\nTotal Cholesterol: 180 mg/dL (Normal)\nBlood Sugar: 95 mg/dL (Normal)",
      },
      {
        id: "4",
        type: "vaccination",
        title: "COVID-19 Booster",
        date: "2023-12-20",
        doctor: "Dr. Meera Patel",
        summary: "COVID-19 booster vaccination administered",
        details:
          "Pfizer-BioNTech COVID-19 vaccine booster dose administered in left arm. No immediate adverse reactions observed.",
      },
    ]

    setRecords(sampleRecords)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <User className="h-4 w-4" />
      case "prescription":
        return <Pill className="h-4 w-4" />
      case "test":
        return <TestTube className="h-4 w-4" />
      case "vaccination":
        return <Activity className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-500"
      case "prescription":
        return "bg-green-500"
      case "test":
        return "bg-purple-500"
      case "vaccination":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
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
                <h1 className="text-lg font-serif font-semibold">Health Records</h1>
                <p className="text-sm text-muted-foreground">Your complete medical history</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Badge className="bg-green-500">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline Mode
                </Badge>
              )}
              <Button variant="outline" size="sm" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Records
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="consultations">Consultations</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="tests">Tests & Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Vital Signs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Current Vital Signs</span>
                    </CardTitle>
                    <CardDescription>Last updated: {vitals.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vitals.bloodPressure.split(" ")[0]}</div>
                        <div className="text-sm text-muted-foreground">Blood Pressure</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vitals.heartRate.split(" ")[0]}</div>
                        <div className="text-sm text-muted-foreground">Heart Rate</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vitals.temperature}</div>
                        <div className="text-sm text-muted-foreground">Temperature</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vitals.weight}</div>
                        <div className="text-sm text-muted-foreground">Weight</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vitals.height}</div>
                        <div className="text-sm text-muted-foreground">Height</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Records */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Recent Medical Records</CardTitle>
                    <CardDescription>Your latest medical activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {records.slice(0, 3).map((record) => (
                        <div key={record.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                          <div className={`p-2 rounded-full ${getRecordColor(record.type)}`}>
                            {getRecordIcon(record.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{record.title}</h4>
                              <Badge variant="outline" className="capitalize">
                                {record.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{record.summary}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{record.date}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">Dr. {record.doctor}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="consultations" className="space-y-4">
                {records
                  .filter((r) => r.type === "consultation")
                  .map((record) => (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-serif">{record.title}</CardTitle>
                          <Badge variant="outline">Consultation</Badge>
                        </div>
                        <CardDescription>
                          {record.date} • Dr. {record.doctor}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{record.summary}</p>
                        {record.details && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Detailed Notes:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{record.details}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                {records
                  .filter((r) => r.type === "prescription")
                  .map((record) => (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-serif">{record.title}</CardTitle>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                        <CardDescription>
                          {record.date} • Dr. {record.doctor}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{record.summary}</p>
                        {record.details && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Instructions:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{record.details}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                {records
                  .filter((r) => r.type === "test" || r.type === "vaccination")
                  .map((record) => (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-serif">{record.title}</CardTitle>
                          <Badge variant="outline" className="capitalize">
                            {record.type}
                          </Badge>
                        </div>
                        <CardDescription>
                          {record.date} • Dr. {record.doctor}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{record.summary}</p>
                        {record.details && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Results:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{record.details}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium">Ramesh Kumar</h3>
                  <p className="text-sm text-muted-foreground">Patient ID: HC001234</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span>45 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blood Group:</span>
                    <span>O+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">Sunita Kumar</p>
                    <p className="text-muted-foreground">Spouse</p>
                    <p className="text-muted-foreground">+91 98765 43211</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergies & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Medical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Allergies:</h4>
                    <Badge variant="destructive" className="mt-1">
                      Penicillin
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Chronic Conditions:</h4>
                    <Badge variant="secondary" className="mt-1">
                      Hypertension
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
