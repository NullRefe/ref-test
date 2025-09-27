"use client"

import type React from "react"

import { GovtHeader } from "@/components/govt-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
    Activity,
    AlertCircle,
    Ambulance,
    Bell,
    CheckCircle,
    Clock,
    FileText,
    MapPin,
    Navigation,
    Phone,
    Shield,
    TrendingUp,
    User,
    Users,
} from "lucide-react"
import { useState } from "react"

interface BookingData {
  patientName: string
  patientAge: string
  contactPhone: string
  pickupAddress: string
  destinationAddress: string
  urgencyLevel: string
  medicalCondition: string
  specialRequirements: string
  wheelchairAccess: boolean
  oxygenRequired: boolean
  stretcherRequired: boolean
}

interface Booking {
  id: string
  patientName: string
  urgency: "routine" | "urgent" | "emergency"
  status: "pending" | "assigned" | "en-route" | "completed"
  location: string
  time: string
  ambulanceId?: string
}

interface AmbulanceUnit {
  id: string
  status: "available" | "busy" | "maintenance"
  location: string
  crew: string
  equipment: string[]
}

export default function AmbulancePlatform() {
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<"booking" | "admin" | "tracking">("booking")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState("")

  const [formData, setFormData] = useState<BookingData>({
    patientName: "",
    patientAge: "",
    contactPhone: "",
    pickupAddress: "",
    destinationAddress: "",
    urgencyLevel: "",
    medicalCondition: "",
    specialRequirements: "",
    wheelchairAccess: false,
    oxygenRequired: false,
    stretcherRequired: false,
  })

  const [bookings] = useState<Booking[]>([
    {
      id: "AMB-001",
      patientName: "John Smith",
      urgency: "emergency",
      status: "en-route",
      location: "123 Main St, Downtown",
      time: "14:32",
      ambulanceId: "Unit-01",
    },
    {
      id: "AMB-002",
      patientName: "Sarah Johnson",
      urgency: "urgent",
      status: "assigned",
      location: "456 Oak Ave, Midtown",
      time: "14:45",
      ambulanceId: "Unit-03",
    },
    {
      id: "AMB-003",
      patientName: "Mike Davis",
      urgency: "routine",
      status: "pending",
      location: "789 Pine Rd, Uptown",
      time: "15:00",
    },
  ])

  const [ambulances] = useState<AmbulanceUnit[]>([
    {
      id: "Unit-01",
      status: "busy",
      location: "En route to Downtown",
      crew: "Team Alpha",
      equipment: ["AED", "Oxygen", "Stretcher"],
    },
    {
      id: "Unit-02",
      status: "available",
      location: "Station 2",
      crew: "Team Beta",
      equipment: ["AED", "Oxygen", "Wheelchair Access"],
    },
    {
      id: "Unit-03",
      status: "busy",
      location: "Assigned to Midtown",
      crew: "Team Gamma",
      equipment: ["AED", "Oxygen", "Advanced Life Support"],
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newTrackingId = `AMB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setTrackingId(newTrackingId)

    toast({
      title: "Booking Confirmed",
      description: `Your ambulance has been dispatched. Tracking ID: ${newTrackingId}`,
    })

    setIsSubmitting(false)
    setActiveView("tracking")
  }

  const updateFormData = (field: keyof BookingData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      case "routine":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "en-route":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Ambulance Service Navigation */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Ambulance className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Emergency Medical Services</h2>
                <p className="text-sm text-muted-foreground">24/7 Ambulance Booking & Tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === "booking" ? "default" : "outline"}
                onClick={() => setActiveView("booking")}
                size="sm"
              >
                Book Now
              </Button>
              <Button
                variant={activeView === "admin" ? "default" : "outline"}
                onClick={() => setActiveView("admin")}
                size="sm"
              >
                Admin
              </Button>
              <Button
                variant={activeView === "tracking" ? "default" : "outline"}
                onClick={() => setActiveView("tracking")}
                size="sm"
              >
                Track
              </Button>
            </div>
          </div>
        </div>
      </div>

      {activeView === "booking" && (
        <div className="bg-red-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 text-center">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">24/7 Emergency Response</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Average Response Time: 8-12 minutes</span>
              <span className="hidden sm:inline">•</span>
              <a href="tel:911" className="flex items-center gap-1 hover:underline">
                <Phone className="h-4 w-4" />
                Call 911 for Life-Threatening Emergencies
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "booking" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Emergency Ambulance Service</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Fast, reliable emergency medical transport when every second counts
              </p>
            </div>

            <Card className="w-full shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                  <Ambulance className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Book Emergency Transport</CardTitle>
                <CardDescription className="text-base">
                  Complete this form to request immediate medical transport
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold">Patient Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) => updateFormData("patientName", e.target.value)}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientAge">Age *</Label>
                        <Input
                          id="patientAge"
                          type="number"
                          value={formData.patientAge}
                          onChange={(e) => updateFormData("patientAge", e.target.value)}
                          placeholder="Age"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData("contactPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold">Location Details</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickupAddress">Pickup Address *</Label>
                      <Input
                        id="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={(e) => updateFormData("pickupAddress", e.target.value)}
                        placeholder="Street address, city, state, zip"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destinationAddress">Destination (Hospital/Clinic) *</Label>
                      <Input
                        id="destinationAddress"
                        value={formData.destinationAddress}
                        onChange={(e) => updateFormData("destinationAddress", e.target.value)}
                        placeholder="Hospital or medical facility address"
                        required
                      />
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold">Medical Details</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                      <Select
                        value={formData.urgencyLevel}
                        onValueChange={(value) => updateFormData("urgencyLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine - Scheduled transport</SelectItem>
                          <SelectItem value="urgent">Urgent - Needs prompt attention</SelectItem>
                          <SelectItem value="emergency">Emergency - Critical condition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalCondition">Medical Condition/Reason *</Label>
                      <Textarea
                        id="medicalCondition"
                        value={formData.medicalCondition}
                        onChange={(e) => updateFormData("medicalCondition", e.target.value)}
                        placeholder="Brief description of medical condition or reason for transport"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <Textarea
                        id="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={(e) => updateFormData("specialRequirements", e.target.value)}
                        placeholder="Any additional medical equipment or special instructions"
                      />
                    </div>
                  </div>

                  {/* Equipment Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Equipment Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="wheelchairAccess"
                          checked={formData.wheelchairAccess}
                          onCheckedChange={(checked) => updateFormData("wheelchairAccess", checked as boolean)}
                        />
                        <Label htmlFor="wheelchairAccess">Wheelchair accessible vehicle required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oxygenRequired"
                          checked={formData.oxygenRequired}
                          onCheckedChange={(checked) => updateFormData("oxygenRequired", checked as boolean)}
                        />
                        <Label htmlFor="oxygenRequired">Oxygen support required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stretcherRequired"
                          checked={formData.stretcherRequired}
                          onCheckedChange={(checked) => updateFormData("stretcherRequired", checked as boolean)}
                        />
                        <Label htmlFor="stretcherRequired">Stretcher transport required</Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Dispatching Ambulance...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Request Emergency Transport
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "admin" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dispatch Control Center</h1>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                <span className="text-sm text-muted-foreground">3 active emergencies</span>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Calls</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Activity className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Units</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Ambulance className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold">9.2m</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="bookings" className="space-y-4">
              <TabsList>
                <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
                <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Emergency Requests</CardTitle>
                    <CardDescription>Manage and assign ambulance units to active bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{booking.patientName}</span>
                              <Badge className={getUrgencyColor(booking.urgency)}>
                                {booking.urgency.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{booking.location}</p>
                            <p className="text-xs text-muted-foreground">
                              Requested: {booking.time} {booking.ambulanceId && `• Assigned: ${booking.ambulanceId}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "pending" && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Assign Unit
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fleet" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ambulance Fleet Status</CardTitle>
                    <CardDescription>Monitor all ambulance units and their current status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ambulances.map((unit) => (
                        <Card key={unit.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold">{unit.id}</h3>
                              <Badge
                                className={
                                  unit.status === "available"
                                    ? "bg-green-100 text-green-800"
                                    : unit.status === "busy"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {unit.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{unit.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{unit.crew}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {unit.equipment.map((item) => (
                                  <Badge key={item} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeView === "tracking" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Track Your Ambulance</h1>
              <p className="text-muted-foreground">
                Enter your tracking ID to see real-time updates on your ambulance request
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trackingInput">Tracking ID</Label>
                    <Input
                      id="trackingInput"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter your tracking ID (e.g., AMB-ABC123)"
                    />
                  </div>
                  <Button className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Track Ambulance
                  </Button>
                </div>
              </CardContent>
            </Card>

            {trackingId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Booking Status: {trackingId}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">Booking Confirmed</p>
                        <p className="text-sm text-muted-foreground">Request received and processed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">Ambulance Assigned</p>
                        <p className="text-sm text-muted-foreground">Unit-02 dispatched to your location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium">En Route</p>
                        <p className="text-sm text-muted-foreground">Estimated arrival: 6-8 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-muted-foreground">Arrived</p>
                        <p className="text-sm text-muted-foreground">Ambulance will arrive shortly</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Live Updates</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Your ambulance is currently 2.3 miles away and approaching your location. The crew will contact
                      you upon arrival.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Emergency Contact</span>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Dispatch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
