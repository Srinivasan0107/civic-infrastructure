import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { complaintsApi } from '@/services/api/endpoints'
import type { Complaint } from '@/services/api/types'
import { formatDateTime } from '@/utils/formatting'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  ExternalLink,
  Building2,
  Wrench
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function CitizenComplaintDetailPage() {
  const { complaintId } = useParams<{ complaintId: string }>()
  const { t, i18n } = useTranslation()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!complaintId) return
    setLoading(true)
    complaintsApi
      .get(complaintId)
      .then(res => setComplaint(res.data))
      .catch(err => {
        console.error('Error fetching complaint details:', err)
        setError('Could not find grievance details. Please check the ID or return to list.')
      })
      .finally(() => setLoading(false))
  }, [complaintId])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <LoadingSpinner />
        <p className="text-xs text-slate-500 mt-3">Loading grievance details from municipal registry...</p>
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <Link to="/citizen/complaints" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back to My Grievances
        </Link>
        <div className="card p-8 text-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">{error || 'Grievance not found'}</h2>
          <Link to="/citizen/complaints" className="btn-secondary text-xs inline-block">
            View All Grievances
          </Link>
        </div>
      </div>
    )
  }

  const displayDate = complaint.reported_at || complaint.created_at
  const isOpen = complaint.status === 'open'
  const evidence = complaint.same_problem_evidence
  const similarCandidates = (evidence as any)?.similar_candidates || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Back Link */}
      <Link
        to="/citizen/complaints"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Grievances
      </Link>

      {/* Main Grievance Card */}
      <div className="card p-6 bg-white border border-slate-200/90 shadow-clay-elevated space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-navy-950 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                {complaint.complaint_id}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs rounded-full font-semibold uppercase ${
                  isOpen
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {complaint.status}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 mt-2">
              Civic Infrastructure Grievance Record
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
            <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reported Timestamp</span>
              <span className="font-bold text-slate-800">
                {formatDateTime(displayDate, i18n.language)}
              </span>
            </div>
          </div>
        </div>

        {/* Grievance Description */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Citizen Grievance Description
          </label>
          <p className="text-sm text-slate-800 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-sans">
            {complaint.description_original}
          </p>
        </div>

        {/* Bound Physical Asset Card */}
        <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-teal-700" />
              Bound Physical Civic Asset Identity
            </span>
            <Link
              to={`/dashboard/assets/${complaint.asset_id || 'RD-0001'}`}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-1"
            >
              Inspect Asset Timeline <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-mono font-bold text-sm text-navy-950">
              {complaint.asset_id || 'RD-0001'}
            </span>
            {complaint.asset_name && (
              <span className="text-xs text-slate-700 font-medium">
                — {complaint.asset_name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Ward: <strong>{complaint.ward || 'Bellandur'}</strong> • Asset Link Status: <strong>{complaint.asset_link_status}</strong>
          </p>
        </div>

        {/* Recurring Failure & Similar Problems Section ("and it similar") */}
        {complaint.is_recurring && (
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                BERT Semantic Recurrence & Similar Incidents
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                Recurrence #{complaint.recurrence_count || 2}
              </span>
            </div>

            <p className="text-xs text-amber-900">
              This defect shares high semantic, spatial, and category similarity with existing grievances on this same physical corridor.
              {complaint.cluster_id && ` Grouped into Incident Cluster ${complaint.cluster_id}.`}
            </p>

            {evidence && (
              <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-navy-900 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Top Matched Issue: {evidence.top_match_id}
                  </span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {evidence.similarity_percent}% Match
                  </span>
                </div>
                <p className="text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                  "{evidence.top_match_text}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-mono">
                  <span>Distance: {evidence.distance_m}m</span>
                  <span>Date Gap: {evidence.date_gap_days} days</span>
                  <span>Model: BERT Multilingual</span>
                </div>
              </div>
            )}

            {/* List of Other Similar Reports on this corridor */}
            {similarCandidates.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Other Linked Incident Reports on this Corridor:
                </span>
                <div className="space-y-1">
                  {similarCandidates.map((c: any) => (
                    <div
                      key={c.complaint_id}
                      className="bg-white/80 p-2 rounded-lg border border-amber-100 flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span className="font-mono font-bold text-navy-900 shrink-0">{c.complaint_id}</span>
                      <span className="text-slate-600 truncate">{c.description}</span>
                      <span className="font-semibold text-teal-700 shrink-0">{c.similarity_percent}% match</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification and Provenance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Source Verification</span>
            <span className="text-slate-700 font-medium">
              {complaint.verification?.status || 'unverified'} • {complaint.source?.name || 'Public Grievance Portal'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Municipal Action State</span>
            <span className="text-teal-800 font-semibold flex items-center gap-1 mt-0.5">
              <Wrench className="h-3.5 w-3.5 text-teal-600" />
              Prioritized in Engineering Dispatch Queue
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitizenComplaintDetailPage
