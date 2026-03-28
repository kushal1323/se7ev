import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Response interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.detail || 'Something went wrong'
    toast.error(message)
    return Promise.reject(err)
  }
)

// ─── Users ────────────────────────────────────────────────────────────────────
export const userService = {
  onboard: (data) => api.post('/users/onboard', data),
  getProfile: () => api.get('/users/me'),
}

// ─── Transactions ──────────────────────────────────────────────────────────────
export const transactionService = {
  uploadAudio: (formData) =>
    api.post('/transactions/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }),
  getToday: () => api.get('/transactions/today'),
  getByDate: (date) => api.get(`/transactions?date=${date}`),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
}

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryService = {
  getAll: () => api.get('/inventory'),
  update: (itemId, data) => api.patch(`/inventory/${itemId}`, data),
  approveRestock: (itemId) => api.post(`/inventory/${itemId}/restock`),
}

// ─── Insights ─────────────────────────────────────────────────────────────────
export const insightsService = {
  getMonthly: (month, year) => api.get(`/insights?month=${month}&year=${year}`),
  getYearly: (year) => api.get(`/insights?year=${year}`),
  getAudioSummary: (month, year) => api.get(`/insights/audio?month=${month}&year=${year}`, {
    responseType: 'blob',
  }),
}

// ─── Ledger ───────────────────────────────────────────────────────────────────
export const ledgerService = {
  getMonthly: (month, year) => api.get(`/ledger?month=${month}&year=${year}`),
  exportPdf: (month, year) => api.get(`/ledger/export?month=${month}&year=${year}`, {
    responseType: 'blob',
  }),
}

export default api
