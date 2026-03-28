import React from 'react'
import { cn, formatCurrency } from '../../utils/helpers'

export function StatCard({ label, value, change, changeLabel, icon: Icon, color = 'teal', isCurrency = true }) {
  const colorMap = {
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', icon: 'text-slate-400' },
  }
  const c = colorMap[color]

  const displayValue = isCurrency ? formatCurrency(value) : value?.toLocaleString('en-IN')
  const changeIsPositive = change > 0

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.bg)}>
          {Icon && <Icon className={cn('w-5 h-5', c.icon)} strokeWidth={1.8} />}
        </div>
        {change !== undefined && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            changeIsPositive ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'
          )}>
            {changeIsPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="stat-label mb-1">{label}</p>
      <p className={cn('text-2xl font-display font-semibold', c.text)}>{displayValue}</p>
      {changeLabel && (
        <p className="text-xs text-slate-400 mt-1">{changeLabel}</p>
      )}
    </div>
  )
}

export function MiniStat({ label, value, isCurrency = true }) {
  const displayValue = isCurrency ? formatCurrency(value) : value
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{displayValue}</span>
    </div>
  )
}
