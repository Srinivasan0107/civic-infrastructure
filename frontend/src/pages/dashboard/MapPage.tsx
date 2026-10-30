import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { assetsApi, complaintsApi, clustersApi } from '@/services/api/endpoints'
import type { Asset, Complaint, IncidentCluster } from '@/services/api/types'
import {
  MapPin,
  Layers,
  Filter,
  Eye,
  Navigation,
  Compass,
  Building2,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Construction,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

declare global {
  interface Window {
    google: any
    initGoogleMap?: () => void
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyClTI2OjAZeRNIBsB8keWmSm1eBGuwLVn4'

export function MapPage() {
  const { t } = useTranslation()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylinesRef = useRef<any[]>([])
  const circlesRef = useRef<any[]>([])

  const [mapLoaded, setMapLoaded] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [assets, setAssets] = useState<Asset[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [clusters, setClusters] = useState<IncidentCluster[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid' | 'terrain'>('roadmap')

  // Layer Visibility
  const [showRoads, setShowRoads] = useState(true)
  const [showLights, setShowLights] = useState(true)
  const [showDrains, setShowDrains] = useState(true)
  const [showComplaints, setShowComplaints] = useState(true)
  const [showClusters, setShowClusters] = useState(true)

  // 1. Load Google Maps Script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true)
      return
    }

    const scriptId = 'google-maps-script'
    if (document.getElementById(scriptId)) {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval)
          setMapLoaded(true)
        }
      }, 100)
      return () => clearInterval(interval)
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = () => {
      setMapLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps script')
    }
    document.head.appendChild(script)
  }, [])

  // 2. Fetch Assets, Complaints, and Clusters from MongoDB
  useEffect(() => {
    async function fetchData() {
      setLoadingData(true)
      try {
        const [assetsRes, complaintsRes, clustersRes] = await Promise.allSettled([
          assetsApi.list({ page_size: 100 }),
          complaintsApi.list({ page_size: 60 }),
          clustersApi.list({ page_size: 30 })
        ])

        if (assetsRes.status === 'fulfilled') {
          const items = assetsRes.value.data.items || []
          setAssets(items)
          if (items.length > 0) setSelectedAsset(items[0])
        }
        if (complaintsRes.status === 'fulfilled') {
          setComplaints(complaintsRes.value.data.items || [])
        }
        if (clustersRes.status === 'fulfilled') {
          setClusters(clustersRes.value.data.items || [])
        }
      } catch (err) {
        console.error('Error fetching map data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  // 3. Initialize Google Map Instance
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapInstanceRef.current) return

    // Center on Bengaluru Bellandur / Mahadevapura Hub
    const defaultCenter = { lat: 12.9260, lng: 77.6744 }

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      mapTypeId: mapType,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'simplified' }]
        }
      ]
    })

    mapInstanceRef.current = map
    infoWindowRef.current = new window.google.maps.InfoWindow()
  }, [mapLoaded, mapType])

  // 4. Update Map Type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType)
    }
  }, [mapType])

  // 5. Plot defined GeoJSON features on Google Maps
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return

    const google = window.google
    const map = mapInstanceRef.current
    const infoWindow = infoWindowRef.current

    // Clear previous elements
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    polylinesRef.current.forEach(p => p.setMap(null))
    polylinesRef.current = []
    circlesRef.current.forEach(c => c.setMap(null))
    circlesRef.current = []

    const bounds = new google.maps.LatLngBounds()
    let hasCoords = false

    // A. Plot Assets (LineStrings & Points)
    assets.forEach(asset => {
      const geo = asset.geometry
      if (!geo) return

      const aType = asset.asset_type
      const isRoad = aType === 'road_segment' || aType === 'road_defect'
      const isLight = aType === 'streetlight'
      const isDrain = aType === 'drain'

      // Check layer filters
      if (isRoad && !showRoads) return
      if (isLight && !showLights) return
      if (isDrain && !showDrains) return
      if (selectedType !== 'all' && aType !== selectedType) return

      // Handle LineString (Road Corridors)
      if (geo.type === 'LineString' && Array.isArray(geo.coordinates)) {
        const path = geo.coordinates.map((c: [number, number]) => {
          const latLng = { lat: c[1], lng: c[0] }
          bounds.extend(latLng)
          hasCoords = true
          return latLng
        })

        const isSelected = selectedAsset?.asset_id === asset.asset_id
        const polyline = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: isSelected ? '#0ea5e9' : isRoad ? '#0284c7' : '#0d9488',
          strokeOpacity: isSelected ? 1.0 : 0.85,
          strokeWeight: isSelected ? 8 : 5,
          map: map,
          zIndex: isSelected ? 100 : 10
        })

        // Interactive InfoWindow on Polyline Click
        polyline.addListener('click', (e: any) => {
          setSelectedAsset(asset)
          const clickPos = e.latLng || path[Math.floor(path.length / 2)]
          infoWindow.setContent(`
            <div style="font-family: inherit; padding: 10px; max-width: 280px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
                <span style="font-family: monospace; font-weight: bold; color: #0b2545; font-size: 13px;">${asset.asset_id}</span>
                <span style="background: #e0f2fe; color: #0369a1; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">
                  ${asset.asset_type.replace('_', ' ')}
                </span>
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #1e293b;">
                ${asset.name || asset.location_text || 'Corridor'}
              </h4>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">
                Ward: ${asset.ward || 'Bengaluru'} • Zone: ${asset.zone || 'BBMP'}
              </p>
              <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                <span style="background: #fef3c7; color: #b45309; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                  Risk Tier: ${(asset.latest_risk_tier || 'Medium').toUpperCase()}
                </span>
                <span style="background: #f1f5f9; color: #334155; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
                  Score: ${asset.latest_risk_score ? asset.latest_risk_score.toFixed(1) : '68.0'}
                </span>
              </div>
              <a href="/dashboard/assets/${asset.asset_id}" style="display: block; text-align: center; background: #00a896; color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
                View Asset History & Timeline →
              </a>
            </div>
          `)
          infoWindow.setPosition(clickPos)
          infoWindow.open(map)
        })

        polylinesRef.current.push(polyline)
      }

      // Handle Point (Streetlight, Drain, Road Defect)
      if (geo.type === 'Point' && Array.isArray(geo.coordinates)) {
        const latLng = { lat: geo.coordinates[1], lng: geo.coordinates[0] }
        bounds.extend(latLng)
        hasCoords = true

        let iconColor = '#0284c7'
        let iconSymbol = '📍'
        if (isLight) {
          iconColor = '#d97706'
          iconSymbol = '💡'
        } else if (isDrain) {
          iconColor = '#0d9488'
          iconSymbol = '💧'
        } else if (aType === 'road_defect') {
          iconColor = '#dc2626'
          iconSymbol = '⚠️'
        }

        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: `${asset.asset_id}: ${asset.name || asset.asset_type}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="${iconColor}" stroke="#ffffff" stroke-width="2.5"/>
                <text x="12" y="16" font-size="10" text-anchor="middle" fill="#ffffff" font-family="sans-serif">${iconSymbol}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(28, 28),
            anchor: new google.maps.Point(14, 14)
          }
        })

        marker.addListener('click', () => {
          setSelectedAsset(asset)
          infoWindow.setContent(`
            <div style="font-family: inherit; padding: 10px; max-width: 260px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-family: monospace; font-weight: bold; color: #0b2545; font-size: 13px;">${asset.asset_id}</span>
                <span style="background: #f1f5f9; color: #475569; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                  ${asset.asset_type}
                </span>
              </div>
              <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #1e293b;">
                ${asset.name || asset.location_text || 'Civic Asset'}
              </h4>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">
                ${asset.ward || 'Bengaluru'}
              </p>
              <a href="/dashboard/assets/${asset.asset_id}" style="display: block; text-align: center; background: #00a896; color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
                Inspect Timeline & Memory →
              </a>
            </div>
          `)
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
      }
    })

    // B. Plot Complaints
    if (showComplaints) {
      complaints.forEach(c => {
        const loc = c.location
        if (!loc || !Array.isArray(loc.coordinates)) return
        const latLng = { lat: loc.coordinates[1], lng: loc.coordinates[0] }
        bounds.extend(latLng)
        hasCoords = true

        const isRec = c.is_recurring
        const cMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: `Complaint ${c.complaint_id}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="${isRec ? 9 : 7}" fill="${isRec ? '#ea580c' : '#ef4444'}" stroke="#ffffff" stroke-width="2"/>
                ${isRec ? '<circle cx="12" cy="12" r="3" fill="#ffffff"/>' : ''}
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(isRec ? 24 : 18, isRec ? 24 : 18),
            anchor: new google.maps.Point(isRec ? 12 : 9, isRec ? 12 : 9)
          }
        })

        cMarker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="font-family: inherit; padding: 10px; max-width: 270px;">
              <span style="font-family: monospace; font-weight: bold; color: #0b2545; font-size: 12px;">${c.complaint_id}</span>
              ${c.is_recurring ? '<span style="margin-left: 6px; background: #ffedd5; color: #c2410c; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Recurring Defect</span>' : ''}
              <p style="margin: 6px 0; font-size: 12px; color: #334155; line-height: 1.4;">
                "${c.description_original.substring(0, 110)}..."
              </p>
              <div style="font-size: 11px; color: #64748b;">
                Corridor: <strong>${c.asset_id || 'Corridor'}</strong> • ${c.ward || 'Bengaluru'}
              </div>
            </div>
          `)
          infoWindow.open(map, cMarker)
        })

        markersRef.current.push(cMarker)
      })
    }

    // C. Plot Recurring Incident Clusters
    if (showClusters) {
      clusters.forEach(clu => {
        const centroidCoords = clu.centroid?.coordinates
        if (!centroidCoords || !Array.isArray(centroidCoords)) return

        const centerLatLng = { lat: centroidCoords[1], lng: centroidCoords[0] }
        bounds.extend(centerLatLng)
        hasCoords = true

        const circle = new google.maps.Circle({
          strokeColor: '#f59e0b',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#fbbf24',
          fillOpacity: 0.18,
          map: map,
          center: centerLatLng,
          radius: 350
        })

        circle.addListener('click', () => {
          infoWindow.setContent(`
            <div style="font-family: inherit; padding: 10px; max-width: 260px;">
              <span style="font-family: monospace; font-weight: bold; color: #b45309; font-size: 12px;">${clu.cluster_id}</span>
              <h4 style="margin: 4px 0 6px 0; font-size: 13px; font-weight: bold; color: #1e293b;">
                ${(clu as any).title || 'Recurring Failure Cluster'}
              </h4>
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Member Incidents: <strong>${clu.member_count}</strong> • Affected Assets: <strong>${clu.candidate_asset_ids?.join(', ') || 'Corridor'}</strong>
              </p>
            </div>
          `)
          infoWindow.setPosition(centerLatLng)
          infoWindow.open(map)
        })

        circlesRef.current.push(circle)
      })
    }

    // Auto-fit bounds if we have coordinates and it's the initial load
    if (hasCoords && !selectedAsset) {
      map.fitBounds(bounds)
    }
  }, [
    mapLoaded,
    assets,
    complaints,
    clusters,
    showRoads,
    showLights,
    showDrains,
    showComplaints,
    showClusters,
    selectedType,
    selectedAsset
  ])

  // Center on asset when selected in sidebar
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    if (!mapInstanceRef.current || !asset.geometry) return

    const geo = asset.geometry
    let targetLatLng = { lat: 12.9260, lng: 77.6744 }

    if (geo.type === 'Point' && Array.isArray(geo.coordinates)) {
      targetLatLng = { lat: geo.coordinates[1], lng: geo.coordinates[0] }
    } else if (geo.type === 'LineString' && Array.isArray(geo.coordinates)) {
      const mid = Math.floor(geo.coordinates.length / 2)
      targetLatLng = { lat: geo.coordinates[mid][1], lng: geo.coordinates[mid][0] }
    }

    mapInstanceRef.current.panTo(targetLatLng)
    mapInstanceRef.current.setZoom(15)
  }

  // Quick Preset Zooms
  const zoomToCorridor = (lat: number, lng: number, zoom = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng })
      mapInstanceRef.current.setZoom(zoom)
    }
  }

  const filteredAssets = assets.filter(a => {
    const matchesType = selectedType === 'all' || a.asset_type === selectedType
    const q = searchQuery.toLowerCase().trim()
    const matchesQ =
      !q ||
      a.asset_id.toLowerCase().includes(q) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.ward && a.ward.toLowerCase().includes(q))
    return matchesType && matchesQ
  })

  return (
    <div className="space-y-4">
      {/* Module Hero Banner */}
      <div className="module-hero !p-4 sm:!p-5">
        <div className="module-hero-glow bg-emerald-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 relative z-10">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 shadow-glass-emerald flex-shrink-0">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  Geospatial GIS Memory
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  MongoDB 2dsphere GeoJSON [lng, lat]
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                {t('map.title')}
              </h1>
              <p className="text-xs text-slate-500">
                {t('map.subtitle')}
              </p>
            </div>
          </div>

          {/* Quick Corridor Navigation Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs w-full lg:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Corridors:</span>
            {[
              { label: 'Bellandur ORR', lat: 12.9260, lng: 77.6744, zoom: 14 },
              { label: 'Sarjapur Rd', lat: 12.9100, lng: 77.6850, zoom: 14 },
              { label: 'Indiranagar', lat: 12.9719, lng: 77.6412, zoom: 15 },
              { label: 'Whitefield', lat: 12.9698, lng: 77.7499, zoom: 14 },
              { label: 'Bengaluru Overview', lat: 12.9716, lng: 77.5946, zoom: 12 }
            ].map(p => (
              <button
                key={p.label}
                onClick={() => zoomToCorridor(p.lat, p.lng, p.zoom)}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-glass-btn transition-all active:scale-95 text-[11px]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map + Asset Context Canvas (Ratio Flexible) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-175px)] min-h-[640px]">
        {/* Interactive Google Map Column */}
        <div className="lg:col-span-8 flex flex-col relative card !p-0 overflow-hidden border-2 border-white/80 shadow-clay-elevated">
          {/* Floating Claymorphic Map Controls Bar */}
          <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Layer Toggles */}
            <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-clay border border-white flex flex-wrap items-center gap-2 text-xs pointer-events-auto">
              <span className="font-bold text-navy-900 flex items-center gap-1 text-[11px]">
                <Layers className="h-3.5 w-3.5 text-teal-600" /> {t('map.layers_label')}
              </span>

              <button
                onClick={() => setShowRoads(!showRoads)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold backdrop-blur-md transition-all ${
                  showRoads ? 'bg-sky-500/20 text-sky-800 border-sky-400/50 shadow-glass-btn' : 'bg-slate-100/50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                🛣️ {t('map.layer_roads')} ({assets.filter(a => a.asset_type.includes('road')).length})
              </button>

              <button
                onClick={() => setShowLights(!showLights)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold backdrop-blur-md transition-all ${
                  showLights ? 'bg-amber-500/20 text-amber-800 border-amber-400/50 shadow-glass-btn' : 'bg-slate-100/50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                💡 {t('map.layer_streetlights')} ({assets.filter(a => a.asset_type === 'streetlight').length})
              </button>

              <button
                onClick={() => setShowDrains(!showDrains)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold backdrop-blur-md transition-all ${
                  showDrains ? 'bg-teal-500/20 text-teal-800 border-teal-400/50 shadow-glass-btn' : 'bg-slate-100/50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                💧 {t('map.layer_drains')} ({assets.filter(a => a.asset_type === 'drain').length})
              </button>

              <button
                onClick={() => setShowComplaints(!showComplaints)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold backdrop-blur-md transition-all ${
                  showComplaints ? 'bg-rose-500/20 text-rose-800 border-rose-400/50 shadow-glass-btn' : 'bg-slate-100/50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                🔴 {t('map.layer_complaints')} ({complaints.length})
              </button>

              <button
                onClick={() => setShowClusters(!showClusters)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold backdrop-blur-md transition-all ${
                  showClusters ? 'bg-purple-500/20 text-purple-800 border-purple-400/50 shadow-glass-btn' : 'bg-slate-100/50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                ⭕ {t('map.layer_clusters')} ({clusters.length})
              </button>
            </div>

            {/* Map Style Selector */}
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-clay border border-white flex items-center gap-1.5 text-xs pointer-events-auto">
              {(['roadmap', 'hybrid', 'terrain'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setMapType(style)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md transition-all ${
                    mapType === style
                      ? 'bg-navy-950/80 text-white border border-white/30 shadow-glass-navy'
                      : 'text-slate-600 hover:bg-white/80 border border-transparent shadow-glass-btn'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Google Maps Container */}
          <div ref={mapContainerRef} className="w-full h-full flex-1 bg-slate-100" />

          {/* Loading Overlay */}
          {(!mapLoaded || loadingData) && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-20">
              <LoadingSpinner />
              <p className="text-xs font-semibold text-slate-700">
                Initializing Google Maps and rendering 2dsphere GeoJSON features...
              </p>
            </div>
          )}

          {/* Bottom Live Coordinate / Attribution Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow border border-slate-200/80 text-[10px] text-slate-600 font-mono flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Maps Active • Coordinates: [77.6744°E, 12.9260°N] • WGS84 EPSG:4326</span>
          </div>
        </div>

        {/* Selected Asset Context & Inventory Sidebar */}
        <div className="lg:col-span-4 flex flex-col card p-4 space-y-3 overflow-hidden shadow-clay-elevated">
          <div className="border-b border-slate-100 pb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-teal-600" />
                Tracked Asset Corridors ({filteredAssets.length})
              </h2>
              <span className="text-[10px] font-mono text-slate-500">Live MongoDB</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('map.search_placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input !text-xs !py-1.5 !pl-8"
              />
            </div>

            {/* Asset Type Pills */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {[
                { id: 'all', label: t('map.filter_all') },
                { id: 'road_segment', label: t('map.filter_roads') },
                { id: 'streetlight', label: t('map.filter_streetlights') },
                { id: 'drain', label: t('map.filter_drains') }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedType(f.id)}
                  className={`px-2 py-0.5 rounded-lg border backdrop-blur-md transition-all active:scale-95 ${
                    selectedType === f.id
                      ? 'bg-teal-500/80 text-white border-teal-300/60 font-semibold shadow-glass-teal'
                      : 'bg-white/60 text-slate-600 border-white/60 hover:bg-white/80 shadow-glass-btn'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Asset Highlight Card */}
          {selectedAsset && (
            <div className="bg-gradient-to-br from-teal-50/80 to-sky-50/80 p-3.5 rounded-2xl border border-teal-200 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-navy-900">{selectedAsset.asset_id}</span>
                  <h3 className="font-bold text-xs text-slate-800 mt-0.5">
                    {selectedAsset.name || selectedAsset.location_text || 'Corridor'}
                  </h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-teal-800 border border-teal-300">
                  {selectedAsset.asset_type}
                </span>
              </div>

              <p className="text-[11px] text-slate-600">
                Location: <strong>{selectedAsset.ward || 'Bellandur'}</strong> • Zone: <strong>{selectedAsset.zone || 'Mahadevapura'}</strong>
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-500">
                  Risk Tier: <strong className="text-amber-800 font-semibold">{selectedAsset.latest_risk_tier || 'Medium'}</strong>
                </span>
                <Link
                  to={`/dashboard/assets/${selectedAsset.asset_id}`}
                  className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold underline"
                >
                  Explore Timeline →
                </Link>
              </div>
            </div>
          )}

          {/* Scrollable Asset List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No civic assets match your search filter.
              </div>
            ) : (
              filteredAssets.map(a => {
                const isSelected = selectedAsset?.asset_id === a.asset_id
                return (
                  <div
                    key={a.asset_id}
                    onClick={() => handleSelectAsset(a)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 shadow-sm ring-1 ring-teal-400'
                        : 'border-slate-200/80 bg-white/80 hover:bg-slate-50/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-navy-900">{a.asset_id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-semibold">
                        {a.asset_type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-medium text-slate-700 mt-1 truncate">
                      {a.name || a.location_text || 'Civic Corridor'}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                      <span>{a.ward || 'Bengaluru'}</span>
                      <span className="font-mono text-teal-700 font-semibold">
                        Geo: {a.geometry?.type || 'Point'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
