import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Menu, X, Building2, User, Lock } from 'lucide-react'
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
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const fontSizeClass = {
    normal: '',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[fontSize]

  return (
    <header className="bg-navy-900 text-white" role="banner">
      {/* Top utility bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-xs">
          <span className="text-white/60">{t('header.municipal_portal')}</span>
          <div className="flex items-center gap-3">
            {/* Accessibility controls */}
            <div className="flex items-center gap-1.5" role="group" aria-label={t('a11y.font_size_controls')}>
              <button
                onClick={() => setFontSize('normal')}
                className={cn('px-2 py-0.5 rounded text-xs border backdrop-blur-md shadow-glass-btn transition-all active:scale-[0.98]', fontSize === 'normal' ? 'border-teal-400/60 bg-white/25 text-white font-bold' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white/80')}
                aria-pressed={fontSize === 'normal'}
                aria-label={t('a11y.font_normal')}
              >A</button>
              <button
                onClick={() => setFontSize('large')}
                className={cn('px-2 py-0.5 rounded text-sm border backdrop-blur-md shadow-glass-btn transition-all active:scale-[0.98]', fontSize === 'large' ? 'border-teal-400/60 bg-white/25 text-white font-bold' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white/80')}
                aria-pressed={fontSize === 'large'}
                aria-label={t('a11y.font_large')}
              >A+</button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={cn('px-2 py-0.5 rounded text-base border backdrop-blur-md shadow-glass-btn transition-all active:scale-[0.98]', fontSize === 'xlarge' ? 'border-teal-400/60 bg-white/25 text-white font-bold' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white/80')}
                aria-pressed={fontSize === 'xlarge'}
                aria-label={t('a11y.font_xlarge')}
              >A++</button>
            </div>
            <span className="text-white/30">|</span>
            <LanguageSelector variant="compact" />
            <span className="text-white/30">|</span>
            <Link to="/login?mode=citizen" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <User className="h-3 w-3" aria-hidden />
              {t('nav.citizen_login')}
            </Link>
            <Link to="/login?mode=employee" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <Lock className="h-3 w-3" aria-hidden />
              {t('nav.employee_login')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label={t('header.home_link')}>
            <img
              src="/logo.png"
              alt="Civic Infrastructure Memory"
              className="w-11 h-11 object-contain rounded-xl p-0.5 bg-white/10 border border-white/20 backdrop-blur-md shadow-glass-btn transition-transform group-hover:scale-105"
            />
            <div>
              <div className={cn('font-bold text-white tracking-tight leading-tight flex items-center gap-1.5', fontSizeClass)}>
                Civic Infrastructure Memory
              </div>
              <div className="text-[11px] text-teal-300/90 font-medium">{t('header.tagline')}</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex" role="search">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.search_placeholder')}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-button text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                aria-label={t('header.search_label')}
              />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/90 hover:text-white border border-white/25 backdrop-blur-md shadow-glass-btn active:scale-[0.98] transition-all"
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
          'border-t border-white/10',
          isMenuOpen ? 'block' : 'hidden md:block'
        )}
        aria-label={t('nav.primary_navigation')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-col md:flex-row md:items-center gap-0 md:gap-1 py-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-2.5 text-sm font-medium rounded-button transition-colors',
                      isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(link.label)}
                </NavLink>
              </li>
            ))}
            <li className="md:ml-auto flex items-center gap-2 pt-2 md:pt-0">
              <Link
                to="/dashboard"
                className="btn-municipal text-xs !py-1.5 !px-3.5"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="h-3.5 w-3.5 text-teal-300" />
                {t('hero.cta_dashboard')}
              </Link>
              <NavLink
                to="/report"
                className="btn-teal text-xs sm:text-sm !py-1.5 !px-3.5"
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
