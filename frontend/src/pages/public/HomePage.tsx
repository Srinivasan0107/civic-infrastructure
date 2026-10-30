import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Building2, Construction, Droplets, Lightbulb, Footprints, 
  Bath, Database, Wrench, Sparkles, ArrowRight, Bell, CheckCircle2,
  AlertTriangle, Shield, Clock, ChevronLeft, ChevronRight, X, Camera,
  Layers, Search, MapPin, Check, Activity, ArrowUpRight
} from 'lucide-react'
import { overviewApi, announcementsApi, mediaApi } from '@/services/api/endpoints'
import type { OverviewResponse, Announcement } from '@/services/api/types'
import { KpiCard, KpiCardSkeleton } from '@/components/cards/KpiCard'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { DataStatusBadge } from '@/components/common/DataStatusBadge'

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-2025-01',
    title: 'Monsoon Road Repair & Pothole Patching Drive Initiated across East Zone',
    content: 'Bruhat Bengaluru Mahanagara Palike has commenced rapid asphalt cold-mix patching for high-traffic corridors and arterial roads.',
    type: 'alert',
    published_at: '2025-05-20T10:00:00Z',
    expires_at: null,
    data_status: 'live'
  },
  {
    id: 'ANN-2025-02',
    title: 'Ward 150 Bellandur Drainage De-silting & Culvert Clearing Update',
    content: 'Stormwater drain de-silting along Outer Ring Road reached 88% completion ahead of scheduled rainfall.',
    type: 'update',
    published_at: '2025-05-18T14:30:00Z',
    expires_at: null,
    data_status: 'live'
  },
  {
    id: 'ANN-2025-03',
    title: 'Mahadevapura Corridor Smart Streetlight Survey Program',
    content: 'Inspection teams are surveying LED streetlights and feeder circuits across Mahadevapura zone from 25th May to 30th May.',
    type: 'notice',
    published_at: '2025-05-15T09:00:00Z',
    expires_at: null,
    data_status: 'live'
  }
]

const DEFAULT_LIVE_EVIDENCE = [
  {
    attachment_id: 'ATT-LIVE-ORR-D40-02',
    asset_id: 'RD-0001',
    label: 'Pothole (D40)',
    confidence: '95.8%',
    corridor: 'Outer Ring Road (EcoSpace Flyover)',
    complaint_id: 'BBMP-2025-8642E56D',
    date: '2026-10-26',
    recurrence: 'Recurrent Crater (14d gap, 89.4% DINOv2 match)'
  },
  {
    attachment_id: 'ATT-LIVE-SRJ-D20-01',
    asset_id: 'RD-0002',
    label: 'Alligator Crack (D20)',
    confidence: '91.5%',
    corridor: 'Sarjapur Road Corridor',
    complaint_id: 'BBMP-2025-59CD725E',
    date: '2026-10-18',
    recurrence: 'Structural Base Fatigue Mesh'
  },
  {
    attachment_id: 'ATT-LIVE-HSR-D10-01',
    asset_id: 'RD-0003',
    label: 'Transverse Crack (D10)',
    confidence: '88.4%',
    corridor: 'Hosur Road Expressway Ramp',
    complaint_id: 'BBMP-2025-0EA8AB07',
    date: '2026-10-22',
    recurrence: 'Thermal Subgrade Separation'
  },
  {
    attachment_id: 'ATT-LIVE-IND-SL-01',
    asset_id: 'SL-0001',
    label: 'LED Illumination Audit',
    confidence: 'Verified',
    corridor: 'Indiranagar 100ft Road',
    complaint_id: 'BBMP-2025-76903BB2',
    date: '2026-10-24',
    recurrence: 'Photocell & Feeder Circuit Verification'
  }
]

