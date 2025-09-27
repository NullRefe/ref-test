import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Clock, Filter, MapPin, Pill, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { AddMedicationDialog } from './AddMedicationDialog'
import { MedicationDetails } from './MedicationDetails'
import { useMedicationStore, type Medication } from './stores/medication-store'

interface MedicationListProps {
  onAddMedication?: () => void
}

export function MedicationList({ onAddMedication }: MedicationListProps) {
  const { medications, loading } = useMedicationStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)

  // Filter medications based on search and filters
  const filteredMedications = medications.filter(medication => {
    const matchesSearch = medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.generic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.prescribed_by.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || medication.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && medication.is_active) ||
      (statusFilter === 'inactive' && !medication.is_active)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">My Medications</h2>
          <p className="text-sm text-muted-foreground">
            {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="chronic">Chronic</SelectItem>
              <SelectItem value="acute">Acute</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="supplement">Supplement</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Medications List */}
      {filteredMedications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No medications found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first medication'
              }
            </p>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setShowAddDialog(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Medication
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMedications.map((medication) => (
            <Card 
              key={medication._id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedMedication(medication)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{medication.name}</h3>
                      {medication.generic_name && (
                        <span className="text-sm text-muted-foreground">
                          ({medication.generic_name})
                        </span>
                      )}
                      <Badge className={getUrgencyColor(medication.category)}>
                        {medication.category}
                      </Badge>
                      {!medication.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span>{medication.dosage} • {medication.frequency}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {medication.reminder_times.length} reminder{medication.reminder_times.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {medication.pharmacy_name}
                        </span>
                        <span className={getAvailabilityColor(medication.availability_status)}>
                          {medication.availability_status.replace('_', ' ')}
                        </span>
                        <span className="font-medium">₹{medication.cost}</span>
                      </div>
                    </div>

                    {medication.instructions && (
                      <p className="text-sm text-muted-foreground italic">
                        {medication.instructions}
                      </p>
                    )}
                  </div>

                  {medication.refills_remaining <= 1 && medication.is_active && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">Low refills</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Medication Dialog */}
      <AddMedicationDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Medication Details Dialog */}
      {selectedMedication && (
        <MedicationDetails
          medication={selectedMedication}
          open={!!selectedMedication}
          onOpenChange={(open) => !open && setSelectedMedication(null)}
        />
      )}
    </div>
  )
}