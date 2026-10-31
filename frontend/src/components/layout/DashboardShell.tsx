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
          iconBg: 'bg-teal-500/15 text-teal-700 border-teal-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-teal-950 border border-teal-500/40 shadow-glass-teal ring-1 ring-teal-500/20'
        },
        {
          to: '/dashboard/map',
          label: t('dashboard.menu_map'),
          icon: Map,
          tag: 'GIS',
          iconBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-emerald-950 border border-emerald-500/40 shadow-glass-emerald ring-1 ring-emerald-500/20'
        },
        {
          to: '/dashboard/assets',
          label: t('dashboard.menu_assets'),
          icon: Database,
          tag: 'Registry',
          iconBg: 'bg-cyan-500/15 text-cyan-700 border-cyan-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-cyan-950 border border-cyan-500/40 shadow-glass-cyan ring-1 ring-cyan-500/20'
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
          iconBg: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-purple-950 border border-purple-500/40 shadow-glass-purple ring-1 ring-purple-500/20'
        },
        {
          to: '/dashboard/image-intelligence',
          label: t('dashboard.menu_image'),
          icon: Image,
          tag: 'YOLO+DINO',
          iconBg: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-blue-950 border border-blue-500/40 shadow-glass-navy ring-1 ring-blue-500/20'
        },
        {
          to: '/dashboard/recurring-incidents',
          label: t('dashboard.menu_clusters'),
          icon: RotateCcw,
          tag: 'HDBSCAN',
          iconBg: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-amber-950 border border-amber-500/40 shadow-glass-amber ring-1 ring-amber-500/20'
        },
        {
          to: '/dashboard/predictive-maintenance',
          label: t('dashboard.menu_predictive'),
          icon: AlertTriangle,
          tag: 'Risk Matrix',
          iconBg: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-rose-950 border border-rose-500/40 shadow-glass-danger ring-1 ring-rose-500/20'
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
          iconBg: 'bg-teal-500/15 text-teal-700 border-teal-500/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-teal-950 border border-teal-500/40 shadow-glass-teal ring-1 ring-teal-500/20'
        },
        {
          to: '/dashboard/reports',
          label: t('dashboard.menu_reports'),
          icon: FileText,
          tag: 'Audit',
          iconBg: 'bg-slate-500/15 text-slate-700 border-slate-400/30',
          activeBg: 'bg-white/95 backdrop-blur-md text-slate-950 border border-slate-300 shadow-glass-btn ring-1 ring-slate-400/20'
        },
      ]
    }
  ]

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar Desktop - Frosted Glass Finish */}
      <aside className={`hidden md:flex flex-col bg-white/80 backdrop-blur-xl text-slate-800 transition-all duration-300 border-r border-slate-200/80 shadow-card ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-200/60 bg-white/60 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
            <img
              src="/logo.png"
              alt="Civic Infrastructure Memory"
              className="w-9 h-9 object-contain rounded-xl p-0.5 bg-white/90 border border-white/90 shadow-glass-btn transition-transform group-hover:scale-105 flex-shrink-0 backdrop-blur-md"
            />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm tracking-tight text-slate-900 whitespace-nowrap truncate">
                  Civic Memory
                </span>
                <span className="text-[10px] text-teal-600 font-semibold tracking-wide whitespace-nowrap truncate">
                  Decision Intelligence
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-glass-btn backdrop-blur-md transition-all active:scale-95"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {sec.title}
                </div>
              )}
              {collapsed && sIdx > 0 && (
                <div className="my-2 border-t border-slate-200/60" />
              )}
              {sec.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `
                    group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                    ${isActive
                      ? `${item.activeBg} font-bold`
                      : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:border-white/90 hover:shadow-glass-btn backdrop-blur-xs'
                    }
                    ${collapsed ? 'justify-center px-2' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-r-full shadow-xs" />
                      )}
                      
                      {/* Glass Finish Module Icon Box */}
                      <div className={`p-1.5 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-105 shadow-glass-btn backdrop-blur-sm ${item.iconBg}`}>
                        <item.icon className="h-4 w-4" />
                      </div>

                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-slate-200/80 shadow-2xs bg-white/70 backdrop-blur-xs text-slate-600">
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

        <div className="p-3 border-t border-slate-200/60 text-xs text-slate-600 bg-white/60 backdrop-blur-md">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glass-emerald" />
                <span className="font-semibold text-slate-700">{t('dashboard.role_badge')}</span>
              </div>
              <Link to="/report" className="text-[10px] text-teal-600 hover:text-teal-700 flex items-center gap-1 font-semibold hover:underline">
                Citizen Portal <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar - elevated z-index so dropdowns float cleanly above page hero */}
        <header className="relative z-40 h-16 bg-white/95 backdrop-blur-md border-b border-civic-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
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
          <div className="relative w-72 bg-white/90 backdrop-blur-xl text-slate-800 border-r border-slate-200/80 shadow-2xl flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Civic Memory" className="w-8 h-8 rounded-lg border border-slate-200/80 shadow-glass-btn" />
                <span className="font-bold text-sm text-slate-900">Civic Memory</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-700 p-1.5 rounded-lg bg-white/80 border border-slate-200/80 shadow-glass-btn">
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto space-y-4">
              {navSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sec.title}
                  </div>
                  {sec.items.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                        ${isActive ? `${item.activeBg} font-bold` : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:border-white/90 hover:shadow-glass-btn'}
                      `}
                    >
                      <div className={`p-1 rounded-md border shadow-glass-btn ${item.iconBg}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider border border-slate-200/80 shadow-2xs bg-white/70 text-slate-600">
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
