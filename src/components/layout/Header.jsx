import React from 'react'
import { Bell, Search } from 'lucide-react'
import { todayLabel } from '../../utils/helpers'

export default function Header({ title, subtitle }) {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div>
        {title && (
          <h1 className="font-display font-semibold text-slate-900 text-base leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search entries..."
            className="pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400
                       w-48 placeholder-slate-400 transition-all focus:w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200
                           flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
        </button>
      </div>
    </header>
  )
}
