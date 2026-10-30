import { useTranslation } from 'react-i18next'
import { Construction, Droplets, Lightbulb, Footprints, Bath, Database, Wrench, Sparkles } from 'lucide-react'
import { ServiceCard } from '@/components/cards/ServiceCard'

export function ServicesPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('services.section_title')}</h1>
        <p className="text-slate-500 mt-2">{t('services.section_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          icon={<Construction className="h-5 w-5" />}
          title={t('services.road_title')}
          description={t('services.road_desc')}
          href="/services/road-infrastructure"
          count={1420}
          countLabel="tracked road links"
        />
        <ServiceCard
          icon={<Droplets className="h-5 w-5" />}
          title={t('services.drain_title')}
          description={t('services.drain_desc')}
          href="/services/drainage"
          count={430}
          countLabel="stormwater channels"
        />
        <ServiceCard
          icon={<Lightbulb className="h-5 w-5" />}
          title={t('services.light_title')}
          description={t('services.light_desc')}
          href="/services/streetlights"
          count={890}
          countLabel="lighting posts"
        />
        <ServiceCard
          icon={<Footprints className="h-5 w-5" />}
          title={t('services.footpath_title')}
          description={t('services.footpath_desc')}
          href="/services/footpaths"
          count={310}
          countLabel="walkway corridors"
        />
        <ServiceCard
          icon={<Bath className="h-5 w-5" />}
          title={t('services.toilet_title')}
          description={t('services.toilet_desc')}
          href="/services/sanitation"
          count={180}
          countLabel="public facilities"
        />
        <ServiceCard
          icon={<Wrench className="h-5 w-5" />}
          title={t('services.maintenance_title')}
          description={t('services.maintenance_desc')}
          href="/dashboard/maintenance"
          count={1240}
          countLabel="work orders logged"
        />
      </div>
    </div>
  )
}
