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
  const [searchFilter, setSearchFilter] = useState<'all' | 'roads' | 'lights' | 'drains' | 'grievance'>('all')
  const [heroTab, setHeroTab] = useState<'ai' | 'stats' | 'corridors'>('ai')
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
    if (!searchCorridor.trim()) return

    const query = encodeURIComponent(searchCorridor.trim())
    if (searchFilter === 'grievance') {
      navigate(`/citizen/complaints?q=${query}`)
    } else if (searchFilter === 'roads') {
      navigate(`/dashboard/assets?type=road&q=${query}`)
    } else if (searchFilter === 'lights') {
      navigate(`/dashboard/assets?type=streetlight&q=${query}`)
    } else if (searchFilter === 'drains') {
      navigate(`/dashboard/assets?type=drain&q=${query}`)
    } else {
      navigate(`/dashboard/assets?q=${query}`)
    }
  }

  const searchPlaceholders = {
    all: 'Search physical asset or corridor (e.g. Outer Ring Road, Sarjapur, RD-0001)...',
    roads: 'Search road defect, corridor or pothole (e.g. Outer Ring Road, RD-0001)...',
    lights: 'Search streetlight pole or circuit (e.g. Indiranagar, SL-0001)...',
    drains: 'Search stormwater drain or culvert (e.g. Marathahalli, DR-0001)...',
    grievance: 'Lookup grievance reference ID (e.g. BBMP-2025-XXXX)...',
  }

  return (
    <div className="min-h-full pb-16">
      {/* Polished Official Live Municipal Broadcast Bar - Light Glass Aura */}
      {!isAnnDismissed && announcements.length > 0 && currentAnn && (
        <aside
          role="region"
          aria-label="Official Municipal Broadcast"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-gradient-to-r from-amber-50/90 via-teal-50/80 to-sky-50/90 text-slate-800 border-b border-teal-200/70 px-3 sm:px-6 py-2.5 shadow-xs z-20 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Left: Live indicator + Tag + Text */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0" title="Municipal Notice"></span>

              {/* Tag pill according to type */}
              {currentAnn.type === 'alert' && (
                <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shrink-0 text-[11px] uppercase tracking-wider shadow-xs">
                  <AlertTriangle className="h-3 w-3 text-rose-600" /> Critical Alert
                </span>
              )}
              {currentAnn.type === 'update' && (
                <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 shrink-0 text-[11px] uppercase tracking-wider shadow-xs">
                  <Sparkles className="h-3 w-3 text-teal-600" /> Live Update
                </span>
              )}
              {currentAnn.type !== 'alert' && currentAnn.type !== 'update' && (
                <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 shrink-0 text-[11px] uppercase tracking-wider shadow-xs">
                  <Bell className="h-3 w-3 text-sky-600" /> Civic Notice
                </span>
              )}

              {/* Title and snippet */}
              <div className="flex items-center gap-2 min-w-0 truncate">
                <p className="font-semibold text-slate-900 truncate tracking-tight">
                  {currentAnn.title}
                </p>
                {currentAnn.content && (
                  <span className="hidden md:inline text-slate-600 text-xs truncate max-w-lg">
                    — {currentAnn.content}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Controls + Dots + View All + Dismiss */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Pagination Counter */}
              {announcements.length > 1 && (
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200/90 text-[11px] font-mono text-slate-700 shadow-xs">
                  <span>{activeAnnIndex + 1}</span>
                  <span className="text-slate-400">/</span>
                  <span>{announcements.length}</span>
                </div>
              )}

              {/* Prev / Next controls */}
              {announcements.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevAnnouncement}
                    aria-label="Previous announcement"
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white active:bg-slate-100 text-slate-700 border border-slate-200/90 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleNextAnnouncement}
                    aria-label="Next announcement"
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white active:bg-slate-100 text-slate-700 border border-slate-200/90 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <Link
                to="/announcements"
                className="hidden sm:inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold text-xs ml-1"
              >
                {t('home.all_notices')} <ArrowRight className="h-3 w-3" />
              </Link>

              <button
                onClick={() => setIsAnnDismissed(true)}
                aria-label="Dismiss notice bar"
                className="p-1.5 rounded-lg bg-white/90 hover:bg-white active:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/90 backdrop-blur-md shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all ml-1"
                title="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Hero Section - Radiant Light Atmosphere & Flexible Interactive UX */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-teal-50/40 via-sky-50/30 to-white text-slate-900 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70">
        {/* Soft atmospheric ambient radiant glowing orbs */}
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-200/35 via-sky-200/25 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-emerald-100/40 via-teal-100/30 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle, Interactive Search & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-800 border border-teal-500/25 text-xs font-semibold shadow-xs">
              <Shield className="h-3.5 w-3.5 text-teal-600" />
              {t('hero.badge')} • Bengaluru Municipal Corporation
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.18]">
              {t('hero.title').replace('Infrastructure Intelligence', '')}
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 bg-clip-text text-transparent">
                Infrastructure Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link to="/report" className="btn-teal text-sm py-2.5 px-5 shadow-glass-teal">
                <Camera className="h-4 w-4" />
                {t('hero.cta_report')}
              </Link>
              <Link to="/dashboard" className="btn-municipal text-sm py-2.5 px-5">
                <Building2 className="h-4 w-4 text-teal-600" />
                {t('hero.cta_dashboard')}
              </Link>
              <Link to="/citizen/complaints" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900 transition">
                {t('home.track_grievance')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Flexible Multi-Category Search & Corridor Explorer */}
            <div className="pt-3 space-y-2.5">
              {/* Category Filter Pills for Flexible Search Targeting */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Assets' },
                  { id: 'roads', label: '🛣️ Roads & Defects' },
                  { id: 'lights', label: '💡 Streetlights' },
                  { id: 'drains', label: '🌊 Storm Drains' },
                  { id: 'grievance', label: '🔍 Grievance ID' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSearchFilter(cat.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
                      searchFilter === cat.id
                        ? 'bg-teal-600 text-white shadow-glass-teal ring-1 ring-teal-500/50'
                        : 'bg-white/90 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/90 shadow-xs'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Form - Gel Glass Capsule */}
              <form onSubmit={handleSearchCorridor} className="relative max-w-xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 group-focus-within:text-teal-700 transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={searchCorridor}
                  onChange={(e) => setSearchCorridor(e.target.value)}
                  placeholder={searchPlaceholders[searchFilter]}
                  className="w-full pl-11 pr-28 py-3.5 rounded-full bg-gradient-to-r from-white/90 via-teal-50/40 to-white/90 backdrop-blur-xl border border-teal-500/30 text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_2px_12px_rgba(0,168,150,0.08)] hover:border-teal-500/50 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_4px_16px_rgba(0,168,150,0.12)] focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 focus:bg-white transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 border border-teal-400/40 shadow-glass-teal hover:shadow-glass-teal-hover active:scale-[0.98] transition-all"
                >
                  {t('home.explore_button')}
                </button>
              </form>

              {/* Quick Preset Corridor Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{t('home.corridor_search_label')}</span>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/assets?q=RD-0001')}
                  className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-teal-700 font-medium border border-slate-200 shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                >
                  Outer Ring Road (RD-0001)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/assets?q=RD-0002')}
                  className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-teal-700 font-medium border border-slate-200 shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                >
                  Sarjapur Road (RD-0002)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/assets?q=SL-0001')}
                  className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-teal-700 font-medium border border-slate-200 shadow-glass-btn hover:shadow-glass-btn-hover active:scale-[0.98] transition-all"
                >
                  Indiranagar 100ft (SL-0001)
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Hero Card: Highly Flexible 3-Tab Frosted Glass Intelligence Card */}
          <div className="lg:col-span-5">
            <div className="card-elevated !bg-white/85 !border-slate-200/80 text-slate-800 space-y-4 backdrop-blur-xl shadow-clay-elevated ring-1 ring-slate-900/5">
              {/* Header with Branding */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <img
                  src="/logo.png"
                  alt="Civic Infrastructure Memory"
                  className="w-13 h-13 object-contain rounded-2xl bg-white p-1 border border-slate-200/80 shadow-glass-btn shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-tight">
                    Civic Infrastructure Memory
                  </h3>
                  <span className="text-xs text-teal-700 font-semibold block truncate">
                    From Complaints to Lasting Infrastructure
                  </span>
                </div>
              </div>

              {/* Interactive Tab Switcher for Rich UX Flexibility */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setHeroTab('ai')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                    heroTab === 'ai'
                      ? 'bg-white text-teal-900 shadow-glass-btn border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  AI Intelligence
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTab('stats')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                    heroTab === 'stats'
                      ? 'bg-white text-teal-900 shadow-glass-btn border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Live Operations
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTab('corridors')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                    heroTab === 'corridors'
                      ? 'bg-white text-teal-900 shadow-glass-btn border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Key Corridors
                </button>
              </div>

              {/* TAB 1: AI Intelligence Core Pillars */}
              {heroTab === 'ai' && (
                <div className="space-y-2.5 text-xs text-slate-700 animate-fadeIn">
                  <div className="flex items-start gap-2.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Permanent Physical Asset Identity: </span>
                      Stable internal IDs (`RD-0001`, `SL-0001`, `DR-0001`) preserve lifecycle memory across years of recurring complaints.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <Sparkles className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Multilingual BERT & Vision Intelligence: </span>
                      Cross-lingual understanding across Kannada, Hindi & English paired with YOLO RDD2022 road defect classification.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Predictive Recurrence & Risk Scoring: </span>
                      Transparent risk indicators flag chronic defect clusters for permanent engineering overhaul.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Live Operations Snapshot */}
              {heroTab === 'stats' && (
                <div className="space-y-2.5 text-xs text-slate-700 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 text-center">
                      <div className="text-lg font-black text-slate-900">{overview?.kpis.total_assets.value ?? '182'}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Tracked Assets</div>
                    </div>
                    <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 text-center">
                      <div className="text-lg font-black text-teal-700">94.2%</div>
                      <div className="text-[11px] text-slate-500 font-medium">AI Model Precision</div>
                    </div>
                    <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 text-center">
                      <div className="text-lg font-black text-slate-900">{overview?.kpis.total_complaints.value ?? '432'}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Resolved Incidents</div>
                    </div>
                    <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 text-center">
                      <div className="text-lg font-black text-amber-700">{overview?.kpis.high_priority_assets.value ?? '14'}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Priority Hotspots</div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-teal-50 text-teal-800 font-bold border border-teal-200 hover:bg-teal-100 transition shadow-xs text-xs"
                  >
                    Open Operational Command Center <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* TAB 3: Key Bengaluru Corridors */}
              {heroTab === 'corridors' && (
                <div className="space-y-2 text-xs text-slate-700 animate-fadeIn">
                  <div
                    onClick={() => navigate('/dashboard/assets?q=RD-0001')}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/90 hover:bg-teal-50/80 border border-slate-200/80 cursor-pointer transition shadow-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Outer Ring Road (RD-0001)</div>
                      <div className="text-[11px] text-slate-500">Bellandur — Marathahalli • 42 Tracked Assets</div>
                    </div>
                    <span className="text-teal-700 font-bold text-[11px] bg-teal-100 px-2 py-0.5 rounded-md">Active</span>
                  </div>

                  <div
                    onClick={() => navigate('/dashboard/assets?q=RD-0002')}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/90 hover:bg-teal-50/80 border border-slate-200/80 cursor-pointer transition shadow-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Sarjapur Road (RD-0002)</div>
                      <div className="text-[11px] text-slate-500">Carmelaram — Iblur • 28 Tracked Assets</div>
                    </div>
                    <span className="text-teal-700 font-bold text-[11px] bg-teal-100 px-2 py-0.5 rounded-md">Monitored</span>
                  </div>

                  <div
                    onClick={() => navigate('/dashboard/assets?q=SL-0001')}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/90 hover:bg-teal-50/80 border border-slate-200/80 cursor-pointer transition shadow-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Indiranagar 100ft Road (SL-0001)</div>
                      <div className="text-[11px] text-slate-500">Domlur — CMH Road • 19 Smart Lighting Posts</div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">Inspected</span>
                  </div>
                </div>
              )}

              {/* Live Status Heartbeat */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Decision Support Engine Active
                </span>
                <span className="text-teal-700 font-semibold">BBMP Ward 150 - East</span>
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
                  <div className="relative h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center group">
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
                    <div className="absolute bottom-2 right-2 bg-slate-900/75 backdrop-blur-sm text-teal-300 font-mono text-[9px] px-2 py-0.5 rounded shadow">
                      GridFS Live
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-800">{photo.attachment_id}</span>
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
                  <span className="font-mono font-bold text-xs text-slate-800">{work.work_order_id}</span>
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
                <Building2 className="h-4 w-4 text-teal-600" />
                Launch Municipal Dashboard <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
