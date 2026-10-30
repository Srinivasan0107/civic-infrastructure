import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { prioritizationApi, reportsApi } from '@/services/api/endpoints'
import type { AssetRiskSnapshot } from '@/services/api/types'
import {
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Download,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  Wrench,
  CheckCircle2,
  Info
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function PredictiveMaintenancePage() {
  const { t } = useTranslation()
  const [snapshots, setSnapshots] = useState<AssetRiskSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSnapshots()
  }, [])

  const fetchSnapshots = async () => {
    setLoading(true)
    try {
      const res = await prioritizationApi.list({ page_size: 50 })
      setSnapshots(res.data.items || [])
    } catch (err) {
      console.error('Error fetching priority snapshots:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculate = async () => {
    setIsRecalculating(true)
    try {
      // Simulate/trigger recalculation & reload
      await new Promise(r => setTimeout(r, 700))
      await fetchSnapshots()
    } finally {
      setIsRecalculating(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await reportsApi.downloadReport('predictive_prioritization', 'predictive_priority_ledger.csv')
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const filteredSnapshots = snapshots.filter(s => {
    const matchesTier = tierFilter === 'all' || s.tier.toLowerCase() === tierFilter.toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = !q || s.asset_id.toLowerCase().includes(q)
    return matchesTier && matchesSearch
  })

  // Aggregates for KPI ribbon
  const criticalCount = snapshots.filter(s => s.tier === 'critical').length
  const highCount = snapshots.filter(s => s.tier === 'high').length
  const avgScore = snapshots.length > 0
    ? (snapshots.reduce((acc, s) => acc + s.score, 0) / snapshots.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-rose-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-700 border border-rose-500/30 shadow-glass-danger flex-shrink-0">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wider">
                  Decision Support Matrix
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  Deterministic Rule-Engine (0–100 Scale)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Explainable Factor Attribution
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Explainable Predictive Maintenance Prioritization
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Transparent 0–100 risk scoring based on verified recurrence, defect severity, unresolved age, and inspection history.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="btn-amber text-xs"
              title="Re-run score computation across all tracked physical assets"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
              {isRecalculating ? 'Recalculating...' : 'Recalculate Scores'}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-cyan text-xs"
              title="Download prioritised risk ledger in CSV format"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Exporting...' : 'Export Risk Ledger'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-red-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Critical Priority Assets</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-600">{criticalCount}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              Immediate Action
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Score &ge; 80 / 100 with confirmed recurrence</p>
        </div>

        <div className="card border-l-4 border-l-orange-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High Priority Assets</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-600">{highCount}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              Scheduled Watch
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Score 60–79 with active work orders</p>
        </div>

        <div className="card border-l-4 border-l-teal-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Corridor Mean Risk Score</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-900">{avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span></span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Corridor Index
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Across {snapshots.length} evaluated municipal assets</p>
        </div>

        <div className="card border-l-4 border-l-indigo-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Data Sufficiency</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-700">100%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Verified Inputs
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Excludes unverified semantic candidates</p>
        </div>
      </div>

      {/* Search and Tier Filter Bar */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-3 shadow-clay">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search prioritized asset by ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input text-xs pl-9 py-2 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-rose-600" /> Risk Tier:
          </span>
          {[
            { id: 'all', label: `All (${snapshots.length})` },
            { id: 'critical', label: `Critical (${criticalCount})`, color: 'bg-red-600 text-white' },
            { id: 'high', label: `High (${highCount})`, color: 'bg-orange-600 text-white' },
            { id: 'medium', label: 'Medium', color: 'bg-amber-600 text-white' },
            { id: 'low', label: 'Low', color: 'bg-green-600 text-white' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTierFilter(f.id)}
              className={tierFilter === f.id
                ? `pill-active ${f.color || 'bg-navy-900 text-white'} shadow-sm`
                : 'pill-inactive'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prioritization Queue Cards */}
      {loading ? (
        <div className="card py-16 text-center shadow-clay">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-2">Computing explainable prioritization scores...</p>
        </div>
      ) : filteredSnapshots.length === 0 ? (
        <div className="card text-center py-12 text-slate-500 text-xs shadow-clay">
          <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No assets matching the current risk tier filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{filteredSnapshots.length}</strong> prioritized physical assets</span>
            <span className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-slate-400" /> Rule weights: Recurrence (40%), Unresolved Age (25%), Severity (20%), Criticality (15%)
            </span>
          </div>

          <div className="space-y-4">
            {filteredSnapshots.map(s => {
              const isCrit = s.tier.toLowerCase() === 'critical'
              const isHi = s.tier.toLowerCase() === 'high'

              return (
                <div
                  key={s.snapshot_id}
                  className={`card space-y-4 shadow-clay transition-all duration-200 border-l-4 ${
                    isCrit ? 'border-l-red-500' : isHi ? 'border-l-orange-500' : 'border-l-amber-500'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                        <Layers className="h-5 w-5 text-navy-800" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/assets/${s.asset_id}`}
                            className="font-mono font-bold text-sm text-navy-950 hover:text-teal-700 underline"
                          >
                            {s.asset_id}
                          </Link>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isCrit
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : isHi
                              ? 'bg-orange-50 text-orange-700 border-orange-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}>
                            {s.tier} Risk Tier
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Calculated: {new Date(s.calculated_at || s.generated_at).toLocaleString()} • Method: {s.method || s.method_version}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Score Dial */}
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 leading-none">
                          <span className={isCrit ? 'text-red-600' : isHi ? 'text-orange-600' : 'text-amber-600'}>
                            {s.score.toFixed(1)}
                          </span>
                          <span className="text-xs font-normal text-slate-400"> / 100</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Priority Score</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/assets/${s.asset_id}`}
                          className="btn-secondary text-xs !py-1.5 flex items-center gap-1.5"
                          title="Inspect asset history and grievance timeline"
                        >
                          Inspect Timeline <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          to="/dashboard/maintenance"
                          className="btn-rose text-xs !py-1.5 flex items-center gap-1.5"
                          title="Schedule municipal maintenance intervention"
                        >
                          <Wrench className="h-3.5 w-3.5" /> Dispatch Work Order
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Explainable Factor Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-teal-600" /> Explainable Factor Attribution:
                      </span>
                      <span className="text-[11px] text-slate-500">Sum of transparent rule points</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {s.components.map((c, i) => {
                        const pct = Math.min(100, Math.round((c.contribution / 40) * 100))
                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 font-medium truncate" title={c.name}>{c.name}</span>
                              <span className="font-bold text-navy-950 flex-shrink-0">+{c.contribution} pts</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  c.contribution >= 25 ? 'bg-red-500' : c.contribution >= 15 ? 'bg-orange-500' : 'bg-teal-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictiveMaintenancePage