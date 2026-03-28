import React, { useEffect, useState, useRef } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, Award, Calendar, Play, Pause,
  Volume2, ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { StatCard } from '../components/ui/StatCard'
import { useAppStore } from '../store'
import { insightsService } from '../services/api'
import { mockInsightsMonthly } from '../services/mockData'
import { cn, formatCurrency, MONTHS, YEARS, monthName } from '../utils/helpers'

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-600 mb-2">Day {label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

function AudioPlayer({ isPlaying, onToggle, language }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl text-white">
      <button
        onClick={onToggle}
        className="w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 transition-colors
                   flex items-center justify-center active:scale-95 flex-shrink-0"
      >
        {isPlaying
          ? <Pause className="w-5 h-5" />
          : <Play className="w-5 h-5 ml-0.5" />
        }
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Volume2 className="w-3.5 h-3.5 text-teal-100" />
          <p className="text-sm font-semibold">Monthly Summary</p>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{language}</span>
        </div>
        {/* Waveform */}
        <div className="flex items-center gap-0.5 h-6">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={cn('rounded-full flex-shrink-0 transition-all', isPlaying ? 'wave-bar bg-white/70' : 'bg-white/30')}
              style={{
                width: '2px',
                height: isPlaying ? undefined : `${20 + Math.sin(i * 0.5) * 15}%`,
                animationDelay: `${i * 0.04}s`,
                animationDuration: isPlaying ? `${0.5 + (i % 5) * 0.15}s` : undefined,
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-teal-100 text-xs">AI Generated</p>
    </div>
  )
}

export default function Insights() {
  const { insightsFilter, setInsightsFilter, user } = useAppStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [chartType, setChartType] = useState('area') // 'area' | 'bar'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = insightsFilter.view === 'monthly'
          ? await insightsService.getMonthly(insightsFilter.month, insightsFilter.year)
          : await insightsService.getYearly(insightsFilter.year)
        setData(res)
      } catch {
        setData(mockInsightsMonthly)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [insightsFilter.month, insightsFilter.year, insightsFilter.view])

  const toggleAudio = async () => {
    if (!audioPlaying) {
      try {
        const blob = await insightsService.getAudioSummary(insightsFilter.month, insightsFilter.year)
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.play()
        audio.onended = () => setAudioPlaying(false)
      } catch {
        // Demo: just toggle
      }
    }
    setAudioPlaying((p) => !p)
  }

  const { totalSales, totalExpenses, totalProfit, dailyAverage, bestDay, topItems, chartData, forecast } = data || {}

  return (
    <AppLayout title="Insights" subtitle="Business performance and forecasts">
      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {['monthly', 'yearly'].map((v) => (
              <button
                key={v}
                onClick={() => setInsightsFilter({ view: v })}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                  insightsFilter.view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Month selector */}
          {insightsFilter.view === 'monthly' && (
            <select
              className="input-field w-36 py-2 text-sm"
              value={insightsFilter.month}
              onChange={(e) => setInsightsFilter({ month: +e.target.value })}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          )}

          {/* Year selector */}
          <select
            className="input-field w-28 py-2 text-sm"
            value={insightsFilter.year}
            onChange={(e) => setInsightsFilter({ year: +e.target.value })}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Chart type */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {[{ key: 'area', label: 'Area' }, { key: 'bar', label: 'Bar' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setChartType(key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                chartType === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Sales" value={totalSales} icon={TrendingUp} color="teal" />
        <StatCard label="Total Expenses" value={totalExpenses} icon={TrendingDown} color="red" />
        <StatCard label="Net Profit" value={totalProfit} icon={TrendingUp} color="amber" />
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-slate-500" strokeWidth={1.8} />
            </div>
          </div>
          <p className="stat-label mb-1">Best Day</p>
          <p className="text-lg font-display font-semibold text-slate-900">{bestDay?.label || '—'}</p>
          <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(bestDay?.profit)} profit</p>
        </div>
      </div>

      {/* Main Chart + Audio */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm">
              {insightsFilter.view === 'monthly'
                ? `${MONTHS[insightsFilter.month - 1]} ${insightsFilter.year}`
                : `Year ${insightsFilter.year}`} Overview
            </h3>
            <div className="flex items-center gap-3 text-xs">
              {[
                { color: '#14b8a6', label: 'Sales' },
                { color: '#f87171', label: 'Expenses' },
                { color: '#fbbf24', label: 'Profit' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      {[['sales', '#14b8a6'], ['expenses', '#f87171'], ['profit', '#fbbf24']].map(([key, color]) => (
                        <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sales" name="Sales" stroke="#14b8a6" strokeWidth={2} fill="url(#grad-sales)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} fill="url(#grad-expenses)" />
                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#fbbf24" strokeWidth={2} fill="url(#grad-profit)" />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sales" name="Sales" fill="#14b8a6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#fbbf24" radius={[3, 3, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right column: Audio + Forecast */}
        <div className="space-y-4">
          <AudioPlayer
            isPlaying={audioPlaying}
            onToggle={toggleAudio}
            language={user?.language || 'Hindi'}
          />

          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              {forecast?.nextWeekTrend === 'up'
                ? <ArrowUpRight className="w-4 h-4 text-teal-500" />
                : <ArrowDownRight className="w-4 h-4 text-red-500" />
              }
              <h4 className="text-sm font-semibold text-slate-800">Forecast</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {forecast?.message || 'Analyzing trends...'}
            </p>
          </div>

          <div className="card p-4">
            <p className="stat-label mb-2">Daily Average</p>
            <p className="text-xl font-display font-semibold text-teal-600">{formatCurrency(dailyAverage)}</p>
            <p className="text-xs text-slate-400 mt-0.5">per trading day</p>
          </div>
        </div>
      </div>

      {/* Top 5 items */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Top 5 Selling Items</h3>
        <div className="space-y-3">
          {topItems?.map((item, i) => {
            const maxRev = topItems[0].revenue
            const pct = (item.revenue / maxRev) * 100
            return (
              <div key={item.name} className="flex items-center gap-4">
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-slate-100 text-slate-500' :
                  'bg-slate-50 text-slate-400'
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-semibold text-teal-600">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.quantity} units sold</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
