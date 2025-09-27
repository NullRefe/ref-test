"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useLocale } from "@/hooks/useLocale"
import { Calendar, Clock, DollarSign, Globe, Phone, Users } from "lucide-react"
import { useState } from "react"

export default function MultilingualTestPage() {
  const { t, language, setLanguage, direction } = useLanguage()
  const locale = useLocale()
  const [testData] = useState({
    number: 1234567.89,
    currency: 5000,
    date: new Date("2024-03-15T14:30:00"),
    relativeDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    phoneNumber: "9876543210",
    items: ["Medicine", "Consultation", "Health Records"],
  })

  return (
    <div className="min-h-screen bg-background p-8" dir={direction}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            {t.common.welcome} - Multi-lingual Test Page
          </h1>
          <p className="text-xl text-muted-foreground">
            Testing Hindi, English, and Punjabi support
          </p>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Language Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Current Language Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Language Code</label>
                <p className="text-lg font-mono">{language}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Text Direction</label>
                <p className="text-lg">{direction.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">HTML Lang Attribute</label>
                <p className="text-lg font-mono">{document.documentElement.lang}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Translations Test */}
        <Card>
          <CardHeader>
            <CardTitle>Common UI Translations</CardTitle>
            <CardDescription>Testing basic UI text translations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="secondary">{t.common.loading}</Badge>
              <Badge variant="secondary">{t.common.error}</Badge>
              <Badge variant="secondary">{t.common.success}</Badge>
              <Badge variant="secondary">{t.common.cancel}</Badge>
              <Badge variant="secondary">{t.common.save}</Badge>
              <Badge variant="secondary">{t.common.continue}</Badge>
              <Badge variant="secondary">{t.common.back}</Badge>
              <Badge variant="secondary">{t.common.next}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Healthcare Dashboard Translations</CardTitle>
            <CardDescription>Testing healthcare-specific translations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{t.dashboard.quickActions}</h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t.dashboard.bookConsultation}</li>
                  <li>• {t.dashboard.healthRecords}</li>
                  <li>• {t.dashboard.findMedicine}</li>
                  <li>• {t.dashboard.symptomChecker}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{t.dashboard.healthSummary}</h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t.dashboard.lastCheckup}</li>
                  <li>• {t.dashboard.bloodPressure}</li>
                  <li>• {t.dashboard.weight}</li>
                  <li>• {t.dashboard.viewFullRecords}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locale Formatting Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Locale-Specific Formatting
            </CardTitle>
            <CardDescription>Testing number, currency, and date formatting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Numbers */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="text-lg">🔢</span>
                  Number Formatting
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Raw:</strong> {testData.number}</p>
                  <p><strong>Formatted:</strong> {locale.formatNumber(testData.number)}</p>
                  <p><strong>Percentage:</strong> {locale.formatNumber(0.75, { style: 'percent' })}</p>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Currency Formatting
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Raw:</strong> {testData.currency}</p>
                  <p><strong>INR:</strong> {locale.formatCurrency(testData.currency)}</p>
                  <p><strong>USD:</strong> {locale.formatCurrency(testData.currency, 'USD')}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Formatting
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Full:</strong> {locale.formatDate(testData.date)}</p>
                  <p><strong>Short:</strong> {locale.formatDate(testData.date, { dateStyle: 'short' })}</p>
                  <p><strong>Relative:</strong> {locale.formatRelativeTime(testData.relativeDate)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Formatting
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Time:</strong> {locale.formatTime(testData.date)}</p>
                  <p><strong>DateTime:</strong> {locale.formatDateTime(testData.date)}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Formatting
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Raw:</strong> {testData.phoneNumber}</p>
                  <p><strong>Formatted:</strong> {locale.formatPhoneNumber(testData.phoneNumber)}</p>
                </div>
              </div>

              {/* Lists */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  List Formatting
                </h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Items:</strong> {locale.formatList(testData.items)}</p>
                  <p><strong>Or:</strong> {locale.formatList(testData.items, { type: 'disjunction' })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complex UI Test */}
        <Card>
          <CardHeader>
            <CardTitle>Complex UI Components</CardTitle>
            <CardDescription>Testing complex healthcare UI components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t.booking.title}</h3>
                <p className="text-sm text-muted-foreground">{t.booking.subtitle}</p>
                <div className="space-y-2">
                  <Button className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t.booking.selectDate}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    {t.booking.selectTime}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    {t.booking.selectDoctor}
                  </Button>
                </div>
              </div>

              {/* Health Records Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t.healthRecords.title}</h3>
                <p className="text-sm text-muted-foreground">{t.healthRecords.subtitle}</p>
                <div className="space-y-2">
                  <Badge variant="outline">{t.healthRecords.consultations}</Badge>
                  <Badge variant="outline">{t.healthRecords.prescriptions}</Badge>
                  <Badge variant="outline">{t.healthRecords.testsReports}</Badge>
                  <Badge variant="outline">{t.healthRecords.allergies}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Switching Test */}
        <Card>
          <CardHeader>
            <CardTitle>Language Switching Test</CardTitle>
            <CardDescription>Quick buttons to test language switching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                🇺🇸 English
              </Button>
              <Button 
                variant={language === 'hi' ? 'default' : 'outline'}
                onClick={() => setLanguage('hi')}
              >
                🇮🇳 हिंदी
              </Button>
              <Button 
                variant={language === 'pa' ? 'default' : 'outline'}
                onClick={() => setLanguage('pa')}
              >
                🇮🇳 ਪੰਜਾਬੀ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Font Rendering Test */}
        <Card>
          <CardHeader>
            <CardTitle>Font Rendering Test</CardTitle>
            <CardDescription>Testing different script rendering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <p className="font-semibold mb-2">English (Latin)</p>
                <p className="text-english">The quick brown fox jumps over the lazy dog. 1234567890</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-semibold mb-2">Hindi (Devanagari)</p>
                <p className="text-hindi">स्वास्थ्य सेवा सभी के लिए सुलभ होनी चाहिए। १२३४५६७८९०</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-semibold mb-2">Punjabi (Gurmukhi)</p>
                <p className="text-punjabi">ਸਿਹਤ ਸੇਵਾ ਸਾਰਿਆਂ ਲਈ ਉਪਲਬਧ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ। ੧੨੩੪੫੬੭੮੯੦</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}