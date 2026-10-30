import { useState, useEffect } from 'react'
import { dataQualityApi } from '@/services/api/endpoints'
import type { DataQualityReport } from '@/services/api/types'

export function DataQualityPage() {
  const [report, setReport] = useState<DataQualityReport | null>(null)

  useEffect(() => {
    dataQualityApi.get().then(res => setReport(res.data))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Data Quality & Pipeline Integrity</h1>
        <p className="text-xs text-slate-500 mt-1">Provenance tracking, coordinate validation, and rejected records audit</p>
      </div>

      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card text-center space-y-1">
            <div className="text-2xl font-black text-navy-900">{report.total_normalized_records}</div>
            <div className="text-xs text-slate-500">Normalized Records</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-2xl font-black text-amber-600">{report.missing_coordinates}</div>
            <div className="text-xs text-slate-500">Missing Coordinates</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-2xl font-black text-red-600">{report.total_rejected_records}</div>
            <div className="text-xs text-slate-500">Rejected Records</div>
          </div>
        </div>
      )}
    </div>
  )
}
