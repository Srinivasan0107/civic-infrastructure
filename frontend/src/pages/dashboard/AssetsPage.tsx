import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Layers,
  ArrowRight,
  Download,
  Database,
  MapPin,
  Map,
  Compass,
  AlertTriangle,
  Lightbulb,
  Footprints,
  Droplets,
  Construction
} from 'lucide-react'
import apiClient from '../../services/api/client'
import { reportsApi } from '../../services/api/endpoints'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export const AssetsPage: React.FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [assetType, setAssetType] = useState('')
  const [ward, setWard] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCsv = async () => {
    setIsExporting(true)
    try {
      await reportsApi.downloadReport('high_risk_assets', `assets_registry_${ward || 'all'}.csv`, ward || undefined)
    } catch (e) {
      console.error(e)
    } finally {
      setIsExporting(false)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['assets', search, assetType, ward],
    queryFn: async () => {
      const res = await apiClient.get('/assets', {
        params: { q: search || undefined, asset_type: assetType || undefined, ward: ward || undefined }
      })
      return res.data
    }
  })

  const assets = data?.items || []

  const assetTypes = [
    { id: '', label: 'All Types' },
    { id: 'road_segment', label: 'Road Segments' },
    { id: 'pothole', label: 'Road Defects' },
    { id: 'streetlight', label: 'Streetlights' },
    { id: 'drain', label: 'Drains & Culverts' },
    { id: 'footpath', label: 'Footpaths' },
    { id: 'public_toilet', label: 'Public Toilets' },
  ]

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-cyan-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-700 border border-cyan-500/30 shadow-glass-cyan flex-shrink-0">
              <Database className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 uppercase tracking-wider">
                  Physical Asset Registry
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  Stable Internal asset_id (AGENTS.md Contract A)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Chronological Timeline Memory
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Civic Physical Asset Inventory & Incident History
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Searchable registry of roads, streetlights, footpaths, and drains linking grievances, photo evidence, and maintenance capex.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="btn-cyan text-xs"
              title="Export complete asset registry in CSV format"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Exporting...' : 'Export Registry CSV'}
            </button>
            <Link to="/dashboard/map" className="btn-emerald text-xs">
              <Map className="h-3.5 w-3.5" />
              GIS Map View
            </Link>
          </div>
        </div>
      </div>

      {/* Asset Type Filter Ribbon */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-3 shadow-clay">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset ID, road name, or ward..."
            className="form-input pl-9 text-xs py-2 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-cyan-600" /> Type:
          </span>
          {assetTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setAssetType(t.id)}
              className={assetType === t.id
                ? 'pill-active bg-cyan-600 text-white shadow-glass-cyan'
                : 'pill-inactive'
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Registry Table Card */}
      <div className="card !p-0 overflow-hidden shadow-clay">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-700" />
            Tracked Civic Physical Assets ({assets.length} items loaded)
          </span>
          <span className="text-[11px] text-slate-400">collection: <code className="font-mono font-bold">assets</code></span>
        </div>

        {isLoading ? (
          <div className="p-16 text-center">
            <LoadingSpinner />
            <p className="text-xs text-slate-500 mt-2">Loading infrastructure asset memory...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-700">{t('dashboard.empty_state')}</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or type filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Asset Identifier</th>
                  <th>Asset Type</th>
                  <th>Name / Physical Location</th>
                  <th>Ward / Zone</th>
                  <th>Priority Tier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a: any) => {
                  const isCrit = a.priority_tier === 'critical'
                  const isHi = a.priority_tier === 'high'

                  return (
                    <tr key={a.asset_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-mono font-bold text-navy-950">
                        <Link to={`/dashboard/assets/${a.asset_id}`} className="hover:text-teal-700 underline">
                          {a.asset_id}
                        </Link>
                      </td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-semibold capitalize">
                          {a.asset_type?.replace('_', ' ') || 'Civic Asset'}
                        </span>
                      </td>
                      <td className="max-w-xs font-sans">
                        <div className="font-semibold text-slate-800 truncate" title={a.name}>{a.name || a.location_text || 'Bengaluru Municipal Corridor'}</div>
                        <div className="text-[10px] text-slate-400 truncate">{a.source_id ? `Source: ${a.source_id}` : 'BBMP Ingested'}</div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {a.ward || 'Bengaluru Urban'}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isCrit
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : isHi
                            ? 'bg-orange-50 text-orange-700 border-orange-300'
                            : 'bg-green-50 text-green-700 border-green-300'
                        }`}>
                          {a.priority_tier || 'Normal'}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/dashboard/assets/${a.asset_id}`}
                          className="btn-secondary text-[11px] !py-1 !px-2.5 flex items-center gap-1 text-teal-800 hover:text-teal-900"
                        >
                          Timeline <ArrowRight className="h-3 w-3" />
                        </Link>
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

export default AssetsPage