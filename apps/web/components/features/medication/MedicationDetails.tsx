import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Clock, Edit, MapPin, ShoppingCart, Trash2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useMedicationStore, type Medication } from './stores/medication-store'

interface MedicationDetailsProps {
  medication: Medication
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicationDetails({ medication, open, onOpenChange }: MedicationDetailsProps) {
  const { deleteMedication, updateMedication, loading, findAlternatives, comparePrices } = useMedicationStore()
  const { toast } = useToast()
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [alternatives, setAlternatives] = useState([])
  const [priceComparison, setPriceComparison] = useState([])

  const getUrgencyColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-500 text-white'
      case 'chronic': return 'bg-blue-500 text-white'
      case 'acute': return 'bg-orange-500 text-white'
      case 'supplement': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600'
      case 'out_of_stock': return 'text-red-600'
      case 'special_order': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this medication?')) {
      try {
        await deleteMedication(medication._id)
        toast({
          title: "Medication Deleted",
          description: `${medication.name} has been removed from your medications`,
        })
        onOpenChange(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete medication. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const toggleActive = async () => {
    try {
      await updateMedication(medication._id, { is_active: !medication.is_active })
      toast({
        title: medication.is_active ? "Medication Paused" : "Medication Resumed",
        description: `${medication.name} is now ${medication.is_active ? 'inactive' : 'active'}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update medication status.",
        variant: "destructive"
      })
    }
  }

  const loadAlternatives = async () => {
    try {
      const alts = await findAlternatives(medication.name)
      setAlternatives(alts)
      setShowAlternatives(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load alternatives.",
        variant: "destructive"
      })
    }
  }

  const loadPriceComparison = async () => {
    try {
      const prices = await comparePrices(medication.name)
      setPriceComparison(prices)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load price comparison.",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{medication.name}</span>
              <Badge className={getUrgencyColor(medication.category)}>
                {medication.category}
              </Badge>
              {!medication.is_active && (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medication Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
                  <p className="text-foreground">{medication.name}</p>
                  {medication.generic_name && (
                    <p className="text-sm text-muted-foreground">({medication.generic_name})</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Dosage & Frequency</h4>
                  <p className="text-foreground">{medication.dosage}</p>
                  <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                </div>
              </div>

              {medication.instructions && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Instructions</h4>
                  <p className="text-foreground">{medication.instructions}</p>
                </div>
              )}

              {medication.side_effects && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Side Effects</h4>
                  <p className="text-foreground">{medication.side_effects}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Prescribed By</h4>
                  <p className="text-foreground">{medication.prescribed_by || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
                  <p className="text-foreground">{medication.duration || 'Not specified'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Start Date</h4>
                  <p className="text-foreground">{formatDate(medication.start_date)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">End Date</h4>
                  <p className="text-foreground">{formatDate(medication.end_date)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Refills Left</h4>
                  <p className="text-foreground flex items-center gap-1">
                    {medication.refills_remaining}
                    {medication.refills_remaining <= 1 && medication.is_active && (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pharmacy & Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Pharmacy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Pharmacy</h4>
                  <p className="text-foreground">{medication.pharmacy_name || 'Not specified'}</p>
                  {medication.pharmacy_location && (
                    <p className="text-sm text-muted-foreground">{medication.pharmacy_location}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Cost & Availability</h4>
                  <p className="text-foreground font-medium">₹{medication.cost}</p>
                  <p className={`text-sm ${getAvailabilityColor(medication.availability_status)}`}>
                    {medication.availability_status.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadAlternatives}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Find Alternatives
                </Button>
                <Button variant="outline" size="sm" onClick={loadPriceComparison}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Compare Prices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reminders */}
          {medication.reminder_times.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Daily Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {medication.reminder_times.map((time) => (
                    <Badge key={time} variant="outline">
                      {time}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant={medication.is_active ? "outline" : "default"}
              onClick={toggleActive}
              disabled={loading}
            >
              {medication.is_active ? 'Pause Medication' : 'Resume Medication'}
            </Button>
            
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}