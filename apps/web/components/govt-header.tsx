"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Globe, Mail, Menu, Phone, Search, User } from "lucide-react"

export function GovtHeader() {
  const { t } = useLanguage()

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3" />
              <span>Helpline: 1075</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3" />
              <span>support@enabha.gov.in</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Badge variant="secondary" className="govt-badge">
              <Globe className="h-3 w-3 mr-1" />
              भारत सरकार | Government of India
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-card border-b-2 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Government Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src="/logo/logo.png" alt="Government of India Emblem" className="h-12 w-12" />
                <div>
                  <h1 className="text-xl font-bold text-primary">eNabha</h1>
                  
                  <p className="text-xs text-muted-foreground">Ministry of Health & Family Welfare</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Home
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Services
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Contact
              </Button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="default" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-muted-foreground">
            <span>Home</span> / <span>Telemedicine Services</span> / <span className="text-foreground">Dashboard</span>
          </nav>
        </div>
      </div>
    </div>
  )
}
