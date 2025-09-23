import React from 'react'
import AppShell from '../components/AppShell'

export default function ExtensionTools() {
  return (
    <AppShell>
      <div className="rounded-card bg-white shadow-card p-6">
        <h2 className="text-xl font-semibold mb-2">Extension Tools (MyDesigns)</h2>
        <p className="text-gray-600 mb-6">Automation panels for Remove BG / Upscale (UI-first).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-4">
            <h3 className="font-medium mb-2">Auto-Clicker: Remove BG</h3>
            <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
              <li>Scope: Selected / Visible / All pages</li>
              <li>Jittered delays, spinner waits</li>
              <li>Skip if already processed</li>
              <li>Start / Stop / Dry-Run</li>
            </ul>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-medium mb-2">Auto-Clicker: Upscale</h3>
            <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
              <li>Runs after BG or standalone</li>
              <li>Waits for state change</li>
              <li>Retries + requeue failures</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
