import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  BookOpen,
  Mic,
  Zap,
  LogOut,
} from 'lucide-react'
import { useAppStore } from '../../store'
import { cn } from '../../utils/helpers'


const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/insights', icon: TrendingUp, label: 'Insights' },
  { to: '/ledger', icon: BookOpen, label: 'Ledger' },
]

export default function Sidebar() {
  const { user, openRecording } = useAppStore()
  const location = useLocation()

  const handleLogout = () => {
    useAppStore.getState().setUser(null)
    localStorage.removeItem('voicetrace-storage')
    window.location.reload()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-slate-900 text-lg tracking-tight">
            VoiceTrace
          </span>
          <button onClick={handleLogout} className="btn-ghost p-2 ml-auto" title="Logout">
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Record Entry CTA */}
      <div className="px-4 mb-6">
        <button
          onClick={openRecording}
          className="w-full flex items-center gap-3 bg-gradient-to-r from-teal-600 to-teal-500
                     text-white px-4 py-3 rounded-xl font-medium text-sm
                     hover:from-teal-700 hover:to-teal-600 transition-all duration-150
                     active:scale-[0.98] shadow-sm shadow-teal-200"
        >
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Mic className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <span>Record Entry</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn('w-4 h-4', isActive ? 'text-teal-600' : 'text-slate-400')}
                      strokeWidth={2}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500
                            flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.businessType}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
