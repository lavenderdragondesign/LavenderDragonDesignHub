import React from 'react'
import AppShell from '../components/AppShell'

export default function PdfBeta() {
  return (
    <AppShell>
      <div className="rounded-card bg-white shadow-card p-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 text-yellow-800 text-sm border border-yellow-200">
          ⚠️ Branded PDF is in Beta. Export may be unstable. Report issues on GitHub.
        </div>
        <h2 className="text-xl font-semibold mb-2">Branded PDF Generator (Beta)</h2>
        <p className="text-gray-600 mb-6">Create branded customer PDFs with logo, descriptions, and a download button.</p>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
          PDF builder placeholder UI. Your PDF generator panel lives here.
        </div>
      </div>
    </AppShell>
  )
}
