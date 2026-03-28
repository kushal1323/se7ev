import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#14b8a6', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
