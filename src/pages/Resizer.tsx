import React from 'react'
import AppShell from '../components/AppShell'

export default function Resizer() {
  return (
    <AppShell>
      <div className="rounded-card bg-white shadow-card p-6">
        <h2 className="text-xl font-semibold mb-2">Resizer</h2>
        <p className="text-gray-600 mb-6">Batch Etsy sizes (2000×2000, 2700×2025, etc.) with ZIP export.</p>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
          Resizer placeholder UI. Plug in your existing resizer module here.
        </div>
      </div>
    </AppShell>
  )
}
