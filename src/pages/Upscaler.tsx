import React from 'react'
import AppShell from '../components/AppShell'

export default function Upscaler() {
  return (
    <AppShell>
      <div className="rounded-card bg-white shadow-card p-6">
        <h2 className="text-xl font-semibold mb-2">LDD Upscaler</h2>
        <p className="text-gray-600 mb-4">
          A dedicated interface for your AI upscaling workflows will live here soon.
        </p>
        <p className="text-sm text-gray-500">
          Hook this into your existing LDD Upscaler UI and ONNX / TFJS models when you are ready.
        </p>
      </div>
    </AppShell>
  )
}
