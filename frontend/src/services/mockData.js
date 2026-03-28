import dayjs from 'dayjs'

export const mockUser = {
  id: 1,
  name: 'Ravi Kumar',
  language: 'Hindi',
  businessType: 'Chaat & Snacks Vendor',
  createdAt: '2024-01-15',
}

export const mockTodaySummary = {
  sales: 3840,
  expenses: 1250,
  profit: 2590,
  date: dayjs().format('YYYY-MM-DD'),
  recentEntries: [
    { id: 1, type: 'sale', description: '12 plates Pani Puri sold', amount: 360, time: '14:32' },
    { id: 2, type: 'expense', description: 'Tamarind chutney purchased', amount: 120, time: '13:15' },
    { id: 3, type: 'sale', description: '8 plates Bhel Puri sold', amount: 240, time: '12:48' },
    { id: 4, type: 'expense', description: 'Sev and papdi restocked', amount: 280, time: '11:30' },
    { id: 5, type: 'sale', description: '20 glasses Nimbu Pani sold', amount: 400, time: '10:15' },
  ],
  topItems: [
    { name: 'Pani Puri', quantity: 45, revenue: 1350 },
    { name: 'Bhel Puri', quantity: 32, revenue: 960 },
    { name: 'Nimbu Pani', quantity: 60, revenue: 1200 },
    { name: 'Dahi Puri', quantity: 11, revenue: 330 },
  ],
}

export const mockInventory = [
  { id: 1, name: 'Puris (batch)', stock: 3, unit: 'packs', minStock: 5, expiryDays: 2, status: 'low' },
  { id: 2, name: 'Tamarind', stock: 800, unit: 'grams', minStock: 500, expiryDays: null, status: 'ok' },
  { id: 3, name: 'Mint Leaves', stock: 100, unit: 'grams', minStock: 200, expiryDays: 1, status: 'critical' },
  { id: 4, name: 'Sev', stock: 1200, unit: 'grams', minStock: 500, expiryDays: null, status: 'ok' },
  { id: 5, name: 'Boondi', stock: 400, unit: 'grams', minStock: 400, expiryDays: null, status: 'ok' },
  { id: 6, name: 'Potatoes', stock: 2, unit: 'kg', minStock: 3, expiryDays: 4, status: 'low' },
  { id: 7, name: 'Lemon', stock: 8, unit: 'pieces', minStock: 20, expiryDays: 5, status: 'low' },
  { id: 8, name: 'Papdi', stock: 600, unit: 'grams', minStock: 300, expiryDays: null, status: 'ok' },
]

export const mockRestockSuggestions = [
  { itemId: 1, name: 'Puris (batch)', suggestedQty: '10 packs', reason: 'High demand yesterday' },
  { itemId: 3, name: 'Mint Leaves', suggestedQty: '500 grams', reason: 'Expiring tomorrow' },
  { itemId: 6, name: 'Potatoes', suggestedQty: '5 kg', reason: 'Below minimum stock' },
  { itemId: 7, name: 'Lemon', suggestedQty: '30 pieces', reason: 'Low stock alert' },
]

export const mockInsightsMonthly = {
  totalSales: 98420,
  totalExpenses: 34560,
  totalProfit: 63860,
  dailyAverage: 3174,
  bestDay: { date: '2024-03-15', profit: 4820, label: 'Friday 15th' },
  topItems: [
    { name: 'Pani Puri', revenue: 28400, quantity: 946 },
    { name: 'Nimbu Pani', revenue: 22000, quantity: 1100 },
    { name: 'Bhel Puri', revenue: 18600, quantity: 620 },
    { name: 'Dahi Puri', revenue: 14200, quantity: 473 },
    { name: 'Aloo Tikki', revenue: 8200, quantity: 205 },
  ],
  chartData: Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    sales: Math.floor(2800 + Math.random() * 2400),
    expenses: Math.floor(900 + Math.random() * 700),
    profit: Math.floor(1600 + Math.random() * 1800),
  })),
  forecast: {
    nextWeekTrend: 'up',
    message: 'Expect 12% higher sales next week due to upcoming festival',
  },
}

export const mockLedger = {
  month: 3,
  year: 2024,
  totalSales: 98420,
  totalExpenses: 34560,
  netProfit: 63860,
  salesBreakdown: [
    { item: 'Pani Puri', quantity: 946, unitPrice: 30, total: 28380 },
    { item: 'Nimbu Pani', quantity: 1100, unitPrice: 20, total: 22000 },
    { item: 'Bhel Puri', quantity: 620, unitPrice: 30, total: 18600 },
    { item: 'Dahi Puri', quantity: 473, unitPrice: 30, total: 14190 },
    { item: 'Aloo Tikki', quantity: 205, unitPrice: 40, total: 8200 },
  ],
  expenseBreakdown: [
    { category: 'Raw Materials', amount: 28400 },
    { category: 'Transportation', amount: 3200 },
    { category: 'Packaging', amount: 1960 },
    { category: 'Other', amount: 1000 },
  ],
  monthlySummaries: [
    { month: 'Jan 2024', sales: 82000, expenses: 29000, profit: 53000 },
    { month: 'Feb 2024', sales: 88000, expenses: 31000, profit: 57000 },
    { month: 'Mar 2024', sales: 98420, expenses: 34560, profit: 63860 },
  ],
}

export const LANGUAGES = [
  'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali',
  'Gujarati', 'Punjabi', 'Malayalam', 'Odia', 'English', 'Urdu',
]

export const BUSINESS_TYPES = [
  'Street Food Vendor', 'Chaat & Snacks', 'Fruit & Vegetable Seller',
  'Tea & Coffee Stall', 'Juice Corner', 'Saree & Clothing',
  'Mobile Accessories', 'Stationery', 'Flowers', 'Other',
]
