// Mock store for medication management - replace with actual implementation
import { useState } from 'react'

export interface Medication {
  id: string
  _id?: string
  name: string
  generic_name?: string
  category?: string
  dosage: string
  frequency: string
  start_date: string
  end_date?: string
  duration?: string
  is_active: boolean
  refills_remaining: number
  pharmacy_name: string
  pharmacy_phone?: string
  pharmacy_address?: string
  pharmacy_location?: string
  notes?: string
  instructions?: string
  side_effects?: string
  prescribing_doctor?: string
  prescribed_by?: string
  reminder_times: string[]
  cost?: number
  availability_status?: string
  created_at: string
  updated_at: string
}

export interface Pharmacy {
  id: string
  _id?: string
  name: string
  owner_name: string
  phone: string
  whatsapp?: string
  address: string
  village: string
  distance?: number
  rating: number
  is_24_hours: boolean
  is_24x7?: boolean
  verified?: boolean
  hours?: string
  services: string[]
  payment_methods: string[]
  specialties?: string
  inventory_count?: number
  delivery_fee?: number
  min_order_amount?: number
  created_at: string
}

export interface MedicationReminder {
  id: string
  medication_id: string
  medication_name: string
  dosage: string
  time: string
  taken: boolean
  date: string
  notes?: string
}

// Mock data
const mockMedications: Medication[] = [
  {
    id: '1',
    _id: '1',
    name: 'Lisinopril',
    generic_name: 'Lisinopril',
    category: 'Blood Pressure',
    dosage: '10mg',
    frequency: 'Once daily',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    duration: '12 months',
    is_active: true,
    refills_remaining: 3,
    pharmacy_name: 'City Pharmacy',
    pharmacy_phone: '555-0123',
    pharmacy_address: '123 Main St',
    pharmacy_location: 'Downtown',
    notes: 'Take with food',
    instructions: 'Take one tablet daily with breakfast',
    side_effects: 'May cause dizziness, dry cough',
    prescribing_doctor: 'Dr. Smith',
    prescribed_by: 'Dr. Smith',
    reminder_times: ['08:00', '20:00'],
    cost: 250,
    availability_status: 'in_stock',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    _id: '1',
    name: 'City Pharmacy',
    owner_name: 'Mr. Sharma',
    phone: '555-0123',
    whatsapp: '555-0123',
    address: '123 Main St',
    village: 'Downtown',
    distance: 0.5,
    rating: 4.5,
    is_24_hours: false,
    is_24x7: false,
    verified: true,
    hours: '9 AM - 10 PM',
    services: ['Prescription Filling', 'Over-the-Counter Medications', 'Health Consultations'],
    payment_methods: ['Cash', 'Credit Card', 'Insurance'],
    specialties: 'General medicines, Ayurvedic products',
    inventory_count: 850,
    delivery_fee: 50,
    min_order_amount: 200,
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockReminders: MedicationReminder[] = [
  {
    id: '1',
    medication_id: '1',
    medication_name: 'Lisinopril',
    dosage: '10mg',
    time: '08:00',
    taken: false,
    date: new Date().toISOString().split('T')[0],
    notes: 'Take with food'
  }
]

// Mock store hook
export function useMedicationStore() {
  const [medications] = useState<Medication[]>(mockMedications)
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies)
  const [todayReminders] = useState<MedicationReminder[]>(mockReminders)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return {
    medications,
    pharmacies,
    todayReminders,
    loading,
    error,
    loadMedications: () => {},
    loadPharmacies: () => {},
    generateTodayReminders: () => {},
    getUpcomingReminders: () => mockReminders,
    addMedication: async (medication: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) => {},
    updateMedication: async (id: string, updates: Partial<Medication>) => {},
    deleteMedication: async (id: string) => {},
    searchPharmacies: async (query: string) => {},
    findAlternatives: async (medicationId: string) => [],
    comparePrices: async (medicationId: string) => [],
    markReminderTaken: async (reminderId: string) => {},
    snoozeReminder: async (reminderId: string, minutes: number) => {}
  }
}