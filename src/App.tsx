import React from 'react';
import { Navbar } from './components/Navbar';

type Tool = {
  id: string;
  name: string;
  badge?: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status?: 'Ready' | 'Coming Soon';
  actionLabel?: string;
};

const tools: Tool[] = [
  {
    id: 'upscaler',
    name: 'LDD Upscaler',
    badge: 'Popular',
    description: 'Upscale AI art, photos, and print files while keeping crisp detail for Etsy and POD.',
    level: 'Intermediate',
    status: 'Ready',
    actionLabel: 'Open Upscaler'
  },
  {
    id: 'grid-mockup',
    name: 'Grid Mockup Generator',
    badge: 'New',
    description: 'Build clean product grids and bundle previews in minutes with drag-and-drop images.',
    level: 'Beginner',
    status: 'Ready',
    actionLabel: 'Open Grid Generator'
  },
  {
    id: 'pdf-maker',
    name: 'Branded PDF Maker',
    description: 'Create simple branded PDFs with your logo, text, and download buttons for customers.',
    level: 'Beginner',
    status: 'Ready',
    actionLabel: 'Open PDF Maker'
  },
  {
    id: 'resizer',
    name: 'Bulk Image Resizer',
    description: 'Export multiple sizes at once for shirts, mugs, stickers, and KDP in one pass.',
    level: 'Intermediate',
    status: 'Ready',
    actionLabel: 'Open Resizer'
  },
  {
    id: 'image-describer',
    name: 'Image Describer & SEO',
    description: 'Turn product images into Etsy-ready descriptions and SEO keywords automatically.',
    level: 'Beginner',
    status: 'Coming Soon',
    actionLabel: 'Preview Tool'
  },
  {
    id: 'instructions',
    name: 'Custom Instructions Manager',
    description: 'Save, reuse, and paste your favorite AI prompts without retyping them 1000 times.',
    level: 'Beginner',
    status: 'Coming Soon',
    actionLabel: 'Preview Tool'
  },
  {
    id: 'bundle-grid',
    name: 'Bundle Grid Builder',
    description: 'Lay out large design bundles into neat preview collages for marketplaces.',
    level: 'Intermediate',
    status: 'Coming Soon',
    actionLabel: 'Preview Tool'
  },
  {
    id: 'wintweaker',
    name: 'LDD WinTweaker',
    badge: 'Utility',
    description: 'Download the Windows tweaking helper to squeeze extra performance from your PC.',
    level: 'Advanced',
    status: 'Ready',
    actionLabel: 'Download / Docs'
  }
];

function ToolCard({ tool }: { tool: Tool }) {
  const isComingSoon = tool.status === 'Coming Soon';

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-50">
            {tool.name}
          </h3>
          <p className="text-xs text-slate-400">{tool.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {tool.badge && (
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-300">
              {tool.badge}
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              tool.level === 'Beginner'
                ? 'bg-emerald-500/10 text-emerald-300'
                : tool.level === 'Intermediate'
                ? 'bg-sky-500/10 text-sky-300'
                : 'bg-orange-500/10 text-orange-300'
            }`}
          >
            {tool.level}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            isComingSoon
              ? 'cursor-not-allowed bg-slate-800 text-slate-500'
              : 'bg-purple-500 text-slate-50 hover:bg-purple-400'
          }`}
          disabled={isComingSoon}
        >
          {tool.actionLabel ?? 'Open'}
        </button>
        <span className="text-[11px] text-slate-500">
          {tool.status === 'Coming Soon' ? 'Coming soon' : 'Ready'}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Lavender Dragon Design Tools Hub
            </h1>
            <p className="max-w-xl text-sm text-slate-400">
              Quickly jump into your favorite LavenderDragonDesign tools from one simple dashboard.
              No hunting for links, no clutter — just click a card and get to work.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="rounded-full border border-slate-700 px-2 py-0.5">
                Best for Etsy & POD workflows
              </span>
              <span className="rounded-full border border-slate-700 px-2 py-0.5">
                Runs in the browser
              </span>
              <span className="rounded-full border border-slate-700 px-2 py-0.5">
                LDD ecosystem
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-col items-start gap-2 rounded-2xl border border-purple-500/30 bg-slate-900/70 p-4 text-xs text-slate-300 md:items-end">
            <p className="font-semibold text-purple-200">
              How to use this page
            </p>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Pick a tool card based on what you want to do.</li>
              <li>• Click the main button on the card to open it.</li>
              <li>• “Coming soon” tools are previews of what&apos;s planned.</li>
            </ul>
            <p className="text-[10px] text-slate-500">
              This is just the hub UI — tools will be plugged in behind each card.
            </p>
          </div>
        </section>

        {/* Tool grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              Tools overview
            </h2>
            <p className="text-[11px] text-slate-500">
              Start with <span className="font-semibold text-slate-300">LDD Upscaler</span> or <span className="font-semibold text-slate-300">Grid Mockup Generator</span> if you&apos;re not sure where to begin.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
