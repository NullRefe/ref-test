"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { PatientDashboard } from "@/components/patient-dashboard"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn) {
    return <PatientDashboard />
  }

  return <LoginForm />
}
