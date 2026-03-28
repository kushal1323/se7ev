import React, { useEffect, useState } from 'react'
import { BookOpen, Download, ChevronRight, ChevronDown, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import AppLayout from '../components/layout/AppLayout'
import { ledgerService } from '../services/api'
import { mockLedger } from '../services/mockData'
import { cn, formatCurrency, MONTHS, YEARS } from '../utils/helpers'
import toast from 'react-hot-toast'

const PIE_COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a']
const EXP_COLORS = ['#f87171', '#fb923c', '#fbbf24', '#94a3b8']

function SectionTable({ title, icon: Icon, color, rows, columns, total }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', color.bg)}>
          <Icon className={cn('w-4 h-4', color.text)} strokeWidth={1.8} />
        </div>
        <h3 className="font-display font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.key} className={cn(
                  'px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide',
                  col.align === 'right' ? 'text-right' : 'text-left'
                )}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn(
                    'px-4 py-3 text-slate-700',
                    col.align === 'right' ? 'text-right font-medium' : '',
                    col.highlight ? color.text + ' font-semibold' : ''
                  )}>
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-700 text-sm" colSpan={columns.length - 1}>
                Total
              </td>
              <td className={cn('px-4 py-3 text-right font-bold text-sm', color.text)}>
                {formatCurrency(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function MonthlySummaryRow({ summary, isExpanded, onToggle }) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <BookOpen className="w-4 h-4 text-slate-400 mr-3" strokeWidth={2} />
        <span className="w-48 font-medium text-slate-700 text-sm">{summary.month}</span>
        <span className="flex-1" /> {/* spacer pushes values right */}
        <span className="w-28 text-right text-sm font-semibold text-teal-600">
          {formatCurrency(summary.sales)}
        </span>
        <span className="w-28 text-right text-sm text-slate-400">
          {formatCurrency(summary.expenses)}
        </span>
        <span className="w-28 text-right text-sm font-bold text-slate-800">
          {formatCurrency(summary.profit)}
        </span>
        {isExpanded
          ? <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
          : <ChevronRight className="w-4 h-4 text-slate-400 ml-2" />
        }
      </button>
      {isExpanded && (
        <div className="px-5 pb-4 border-t border-slate-100 pt-4 animate-slide-up">
          <p className="text-xs text-slate-400 italic">
            Day-wise drill-down will be loaded from API
          </p>
        </div>
      )}
    </div>
  )
}



export default function Ledger() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [expandedMonth, setExpandedMonth] = useState(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await ledgerService.getMonthly(month, year)
        setData(res)
      } catch {
        setData(mockLedger)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [month, year])

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await ledgerService.exportPdf(month, year)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ledger-${MONTHS[month - 1]}-${year}.pdf`
      a.click()
      toast.success('Ledger exported!')
    } catch {
      toast.success('Export feature coming soon!')
    } finally {
      setExporting(false)
    }
  }

  const { totalSales, totalExpenses, netProfit, salesBreakdown, expenseBreakdown, monthlySummaries } = data || {}

  const salesPieData = salesBreakdown?.map(s => ({ name: s.item, value: s.total })) || []
  const expPieData = expenseBreakdown?.map(e => ({ name: e.category, value: e.amount })) || []

  return (
    <AppLayout title="Ledger" subtitle="Monthly income statements & history">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <select
            className="input-field w-36 py-2 text-sm"
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            className="input-field w-28 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(+e.target.value)}
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      {/* Summary bar */}
      {!loading && (
        <div className="card p-5 mb-6 flex items-center gap-8">
          <div>
            <p className="stat-label mb-1">Total Revenue</p>
            <p className="text-xl font-display font-bold text-teal-600">{formatCurrency(totalSales)}</p>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div>
            <p className="stat-label mb-1">Total Expenses</p>
            <p className="text-xl font-display font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div>
            <p className="stat-label mb-1">Net Profit</p>
            <p className="text-xl font-display font-bold text-slate-900">{formatCurrency(netProfit)}</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {totalSales ? Math.round((netProfit / totalSales) * 100) : 0}% margin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Sales breakdown */}
        <div className="col-span-2 space-y-6">
          {loading ? (
            <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ) : (
            <>
              <SectionTable
                title="Sales Breakdown"
                icon={TrendingUp}
                color={{ bg: 'bg-teal-50', text: 'text-teal-600' }}
                rows={salesBreakdown || []}
                total={totalSales}
                columns={[
                  { key: 'item', label: 'Item' },
                  { key: 'quantity', label: 'Qty', align: 'right' },
                  { key: 'unitPrice', label: 'Rate', align: 'right', format: (v) => `₹${v}` },
                  { key: 'total', label: 'Amount', align: 'right', highlight: true, format: formatCurrency },
                ]}
              />
              <SectionTable
                title="Expense Breakdown"
                icon={TrendingDown}
                color={{ bg: 'bg-red-50', text: 'text-red-500' }}
                rows={expenseBreakdown || []}
                total={totalExpenses}
                columns={[
                  { key: 'category', label: 'Category' },
                  { key: 'amount', label: 'Amount', align: 'right', highlight: true, format: formatCurrency },
                ]}
              />
            </>
          )}
        </div>

        {/* Pie charts */}
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Revenue Split</h4>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salesPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                    {salesPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {salesPieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="flex-1 text-slate-600 truncate">{d.name}</span>
                  <span className="font-medium text-slate-700">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Expense Split</h4>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={2} dataKey="value">
                    {expPieData.map((_, i) => (
                      <Cell key={i} fill={EXP_COLORS[i % EXP_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-1">
              {expPieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: EXP_COLORS[i] }} />
                  <span className="flex-1 text-slate-500">{d.name}</span>
                  <span className="font-medium text-slate-600">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly history */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-slate-800 text-sm mb-4">Monthly History</h3>
        <div className="flex text-xs text-slate-400 font-semibold uppercase tracking-wide px-5 pb-2">
          <span className="w-48">Period</span>
          <span className="flex-1" />  {/* spacer */}
          <span className="w-28 text-right">Sales</span>
          <span className="w-28 text-right">Expenses</span>
          <span className="w-28 text-right">Profit</span>
          <span className="w-8" />
        </div>
        <div className="space-y-2">
          {(monthlySummaries || []).map((s) => (
            <MonthlySummaryRow
              key={s.month}
              summary={s}
              isExpanded={expandedMonth === s.month}
              onToggle={() => setExpandedMonth(expandedMonth === s.month ? null : s.month)}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