const RECENT_MUNICIPAL_WORKS = [
  {
    work_order_id: 'WO-2025-0891',
    asset_id: 'RD-0001',
    title: 'Cold-Mix Asphalt Surface Overhaul',
    location: 'EcoSpace Flyover Corridor (Ward 150)',
    status: 'Verified Completed',
    contractor: 'BBMP Mahadevapura Division',
    completion_date: '2026-10-28',
    outcome: 'Recurrent pothole filled and compacted; drainage gradient restored.'
  },
  {
    work_order_id: 'WO-2025-0742',
    asset_id: 'DR-0001',
    title: 'Culvert De-silting & Trash Grate Clearance',
    location: 'Marathahalli Primary SWD Outfall',
    status: 'In Progress (88% Cleared)',
    contractor: 'Stormwater Management Cell',
    completion_date: 'Target: 2026-11-05',
    outcome: 'De-silted 420m of culvert; continuous gravity flow restored.'
  },
  {
    work_order_id: 'WO-2025-0610',
    asset_id: 'SL-0001',
    title: 'Feeder Cable & Photocell Sensor Replacement',
    location: 'Indiranagar 100ft Road (Poles #12 - #24)',
    status: 'Verified Completed',
    contractor: 'BESCOM-BBMP Joint Taskforce',
    completion_date: '2026-10-25',
    outcome: '12 LED fixtures connected to automated twilight switching.'
  }
]

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS)
  const [activeAnnIndex, setActiveAnnIndex] = useState(0)
  const [isAnnDismissed, setIsAnnDismissed] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [livePhotos, setLivePhotos] = useState<any[]>(DEFAULT_LIVE_EVIDENCE)
  const [searchCorridor, setSearchCorridor] = useState('')
  const [loading, setLoading] = useState(true)

  const streamBase = import.meta.env.VITE_API_BASE_URL || '/api/v1'

  useEffect(() => {
    async function loadData() {
      try {
        const [overviewRes, annRes, mediaRes] = await Promise.allSettled([
          overviewApi.get(),
          announcementsApi.list({ page_size: 5 }),
          mediaApi.listAttachments({ page_size: 8 })
        ])
        if (overviewRes.status === 'fulfilled') {
          setOverview(overviewRes.value.data)
        }
        if (annRes.status === 'fulfilled' && annRes.value.data.items?.length > 0) {
          setAnnouncements(annRes.value.data.items)
        }
        if (mediaRes.status === 'fulfilled' && mediaRes.value.data.items?.length > 0) {
          const valid = mediaRes.value.data.items.filter((item: any) => 
            item.attachment_id && (item.file_size > 5000 || item.attachment_id.startsWith('ATT-LIVE'))
          )
          if (valid.length > 0) {
            setLivePhotos(valid.slice(0, 4))
          }
        }
      } catch (err) {
        console.error('Failed to load homepage data', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Auto-cycle announcements every 6 seconds if not paused/dismissed
  useEffect(() => {
    if (isAnnDismissed || isPaused || announcements.length <= 1) return
    const timer = setInterval(() => {
      setActiveAnnIndex(prev => (prev + 1) % announcements.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [announcements.length, isAnnDismissed, isPaused])

  const currentAnn = announcements[activeAnnIndex] || announcements[0]

  const handlePrevAnnouncement = () => {
    setActiveAnnIndex(prev => (prev === 0 ? announcements.length - 1 : prev - 1))
  }

  const handleNextAnnouncement = () => {
    setActiveAnnIndex(prev => (prev + 1) % announcements.length)
  }

  const handleSearchCorridor = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCorridor.trim()) {
      navigate(`/dashboard/assets?q=${encodeURIComponent(searchCorridor.trim())}`)
    }
  }

  return (
    <div className="min-h-full pb-16">
      {/* Polished Official Live Municipal Broadcast Bar */}
      {!isAnnDismissed && announcements.length > 0 && currentAnn && (
        <aside
          role="region"
          aria-label="Official Municipal Broadcast"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border-b border-teal-500/30 px-3 sm:px-6 py-2.5 shadow-md z-20"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Left: Live indicator + Tag + Text (No glowing) */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <span className="h-2 w-2 rounded-full bg-teal-400 shrink-0" title="Municipal Notice"></span>

              {/* Tag pill according to type */}
              {currentAnn.type === 'alert' && (
                <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0 text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="h-3 w-3 text-rose-400" /> Critical Alert
                </span>
              )}
              {currentAnn.type === 'update' && (
                <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0 text-[11px] uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-teal-400" /> Live Update
                </span>
              )}
              {currentAnn.type !== 'alert' && currentAnn.type !== 'update' && (
                <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 shrink-0 text-[11px] uppercase tracking-wider">
                  <Bell className="h-3 w-3 text-sky-400" /> Civic Notice
                </span>
              )}

              {/* Title and snippet */}
              <div className="flex items-center gap-2 min-w-0 truncate">
                <p className="font-semibold text-white truncate tracking-tight">
                  {currentAnn.title}
                </p>
                {currentAnn.content && (
                  <span className="hidden md:inline text-white/70 text-xs truncate max-w-lg">
                    — {currentAnn.content}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Controls + Dots + View All + Dismiss */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Pagination Counter */}
              {announcements.length > 1 && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-white/80">
                  <span>{activeAnnIndex + 1}</span>
                  <span className="text-white/40">/</span>
                  <span>{announcements.length}</span>
                </div>
              )}

              {/* Prev / Next controls */}
              {announcements.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevAnnouncement}
                    aria-label="Previous announcement"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 hover:text-white border border-white/25 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleNextAnnouncement}
                    aria-label="Next announcement"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 hover:text-white border border-white/25 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <Link
                to="/announcements"
                className="hidden sm:inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 underline hover:no-underline text-xs font-medium ml-1"
              >
                {t('home.all_notices')} <ArrowRight className="h-3 w-3" />
              </Link>

              <button
                onClick={() => setIsAnnDismissed(true)}
                aria-label="Dismiss notice bar"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/70 hover:text-white border border-white/25 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all ml-1"
                title="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-[#0B2545] text-white py-14 lg:py-20 px-4 sm:px-6 lg:px-8 shadow-clay-elevated">
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-teal-200 border border-white/20 text-xs font-medium">
              <Shield className="h-3.5 w-3.5 text-teal-400" />
              {t('hero.badge')} • Bengaluru Municipal Corporation
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/report" className="btn-teal text-sm py-2.5 px-5">
                <Camera className="h-4 w-4" />
                {t('hero.cta_report')}
              </Link>
              <Link to="/dashboard" className="btn-municipal text-sm py-2.5 px-5">
                <Building2 className="h-4 w-4 text-teal-300" />
                {t('hero.cta_dashboard')}
              </Link>
              <Link to="/citizen/complaints" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-white transition">
                {t('home.track_grievance')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Corridor & Asset Explorer Search Strip */}
            <div className="pt-2">
              <form onSubmit={handleSearchCorridor} className="relative max-w-xl">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  value={searchCorridor}
                  onChange={(e) => setSearchCorridor(e.target.value)}
                  placeholder="Search physical asset or corridor (e.g. Outer Ring Road, Sarjapur, RD-0001)..."
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/15 transition backdrop-blur-md"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-lg bg-teal-500/80 hover:bg-teal-400/95 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md border border-teal-300/40 shadow-glass-teal hover:shadow-glass-teal-hover active:scale-[0.98] transition-all"
                >
                  {t('home.explore_button')}
                </button>
              </form>

              {/* Quick Preset Corridor Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-white/70">
                <span className="font-semibold text-white/90">{t('home.corridor_search_label')}</span>
                <button
                  onClick={() => navigate('/dashboard/assets?q=RD-0001')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/25 text-teal-200 font-medium border border-white/20 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                >
                  Outer Ring Road (RD-0001)
                </button>
                <button
                  onClick={() => navigate('/dashboard/assets?q=RD-0002')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/25 text-teal-200 font-medium border border-white/20 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                >
                  Sarjapur Road (RD-0002)
                </button>
                <button
                  onClick={() => navigate('/dashboard/assets?q=SL-0001')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/25 text-teal-200 font-medium border border-white/20 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                >
                  Indiranagar 100ft (SL-0001)
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Hero Card: Claymorphic Municipal Memory System Overview */}
          <div className="lg:col-span-5">
            <div className="card-elevated !bg-white/10 !border-white/20 text-white space-y-4 backdrop-blur-md shadow-clay-elevated">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <img
                  src="/logo.png"
                  alt="Civic Infrastructure Memory"
                  className="w-14 h-14 object-contain rounded-2xl bg-white/10 p-1 border border-white/20 backdrop-blur-md shadow-glass-btn shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm sm:text-base tracking-tight text-white leading-tight">Civic Infrastructure Memory</h3>
                  <span className="text-xs text-teal-200 font-medium">From Complaints to Lasting Infrastructure</span>
                </div>
              </div>

              {/* Live Intelligence Core Pillars */}
              <div className="space-y-2.5 text-xs text-white/90">
                <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Permanent Physical Asset Identity: </span>
                    Stable internal IDs (`RD-0001`, `SL-0001`, `DR-0001`) preserve lifecycle memory across years of recurring complaints.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Sparkles className="h-4 w-4 text-cyan-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Multilingual BERT & Vision Intelligence: </span>
                    Cross-lingual understanding across Kannada, Hindi & English paired with YOLO RDD2022 road defect classification.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <AlertTriangle className="h-4 w-4 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Predictive Recurrence & Risk Scoring: </span>
                    Transparent risk indicators flag chronic defect clusters for permanent engineering overhaul.
                  </div>
                </div>
              </div>

              {/* Live Status Heartbeat (Calm, non-glowing) */}
              <div className="pt-2 border-t border-white/10 text-[11px] text-white/70 flex items-center justify-between font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Decision Support Engine Active
                </span>
                <span className="text-teal-200 font-semibold">BBMP Ward 150 - East</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections with Standard Spacing */}
      <div className="space-y-16 mt-14 sm:mt-16">
        {/* Platform Statistics Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('stats.section_title')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('stats.section_subtitle')}</p>
            </div>
            {overview && (
              <div className="flex items-center gap-2">
                <DataStatusBadge status={overview.data_status} />
                <span className="text-xs text-slate-400">Fresh as of today</span>
              </div>
            )}
          </div>

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
                title={t('stats.tracked_assets')}
                kpi={overview.kpis.total_assets}
                dataStatus={overview.data_status}
                icon={<Database className="h-5 w-5" />}
              />
              <KpiCard
                title={t('stats.complaints_filed')}
                kpi={overview.kpis.total_complaints}
                dataStatus={overview.data_status}
                icon={<Construction className="h-5 w-5" />}
              />
              <KpiCard
                title={t('stats.recurring_incidents')}
                kpi={overview.kpis.confirmed_recurring_incidents}
                dataStatus={overview.data_status}
                icon={<AlertTriangle className="h-5 w-5" />}
              />
              <KpiCard
                title={t('stats.priority_assets')}
                kpi={overview.kpis.high_priority_assets}
                dataStatus={overview.data_status}
                icon={<Shield className="h-5 w-5" />}
              />
            </div>
          ) : (
            <div className="card text-center py-8 text-slate-500 text-sm shadow-clay">
              Municipal metrics currently offline. Running local fallback demonstration.
            </div>
          )}
        </section>

        {/* SECTION: HOW CIVIC MEMORY RESOLVES INFRASTRUCTURE FAILURES (4-Step Visual Journey) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-2 shadow-sm">
              <Activity className="h-3.5 w-3.5 text-teal-600" />
              <span>Institutional Memory Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              From Citizen Grievance to Lasting Physical Repair
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Eliminating the cycle of short-lived superficial patches by connecting complaints, photos, and contractor work orders into an enduring timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="card p-5 space-y-3 relative shadow-clay hover:shadow-clay-hover transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-sm shadow-inner">
                01
              </div>
              <h3 className="font-bold text-slate-800 text-base">Citizen Reporting & Geotagging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizens submit photos and complaints in Kannada, Hindi, Tamil, Telugu, or English via mobile portal with GPS location.
              </p>
              <div className="pt-2 text-[11px] font-mono text-teal-700 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Mobile Evidence Capture
              </div>
            </div>

            {/* Step 2 */}
            <div className="card p-5 space-y-3 relative shadow-clay hover:shadow-clay-hover transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center font-bold text-cyan-700 text-sm shadow-inner">
                02
              </div>
              <h3 className="font-bold text-slate-800 text-base">AI Classification & Asset Linking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                YOLO classifies road damage (RDD2022 taxonomy) while multilingual BERT links report to permanent internal asset ID (`RD-0001`).
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-700 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Permanent Asset Binding
              </div>
            </div>

            {/* Step 3 */}
            <div className="card p-5 space-y-3 relative shadow-clay hover:shadow-clay-hover transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-sm shadow-inner">
                03
              </div>
              <h3 className="font-bold text-slate-800 text-base">Recurrence Clustering & Risk Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                DINOv2 visual matching and spatial-temporal constraints group recurring failures and compute transparent risk indicators.
              </p>
              <div className="pt-2 text-[11px] font-mono text-purple-700 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Chronic Hotspot Detection
              </div>
            </div>

            {/* Step 4 */}
            <div className="card p-5 space-y-3 relative shadow-clay hover:shadow-clay-hover transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-sm shadow-inner">
                04
              </div>
              <h3 className="font-bold text-slate-800 text-base">Permanent Engineering Overhaul</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Municipal engineers inspect complete multi-year history, issue work orders for root-cause repairs, and verify lasting outcomes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Verified Outcome Audit
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: LIVE PHOTOGRAPHIC EVIDENCE & INFRASTRUCTURE INTELLIGENCE SHOWCASE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-1.5 shadow-sm">
                <Camera className="h-3.5 w-3.5 text-teal-600" />
                <span>MongoDB GridFS Photographic Memory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {t('home.evidence_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {t('home.evidence_subtitle')}
              </p>
            </div>
            <Link
              to="/dashboard/image-intelligence"
              className="inline-flex items-center gap-2 btn-teal text-xs py-2 px-3.5 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Inspect Visual Intelligence Engine
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {livePhotos.map((photo: any) => {
              const firstDet = photo.detections && photo.detections[0]
              const defectLabel = photo.label || (firstDet ? `${firstDet.class_label}` : 'Civic Inspection')
              const confidence = photo.confidence || (firstDet ? `${Math.round(firstDet.confidence * 100)}%` : '92%')
              const corridor = photo.corridor || `Bengaluru Corridor (${photo.asset_id})`

              return (
                <div key={photo.attachment_id} className="card p-3 space-y-3 shadow-clay hover:shadow-clay-hover transition-all">
                  {/* Photo Frame */}
                  <div className="relative h-44 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center group">
                    <img
                      src={`${streamBase}/media/attachments/${photo.attachment_id}/stream`}
                      alt={photo.attachment_id}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent && !parent.querySelector('.img-fallback')) {
                          const fallback = document.createElement('div')
                          fallback.className = 'img-fallback text-center p-4 text-xs text-slate-400'
                          fallback.innerHTML = '<span>Photo file streaming from GridFS</span>'
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                    {/* Defect detection overlay tag */}
                    <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {defectLabel}: {confidence}
                    </div>
                    {/* Live Stream badge */}
                    <div className="absolute bottom-2 right-2 bg-navy-950/80 backdrop-blur-sm text-teal-300 font-mono text-[9px] px-2 py-0.5 rounded shadow">
                      GridFS Live
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-navy-900">{photo.attachment_id}</span>
                      <Link
                        to={`/dashboard/assets/${photo.asset_id}`}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200 hover:bg-teal-100 transition"
                      >
                        Asset: {photo.asset_id}
                      </Link>
                    </div>

                    <p className="text-xs font-medium text-slate-700 truncate" title={corridor}>
                      {corridor}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{photo.date || (photo.captured_at?.slice(0, 10)) || 'Recent Inspection'}</span>
                      <span className="text-purple-700 font-medium">DINOv2 Embed</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION: RECENT MUNICIPAL ENGINEERING WORKS & TRANSPARENCY FEED */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-1.5 shadow-sm">
                <Wrench className="h-3.5 w-3.5 text-blue-600" />
                <span>Verified Field Accountability</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {t('home.recent_works_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {t('home.recent_works_subtitle')}
              </p>
            </div>
            <Link
              to="/dashboard/maintenance"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-4"
            >
              {t('home.view_all_work_orders')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RECENT_MUNICIPAL_WORKS.map((work) => (
              <div key={work.work_order_id} className="card p-4 space-y-3 shadow-clay hover:shadow-clay-hover transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono font-bold text-xs text-navy-900">{work.work_order_id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {work.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-800">{work.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" /> {work.location}
                  </p>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {work.outcome}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Asset: <strong className="text-slate-700 font-mono">{work.asset_id}</strong></span>
                  <span>{work.completion_date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Catalogue Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{t('services.section_title')}</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">{t('services.section_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              icon={<Database className="h-5 w-5" />}
              title={t('services.registry_title')}
              description={t('services.registry_desc')}
              href="/dashboard/assets"
              count={3230}
              countLabel="total assets"
            />
            <ServiceCard
              icon={<Wrench className="h-5 w-5" />}
              title={t('services.maintenance_title')}
              description={t('services.maintenance_desc')}
              href="/dashboard/maintenance"
              count={1240}
              countLabel="work orders logged"
            />
            <ServiceCard
              icon={<Sparkles className="h-5 w-5" />}
              title={t('services.semantic_title')}
              description={t('services.semantic_desc')}
              href="/dashboard/semantic-analysis"
              count={5}
              countLabel="languages supported"
            />
          </div>
        </section>

        {/* Institutional Architecture & Policy Section */}
        <section className="bg-slate-50 border-y border-civic-border py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{t('about.title')}</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('about.p1')}</p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('about.p2')}</p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('about.p3')}</p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link to="/about" className="btn-secondary">
                Read Technical Architecture & Policy <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="btn-municipal">
                <Building2 className="h-4 w-4 text-teal-300" />
                Launch Municipal Dashboard <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
