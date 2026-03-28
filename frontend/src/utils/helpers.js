import clsx from 'clsx'
import dayjs from 'dayjs'

export { clsx }

export const cn = (...args) => clsx(args)

export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) return `${currency}0`
  if (amount >= 100000) return `${currency}${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`
  return `${currency}${amount.toLocaleString('en-IN')}`
}

export const formatDate = (date) => dayjs(date).format('D MMM YYYY')
export const formatTime = (time) => time
export const todayLabel = () => dayjs().format('dddd, D MMMM YYYY')
export const monthName = (month) => dayjs().month(month - 1).format('MMMM')

export const getStockStatus = (item) => {
  if (item.status === 'critical') return { label: 'Critical', color: 'badge-red' }
  if (item.status === 'low') return { label: 'Low Stock', color: 'badge-amber' }
  return { label: 'In Stock', color: 'badge-green' }
}

export const getProfitColor = (value) => {
  if (value > 0) return 'text-teal-600'
  if (value < 0) return 'text-red-500'
  return 'text-slate-600'
}

export const getChangeIndicator = (change) => {
  if (change > 0) return { icon: '↑', color: 'text-teal-600', bg: 'bg-teal-50' }
  if (change < 0) return { icon: '↓', color: 'text-red-500', bg: 'bg-red-50' }
  return { icon: '–', color: 'text-slate-400', bg: 'bg-slate-50' }
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const currentYear = () => new Date().getFullYear()
export const YEARS = Array.from({ length: 5 }, (_, i) => currentYear() - i)
