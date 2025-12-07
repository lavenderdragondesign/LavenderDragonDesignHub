import React from 'react'
import AppShell from '../components/AppShell'

export default function WinTweaker() {
  return (
    <AppShell>
      <div className="rounded-card bg-white shadow-card p-6">
        <h2 className="text-xl font-semibold mb-2">LDD WinTweaker</h2>
        <p className="text-gray-600 mb-4">
          Windows debloat & performance tweak presets are coming soon to LDDTools.lol.
        </p>
        <p className="text-sm text-gray-500">
          This will be your control panel for aggressive-but-optional tweaks, exportable scripts, and safe defaults.
        </p>
      </div>
    </AppShell>
  )
}
