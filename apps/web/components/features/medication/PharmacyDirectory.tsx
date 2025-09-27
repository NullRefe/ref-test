import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Clock, CreditCard, Filter, MapPin, Phone, Search, Star, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMedicationStore, type Pharmacy } from './stores/medication-store'

export function PharmacyDirectory() {
  const { pharmacies, loading, loadPharmacies, searchPharmacies } = useMedicationStore()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [villageFilter, setVillageFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)

  useEffect(() => {
    // Seed some sample pharmacy data if none exists
    if (pharmacies.length === 0) {
      seedSamplePharmacies()
    }
  }, [pharmacies])

  const seedSamplePharmacies = () => {
    // This would typically be done through an admin interface
    // For now, we'll show the empty state
  }

  // Get unique villages for filter
  const villages = ['all', ...new Set(pharmacies.map(p => p.village))]

  // Filter pharmacies
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = searchQuery === '' || 
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesVillage = villageFilter === 'all' || pharmacy.village === villageFilter
    
    const matchesService = serviceFilter === 'all' || 
      pharmacy.services.includes(serviceFilter)
    
    return matchesSearch && matchesVillage && matchesService
  })

  const handleCallPharmacy = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp}`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
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
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Local Pharmacies</h2>
        <p className="text-sm text-muted-foreground">
          Find nearby pharmacies and check medication availability
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pharmacies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={villageFilter} onValueChange={setVillageFilter}>
            <SelectTrigger className="w-40">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {villages.map(village => (
                <SelectItem key={village} value={village}>
                  {village === 'all' ? 'All Locations' : village}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="home_delivery">Home Delivery</SelectItem>
              <SelectItem value="online_order">Online Order</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pharmacies List */}
      {filteredPharmacies.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No pharmacies found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || villageFilter !== 'all' || serviceFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Pharmacy directory is being updated with local providers'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Contact our support team to add your local pharmacy to the directory.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {pharmacy.name}
                        </h3>
                        {pharmacy.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {pharmacy.is_24x7 && (
                          <Badge className="bg-green-600 text-white text-xs">
                            24×7
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Owner: {pharmacy.owner_name}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderStars(pharmacy.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({pharmacy.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location and Hours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{pharmacy.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{pharmacy.hours}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Specialties:</span> {pharmacy.specialties}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Medicines in stock:</span> ~{pharmacy.inventory_count}
                      </p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {pharmacy.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {pharmacy.services.includes('home_delivery') && (
                    <div className="flex items-center gap-4 text-sm bg-muted/50 p-3 rounded-lg">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Home delivery: ₹{pharmacy.delivery_fee} 
                        (Min order: ₹{pharmacy.min_order_amount})
                      </span>
                    </div>
                  )}

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment Methods:</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-2">
                        {pharmacy.payment_methods.map((method) => (
                          <Badge key={method} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleCallPharmacy(pharmacy.phone)}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    
                    {pharmacy.whatsapp && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsApp(pharmacy.whatsapp!)}
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPharmacy(pharmacy)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}