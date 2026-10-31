import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Building2, User, Lock } from 'lucide-react'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { to: '/', label: 'nav.home', exact: true },
  { to: '/services', label: 'nav.services' },
  { to: '/about', label: 'nav.about' },
  { to: '/announcements', label: 'nav.announcements' },
]

export function PublicHeader() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal')

  const fontSizeClass = {
    normal: '',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[fontSize]

  return (
    <header className="bg-gradient-to-r from-white/95 via-teal-50/40 via-sky-50/35 to-white/95 backdrop-blur-2xl border-b border-teal-500/20 text-slate-800 shadow-[0_4px_24px_rgba(0,168,150,0.04)] sticky top-0 z-50 transition-all duration-200" role="banner">
      {/* Top utility bar - Elevated z-50 so Language dropdown floats cleanly above Main header and action buttons */}
      <div className="relative z-50 border-b border-teal-500/15 bg-gradient-to-r from-slate-50/95 via-teal-50/30 to-sky-50/35 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-9 text-xs">
          <span className="text-slate-600 font-semibold tracking-wide flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-glass-teal shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              {t('header.municipal_portal')}
            </span>
          </span>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Accessibility controls */}
            <div className="hidden sm:flex items-center gap-1.5" role="group" aria-label={t('a11y.font_size_controls')}>
              <button
                onClick={() => setFontSize('normal')}
                className={cn('px-2 py-0.5 rounded text-xs border shadow-glass-btn transition-all active:scale-[0.98]', fontSize === 'normal' ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700')}
                aria-pressed={fontSize === 'normal'}
                aria-label={t('a11y.font_normal')}
              >A</button>
              <button
                onClick={() => setFontSize('large')}
                className={cn('px-2 py-0.5 rounded text-sm border shadow-glass-btn transition-all active:scale-[0.98]', fontSize === 'large' ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700')}
                aria-pressed={fontSize === 'large'}
                aria-label={t('a11y.font_large')}
              >A+</button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={cn('px-2 py-0.5 rounded text-base border shadow-glass-btn transition-all active:scale-[0.98]', fontSize === 'xlarge' ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700')}
                aria-pressed={fontSize === 'xlarge'}
                aria-label={t('a11y.font_xlarge')}
              >A++</button>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <LanguageSelector variant="default" />
            <span className="text-slate-300">|</span>
            <Link to="/login?mode=citizen" className="flex items-center gap-1 font-semibold text-slate-600 hover:text-teal-700 transition-colors" title={t('nav.citizen_login')}>
              <User className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              <span className="hidden sm:inline">{t('nav.citizen_login')}</span>
            </Link>
            <Link to="/login?mode=employee" className="flex items-center gap-1 font-semibold text-slate-600 hover:text-teal-700 transition-colors" title={t('nav.employee_login')}>
              <Lock className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              <span className="hidden sm:inline">{t('nav.employee_login')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header - z-20 so it sits below the top utility bar dropdown */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo / Brand - Seamless Gel Glass Capsule */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group px-2 sm:px-2.5 py-1.5 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-md border border-teal-500/20 shadow-glass-btn hover:shadow-card transition-all" aria-label={t('header.home_link')}>
            <img
              src="/logo.png"
              alt="Civic Infrastructure Memory"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl p-0.5 bg-white border border-teal-500/20 shadow-xs transition-transform group-hover:scale-105 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <div className={cn('font-extrabold text-slate-900 tracking-tight leading-tight text-xs sm:text-sm md:text-base flex items-center gap-1.5', fontSizeClass)}>
                Civic Infrastructure Memory
              </div>
              <div className="text-[10px] sm:text-[11px] text-teal-700 font-semibold tracking-wide truncate max-w-[170px] sm:max-w-none">{t('header.tagline')}</div>
            </div>
          </Link>

          {/* Action CTAs Desktop */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="btn-municipal text-xs !py-2 !px-4"
            >
              <Building2 className="h-3.5 w-3.5 text-teal-600" />
              {t('hero.cta_dashboard')}
            </Link>
            <NavLink
              to="/report"
              className="btn-teal text-xs sm:text-sm !py-2 !px-4"
            >
              {t('nav.report_issue')}
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200/80 shadow-glass-btn active:scale-[0.98] transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t('nav.close_menu') : t('nav.open_menu')}
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          'relative z-10 border-t border-teal-500/15 bg-gradient-to-r from-white/85 via-teal-50/25 to-white/85 backdrop-blur-xl',
          isMenuOpen ? 'block' : 'hidden md:block'
        )}
        aria-label={t('nav.primary_navigation')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-col md:flex-row md:items-center gap-0.5 py-1.5" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    cn(
                      'block px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all',
                      isActive
                        ? 'text-teal-900 bg-teal-500/15 border border-teal-500/30 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(link.label)}
                </NavLink>
              </li>
            ))}
            <li className="lg:hidden flex items-center gap-2 pt-2 pb-1 border-t border-slate-200/60 mt-1 md:mt-0 md:border-0 md:pt-0">
              <Link
                to="/dashboard"
                className="btn-municipal text-xs !py-1.5 !px-3.5 flex-1 text-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="h-3.5 w-3.5 text-teal-600" />
                {t('hero.cta_dashboard')}
              </Link>
              <NavLink
                to="/report"
                className="btn-teal text-xs sm:text-sm !py-1.5 !px-3.5 flex-1 text-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.report_issue')}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
