import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { complaintsApi } from '@/services/api/endpoints'
import type { Complaint } from '@/services/api/types'
import { formatDateTime } from '@/utils/formatting'
import {
  Calendar,
  MapPin,
  Compass,
  AlertTriangle,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Plus
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function CitizenComplaintsPage() {
  const { t, i18n } = useTranslation()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    complaintsApi
      .list({ page_size: 40 })
      .then(res => setComplaints(res.data.items || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = complaints.filter(c => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      c.complaint_id.toLowerCase().includes(q) ||
      (c.description_original && c.description_original.toLowerCase().includes(q)) ||
      (c.ward && c.ward.toLowerCase().includes(q)) ||
      (c.asset_id && c.asset_id.toLowerCase().includes(q))
    )
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">
            Registered Citizen Grievances
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track reported issues, updated timestamps, and AI-linked physical asset memory.
          </p>
        </div>
        <Link to="/report" className="btn-teal text-xs py-2 px-3.5 flex items-center gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          <span>Report New Grievance</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="card p-3 flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-400 ml-1" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by grievance ID, description, corridor, or ward..."
          className="form-input !py-1.5 !text-xs border-0 shadow-none focus:ring-0"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grievance Timeline List */}
      {loading ? (
        <div className="p-16 text-center">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-3">Loading registered complaints timeline...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Layers className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No grievances match your search.</p>
          <p className="text-xs text-slate-400">
            Click 'Report New Grievance' to register an infrastructure defect.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map(c => {
            const displayDate = c.reported_at || c.created_at
            const isOpen = c.status === 'open'
            const isRecurring = c.is_recurring

            return (
              <div
                key={c.complaint_id}
                className="card p-4 hover:shadow-card-hover transition-all duration-200 border border-slate-200/90 bg-white space-y-3"
              >
                {/* Top Info Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-navy-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {c.complaint_id}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase ${
                        isOpen
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {c.category} • {c.ward || 'Bengaluru'}
                    </span>
                  </div>

                  {/* Accurately Formatted Date & Time */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-teal-600" />
                    <span>{formatDateTime(displayDate, i18n.language)}</span>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-700 leading-relaxed">
                  {c.description_original}
                </p>

                {/* Footer with Asset & Recurrence Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.asset_id && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200">
                        <Compass className="h-3 w-3" />
                        Asset: <strong className="font-mono">{c.asset_id}</strong>
                        {c.asset_name && <span>({c.asset_name})</span>}
                      </span>
                    )}

                    {isRecurring && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Recurrent Defect #{c.recurrence_count || 2}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/citizen/complaints/${c.complaint_id}`}
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold text-xs ml-auto group"
                  >
                    <span>View Status & Similar Incidents</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CitizenComplaintsPage
