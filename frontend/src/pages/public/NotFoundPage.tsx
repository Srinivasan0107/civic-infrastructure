import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-5xl font-black text-navy-900">404</h1>
      <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="text-sm text-slate-500">The municipal record or page you requested could not be located.</p>
      <div className="pt-2">
        <Link to="/" className="btn-primary">
          <ArrowLeft className="h-4 w-4" /> Return Home
        </Link>
      </div>
    </div>
  )
}
