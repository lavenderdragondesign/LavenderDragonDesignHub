import React from 'react'
import {
  Images,
  Crop,
  FileText,
  Puzzle,
  Wrench,
  Cpu
} from 'lucide-react'

export type ToolStatus = 'stable' | 'beta' | 'lab'

export interface ToolConfig {
  id: string
  slug: string
  path: string
  name: string
  shortName?: string
  description: string
  status?: ToolStatus
  category: 'Images' | 'POD' | 'System' | 'MyDesigns' | 'Other'
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const TOOLS: ToolConfig[] = [
  {
    id: 'grid-mockup',
    slug: 'mockup',
    path: '/mockup',
    name: 'Grid Mockup Generator',
    shortName: 'Mockup',
    description: 'Bundle PNGs into Etsy-ready grid mockups.',
    status: 'stable',
    category: 'Images',
    icon: Images
  },
  {
    id: 'bulk-resizer',
    slug: 'resizer',
    path: '/resizer',
    name: 'Bulk Resizer',
    shortName: 'Resizer',
    description: 'Batch POD + Etsy sizes with ZIP export.',
    status: 'beta',
    category: 'Images',
    icon: Crop
  },
  {
    id: 'pdf-maker',
    slug: 'pdf',
    path: '/pdf',
    name: 'Branded PDF Maker',
    shortName: 'PDF',
    description: 'Branded downloads with logo, button & disclaimers.',
    status: 'beta',
    category: 'POD',
    icon: FileText
  },
  {
    id: 'extension-tools',
    slug: 'extension',
    path: '/extension',
    name: 'Extension Tools (MyDesigns)',
    shortName: 'Extension',
    description: 'Auto-click Remove BG & Upscale in MyDesigns.',
    status: 'stable',
    category: 'MyDesigns',
    icon: Puzzle
  },
  {
    id: 'wintweaker',
    slug: 'wintweaker',
    path: '/wintweaker',
    name: 'LDD WinTweaker',
    shortName: 'WinTweaker',
    description: 'Windows debloat & performance tweak presets.',
    status: 'lab',
    category: 'System',
    icon: Wrench
  },
  {
    id: 'upscaler',
    slug: 'upscaler',
    path: '/upscaler',
    name: 'LDD Upscaler',
    shortName: 'Upscaler',
    description: 'Anime + art upscaling with multiple models.',
    status: 'lab',
    category: 'Images',
    icon: Cpu
  }
]
