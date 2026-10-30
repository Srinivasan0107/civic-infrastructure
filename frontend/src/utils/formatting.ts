// Locale-aware formatting utilities
// Uses Intl APIs — no hardcoded format strings

type Locale = 'en' | 'kn' | 'hi' | 'ta' | 'te'

const LOCALE_MAP: Record<Locale, string> = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
}

export function getIntlLocale(i18nLang: string): string {
  return LOCALE_MAP[i18nLang as Locale] ?? 'en-IN'
}

/**
 * Format a UTC ISO string to a locale-aware display date.
 * Returns 'Unknown' if date is null.
 */
function normalizeDateString(dateStr: string): string {
  if (typeof dateStr !== 'string') return dateStr
  let s = dateStr.trim()
  if (s.includes(' ') && !s.includes('T')) {
    s = s.replace(' ', 'T')
  }
  if (s.includes('T') && !s.endsWith('Z') && !s.slice(10).includes('+') && !s.slice(10).includes('-')) {
    s = s + 'Z'
  }
  return s
}

export function formatDate(dateStr: string | null | undefined, locale: string = 'en'): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(normalizeDateString(dateStr))
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat(getIntlLocale(locale), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string | null | undefined, locale: string = 'en'): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(normalizeDateString(dateStr))
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat(getIntlLocale(locale), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return dateStr
  }
}

export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(normalizeDateString(dateStr))
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  } catch {
    return dateStr
  }
}

export function formatNumber(value: number | null | undefined, locale: string = 'en'): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat(getIntlLocale(locale)).format(value)
}

export function formatCurrency(amount: number | null | undefined, currency = 'INR', locale = 'en'): string {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number | null | undefined, locale = 'en'): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function formatDistance(metres: number | null | undefined): string {
  if (metres === null || metres === undefined) return '—'
  if (metres < 1000) return `${Math.round(metres)} m`
  return `${(metres / 1000).toFixed(1)} km`
}

export function formatDays(days: number | null | undefined): string {
  if (days === null || days === undefined) return '—'
  if (days === 0) return 'Same day'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  if (days < 365) return `${Math.round(days / 30)} months`
  return `${Math.round(days / 365)} years`
}

/** Truncate text to maxLen chars */
export function truncate(text: string | null | undefined, maxLen = 120): string {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '…'
}

export function scoreToPercent(score: number): string {
  return `${Math.round(score)}`
}
