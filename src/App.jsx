import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store'
import Onboarding from './components/ui/Onboarding'
import VoiceRecordModal from './components/voice/VoiceRecordModal'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Insights from './pages/Insights'
import Ledger from './pages/Ledger'

export default function App() {
  const { isOnboarded } = useAppStore()

  if (!isOnboarded) {
    return <Onboarding />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <VoiceRecordModal />
    </>
  )
}
