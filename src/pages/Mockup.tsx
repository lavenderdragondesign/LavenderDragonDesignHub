import React from 'react'
import AppShell from '../components/AppShell'

export default function Mockup() {
  return (
    <AppShell>
      <div className="rounded-card bg-white shadow-card p-6">
        <h2 className="text-xl font-semibold mb-2">Grid Mockup Generator</h2>
        <p className="text-gray-600 mb-6">Arrange product previews with captions, backgrounds, and bundle exports.</p>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
          Drop your images here (placeholder UI). Your existing mockup logic can drop in here.
        </div>
      </div>
    </AppShell>
  )
}
