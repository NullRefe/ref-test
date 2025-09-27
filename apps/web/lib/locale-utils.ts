import { type Language } from "./i18n";

// Locale mappings for supported languages
const localeMap: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  pa: 'pa-IN',
}

// Currency configurations
const currencyConfig: Record<Language, { currency: string; locale: string }> = {
  en: { currency: 'USD', locale: 'en-US' },
  hi: { currency: 'INR', locale: 'hi-IN' },
  pa: { currency: 'INR', locale: 'pa-IN' },
}

/**
 * Format numbers according to the current language locale
 */
export function formatNumber(
  number: number,
  language: Language,
  options?: Intl.NumberFormatOptions
): string {
  try {
    const locale = localeMap[language]
    return new Intl.NumberFormat(locale, options).format(number)
  } catch (error) {
    console.warn(`Failed to format number for language ${language}:`, error)
    return number.toString()
  }
}

/**
 * Format currency according to the current language locale
 */
export function formatCurrency(
  amount: number,
  language: Language,
  currency?: string
): string {
  try {
    const config = currencyConfig[language]
    const targetCurrency = currency || config.currency
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    console.warn(`Failed to format currency for language ${language}:`, error)
    return `${currency || 'INR'} ${amount}`
  }
}

/**
 * Format dates according to the current language locale
 */
export function formatDate(
  date: Date | string | number,
  language: Language,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const locale = localeMap[language]
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj)
  } catch (error) {
    console.warn(`Failed to format date for language ${language}:`, error)
    return new Date(date).toLocaleDateString()
  }
}

/**
 * Format time according to the current language locale
 */
export function formatTime(
  time: Date | string | number,
  language: Language,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const locale = localeMap[language]
    const timeObj = typeof time === 'string' ? new Date(time) : new Date(time)
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: language === 'en', // Use 12-hour format for English, 24-hour for others
    }
    
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(timeObj)
  } catch (error) {
    console.warn(`Failed to format time for language ${language}:`, error)
    return new Date(time).toLocaleTimeString()
  }
}

/**
 * Format date and time together
 */
export function formatDateTime(
  datetime: Date | string | number,
  language: Language,
  options?: {
    dateOptions?: Intl.DateTimeFormatOptions
    timeOptions?: Intl.DateTimeFormatOptions
    separator?: string
  }
): string {
  const { dateOptions, timeOptions, separator = ', ' } = options || {}
  
  const formattedDate = formatDate(datetime, language, dateOptions)
  const formattedTime = formatTime(datetime, language, timeOptions)
  
  return `${formattedDate}${separator}${formattedTime}`
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(
  date: Date | string | number,
  language: Language,
  baseDate?: Date
): string {
  try {
    const locale = localeMap[language]
    const targetDate = new Date(date)
    const base = baseDate || new Date()
    
    const diffInSeconds = Math.floor((targetDate.getTime() - base.getTime()) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    
    if (Math.abs(diffInDays) >= 1) {
      return rtf.format(diffInDays, 'day')
    } else if (Math.abs(diffInHours) >= 1) {
      return rtf.format(diffInHours, 'hour')
    } else if (Math.abs(diffInMinutes) >= 1) {
      return rtf.format(diffInMinutes, 'minute')
    } else {
      return rtf.format(diffInSeconds, 'second')
    }
  } catch (error) {
    console.warn(`Failed to format relative time for language ${language}:`, error)
    return formatDate(date, language)
  }
}

/**
 * Get ordinal numbers (1st, 2nd, 3rd, etc.) in the appropriate language
 */
export function formatOrdinal(
  number: number,
  language: Language
): string {
  try {
    const locale = localeMap[language]
    
    // For Hindi and Punjabi, we use a simple number format
    if (language === 'hi' || language === 'pa') {
      return formatNumber(number, language)
    }
    
    // For English, use proper ordinal formatting
    const pr = new Intl.PluralRules(locale, { type: 'ordinal' })
    const suffixes: Record<string, string> = {
      one: 'st',
      two: 'nd',
      few: 'rd',
      other: 'th',
    }
    
    const rule = pr.select(number)
    const suffix = suffixes[rule] || suffixes.other
    
    return `${number}${suffix}`
  } catch (error) {
    console.warn(`Failed to format ordinal for language ${language}:`, error)
    return number.toString()
  }
}

/**
 * Format phone numbers according to locale conventions
 */
export function formatPhoneNumber(
  phoneNumber: string,
  language: Language
): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '')
  
  // Indian phone number formatting for Hindi and Punjabi
  if (language === 'hi' || language === 'pa') {
    if (digits.length === 10) {
      return `${digits.slice(0, 5)} ${digits.slice(5)}`
    } else if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
    }
  }
  
  // US phone number formatting for English
  if (language === 'en' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  
  return phoneNumber // Return original if no formatting rules apply
}

/**
 * Get list formatting for arrays (e.g., "A, B, and C")
 */
export function formatList(
  items: string[],
  language: Language,
  options?: Intl.ListFormatOptions
): string {
  try {
    const locale = localeMap[language]
    const listFormatter = new Intl.ListFormat(locale, {
      style: 'long',
      type: 'conjunction',
      ...options,
    })
    
    return listFormatter.format(items)
  } catch (error) {
    console.warn(`Failed to format list for language ${language}:`, error)
    return items.join(', ')
  }
}