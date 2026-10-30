import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Map, Database, Sparkles, Image,
  RotateCcw, AlertTriangle, Wrench,
  FileText, Building2, User, ChevronLeft, ChevronRight, Menu,
  Layers, ExternalLink, ShieldCheck, Activity
} from 'lucide-react'
import { LanguageSelector } from '@/components/common/LanguageSelector'

export function DashboardShell() {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navSections = [
    {
      title: 'Geospatial & Operations',
      items: [
        {
          to: '/dashboard',
          label: t('dashboard.menu_overview'),
          icon: LayoutDashboard,
          tag: 'Ops',
          exact: true,
          iconBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
          activeBg: 'bg-teal-500/25 text-white border-teal-400/60 shadow-glass-teal'
        },
        {
          to: '/dashboard/map',
          label: t('dashboard.menu_map'),
          icon: Map,
          tag: 'GIS',
          iconBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          activeBg: 'bg-emerald-500/25 text-white border-emerald-400/60 shadow-glass-emerald'
        },
        {
          to: '/dashboard/assets',
          label: t('dashboard.menu_assets'),
          icon: Database,
          tag: 'Registry',
          iconBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          activeBg: 'bg-cyan-500/25 text-white border-cyan-400/60 shadow-glass-cyan'
        },
      ]
    },
    {
      title: 'AI & Incident Memory',
      items: [
        {
          to: '/dashboard/semantic-analysis',
          label: t('dashboard.menu_semantic'),
          icon: Sparkles,
          tag: 'E5-NLP',
          iconBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          activeBg: 'bg-purple-500/25 text-white border-purple-400/60 shadow-glass-purple'
        },
        {
          to: '/dashboard/image-intelligence',
          label: t('dashboard.menu_image'),
          icon: Image,
          tag: 'YOLO+DINO',
          iconBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          activeBg: 'bg-blue-500/25 text-white border-blue-400/60 shadow-glass-navy'
        },
        {
          to: '/dashboard/recurring-incidents',
          label: t('dashboard.menu_clusters'),
          icon: RotateCcw,
          tag: 'HDBSCAN',
          iconBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          activeBg: 'bg-amber-500/25 text-white border-amber-400/60 shadow-glass-amber'
        },
        {
          to: '/dashboard/predictive-maintenance',
          label: t('dashboard.menu_predictive'),
          icon: AlertTriangle,
          tag: 'Risk Matrix',
          iconBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          activeBg: 'bg-rose-500/25 text-white border-rose-400/60 shadow-glass-danger'
        },
      ]
    },
    {
      title: 'Works & Governance',
      items: [
        {
          to: '/dashboard/maintenance',
          label: t('dashboard.menu_maintenance'),
          icon: Wrench,
          tag: 'Works',
          iconBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
          activeBg: 'bg-teal-500/25 text-white border-teal-400/60 shadow-glass-teal'
        },
        {
          to: '/dashboard/reports',
          label: t('dashboard.menu_reports'),
          icon: FileText,
          tag: 'Audit',
          iconBg: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
          activeBg: 'bg-slate-500/25 text-white border-slate-400/60 shadow-glass-btn'
        },
      ]
    }
  ]

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col bg-navy-950 text-white transition-all duration-300 border-r border-white/10 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-white/10 bg-navy-900/60">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
            <img
              src="/logo.png"
              alt="Civic Infrastructure Memory"
              className="w-9 h-9 object-contain rounded-xl p-0.5 bg-white/10 border border-white/20 backdrop-blur-md shadow-glass-btn transition-transform group-hover:scale-105 flex-shrink-0"
            />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap truncate">
                  Civic Memory
                </span>
                <span className="text-[10px] text-teal-300/80 font-medium whitespace-nowrap truncate">
                  Decision Intelligence
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 hover:text-white border border-white/20 backdrop-blur-md shadow-glass-btn transition-all"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {sec.title}
                </div>
              )}
              {collapsed && sIdx > 0 && (
                <div className="my-2 border-t border-white/10" />
              )}
              {sec.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `
                    group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border
                    ${isActive
                      ? `${item.activeBg} font-semibold`
                      : 'border-transparent text-white/70 hover:text-white hover:bg-white/5 hover:border-white/10'
                    }
                    ${collapsed ? 'justify-center px-2' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-sm" />
                      )}
                      
                      {/* Distinct Module Icon Box */}
                      <div className={`p-1.5 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-105 ${item.iconBg}`}>
                        <item.icon className="h-4 w-4" />
                      </div>

                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border opacity-80 ${item.iconBg}`}>
                            {item.tag}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 text-xs text-white/60 bg-navy-900/40">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glass-emerald" />
                <span className="font-semibold text-white/80">{t('dashboard.role_badge')}</span>
              </div>
              <Link to="/report" className="text-[10px] text-teal-300 hover:text-teal-200 flex items-center gap-1 font-semibold underline">
                Citizen Portal <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Connected" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-civic-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 backdrop-blur-md shadow-glass-btn transition-all active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-navy-100 text-navy-800 border border-navy-200 uppercase tracking-wider hidden sm:inline">
                BBMP Official
              </span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:inline">
                Bengaluru Municipal Corporation • Infrastructure Memory System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="default" />
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl shadow-glass-btn">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                EE
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-slate-800 text-[11px] leading-tight">Executive Engineer</span>
                <span className="text-[10px] text-slate-400">Road Infrastructure Div</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-navy-950 text-white flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Civic Memory" className="w-8 h-8 rounded-lg" />
                <span className="font-bold text-sm text-white">Civic Memory</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/70 p-1.5 rounded-lg bg-white/10">
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto space-y-4">
              {navSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                    {sec.title}
                  </div>
                  {sec.items.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border
                        ${isActive ? `${item.activeBg} font-semibold` : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      <div className={`p-1 rounded-md border ${item.iconBg}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="text-[9px] px-1 py-0.5 rounded font-mono border opacity-70">
                        {item.tag}
                      </span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
