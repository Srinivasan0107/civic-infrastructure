import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react'

export function ServiceDetailPage() {
  const { serviceId } = useParams()

  const details: Record<string, { title: string; desc: string; coverage: string; taxonomy: string }> = {
    'road-infrastructure': {
      title: 'Road Infrastructure & Defect Tracking',
      desc: 'Tracks road corridors, longitudinal/transverse/alligator cracks, potholes, and cold-mix repairs across Bengaluru.',
      coverage: '1,420 arterial and sub-arterial road sections indexed in Mahadevapura, Bommanahalli and East zones.',
      taxonomy: 'RDD2022 damage mapping: D00 (longitudinal crack), D10 (transverse crack), D20 (alligator crack), D40 (pothole).'
    },
    'drainage': {
      title: 'Stormwater Drainage & Culvert Memory',
      desc: 'Chronological flood risk monitoring, de-silting timelines, and monsoon waterlogging recurrent clusters.',
      coverage: '430 primary and secondary stormwater drainage channels.',
      taxonomy: 'Primary SWD canal, secondary culvert, inlet choke, silt accumulation.'
    },
    'streetlights': {
      title: 'Streetlighting Network & Public Safety',
      desc: 'Illumination pole monitoring, feeder circuits, safety-critical darkness hotspots, and LED transition programs.',
      coverage: '890 lighting post identifiers with BESCOM electric pole correlations.',
      taxonomy: 'LED lamp outage, underground cable fault, timer controller malfunction.'
    }
  }

  const item = details[serviceId || 'road-infrastructure'] || details['road-infrastructure']

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4" /> Back to Services
      </Link>
      <h1 className="text-3xl font-bold text-slate-800">{item.title}</h1>
      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="card space-y-2">
          <div className="flex items-center gap-2 text-navy-800 font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4 text-teal-600" /> Geographic Coverage
          </div>
          <p className="text-xs text-slate-600">{item.coverage}</p>
        </div>
        <div className="card space-y-2">
          <div className="flex items-center gap-2 text-navy-800 font-semibold text-sm">
            <Wrench className="h-4 w-4 text-amber-600" /> Defect Taxonomy
          </div>
          <p className="text-xs text-slate-600">{item.taxonomy}</p>
        </div>
      </div>

      <div className="pt-6">
        <Link to="/report" className="btn-teal">
          Report Issue in this Category
        </Link>
      </div>
    </div>
  )
}
