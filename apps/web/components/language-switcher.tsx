"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { languageNames, supportedLanguages, type Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Globe, Languages } from "lucide-react"

// Language flag emojis and display info
const languageInfo: Record<Language, { flag: string; nativeName: string; code: string }> = {
  en: { flag: "🇺🇸", nativeName: "English", code: "EN" },
  hi: { flag: "🇮🇳", nativeName: "हिंदी", code: "हि" },
  pa: { flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ", code: "ਪਾ" },
}

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "icon-only"
  className?: string
}

export function LanguageSwitcher({ variant = "default", className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    // Announce the change for accessibility
    const message = `Language changed to ${languageInfo[newLanguage].nativeName}`
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.volume = 0.1
      speechSynthesis.speak(utterance)
    }
  }

  if (variant === "icon-only") {
    return (
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className={cn("w-12 h-10", className)} aria-label="Select language">
          <Languages className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent align="end">
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang} className="flex items-center gap-2">
              <span className="text-lg" role="img" aria-label={`${languageInfo[lang].nativeName} flag`}>
                {languageInfo[lang].flag}
              </span>
              <span className="font-medium">{languageInfo[lang].nativeName}</span>
              <span className="text-xs text-muted-foreground ml-auto">{languageInfo[lang].code}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (variant === "compact") {
    return (
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className={cn("w-24 h-8 text-sm", className)} aria-label="Select language">
          <span className="text-base mr-1" role="img" aria-label={`${languageInfo[language].nativeName} flag`}>
            {languageInfo[language].flag}
          </span>
          <span className="font-medium">{languageInfo[language].code}</span>
        </SelectTrigger>
        <SelectContent align="end">
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang} className="flex items-center gap-2">
              <span className="text-lg" role="img" aria-label={`${languageInfo[lang].nativeName} flag`}>
                {languageInfo[lang].flag}
              </span>
              <span className="font-medium">{languageInfo[lang].nativeName}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className={cn("w-[200px]", className)} aria-label="Select language">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-base" role="img" aria-label={`${languageInfo[language].nativeName} flag`}>
            {languageInfo[language].flag}
          </span>
          <span className="font-medium">{languageInfo[language].nativeName}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="end">
        {supportedLanguages.map((lang) => (
          <SelectItem 
            key={lang} 
            value={lang}
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer transition-colors",
              language === lang && "bg-accent"
            )}
          >
            <span className="text-lg" role="img" aria-label={`${languageInfo[lang].nativeName} flag`}>
              {languageInfo[lang].flag}
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-medium">{languageInfo[lang].nativeName}</span>
              <span className="text-xs text-muted-foreground">{languageNames[lang]}</span>
            </div>
            {language === lang && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
