"use client"

import { GovtHeader } from "@/components/govt-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, CheckCircle, Clock, MapPin, Navigation, Phone, Search, XCircle } from "lucide-react"
import { useState } from "react"

interface Medicine {
  id: string
  name: string
  genericName: string
  strength: string
  form: string
  manufacturer: string
}

interface PharmacyStock {
  pharmacyId: string
  pharmacyName: string
  address: string
  phone: string
  distance: string
  isOpen: boolean
  openHours: string
  availability: "in-stock" | "low-stock" | "out-of-stock"
  price: number
  lastUpdated: string
}

interface Prescription {
  id: string
  medicineName: string
  dosage: string
  quantity: string
  doctor: string
  date: string
}

export function PharmacyTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [pharmacyStocks, setPharmacyStocks] = useState<PharmacyStock[]>([])
  const [prescriptions] = useState<Prescription[]>([
    {
      id: "1",
      medicineName: "Amlodipine",
      dosage: "5mg",
      quantity: "30 tablets",
      doctor: "Dr. Priya Sharma",
      date: "2024-01-15",
    },
    {
      id: "2",
      medicineName: "Metformin",
      dosage: "500mg",
      quantity: "60 tablets",
      doctor: "Dr. Rajesh Kumar",
      date: "2024-01-10",
    },
  ])
  const [isSearching, setIsSearching] = useState(false)

  const sampleMedicines: Medicine[] = [
    {
      id: "1",
      name: "Amlodipine",
      genericName: "Amlodipine Besylate",
      strength: "5mg",
      form: "Tablet",
      manufacturer: "Sun Pharma",
    },
    {
      id: "2",
      name: "Metformin",
      genericName: "Metformin Hydrochloride",
      strength: "500mg",
      form: "Tablet",
      manufacturer: "Cipla",
    },
    {
      id: "3",
      name: "Paracetamol",
      genericName: "Acetaminophen",
      strength: "500mg",
      form: "Tablet",
      manufacturer: "GSK",
    },
  ]

  const searchMedicine = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)

    // Simulate API search
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const medicine = sampleMedicines.find(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) || m.genericName.toLowerCase().includes(query.toLowerCase()),
    )

    if (medicine) {
      setSelectedMedicine(medicine)

      // Simulate pharmacy stock data
      const mockStocks: PharmacyStock[] = [
        {
          pharmacyId: "1",
          pharmacyName: "Raj Medical Store",
          address: "Main Market, Village Center",
          phone: "+91 98765 11111",
          distance: "0.5 km",
          isOpen: true,
          openHours: "8:00 AM - 9:00 PM",
          availability: "in-stock",
          price: 45,
          lastUpdated: "2 hours ago",
        },
        {
          pharmacyId: "2",
          pharmacyName: "Sharma Pharmacy",
          address: "Near Bus Stand, Main Road",
          phone: "+91 98765 22222",
          distance: "1.2 km",
          isOpen: true,
          openHours: "9:00 AM - 8:00 PM",
          availability: "low-stock",
          price: 42,
          lastUpdated: "1 hour ago",
        },
        {
          pharmacyId: "3",
          pharmacyName: "Health Plus Medical",
          address: "Hospital Road, Sector 2",
          phone: "+91 98765 33333",
          distance: "2.1 km",
          isOpen: false,
          openHours: "8:00 AM - 7:00 PM",
          availability: "out-of-stock",
          price: 48,
          lastUpdated: "4 hours ago",
        },
        {
          pharmacyId: "4",
          pharmacyName: "Apollo Pharmacy",
          address: "City Center Mall, Ground Floor",
          phone: "+91 98765 44444",
          distance: "3.5 km",
          isOpen: true,
          openHours: "24 Hours",
          availability: "in-stock",
          price: 50,
          lastUpdated: "30 minutes ago",
        },
      ]

      setPharmacyStocks(mockStocks)
    }

    setIsSearching(false)
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "low-stock":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "out-of-stock":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return <Badge className="bg-green-500">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-yellow-500">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return null
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
              <Button onClick ={ () => {window.location.href = "/dashboard" }} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-serif font-semibold">Medicine Finder</h1>
                <p className="text-sm text-muted-foreground">Find medicines at nearby pharmacies</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <MapPin className="h-3 w-3 mr-1" />
                Village Center Area
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Medicine</TabsTrigger>
            <TabsTrigger value="prescriptions">My Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Search for Medicine</CardTitle>
                <CardDescription>Enter medicine name or generic name to find availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter medicine name (e.g., Amlodipine, Paracetamol)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && searchMedicine(searchQuery)}
                    />
                  </div>
                  <Button onClick={() => searchMedicine(searchQuery)} disabled={isSearching || !searchQuery.trim()}>
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Quick Search Suggestions */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Quick search:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleMedicines.map((medicine) => (
                      <Button
                        key={medicine.id}
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => {
                          setSearchQuery(medicine.name)
                          searchMedicine(medicine.name)
                        }}
                      >
                        {medicine.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicine Details */}
            {selectedMedicine && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Medicine Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-lg">{selectedMedicine.name}</h3>
                      <p className="text-muted-foreground">{selectedMedicine.genericName}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Strength:</span>
                        <span className="font-medium">{selectedMedicine.strength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Form:</span>
                        <span className="font-medium">{selectedMedicine.form}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manufacturer:</span>
                        <span className="font-medium">{selectedMedicine.manufacturer}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pharmacy Results */}
            {pharmacyStocks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Available at Nearby Pharmacies</CardTitle>
                  <CardDescription>Real-time availability and pricing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pharmacyStocks.map((stock) => (
                      <div key={stock.pharmacyId} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{stock.pharmacyName}</h4>
                              {getAvailabilityIcon(stock.availability)}
                              {getAvailabilityBadge(stock.availability)}
                              {!stock.isOpen && <Badge variant="secondary">Closed</Badge>}
                            </div>

                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>
                                  {stock.address} • {stock.distance}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{stock.phone}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{stock.openHours}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">₹{stock.price}</div>
                            <div className="text-xs text-muted-foreground">Updated {stock.lastUpdated}</div>
                            <div className="mt-2 space-x-2">
                              <Button size="sm" variant="outline" className="bg-transparent">
                                <Navigation className="h-3 w-3 mr-1" />
                                Directions
                              </Button>
                              <Button size="sm" disabled={stock.availability === "out-of-stock"}>
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Active Prescriptions</CardTitle>
                <CardDescription>Find medicines from your recent prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{prescription.medicineName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {prescription.dosage} • {prescription.quantity}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Prescribed by {prescription.doctor} on {prescription.date}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSearchQuery(prescription.medicineName)
                            searchMedicine(prescription.medicineName)
                          }}
                        >
                          <Search className="h-3 w-3 mr-1" />
                          Find Nearby
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
