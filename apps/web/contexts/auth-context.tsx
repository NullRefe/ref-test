"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email?: string
  phone?: string
  type: "patient" | "medical-staff"
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage on app start
    const savedUser = localStorage.getItem("enabha-user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        localStorage.removeItem("enabha-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("enabha-user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("enabha-user")
    // Redirect to home page
    window.location.href = "/"
  }

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}