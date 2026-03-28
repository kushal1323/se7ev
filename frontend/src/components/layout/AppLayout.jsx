import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({ children, title, subtitle }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
