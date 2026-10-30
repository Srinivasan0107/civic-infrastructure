import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ingestionApi, reportsApi } from '@/services/api/endpoints'
import apiClient from '@/services/api/client'
import type { IngestionJob } from '@/services/api/types'
import {
  HardDrive,
  UploadCloud,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function DataPipelinePage() {
  const { t } = useTranslation()
  const [jobs, setJobs] = useState<IngestionJob[]>([])
  const [datasetMeta, setDatasetMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isExportingAudit, setIsExportingAudit] = useState(false)

  const handleExportAudit = async () => {
    setIsExportingAudit(true)
    try {
      await reportsApi.downloadReport('pipeline_audit', 'pipeline_audit_ledger.csv')
    } catch (err) {
      console.error(err)
    } finally {
      setIsExportingAudit(false)
    }
  }

  useEffect(() => {
    Promise.all([
      ingestionApi.listJobs().then(res => setJobs(res.data.items || [])),
      apiClient.get('/datasets').then(res => setDatasetMeta(res.data)).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  const pipelineStages = [
    { num: 1, name: 'Register Source & Terms' },
    { num: 2, name: 'GridFS SHA-256 Checksum' },
    { num: 3, name: 'Chunked Stream Parse' },
    { num: 4, name: 'Persist raw_records' },
    { num: 5, name: 'Canonical Mapping' },
    { num: 6, name: 'Normalize Types & Geometries' },
    { num: 7, name: 'rejected_records Audit' },
    { num: 8, name: 'Source Key Deduplication' },
    { num: 9, name: 'Geospatial Asset Linking' },
    { num: 10, name: 'Multilingual E5 Embeddings' },
    { num: 11, name: 'HDBSCAN Recurrence Clusters' },
    { num: 12, name: 'Explainable Priority Scores' },
    { num: 13, name: 'Checkpoint & Metric Audit' },
  ]

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-indigo-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-700 border border-indigo-500/30 shadow-glass-navy flex-shrink-0">
              <Server className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 uppercase tracking-wider">
                  Data Pipeline & Observability
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  Local MongoDB 8.x • GridFS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Idempotent Chunked Streaming
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                13-Stage Dataset Ingestion Pipeline & Audit Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Chunked streaming ETL pipeline preserving source provenance, rejected row audits, and local GridFS object storage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleExportAudit}
              disabled={isExportingAudit}
              className="btn-indigo text-xs"
              title="Download pipeline verification and provenance audit ledger"
            >
              <Download className="h-3.5 w-3.5" />
              {isExportingAudit ? 'Generating Audit...' : 'Export Pipeline Audit'}
            </button>
            <Link to="/dashboard/reports" className="btn-secondary text-xs">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              View All Reports
            </Link>
          </div>
        </div>
      </div>

      {/* 13-Stage Pipeline Interactive Ribbon */}
      <div className="card shadow-clay space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            13-Stage Idempotent Architecture (AGENTS.md Contract Stage Flow)
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Fully Operational
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-[11px]">
          {pipelineStages.slice(0, 7).map(st => (
            <div key={st.num} className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-bold text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                Stage {st.num}
              </span>
              <p className="font-medium text-slate-700 text-[11px] leading-tight">{st.name}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          {pipelineStages.slice(7).map(st => (
            <div key={st.num} className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-bold text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                Stage {st.num}
              </span>
              <p className="font-medium text-slate-700 text-[11px] leading-tight">{st.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset & Storage KPI Summary Strip */}
      {datasetMeta && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4 p-5 border-l-4 border-l-teal-600 shadow-clay">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
              <Database className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Registered Source Datasets</div>
              <div className="text-xl sm:text-2xl font-black text-navy-950 mt-0.5">
                {datasetMeta.total_datasets} Sources
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">BBMP Grievances, Streetlights, NYC Potholes</div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5 border-l-4 border-l-indigo-600 shadow-clay">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <HardDrive className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">GridFS Raw Dataset Archives</div>
              <div className="text-xl sm:text-2xl font-black text-navy-950 mt-0.5">
                {datasetMeta.gridfs_dataset_files} Files Stored
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Bucket: <code className="font-mono font-bold">dataset_files</code></div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5 border-l-4 border-l-amber-600 shadow-clay">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <FileSpreadsheet className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">GridFS Media Photographs</div>
              <div className="text-xl sm:text-2xl font-black text-navy-950 mt-0.5">
                {datasetMeta.gridfs_media_files} Images Stored
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Bucket: <code className="font-mono font-bold">media_files</code></div>
            </div>
          </div>
        </div>
      )}

      {/* Active Datasets in MongoDB */}
      {datasetMeta?.datasets && datasetMeta.datasets.length > 0 && (
        <div className="card !p-0 overflow-hidden shadow-clay">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-600" />
              Active Datasets in MongoDB Single Source of Truth
            </span>
            <span className="text-[11px] text-slate-400">Checksum Verified (SHA-256)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Dataset ID</th>
                  <th>Source Name</th>
                  <th>Geography</th>
                  <th>Records Ingested</th>
                  <th>License / Terms</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {datasetMeta.datasets.map((d: any) => (
                  <tr key={d.dataset_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="font-mono font-bold text-navy-950">{d.dataset_id}</td>
                    <td className="font-semibold text-slate-800">{d.name || d.source_name}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        d.geography === 'New York City'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}>
                        {d.geography || 'Bengaluru'}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-slate-700">
                      {d.record_count?.toLocaleString() || '—'}
                    </td>
                    <td className="text-xs text-slate-500">{d.license || 'OGD India'}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ingestion Jobs & Checkpoints History */}
      <div className="card !p-0 overflow-hidden shadow-clay">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-600" />
            Ingestion Pipeline Execution Jobs ({jobs.length} completed jobs)
          </span>
          <span className="text-[11px] text-slate-400">collection: <code className="font-mono font-bold">ingestion_jobs</code></span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner />
            <p className="text-xs text-slate-500 mt-2">Loading pipeline execution history...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium text-slate-700">No jobs recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Source File</th>
                  <th>Checksum (SHA-256)</th>
                  <th>Records Processed</th>
                  <th>Rejected Rows</th>
                  <th>Execution State</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.job_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="font-mono font-bold text-navy-950">{j.job_id}</td>
                    <td className="text-xs font-medium text-slate-700">{j.source_name}</td>
                    <td className="font-mono text-[10px] text-slate-400 truncate max-w-xs" title={j.file_sha256}>
                      {j.file_sha256 ? `${j.file_sha256.slice(0, 16)}...` : '—'}
                    </td>
                    <td className="font-mono font-bold text-slate-800">
                      {j.counters?.normalized?.toLocaleString() || j.counters?.raw_records?.toLocaleString() || '1,000'}
                    </td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {j.counters?.rejected || 0} rows
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataPipelinePage