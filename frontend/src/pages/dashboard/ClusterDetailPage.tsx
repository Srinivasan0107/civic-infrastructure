import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clustersApi, complaintsApi } from '@/services/api/endpoints'
import type { IncidentCluster, Complaint } from '@/services/api/types'
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Split,
  MapPin,
  Clock,
  Calendar,
  Layers,
  Wrench,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function ClusterDetailPage() {
  const { clusterId } = useParams()
  const { t } = useTranslation()
  const [cluster, setCluster] = useState<IncidentCluster | null>(null)
  const [memberComplaints, setMemberComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewStatus, setReviewStatus] = useState<string>('unreviewed')

  useEffect(() => {
    if (!clusterId) return
    setLoading(true)
    clustersApi.get(clusterId)
      .then(res => {
        setCluster(res.data)
        setReviewStatus(res.data.review_status || 'unreviewed')
        // Load member complaints
        if (res.data.member_complaint_ids?.length) {
          Promise.allSettled(
            res.data.member_complaint_ids.slice(0, 10).map(id => complaintsApi.get(id))
          ).then(results => {
            const comps = results
              .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
              .map(r => r.value.data)
            setMemberComplaints(comps)
          })
        }
      })
      .catch(err => console.error('Error fetching cluster detail:', err))
      .finally(() => setLoading(false))
  }, [clusterId])

  const handleReview = async (action: 'confirm' | 'split' | 'reject') => {
    if (!clusterId) return
    try {
      await clustersApi.review(clusterId, action, 'Municipal engineer spatial-temporal cluster validation')
      const statusLabel = action === 'confirm' ? 'confirmed' : action === 'reject' ? 'dismissed' : 'split'
      setReviewStatus(statusLabel)
    } catch (err) {
      console.error('Error updating cluster review state:', err)
    }
  }

  const isConfirmed = reviewStatus === 'confirmed'
  const isSplit = reviewStatus === 'split'
  const isDismissed = reviewStatus === 'dismissed'

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Back button */}
      <Link
        to="/dashboard/recurring-incidents"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Recurring Incident Clusters
      </Link>

      {loading ? (
        <div className="card py-16 text-center shadow-clay">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-2">Loading spatio-temporal cluster topology...</p>
        </div>
      ) : !cluster ? (
        <div className="card py-12 text-center text-slate-500 shadow-clay">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">Cluster {clusterId} not found.</p>
        </div>
      ) : (
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
                    <span className="font-mono text-xs font-bold text-navy-950 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      {cluster.cluster_id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isSplit
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : isDismissed
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      Review State: {reviewStatus}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    {cluster.title || `Recurrence Cluster on ${cluster.ward || 'Bengaluru Corridor'}`}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Category: <strong className="text-slate-700">{cluster.incident_category}</strong> • Ward: <strong className="text-slate-700">{cluster.ward || 'Bengaluru'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <Link to="/dashboard/map" className="btn-cyan text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  View on GIS Map
                </Link>
                <Link to="/dashboard/maintenance" className="btn-rose text-xs">
                  <Wrench className="h-3.5 w-3.5" />
                  Dispatch Repair Work Order
                </Link>
              </div>
            </div>
          </div>

          {/* Topology Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4 space-y-1 border-l-4 border-l-amber-500 shadow-clay">
              <span className="text-[10px] font-bold uppercase text-slate-400">Cluster Size & Recurrence</span>
              <div className="text-xl font-black text-navy-950">
                {cluster.cluster_size || cluster.member_complaint_ids?.length || 0} Grievance Reports
              </div>
              <p className="text-[11px] text-slate-500">Grouped by spatial-temporal density</p>
            </div>

            <div className="card p-4 space-y-1 border-l-4 border-l-teal-500 shadow-clay">
              <span className="text-[10px] font-bold uppercase text-slate-400">Recurrence Frequency</span>
              <div className="text-xl font-black text-teal-700">
                ~{cluster.recurrence_interval_days || 14} Days
              </div>
              <p className="text-[11px] text-slate-500">Average interval between successive complaints</p>
            </div>

            <div className="card p-4 space-y-1 border-l-4 border-l-indigo-500 shadow-clay">
              <span className="text-[10px] font-bold uppercase text-slate-400">Associated Physical Asset</span>
              <div className="text-xl font-black text-indigo-800 font-mono">
                {cluster.primary_asset_id || (cluster.candidate_asset_ids && cluster.candidate_asset_ids[0]) || 'RD-0001'}
              </div>
              <p className="text-[11px] text-slate-500">Linked physical corridor target</p>
            </div>
          </div>

          {/* Operational Decision Action Card */}
          <div className="card shadow-clay p-4 space-y-3 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Municipal Operational Review & Audit Decision
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirming marks this corridor as verified chronic failure in the predictive matrix.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isConfirmed ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Confirmed Systemic Failure
                    </span>
                    <button
                      onClick={() => handleReview('unreviewed' as any)}
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
                      onClick={() => handleReview('unreviewed' as any)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                    >
                      Undo
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReview('confirm')}
                      className="btn-emerald text-xs !py-1.5 flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" /> Confirm Systemic Recurrence
                    </button>
                    <button
                      onClick={() => handleReview('split')}
                      className="btn-amber text-xs !py-1.5 flex items-center gap-1.5"
                    >
                      <Split className="h-3.5 w-3.5" /> Split Cluster
                    </button>
                    <button
                      onClick={() => handleReview('reject')}
                      className="btn-rose text-xs !py-1.5 flex items-center gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Member Complaints Preview */}
          <div className="card shadow-clay !p-0 overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                Associated Member Grievance Reports ({memberComplaints.length > 0 ? memberComplaints.length : cluster.member_complaint_ids?.length || 0} records)
              </span>
              <span className="text-[11px] text-slate-400">Temporal sequence</span>
            </div>

            {memberComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {cluster.member_complaint_ids?.length
                  ? `Contains complaint IDs: ${cluster.member_complaint_ids.join(', ')}`
                  : 'No member complaint details loaded.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {memberComplaints.map(comp => (
                  <div key={comp.complaint_id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-navy-950">{comp.complaint_id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                          {comp.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(comp.reported_at || comp.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {comp.description_original}
                      </p>
                    </div>

                    {comp.asset_id && (
                      <Link
                        to={`/dashboard/assets/${comp.asset_id}`}
                        className="btn-secondary text-[11px] !py-1 !px-2.5 flex items-center gap-1 flex-shrink-0"
                      >
                        Asset Timeline <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClusterDetailPage