"use client"

import { supportedLanguages, translations, type Language, type Translation } from "@/lib/i18n"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translation
  isLoading: boolean
  direction: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Function to detect browser language
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  
  // Get browser languages in order of preference
  const browserLanguages = navigator.languages || [navigator.language]
  
  for (const browserLang of browserLanguages) {
    // Extract primary language code (e.g., 'hi' from 'hi-IN')
    const primaryLang = browserLang.split('-')[0].toLowerCase()
    
    // Check if we support this language
    if (supportedLanguages.includes(primaryLang as Language)) {
      return primaryLang as Language
    }
    
    // Special handling for specific locale codes
    const langMap: Record<string, Language> = {
      'hin': 'hi', // Hindi
      'pan': 'pa', // Punjabi
      'pnb': 'pa', // Western Punjabi
    }
    
    if (langMap[primaryLang]) {
      return langMap[primaryLang]
    }
  }
  
  return 'en' // Default fallback
}

// Function to get text direction for language
function getTextDirection(lang: Language): 'ltr' | 'rtl' {
  // Currently all supported languages use LTR
  // This can be extended if RTL languages are added in the future
  return 'ltr'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeLanguage = () => {
      try {
        // First, try to load saved language from localStorage
        const savedLanguage = localStorage.getItem("healthconnect-language") as Language
        
        if (savedLanguage && translations[savedLanguage]) {
          setLanguage(savedLanguage)
        } else {
          // If no saved language, detect from browser
          const detectedLanguage = detectBrowserLanguage()
          setLanguage(detectedLanguage)
          
          // Save the detected language
          localStorage.setItem("healthconnect-language", detectedLanguage)
        }
      } catch (error) {
        console.warn("Failed to initialize language:", error)
        setLanguage("en") // Fallback to English
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    try {
      localStorage.setItem("healthconnect-language", lang)
      
      // Update HTML lang attribute for accessibility
      document.documentElement.lang = lang
      
      // Update HTML dir attribute for text direction
      document.documentElement.dir = getTextDirection(lang)
      
      // Announce language change for screen readers
      const event = new CustomEvent('languageChange', { 
        detail: { 
          language: lang,
          languageName: translations[lang]?.common?.welcome || lang 
        } 
      })
      document.dispatchEvent(event)
      
    } catch (error) {
      console.warn("Failed to save language preference:", error)
    }
  }

  // Set initial HTML attributes
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.lang = language
      document.documentElement.dir = getTextDirection(language)
    }
  }, [language, isLoading])

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language] || translations.en, // Fallback to English
    isLoading,
    direction: getTextDirection(language),
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
