import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Building2, ExternalLink } from 'lucide-react'

export function PublicFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      heading: t('footer.about_heading'),
      links: [
        { to: '/about', label: t('footer.about_platform') },
        { to: '/about#how-it-works', label: t('footer.how_it_works') },
        { to: '/about#governance', label: t('footer.governance') },
      ],
    },
    {
      heading: t('footer.services_heading'),
      links: [
        { to: '/services', label: t('footer.all_services') },
        { to: '/services/road-infrastructure', label: t('footer.road_infrastructure') },
        { to: '/services/drainage', label: t('footer.drainage') },
        { to: '/services/streetlights', label: t('footer.streetlights') },
      ],
    },
    {
      heading: t('footer.citizen_heading'),
      links: [
        { to: '/report', label: t('footer.report_issue') },
        { to: '/citizen/complaints', label: t('footer.my_complaints') },
        { to: '/announcements', label: t('footer.announcements') },
      ],
    },
    {
      heading: t('footer.info_heading'),
      links: [
        { to: '/about#accessibility', label: t('footer.accessibility') },
        { to: '/about#privacy', label: t('footer.privacy') },
        { to: '/about#terms', label: t('footer.terms') },
        { to: '/about#contact', label: t('footer.contact') },
      ],
    },
  ]

  return (
    <footer className="bg-navy-950 text-white/80" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4" aria-label={t('header.home_link')}>
              <img
                src="/logo.png"
                alt="Civic Infrastructure Memory"
                className="w-10 h-10 object-contain rounded-xl bg-white/10 p-0.5 border border-white/20 backdrop-blur-md shadow-glass-btn shrink-0"
              />
              <div>
                <span className="font-bold text-white text-base tracking-tight block">CivicMemory</span>
                <span className="text-[10px] text-teal-300 font-medium block">BBMP Intelligence</span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              {t('footer.platform_description')}
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-white mb-3">{section.heading}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            © {currentYear} CivicMemory. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span>{t('footer.data_disclaimer')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
