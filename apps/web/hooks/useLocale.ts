"use client"

import { useLanguage } from "@/contexts/language-context"
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatList,
    formatNumber,
    formatOrdinal,
    formatPhoneNumber,
    formatRelativeTime,
    formatTime,
} from "@/lib/locale-utils"

/**
 * Hook that provides locale-aware formatting functions
 * Uses the current language from the LanguageContext
 */
export function useLocale() {
  const { language } = useLanguage()

  return {
    // Format numbers with current locale
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(number, language, options),

    // Format currency with current locale
    formatCurrency: (amount: number, currency?: string) =>
      formatCurrency(amount, language, currency),

    // Format dates with current locale
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, language, options),

    // Format time with current locale
    formatTime: (time: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
      formatTime(time, language, options),

    // Format date and time together
    formatDateTime: (
      datetime: Date | string | number,
      options?: {
        dateOptions?: Intl.DateTimeFormatOptions
        timeOptions?: Intl.DateTimeFormatOptions
        separator?: string
      }
    ) => formatDateTime(datetime, language, options),

    // Format relative time (e.g., "2 hours ago")
    formatRelativeTime: (date: Date | string | number, baseDate?: Date) =>
      formatRelativeTime(date, language, baseDate),

    // Format ordinal numbers (1st, 2nd, 3rd)
    formatOrdinal: (number: number) => formatOrdinal(number, language),

    // Format phone numbers according to locale
    formatPhoneNumber: (phoneNumber: string) => formatPhoneNumber(phoneNumber, language),

    // Format lists with proper conjunctions
    formatList: (items: string[], options?: Intl.ListFormatOptions) =>
      formatList(items, language, options),

    // Current language
    language,
  }
}