import { useState, useRef, useEffect } from 'react'
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
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeCode = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)
  const currentLang = LANGUAGES.find((l) => l.code === activeCode) ?? LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (code: string) => {
    i18n.changeLanguage(code).then(() => {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
      document.documentElement.lang = code
      setOpen(false)
    })
  }

  return (
    <div ref={containerRef} className={cn('relative z-50 group', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3 py-1.5 shadow-sm active:scale-[0.98] transition-all border-2 border-slate-900',
          variant === 'default'
            ? 'text-slate-900 bg-white hover:bg-slate-50'
            : 'text-white hover:text-white bg-white/10 hover:bg-white/20 border-white/40'
        )}
        aria-label={`Language: ${currentLang.nativeLabel}. Click to change.`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span lang={currentLang.code}>{currentLang.nativeLabel}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>

      {/* Dropdown Menu - Floating with high z-index and dark outline */}
      <div
        className={cn(
          'absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-slate-900 z-[100] py-1.5 transition-all duration-150',
          open
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
        )}
        role="listbox"
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            role="option"
            aria-selected={lang.code === activeCode}
            onClick={() => handleChange(lang.code)}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors',
              lang.code === activeCode
                ? 'text-teal-900 font-bold bg-teal-50 border-l-4 border-slate-900'
                : 'text-slate-800 font-medium hover:bg-slate-100'
            )}
          >
            <span lang={lang.code}>{lang.nativeLabel}</span>
            <span className="text-slate-500 text-xs font-mono uppercase font-semibold">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
