import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { LOCALE_STORAGE_KEY } from '@/i18n'

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
]

interface LanguageSelectorProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function LanguageSelector({ variant = 'default', className }: LanguageSelectorProps) {
  const { i18n } = useTranslation()
  const activeCode = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)
  const currentLang = LANGUAGES.find((l) => l.code === activeCode) ?? LANGUAGES[0]

  const handleChange = (code: string) => {
    i18n.changeLanguage(code).then(() => {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
      document.documentElement.lang = code
    })
  }

  return (
    <div className={cn('relative group', className)}>
      <button
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium rounded-button px-3 py-1.5 backdrop-blur-md shadow-glass-btn active:scale-[0.98] transition-all',
          variant === 'default'
            ? 'text-slate-700 bg-white/70 hover:bg-white/90 border border-white/80'
            : 'text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25'
        )}
        aria-label={`Language: ${currentLang.nativeLabel}. Click to change.`}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span lang={currentLang.code}>{currentLang.nativeLabel}</span>
        <ChevronDown className="h-3 w-3" aria-hidden />
      </button>

      {/* Dropdown */}
      <div
        className="absolute right-0 top-full mt-1 w-44 bg-white rounded-card shadow-elevated border border-civic-border z-50 py-1 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible group-hover:opacity-100 group-hover:visible transition-all"
        role="listbox"
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            role="option"
            aria-selected={lang.code === i18n.language}
            onClick={() => handleChange(lang.code)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors',
              lang.code === i18n.language ? 'text-navy-800 font-medium bg-navy-50' : 'text-slate-700'
            )}
          >
            <span lang={lang.code} className="font-medium">{lang.nativeLabel}</span>
            <span className="text-slate-400 text-xs ml-auto">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
