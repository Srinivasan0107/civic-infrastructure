import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, User, Lock, ArrowRight } from 'lucide-react'

export function LoginPage() {
  const [params] = useSearchParams()
  const initialMode = params.get('mode') === 'employee' ? 'employee' : 'citizen'
  const [mode, setMode] = useState<'citizen' | 'employee'>(initialMode)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'employee') {
      navigate('/dashboard')
    } else {
      navigate('/citizen/complaints')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-navy-900 text-teal-400 mx-auto flex items-center justify-center shadow-glass-navy border border-white/20">
          <Building2 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          {mode === 'employee' ? 'Municipal Officer Login' : 'Citizen Grievance Portal'}
        </h1>
        <p className="text-xs text-slate-500">Sign in to access infrastructure records and history</p>
      </div>

      <div className="flex rounded-xl bg-slate-200/50 p-1 text-xs font-semibold backdrop-blur-md border border-white/60 shadow-glass-btn">
        <button
          onClick={() => setMode('citizen')}
          className={`flex-1 py-2 rounded-lg transition-all ${mode === 'citizen' ? 'bg-white/90 text-navy-950 font-bold backdrop-blur-md shadow-glass-btn border border-white/80' : 'text-slate-600 hover:text-navy-950'}`}
        >
          Citizen Access
        </button>
        <button
          onClick={() => setMode('employee')}
          className={`flex-1 py-2 rounded-lg transition-all ${mode === 'employee' ? 'bg-white/90 text-navy-950 font-bold backdrop-blur-md shadow-glass-btn border border-white/80' : 'text-slate-600 hover:text-navy-950'}`}
        >
          Municipal Officer
        </button>
      </div>

      <form onSubmit={handleLogin} className="card space-y-4">
        <div>
          <label className="form-label">
            {mode === 'employee' ? 'Officer Employee ID / KGID' : 'Mobile Number / Citizen ID'}
          </label>
          <input
            type="text"
            required
            defaultValue={mode === 'employee' ? 'BBMP-EE-150' : '9845012345'}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Password / OTP</label>
          <input
            type="password"
            required
            defaultValue="password123"
            className="form-input"
          />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          Continue to {mode === 'employee' ? 'Command Center' : 'My Complaints'} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
