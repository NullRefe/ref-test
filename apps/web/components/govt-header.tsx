"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useBreadcrumbs } from "@/lib/utils/breadcrumb"
import { Globe, LogOut, Mail, Menu, Phone, Search, User } from "lucide-react"
import Link from "next/link"

export function GovtHeader() {
  const { t } = useLanguage()
  const { isLoggedIn, user, logout } = useAuth()
  const breadcrumbs = useBreadcrumbs()

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
            <LanguageSwitcher variant="compact" />
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


            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Welcome, {user?.name || 'User'}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/">
                  <Button variant="default" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
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
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.href} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {breadcrumb.isCurrentPage ? (
                    <span className="text-foreground font-medium" aria-current="page">
                      {breadcrumb.label}
                    </span>
                  ) : (
                    <Link 
                      href={breadcrumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  )
}
