import React, { useEffect, useState } from 'react'
import { Package, AlertTriangle, Clock, ShoppingCart, Check, ChevronDown } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAppStore } from '../store'
import { inventoryService } from '../services/api'
import { mockInventory, mockRestockSuggestions } from '../services/mockData'
import { cn, getStockStatus } from '../utils/helpers'
import toast from 'react-hot-toast'

function StockBar({ item }) {
  const pct = Math.min(100, (item.stock / (item.minStock * 2)) * 100)
  const color = item.status === 'critical' ? 'bg-red-400' : item.status === 'low' ? 'bg-amber-400' : 'bg-teal-400'
  return (
    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  )
}

function InventoryRow({ item, onApprove }) {
  const { label, color } = getStockStatus(item)
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            item.status === 'critical' ? 'bg-red-50' :
            item.status === 'low' ? 'bg-amber-50' : 'bg-teal-50'
          )}>
            <Package className={cn(
              'w-4 h-4',
              item.status === 'critical' ? 'text-red-500' :
              item.status === 'low' ? 'text-amber-500' : 'text-teal-500'
            )} strokeWidth={1.8} />
          </div>
          <span className="text-sm font-medium text-slate-800">{item.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <StockBar item={item} />
          <span className="text-sm text-slate-700 font-medium">
            {item.stock} <span className="text-slate-400 font-normal">{item.unit}</span>
          </span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={cn('badge', color)}>{label}</span>
      </td>
      <td className="px-5 py-3.5">
        {item.expiryDays !== null ? (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            item.expiryDays <= 1 ? 'text-red-500' : item.expiryDays <= 3 ? 'text-amber-600' : 'text-slate-400'
          )}>
            <Clock className="w-3.5 h-3.5" />
            {item.expiryDays <= 1 ? 'Expires today!' : `${item.expiryDays} days`}
          </div>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-right">
        <span className="text-xs text-slate-400">{item.minStock} {item.unit}</span>
      </td>
    </tr>
  )
}

function RestockCard({ suggestion, onApprove, approved }) {
  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl border transition-all',
      approved ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-200 hover:border-teal-200'
    )}>
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
        <ShoppingCart className="w-4 h-4 text-amber-500" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{suggestion.name}</p>
        <p className="text-xs text-slate-400">{suggestion.reason}</p>
      </div>
      <div className="text-right mr-3">
        <p className="text-xs font-semibold text-slate-700">{suggestion.suggestedQty}</p>
        <p className="text-xs text-slate-400">suggested</p>
      </div>
      <button
        onClick={() => onApprove(suggestion.itemId)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
          approved
            ? 'bg-teal-100 text-teal-700'
            : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
        )}
      >
        {approved ? <><Check className="w-3 h-3" /> Approved</> : 'Approve'}
      </button>
    </div>
  )
}

export default function Inventory() {
  const { inventory, setInventory } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [suggestions] = useState(mockRestockSuggestions)
  const [approved, setApproved] = useState(new Set())
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await inventoryService.getAll()
        setInventory(data)
      } catch {
        setInventory(mockInventory)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleApprove = (itemId) => {
    setApproved((prev) => new Set([...prev, itemId]))
    toast.success('Restock order approved!')
  }

  const filtered = inventory.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'alerts') return item.status !== 'ok'
    if (filter === 'expiring') return item.expiryDays !== null && item.expiryDays <= 3
    return true
  })

  const alertCount = inventory.filter(i => i.status !== 'ok').length
  const expiringCount = inventory.filter(i => i.expiryDays !== null && i.expiryDays <= 3).length

  return (
    <AppLayout title="Inventory" subtitle="Stock levels and restock suggestions">
      <div className="grid grid-cols-3 gap-6">
        {/* Main table — 2/3 width */}
        <div className="col-span-2 space-y-4">
          {/* Alert banner */}
          {alertCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 animate-slide-up">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 font-medium">
                {alertCount} item{alertCount > 1 ? 's are' : ' is'} running low.{' '}
                {expiringCount > 0 && `${expiringCount} expiring soon.`}
              </p>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {[
              { key: 'all', label: `All (${inventory.length})` },
              { key: 'alerts', label: `Alerts (${alertCount})` },
              { key: 'expiring', label: `Expiring (${expiringCount})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                  filter === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Item</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Stock</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Expiry</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">Min Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-5 py-4">
                          <div className="h-6 bg-slate-100 rounded-lg animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : filtered.map((item) => (
                      <InventoryRow key={item.id} item={item} />
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restock suggestions — 1/3 width */}
        <div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-teal-500" strokeWidth={2} />
              <h3 className="font-display font-semibold text-slate-800 text-sm">Restock Suggestions</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Based on your sales trends</p>
            <div className="space-y-2.5">
              {suggestions.map((s) => (
                <RestockCard
                  key={s.itemId}
                  suggestion={s}
                  onApprove={handleApprove}
                  approved={approved.has(s.itemId)}
                />
              ))}
            </div>
          </div>

          {/* Next-day order summary */}
          <div className="card p-5 mt-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm mb-3">Tomorrow's Prep</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-500 text-xs leading-relaxed">
                Based on today's demand, here's what to prepare for tomorrow:
              </p>
              {[
                { item: 'Puris', qty: '8–10 batches', note: 'High demand day' },
                { item: 'Mint chutney', qty: '600g', note: 'Running low' },
                { item: 'Lemons', qty: '25 pieces', note: 'Fresh stock' },
              ].map((r) => (
                <div key={r.item} className="flex justify-between items-start py-1.5 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-slate-700 text-xs">{r.item}</p>
                    <p className="text-slate-400 text-xs">{r.note}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{r.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
