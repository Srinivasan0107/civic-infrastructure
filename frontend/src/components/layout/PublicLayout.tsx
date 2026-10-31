import { Outlet } from 'react-router-dom'
import { PublicHeader } from './PublicHeader'
import { PublicFooter } from './PublicFooter'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50/70 overflow-x-hidden">
      {/* Continuous Scrolling Motion Effect Canvas in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Dynamic scrolling civic tech dot grid */}
        <div className="absolute inset-0 scrolling-motion-grid opacity-80" />
        {/* Subtle diagonal civic infrastructure motion lines */}
        <div className="absolute inset-0 scrolling-linear-lines opacity-60" />

        {/* Ambient floating luminous orbs moving organically in the background */}
        <div className="ambient-glow-float-1 absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-teal-200/30 via-cyan-100/25 to-transparent blur-3xl pointer-events-none" />
        <div className="ambient-glow-float-2 absolute top-1/3 -left-36 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-sky-200/25 via-teal-100/20 to-transparent blur-3xl pointer-events-none" />
        <div className="ambient-glow-float-1 absolute -bottom-40 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-emerald-100/30 via-teal-100/20 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen flex-1">
        <PublicHeader />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </div>
  )
}
