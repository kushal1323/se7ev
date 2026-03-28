import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn, formatCurrency } from '../../utils/helpers'

export function EntryItem({ entry }) {
  const isSale = entry.type === 'sale'
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0 group">
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        isSale ? 'bg-teal-50' : 'bg-red-50'
      )}>
        {isSale
          ? <ArrowUpRight className="w-4 h-4 text-teal-600" strokeWidth={2} />
          : <ArrowDownRight className="w-4 h-4 text-red-500" strokeWidth={2} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 font-medium truncate">{entry.description}</p>
        <p className="text-xs text-slate-400">{entry.time}</p>
      </div>
      <span className={cn(
        'text-sm font-semibold flex-shrink-0',
        isSale ? 'text-teal-600' : 'text-red-500'
      )}>
        {isSale ? '+' : '-'}{formatCurrency(entry.amount)}
      </span>
    </div>
  )
}

export function EntryList({ entries, title = 'Recent Entries' }) {
  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">{title}</h3>
      {entries?.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">No entries yet today</p>
      )}
      <div>
        {entries?.map((entry) => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
