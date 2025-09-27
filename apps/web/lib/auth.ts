import type { AuthError, Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthResult {
  user: User | null
  session: Session | null
  error: AuthError | null
}

export interface SignUpData {
  email: string
  password: string
  options?: {
    data?: {
      full_name?: string
      phone?: string
      [key: string]: any
    }
  }
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up new user
  static async signUp({ email, password, options }: SignUpData): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    })

    return {
      user: data.user,
      session: data.session,
      error
    }
  }

  // Sign in existing user
  static async signIn({ email, password }: SignInData): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return {
      user: data.user,
      session: data.session,
      error
    }
  }

  // Sign out user
  static async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Get current session
  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })
    return { error }
  }

  // Update user profile
  static async updateProfile(updates: {
    email?: string
    password?: string
    data?: { [key: string]: any }
  }): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.updateUser(updates)
    return {
      user: data.user,
      error
    }
  }

  // Listen to auth changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Export commonly used types
export type { AuthError, Session, User } from '@supabase/supabase-js'

