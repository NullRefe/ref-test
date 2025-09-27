import type { PostgrestError } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface DatabaseResult<T = any> {
  data: T | null
  error: PostgrestError | null
}

export class DatabaseService {
  // Generic select query
  static async select<T = any>(
    table: string,
    columns = '*',
    filters?: Record<string, any>
  ): Promise<DatabaseResult<T[]>> {
    let query = supabase.from(table).select(columns)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query
    return { data: data as T[], error }
  }

  // Generic insert query
  static async insert<T = any>(
    table: string,
    data: any
  ): Promise<DatabaseResult<T>> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    return { data: result as T, error }
  }

  // Generic update query
  static async update<T = any>(
    table: string,
    id: string | number,
    updates: any
  ): Promise<DatabaseResult<T>> {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data: data as T, error }
  }

  // Generic delete query
  static async delete(
    table: string,
    id: string | number
  ): Promise<DatabaseResult<null>> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    return { data: null, error }
  }

  // User-specific queries
  static async getUserProfile(userId: string) {
    return this.select('profiles', '*', { user_id: userId })
  }

  static async createUserProfile(profileData: {
    user_id: string
    full_name?: string
    phone?: string
    [key: string]: any
  }) {
    return this.insert('profiles', profileData)
  }

  static async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  }

  // Health Records queries
  static async getHealthRecords(userId: string) {
    return this.select('health_records', '*', { user_id: userId })
  }

  static async createHealthRecord(recordData: any) {
    return this.insert('health_records', recordData)
  }

  // Consultation queries
  static async getConsultations(userId: string) {
    return this.select('consultations', '*', { user_id: userId })
  }

  static async createConsultation(consultationData: any) {
    return this.insert('consultations', consultationData)
  }
}

// Export commonly used types
export type { PostgrestError } from '@supabase/supabase-js'

