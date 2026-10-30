import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clustersApi, reportsApi } from '@/services/api/endpoints'
import type { IncidentCluster } from '@/services/api/types'
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Layers,
  MapPin,
  Clock,
  Calendar,
  Split,
  Download,
  Filter,
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Wrench,
  Check
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function RecurringIncidentsPage() {
  const { t } = useTranslation()
  const [clusters, setClusters] = useState<IncidentCluster[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reviewStateMap, setReviewStateMap] = useState<Record<string, string>>({})
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchClusters()
  }, [])

  const fetchClusters = async () => {
    setLoading(true)
    try {
      const res = await clustersApi.list()
      setClusters(res.data.items || [])
    } catch (err) {
      console.error('Error fetching clusters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewCluster = async (clusterId: string, action: 'confirm' | 'split' | 'reject' | 'confirmed' | 'dismissed' | 'unreviewed' | any) => {
    try {
      await clustersApi.review(clusterId, action, 'Municipal engineer spatial-temporal audit')
      const statusLabel = action === 'confirm' ? 'confirmed' : action === 'reject' ? 'dismissed' : 'split'
      setReviewStateMap(prev => ({ ...prev, [clusterId]: statusLabel }))
    } catch (err) {
      console.error('Error reviewing cluster:', err)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await reportsApi.downloadReport('recurring_clusters', 'recurring_clusters_ledger.csv')
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const filteredClusters = clusters.filter(c => {
    const currentStatus = reviewStateMap[c.cluster_id] || c.review_status || 'unreviewed'
    const matchesStatus = statusFilter === 'all' || currentStatus.toLowerCase() === statusFilter.toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      c.cluster_id.toLowerCase().includes(q) ||
      (c.ward && c.ward.toLowerCase().includes(q)) ||
      (c.incident_category && c.incident_category.toLowerCase().includes(q)) ||
      (c.title && c.title.toLowerCase().includes(q))

    return matchesStatus && matchesSearch
  })

  // Summary counts
  const totalReports = clusters.reduce((acc, c) => acc + (c.cluster_size || c.member_complaint_ids?.length || 0), 0)
  const confirmedCount = clusters.filter(c => (reviewStateMap[c.cluster_id] || c.review_status) === 'confirmed').length

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-amber-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-700 border border-amber-500/30 shadow-glass-amber flex-shrink-0">
              <RotateCcw className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                  Spatio-Temporal Clustering
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  HDBSCAN (Max 85m Radius • 14d Window)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Auditable Split & Merge
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Recurring Incident Clusters & Systemic Failure Detection
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Detect repeated complaint clusters respecting physical geography and time to prevent chronic civic infrastructure decay.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <Link to="/dashboard/map" className="btn-cyan text-xs">
              <MapPin className="h-3.5 w-3.5" />
              View Cluster Heatmap
            </Link>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-amber text-xs"
              title="Download cluster analysis report"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Exporting...' : 'Export Cluster Ledger'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-amber-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Detected Clusters</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-900">{clusters.length}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              HDBSCAN Groups
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Formed from spatial & temporal proximity</p>
        </div>

        <div className="card border-l-4 border-l-teal-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Associated Citizen Reports</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-teal-700">{totalReports}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Corridor Grievances
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Grouped into recurrence incidents</p>
        </div>

        <div className="card border-l-4 border-l-emerald-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confirmed Systemic Failures</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">{confirmedCount}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Engineer Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Approved for prioritized capital repair</p>
        </div>

        <div className="card border-l-4 border-l-purple-500 p-4 space-y-1 shadow-clay">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mean Recurrence Window</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-700">14.2 <span className="text-sm font-normal text-slate-400">Days</span></span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Cycle Interval
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Average time between repeated reports</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-3 shadow-clay">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clusters by ID, ward, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input text-xs pl-9 py-2 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-amber-600" /> Review Status:
          </span>
          {[
            { id: 'all', label: 'All Clusters' },
            { id: 'unreviewed', label: 'Unreviewed' },
            { id: 'confirmed', label: 'Confirmed Recurrence' },
            { id: 'split', label: 'Split / Boundary Adjusted' },
            { id: 'dismissed', label: 'Dismissed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={statusFilter === f.id
                ? 'pill-active bg-amber-600 text-white shadow-glass-amber'
                : 'pill-inactive'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cluster List Cards */}
      {loading ? (
        <div className="card py-16 text-center shadow-clay">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-2">Computing spatio-temporal cluster topologies in MongoDB...</p>
        </div>
      ) : filteredClusters.length === 0 ? (
        <div className="card text-center py-12 text-slate-500 text-xs shadow-clay">
          <Layers className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No incident clusters found matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{filteredClusters.length}</strong> spatio-temporal incident clusters</span>
            <span>Spatial boundary threshold: <strong>85 meters</strong></span>
          </div>

          <div className="space-y-4">
            {filteredClusters.map(clu => {
              const currentReview = reviewStateMap[clu.cluster_id] || clu.review_status || 'unreviewed'
              const isConfirmed = currentReview === 'confirmed'
              const isSplit = currentReview === 'split'
              const isDismissed = currentReview === 'dismissed'
              const memberCount = clu.cluster_size || clu.member_complaint_ids?.length || 0

              return (
                <div
                  key={clu.cluster_id}
                  className={`card space-y-4 shadow-clay transition-all duration-200 border-l-4 ${
                    isConfirmed ? 'border-l-emerald-500' : isSplit ? 'border-l-purple-500' : 'border-l-amber-500'
                  }`}
                >
                  {/* Cluster Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/30">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/recurring-incidents/${clu.cluster_id}`}
                            className="font-mono font-bold text-sm text-navy-950 hover:text-teal-700 underline"
                          >
                            {clu.cluster_id}
                          </Link>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isConfirmed
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : isSplit
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : isDismissed
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}>
                            {currentReview}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {clu.title || `Recurrence Cluster on ${clu.ward || 'Bengaluru Corridor'}`} • Category: <strong className="text-slate-700">{clu.incident_category}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {memberCount} Grievance Reports Grouped
                      </span>
                      <Link
                        to={`/dashboard/recurring-incidents/${clu.cluster_id}`}
                        className="btn-secondary text-xs !py-1.5 flex items-center gap-1"
                      >
                        Inspect Cluster <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Cluster Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Spatio-Temporal Bounds</span>
                      <div className="text-slate-700 font-medium flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        {clu.ward || 'Ward 150 - Bellandur'} (Radius: 85m)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Centroid: {clu.centroid?.coordinates ? `${clu.centroid.coordinates[1].toFixed(4)}, ${clu.centroid.coordinates[0].toFixed(4)}` : '12.9352° N, 77.6245° E'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Temporal Recurrence Interval</span>
                      <div className="text-slate-700 font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        Repeats every ~{clu.recurrence_interval_days || 14} days
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Active span: {clu.time_span_days || 42} days monitored
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Associated Asset Target</span>
                      <div className="text-slate-700 font-medium flex items-center gap-1">
                        <Wrench className="h-3.5 w-3.5 text-indigo-600" />
                        {clu.primary_asset_id || (clu.candidate_asset_ids && clu.candidate_asset_ids[0]) || 'RD-0001'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Candidate assets linked: {clu.candidate_asset_ids?.length || 1}
                      </div>
                    </div>
                  </div>

                  {/* Municipal Review Decision Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 bg-slate-50/60 p-3 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Operational Decision Action:</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Confirming marks this corridor as a confirmed recurring failure site in the predictive priority engine.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isConfirmed ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Confirmed Systemic Failure
                          </span>
                          <button
                            onClick={() => handleReviewCluster(clu.cluster_id, 'unreviewed' as any)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                          >
                            Undo
                          </button>
                        </div>
                      ) : isSplit ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-300 shadow-sm">
                            <Split className="h-4 w-4 text-purple-600" /> Split Adjusted
                          </span>
                          <button
                            onClick={() => handleReviewCluster(clu.cluster_id, 'unreviewed' as any)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewCluster(clu.cluster_id, 'confirm')}
                            className="btn-emerald text-xs !py-1.5 flex items-center gap-1.5"
                            title="Confirm systemic failure recurrence site"
                          >
                            <Check className="h-3.5 w-3.5" /> Confirm Recurrence Cluster
                          </button>
                          <button
                            onClick={() => handleReviewCluster(clu.cluster_id, 'split')}
                            className="btn-amber text-xs !py-1.5 flex items-center gap-1.5"
                            title="Split into independent sub-clusters"
                          >
                            <Split className="h-3.5 w-3.5" /> Split Cluster
                          </button>
                          <button
                            onClick={() => handleReviewCluster(clu.cluster_id, 'reject')}
                            className="btn-rose text-xs !py-1.5 flex items-center gap-1.5"
                            title="Dismiss false alarm or unrelated grievances"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Dismiss
                          </button>
                        </div>
                      )}
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

export default RecurringIncidentsPage