import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Mic } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { StatCard } from '../components/ui/StatCard'
import { EntryList } from '../components/ui/EntryList'
import { useAppStore } from '../store'
import { dashboardService } from '../services/api'
import { mockTodaySummary } from '../services/mockData'
import { todayLabel, formatCurrency, cn } from '../utils/helpers'

export default function Dashboard() {
  const { todaySummary, setTodaySummary, openRecording, user } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardService.getSummary()
        setTodaySummary(data)
      } catch {
        setTodaySummary(mockTodaySummary)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const { sales, expenses, profit, recentEntries, topItems } = todaySummary

  return (
    <AppLayout title="Dashboard" subtitle={todayLabel()}>
      {/* Welcome Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 70%)' }} />
        <p className="text-teal-100 text-sm font-medium mb-1">Good morning, {user?.name?.split(' ')[0] || 'there'} 👋</p>
        <h2 className="font-display font-bold text-2xl mb-4">Today's Business</h2>
        <button
          onClick={openRecording}
          className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold text-sm
                     px-4 py-2.5 rounded-xl hover:bg-teal-50 transition-colors active:scale-[0.98] shadow-sm"
        >
          <Mic className="w-4 h-4" strokeWidth={2} />
          Record New Entry
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Today's Sales"
          value={loading ? 0 : sales}
          icon={TrendingUp}
          color="teal"
          change={8}
          changeLabel="vs yesterday"
        />
        <StatCard
          label="Today's Expenses"
          value={loading ? 0 : expenses}
          icon={TrendingDown}
          color="red"
          change={-3}
          changeLabel="vs yesterday"
        />
        <StatCard
          label="Today's Profit"
          value={loading ? 0 : profit}
          icon={DollarSign}
          color="amber"
          change={12}
          changeLabel="vs yesterday"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* Recent Entries */}
        <div className="col-span-3">
          <EntryList entries={loading ? [] : recentEntries} />
        </div>

        {/* Top Items */}
        <div className="col-span-2">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-4 h-4 text-slate-400" strokeWidth={2} />
              <h3 className="font-display font-semibold text-slate-800 text-sm">Top Items Today</h3>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {topItems?.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-slate-100 text-slate-600' :
                      'bg-orange-50 text-orange-600'
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.quantity} sold</p>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
