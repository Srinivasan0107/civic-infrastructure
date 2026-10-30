import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { overviewApi, prioritizationApi } from '@/services/api/endpoints'
import type { OverviewResponse, AssetRiskSnapshot } from '@/services/api/types'
import { KpiCard, KpiCardSkeleton } from '@/components/cards/KpiCard'
import { DataStatusBadge } from '@/components/common/DataStatusBadge'
import {
  Building2,
  Construction,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function OverviewPage() {
  const { t } = useTranslation()
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [priorityQueue, setPriorityQueue] = useState<AssetRiskSnapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      overviewApi.get(),
      prioritizationApi.list({ page_size: 6 })
    ]).then(([ov, pr]) => {
      if (ov.status === 'fulfilled') setOverview(ov.value.data)
      if (pr.status === 'fulfilled') setPriorityQueue(pr.value.data.items)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Top Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-teal-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/30 shadow-glass-teal flex-shrink-0">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 uppercase tracking-wider">
                  Command Center
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-navy-100 text-navy-800 border border-navy-200">
                  MongoDB 8.x • Realtime Ingestion
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {t('overview.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t('overview.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {overview && <DataStatusBadge status={overview.data_status} />}
            <Link to="/dashboard/map" className="btn-cyan text-xs">
              <Layers className="h-3.5 w-3.5" />
              Open GIS Map
            </Link>
            <Link to="/dashboard/predictive-maintenance" className="btn-rose text-xs">
              <AlertTriangle className="h-3.5 w-3.5" />
              Risk Queue
            </Link>
          </div>
        </div>

        {/* Quick Module Shortcuts Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Jump to Module:
          </span>
          <Link
            to="/dashboard/map"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Geospatial Map
          </Link>
          <Link
            to="/dashboard/semantic-analysis"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-medium transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            Semantic NLP AI
          </Link>
          <Link
            to="/dashboard/image-intelligence"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-medium transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Photo Vision AI
          </Link>
          <Link
            to="/dashboard/recurring-incidents"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-medium transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
            Recurring Clusters
          </Link>
          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 font-medium transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Audit Reports
          </Link>
        </div>
      </div>

      {/* Tactile Claymorphic KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
      ) : overview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title={t('overview.tracked_assets')}
            kpi={overview.kpis.total_assets}
            dataStatus={overview.data_status}
            icon={<Building2 className="h-5 w-5 text-teal-600" />}
          />
          <KpiCard
            title={t('overview.total_grievances')}
            kpi={overview.kpis.total_complaints}
            dataStatus={overview.data_status}
            icon={<Construction className="h-5 w-5 text-sky-600" />}
          />
          <KpiCard
            title={t('overview.recurring_clusters')}
            kpi={overview.kpis.confirmed_recurring_incidents}
            dataStatus={overview.data_status}
            icon={<RotateCcw className="h-5 w-5 text-purple-600" />}
          />
          <KpiCard
            title={t('overview.high_priority_assets')}
            kpi={overview.kpis.high_priority_assets}
            dataStatus={overview.data_status}
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          />
        </div>
      ) : null}

      {/* Main Ratio-Flexible Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-7 card space-y-4 shadow-clay">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-teal-600" />
              {t('overview.grievance_distribution')}
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">{t('overview.bbmp_corpus')}</span>
          </div>
          <div className="h-64 sm:h-72 w-full pt-2">
            {overview && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.category_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b2545',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                      fontSize: '12px'
                    }}
                    cursor={{ fill: 'rgba(0, 168, 150, 0.08)' }}
                  />
                  <Bar dataKey="count" fill="#00a896" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Queue Preview */}
        <div className="lg:col-span-5 card space-y-4 shadow-clay">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              {t('overview.prioritization_queue')}
            </h2>
            <Link to="/dashboard/predictive-maintenance" className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline">
              {t('overview.view_priority_matrix')} →
            </Link>
          </div>

          <div className="space-y-2.5">
            {priorityQueue.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                {t('dashboard.empty_state')}
              </div>
            ) : (
              priorityQueue.map(item => {
                const isCritical = item.tier === 'critical'
                return (
                  <div
                    key={item.snapshot_id}
                    className="p-3 rounded-2xl border border-slate-200/80 bg-white/70 hover:bg-slate-50 flex items-center justify-between transition-all hover:shadow-sm"
                  >
                    <div>
                      <Link to={`/dashboard/assets/${item.asset_id}`} className="font-bold text-xs text-navy-900 hover:text-teal-700 font-mono">
                        {item.asset_id}
                      </Link>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className={`font-bold uppercase px-1.5 py-0.2 rounded text-[10px] ${
                          isCritical ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.tier}
                        </span>
                        <span>{t('overview.score')}: <strong className="text-slate-800">{item.score.toFixed(1)}/100</strong></span>
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/assets/${item.asset_id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
                      title={t('overview.inspect')}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewPage
