"use client"

import { LoginForm } from "@/components/login-form"
import { PatientDashboard } from "@/components/patient-dashboard"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    return <PatientDashboard />
  }

  return <LoginForm />
}
