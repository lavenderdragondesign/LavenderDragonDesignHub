import React from 'react'
import AppShell from '../components/AppShell'
import ToolCard from '../components/ToolCard'
import { TOOLS } from '../toolsConfig'

export default function Home() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create faster. Export cleaner. Sell more.</h1>
        <p className="text-gray-600">
          Mockups, PDFs, batch resizing, Windows tweaks, and MyDesigns automations — all in one place.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          const badge =
            tool.status === 'beta'
              ? 'Beta'
              : tool.status === 'lab'
              ? 'Lab'
              : undefined

          return (
            <ToolCard
              key={tool.id}
              icon={<Icon className="h-8 w-8 text-brand.ink" />}
              title={tool.name}
              description={tool.description}
              to={tool.path}
              badge={badge}
            />
          )
        })}
      </div>
    </AppShell>
  )
}
