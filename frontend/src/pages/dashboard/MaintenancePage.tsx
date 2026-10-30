import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import apiClient from '@/services/api/client'
import { reportsApi } from '@/services/api/endpoints'
import {
  Wrench,
  DollarSign,
  CheckCircle2,
  Clock,
  Layers,
  Download,
  Filter,
  Search,
  ArrowRight,
  Building2,
  Calendar,
  ShieldCheck,
  PlusCircle
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function MaintenancePage() {
  const { t } = useTranslation()
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    Promise.all([
      apiClient.get('/maintenance').then(res => setWorkOrders(res.data.items || [])),
      apiClient.get('/maintenance/summary').then(res => setSummary(res.data)).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await reportsApi.downloadReport('maintenance_capex', 'municipal_work_orders_ledger.csv')
    } catch (err) {
      console.error(err)
    } finally {
      setIsExporting(false)
    }
  }

  const filteredOrders = workOrders.filter(wo => {
    const matchesStatus = statusFilter === 'all' || (wo.status || '').toLowerCase() === statusFilter.toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      (wo.work_order_id && wo.work_order_id.toLowerCase().includes(q)) ||
      (wo.title && wo.title.toLowerCase().includes(q)) ||
      (wo.asset_id && wo.asset_id.toLowerCase().includes(q)) ||
      (wo.department && wo.department.toLowerCase().includes(q))
    return matchesStatus && matchesQuery
  })

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-teal-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/30 shadow-glass-teal flex-shrink-0">
              <Wrench className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 uppercase tracking-wider">
                  Civil Engineering Works
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  BBMP Road Infrastructure Capex
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Actual Cost Verified
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Works & Maintenance Expenditure Ledger
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Audit official municipal capital expenditure records, contractor interventions, and asset repair history.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-cyan text-xs"
              title="Download official work orders ledger"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Exporting...' : 'Export Capex Ledger'}
            </button>
            <Link to="/dashboard/predictive-maintenance" className="btn-rose text-xs">
              <Clock className="h-3.5 w-3.5" />
              Prioritize Interventions
            </Link>
          </div>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4 p-5 border-l-4 border-l-emerald-600 shadow-clay">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sanctioned Capex Expenditure</div>
              <div className="text-xl sm:text-2xl font-black text-navy-950 mt-0.5">
                ₹{((summary.total_expenditure_inr || 0) / 10000000).toFixed(2)} Cr INR
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Sanctioned across Bengaluru road packages</div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5 border-l-4 border-l-teal-600 shadow-clay">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Interventions</div>
              <div className="text-xl sm:text-2xl font-black text-navy-950 mt-0.5">
                {summary.completed_orders} Orders
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Physically verified by ward engineers</div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5 border-l-4 border-l-amber-600 shadow-clay">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Works in Progress</div>
              <div className="text-xl sm:text-2xl font-black text-navy-950 mt-0.5">
                {summary.active_orders} Orders
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ongoing resurfacing and pothole repairs</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-3 shadow-clay">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Work Order ID, title, or asset..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input text-xs pl-9 py-2 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-teal-600" /> Status:
          </span>
          {[
            { id: 'all', label: `All (${workOrders.length})` },
            { id: 'completed', label: 'Completed' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'sanctioned', label: 'Sanctioned' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={statusFilter === f.id
                ? 'pill-active bg-teal-600 text-white shadow-glass-teal'
                : 'pill-inactive'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work Orders Ledger Table */}
      <div className="card !p-0 overflow-hidden shadow-clay">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-700" />
            Official Municipal Work Orders in MongoDB ({filteredOrders.length} records)
          </span>
          <span className="text-[11px] text-slate-400">Currency: INR (₹)</span>
        </div>

        {loading ? (
          <div className="p-12 text-center shadow-clay">
            <LoadingSpinner />
            <p className="text-xs text-slate-500 mt-2">Loading municipal work orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">{t('dashboard.empty_state')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Work Order ID</th>
                  <th>Department</th>
                  <th>Particulars / Scope of Civil Work</th>
                  <th>Linked Asset</th>
                  <th>Sanctioned Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((wo: any) => {
                  const isComp = wo.status === 'completed'
                  return (
                    <tr key={wo.work_order_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-mono font-bold text-navy-950">{wo.work_order_id}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {wo.department || 'Road Works'}
                        </span>
                      </td>
                      <td className="max-w-xs font-sans">
                        <div className="font-semibold text-slate-800 truncate" title={wo.title}>{wo.title || wo.description}</div>
                        <div className="text-[10px] text-slate-400 truncate">{wo.contractor || 'BBMP Major Works Division'}</div>
                      </td>
                      <td>
                        {wo.asset_id ? (
                          <Link
                            to={`/dashboard/assets/${wo.asset_id}`}
                            className="font-mono text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-800 hover:underline font-semibold"
                          >
                            {wo.asset_id}
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="font-semibold text-slate-900 font-mono">
                        ₹{((wo.actual_expenditure || 0) / 100000).toFixed(2)} Lakhs
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isComp
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {wo.status}
                        </span>
                      </td>
                      <td>
                        {wo.asset_id ? (
                          <Link
                            to={`/dashboard/assets/${wo.asset_id}`}
                            className="btn-secondary text-[11px] !py-1 !px-2.5 flex items-center gap-1"
                          >
                            View Timeline <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-300 text-xs">No Link</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MaintenancePage