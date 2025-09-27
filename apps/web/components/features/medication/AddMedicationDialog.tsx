import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Clock, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useMedicationStore } from './stores/medication-store'

interface AddMedicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMedicationDialog({ open, onOpenChange }: AddMedicationDialogProps) {
  const { addMedication, loading } = useMedicationStore()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    prescribed_by: '',
    prescription_date: '',
    start_date: '',
    end_date: '',
    is_active: true,
    refills_remaining: 0,
    cost: 0,
    pharmacy_name: '',
    pharmacy_location: '',
    availability_status: 'available' as const,
    side_effects: '',
    category: 'acute' as const,
    reminder_times: [] as string[]
  })
  
  const [newReminderTime, setNewReminderTime] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addReminderTime = () => {
    if (newReminderTime && !formData.reminder_times.includes(newReminderTime)) {
      setFormData(prev => ({
        ...prev,
        reminder_times: [...prev.reminder_times, newReminderTime].sort()
      }))
      setNewReminderTime('')
    }
  }

  const removeReminderTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      reminder_times: prev.reminder_times.filter(t => t !== time)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.dosage || !formData.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (name, dosage, frequency)",
        variant: "destructive"
      })
      return
    }

    try {
      await addMedication(formData)
      
      toast({
        title: "Medication Added",
        description: `${formData.name} has been added to your medications`,
      })
      
      // Reset form
      setFormData({
        name: '',
        generic_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        prescribed_by: '',
        prescription_date: '',
        start_date: '',
        end_date: '',
        is_active: true,
        refills_remaining: 0,
        cost: 0,
        pharmacy_name: '',
        pharmacy_location: '',
        availability_status: 'available',
        side_effects: '',
        category: 'acute',
        reminder_times: []
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Medication
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Paracetamol"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="generic_name">Generic Name</Label>
                <Input
                  id="generic_name"
                  value={formData.generic_name}
                  onChange={(e) => handleInputChange('generic_name', e.target.value)}
                  placeholder="e.g., Acetaminophen"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="e.g., 500mg tablet"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once daily">Once daily</SelectItem>
                    <SelectItem value="twice daily">Twice daily</SelectItem>
                    <SelectItem value="three times daily">Three times daily</SelectItem>
                    <SelectItem value="four times daily">Four times daily</SelectItem>
                    <SelectItem value="as needed">As needed</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chronic">Chronic</SelectItem>
                    <SelectItem value="acute">Acute</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="supplement">Supplement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="e.g., Take with food, Avoid alcohol"
                rows={2}
              />
            </div>
          </div>

          {/* Prescription Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Prescription Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prescribed_by">Prescribed By</Label>
                <Input
                  id="prescribed_by"
                  value={formData.prescribed_by}
                  onChange={(e) => handleInputChange('prescribed_by', e.target.value)}
                  placeholder="Doctor's name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 7 days, 1 month"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refills_remaining">Refills Remaining</Label>
                <Input
                  id="refills_remaining"
                  type="number"
                  min="0"
                  value={formData.refills_remaining}
                  onChange={(e) => handleInputChange('refills_remaining', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Pharmacy Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Pharmacy Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
                <Input
                  id="pharmacy_name"
                  value={formData.pharmacy_name}
                  onChange={(e) => handleInputChange('pharmacy_name', e.target.value)}
                  placeholder="e.g., City Medical Store"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (₹)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pharmacy_location">Pharmacy Location</Label>
              <Input
                id="pharmacy_location"
                value={formData.pharmacy_location}
                onChange={(e) => handleInputChange('pharmacy_location', e.target.value)}
                placeholder="Address or village name"
              />
            </div>
          </div>

          {/* Reminders */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Medication Reminders</h3>
            
            <div className="flex gap-2">
              <Input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                placeholder="Add reminder time"
                className="flex-1"
              />
              <Button type="button" onClick={addReminderTime} variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            {formData.reminder_times.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.reminder_times.map((time) => (
                  <Badge
                    key={time}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeReminderTime(time)}
                  >
                    {time} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-base">Currently Taking</Label>
              <p className="text-sm text-muted-foreground">
                Enable to include in active medications and reminders
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Medication'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}