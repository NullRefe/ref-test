'use client'

import { MedicationList } from '@/components/features/medication/MedicationList'
import { MedicationReminders } from '@/components/features/medication/MedicationReminders'
import { PharmacyDirectory } from '@/components/features/medication/PharmacyDirectory'
import { useMedicationStore } from '@/components/features/medication/stores/medication-store'
import { GovtHeader } from '@/components/govt-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Pill, Store } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MedicinePage() {
  // Mock user state - replace with actual auth implementation
  const user = { id: '1', name: 'User' } // TODO: Replace with actual auth
  
  // Use actual medication store
  const { 
    medications, 
    todayReminders, 
    loading, 
    error, 
    loadMedications, 
    loadPharmacies,
    generateTodayReminders 
  } = useMedicationStore()
  
  const [activeTab, setActiveTab] = useState('medications')

  useEffect(() => {
    if (user) {
      loadMedications()
      loadPharmacies()
    }
  }, [user])

  useEffect(() => {
    if (medications.length > 0) {
      generateTodayReminders()
    }
  }, [medications])

  // Calculate stats
  const activeMedications = medications.filter(med => med.is_active).length
  const completedToday = todayReminders.filter(reminder => reminder.taken).length
  const totalRemindersToday = todayReminders.length
  const lowRefills = medications.filter(med => med.is_active && med.refills_remaining <= 1).length

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <GovtHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please sign in to access your medication management.
                </p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
              </CardContent>
            </Card>
          </div>
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
              <h1 className="text-2xl font-bold text-primary mb-2">Medication Management</h1>
              <p className="text-muted-foreground">Track your medications, set reminders, and find pharmacies</p>
            </div>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Pill className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{activeMedications}</div>
                  <div className="text-xs text-muted-foreground">Active Medications</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {completedToday}/{totalRemindersToday}
                  </div>
                  <div className="text-xs text-muted-foreground">Today's Reminders</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Store className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {new Set(medications.map(med => med.pharmacy_name)).size}
                  </div>
                  <div className="text-xs text-muted-foreground">Pharmacies Used</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Pill className="h-6 w-6 text-orange-600" />
                    {lowRefills > 0 && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        {lowRefills}
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-foreground">{lowRefills}</div>
                  <div className="text-xs text-muted-foreground">Low Refills</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="medications" className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  <span className="hidden sm:inline">Medications</span>
                </TabsTrigger>
                <TabsTrigger value="reminders" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Reminders</span>
                </TabsTrigger>
                <TabsTrigger value="pharmacies" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="hidden sm:inline">Pharmacies</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medications" className="space-y-6">
                <MedicationList />
              </TabsContent>

              <TabsContent value="reminders" className="space-y-6">
                <MedicationReminders />
              </TabsContent>

              <TabsContent value="pharmacies" className="space-y-6">
                <PharmacyDirectory />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('medications')}
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('reminders')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Set Reminder
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('pharmacies')}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Find Pharmacy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Today's Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medications taken:</span>
                    <span className="font-medium">{completedToday}/{totalRemindersToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active medications:</span>
                    <span className="font-medium">{activeMedications}</span>
                  </div>
                  {lowRefills > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Low refills:</span>
                      <span className="font-medium">{lowRefills}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}