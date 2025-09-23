import React from 'react'
import AppShell from '../components/AppShell'
import ToolCard from '../components/ToolCard'
import { Images, Crop, FileText, Puzzle } from 'lucide-react'

export default function Home() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create faster. Export cleaner. Sell more.</h1>
        <p className="text-gray-600">Mockups, PDFs, batch resizing, and MyDesigns automations — all in one place.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToolCard
          icon={<Images className="h-8 w-8 text-brand.ink" />}
          title="Grid Mockup Generator"
          description="Arrange Etsy-style previews with captions & clean exports."
          to="/mockup"
        />
        <ToolCard
          icon={<Crop className="h-8 w-8 text-brand.ink" />}
          title="Resizer"
          description="Batch Etsy sizes in seconds (2000×2000, 2700×2025, etc.)."
          to="/resizer"
        />
        <ToolCard
          icon={<FileText className="h-8 w-8 text-brand.ink" />}
          title="Branded PDF Generator"
          description="Branded downloads with logo, button & disclaimers."
          to="/pdf"
          badge="Beta"
        />
        <ToolCard
          icon={<Puzzle className="h-8 w-8 text-brand.ink" />}
          title="Extension Tools (MyDesigns)"
          description="Auto-click Remove BG & Upscale in MyDesigns."
          to="/extension"
        />
      </div>
    </AppShell>
  )
}
