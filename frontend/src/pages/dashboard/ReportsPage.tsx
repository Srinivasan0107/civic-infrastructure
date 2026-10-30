import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Calendar,
  Filter,
  Loader2,
  FileCheck
} from 'lucide-react'
import { reportsApi } from '@/services/api/endpoints'

interface ReportCardProps {
  id: string
  title: string
  categoryBadge: string
  description: string
  columns: string[]
  estimatedRecords: string
  lastUpdated: string
  onExport: (id: string, title: string) => void
  isDownloading: boolean
}

function ReportCard({
  id,
  title,
  categoryBadge,
  description,
  columns,
  estimatedRecords,
  lastUpdated,
  onExport,
  isDownloading
}: ReportCardProps) {
  const { t } = useTranslation()
  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between border border-slate-200/80 bg-white">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-card bg-teal-50 text-teal-700 border border-teal-100">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-950 leading-snug">{title}</h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold rounded-badge bg-slate-100 text-slate-700 border border-slate-200">
                {categoryBadge}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            {estimatedRecords}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

        <div className="bg-slate-50/80 p-2.5 rounded-button border border-slate-100">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Standard CSV Columns
          </div>
          <p className="text-[11px] text-slate-600 font-mono line-clamp-2">
            {columns.join(', ')}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Updated: {lastUpdated}
        </span>
        <button
          onClick={() => onExport(id, title)}
          disabled={isDownloading}
          className="btn-cyan text-xs !py-1.5 !px-3"
          title={`Download ${title} in CSV format`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t('reports.exporting', 'Exporting...')}</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>{t('reports.export_csv', 'Export CSV')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export function ReportsPage() {
  const { t } = useTranslation()
  const [selectedWard, setSelectedWard] = useState<string>('')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const handleExport = async (reportType: string, title: string) => {
    setDownloadingId(reportType)
    setErrorToast(null)
    setSuccessToast(null)
    try {
      const filename = `${reportType}_${selectedWard ? selectedWard + '_' : ''}${new Date().toISOString().slice(0, 10)}.csv`
      await reportsApi.downloadReport(reportType, filename, selectedWard || undefined)
      setSuccessToast(`Successfully downloaded "${title}" as CSV!`)
      setTimeout(() => setSuccessToast(null), 5000)
    } catch (err: any) {
      console.error('Export failed:', err)
      setErrorToast(`Failed to export CSV: ${err.message || 'Unknown error'}`)
    } finally {
      setDownloadingId(null)
    }
  }

  const reports = [
    {
      id: 'monsoon_vulnerability',
      title: 'Monsoon Vulnerability & Drainage Defect Digest',
      categoryBadge: 'Seasonal Audit',
      description: 'Consolidated recurring failure report focusing on road potholes, blocked stormwater drains, and silt recurrence prone to monsoon flash-flooding.',
      columns: [
        'complaint_id',
        'asset_id',
        'ward',
        'category',
        'status',
        'reported_at',
        'is_recurring',
        'recurrence_count',
        'latitude',
        'longitude',
        'description',
        'verification_source'
      ],
      estimatedRecords: '880 Records',
      lastUpdated: 'Live from Atlas Cloud'
    },
    {
      id: 'high_risk_assets',
      title: 'High-Priority Civic Asset Maintenance Audit',
      categoryBadge: 'Risk Prioritization',
      description: 'Audit-ready asset risk scores ranked by recurrence intervals, physical condition degradation, pending work orders, and explainable priority factor weights.',
      columns: [
        'asset_id',
        'name',
        'asset_type',
        'ward',
        'condition',
        'priority_score',
        'priority_tier',
        'recurrence_count',
        'open_complaints',
        'latitude',
        'longitude'
      ],
      estimatedRecords: '36 Assets',
      lastUpdated: 'Active Snapshot'
    },
    {
      id: 'complaints',
      title: 'Civic Grievances & Defect History Master Register',
      categoryBadge: 'Master Dataset',
      description: 'Full unmerged complaint memory timeline including BBMP citizen grievances, multilingual text, normalized GeoJSON coordinates, and asset linkage status.',
      columns: [
        'complaint_id',
        'source_record_id',
        'ward',
        'category',
        'status',
        'reported_at',
        'asset_id',
        'is_recurring',
        'recurrence_count',
        'latitude',
        'longitude',
        'description',
        'source_name'
      ],
      estimatedRecords: '1,308 Records',
      lastUpdated: 'Synchronized'
    },
    {
      id: 'recurring_clusters',
      title: 'Recurring Incident Clusters & Spatial Hotspots',
      categoryBadge: 'Incident Clustering',
      description: 'Algorithmic spatial-temporal clusters grouping repeated failures across road corridors, storm drains, and public footpaths with mean recurrence days.',
      columns: [
        'cluster_id',
        'category',
        'ward',
        'incident_count',
        'affected_assets_count',
        'recurrence_interval_days',
        'first_incident_at',
        'latest_incident_at',
        'review_status',
        'centroid_lat',
        'centroid_lon'
      ],
      estimatedRecords: '36 Clusters',
      lastUpdated: 'Clustered'
    },
    {
      id: 'pipeline_audit',
      title: 'Data Pipeline Ingestion & Provenance Audit Log',
      categoryBadge: 'Pipeline Integrity',
      description: 'Full audit ledger of ingested dataset files, SHA-256 checksums, normalized counts, rejected row counts, and BERT multilingual embeddings generated.',
      columns: [
        'job_id',
        'source_name',
        'status',
        'stage',
        'raw_records',
        'normalized',
        'rejected',
        'assets_linked',
        'embeddings_generated',
        'started_at',
        'completed_at'
      ],
      estimatedRecords: 'Audit Ledger',
      lastUpdated: 'Idempotent'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-slate-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-slate-500/10 text-slate-700 border border-slate-500/30 shadow-glass-btn flex-shrink-0">
              <FileSpreadsheet className="h-7 w-7 text-navy-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300 uppercase tracking-wider">
                  Audit & Compliance Export
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-navy-50 text-navy-800 border border-navy-200">
                  MongoDB Direct Stream • CSV
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  No Fabricated Data
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {t('reports.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t('reports.subtitle')}
              </p>
            </div>
          </div>

          {/* Global Ward Filter */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="form-input text-xs py-2 px-3 w-full lg:w-52"
            >
              <option value="">{t('reports.all_wards')}</option>
              <option value="Doddanekkundi">Doddanekkundi</option>
              <option value="Bellandur">Bellandur</option>
              <option value="Mahadevapura">Mahadevapura</option>
              <option value="Koramangala">Koramangala</option>
              <option value="Indiranagar">Indiranagar</option>
              <option value="Whitefield">Whitefield</option>
              <option value="HSR Layout">HSR Layout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toast Alerts */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-card text-xs flex items-center justify-between gap-2 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {errorToast && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-card text-xs flex items-center justify-between gap-2 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            <span>{errorToast}</span>
          </div>
          <button
            onClick={() => setErrorToast(null)}
            className="text-rose-700 hover:text-rose-950 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((r) => (
          <ReportCard
            key={r.id}
            {...r}
            onExport={handleExport}
            isDownloading={downloadingId === r.id}
          />
        ))}
      </div>

      {/* Provenance and Integrity Banner */}
      <div className="card bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileCheck className="h-8 w-8 text-teal-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-navy-950">
              {t('reports.integrity_guarantee')}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t('reports.integrity_desc')}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleExport('complaints', 'Civic Grievances Master Register')}
          disabled={downloadingId === 'complaints'}
          className="btn-teal text-xs whitespace-nowrap"
        >
          <Download className="h-4 w-4" /> {t('reports.download_master')}
        </button>
      </div>
    </div>
  )
}

export default ReportsPage
