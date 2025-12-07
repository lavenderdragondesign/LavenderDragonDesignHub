import React, { useState } from 'react'
import { Image as ImageIcon, Zap, Loader2, Download, Trash2, Settings2 } from 'lucide-react'
import AppShell from '../components/AppShell'

type PerfMode = 'safe' | 'balanced' | 'turbo'

interface SizePreset {
  id: string
  label: string
  note: string
}

const POD_PRESETS: SizePreset[] = [
  { id: '4500x5400', label: '4500 × 5400', note: 'Standard POD' },
  { id: '3000x3000', label: '3000 × 3000', note: 'Square' },
  { id: '2625x1050', label: '2625 × 1050', note: 'Mug 11oz' },
  { id: '2700x2025', label: '2700 × 2025', note: 'Etsy 4:3' },
  { id: '2048x2048', label: '2048 × 2048', note: 'Generic / KDP' }
]

export default function Resizer() {
  const [status, setStatus] = useState<'idle' | 'preparing' | 'rendering' | 'zipping'>('idle')
  const [perfMode, setPerfMode] = useState<PerfMode>('balanced')
  const [activeTab, setActiveTab] = useState<'pod' | 'social' | 'custom'>('pod')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [jobs, setJobs] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)

  const toggleSize = (id: string) => {
    setSelectedSizes(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    const allIds = POD_PRESETS.map(p => p.id)
    setSelectedSizes(allIds)
  }

  const clearAll = () => {
    setSelectedSizes([])
  }

  const addCustomSize = () => {
    if (!customWidth || !customHeight) return
    const id = `${customWidth}x${customHeight}`
    if (!selectedSizes.includes(id)) {
      setSelectedSizes(prev => [...prev, id])
    }
    setCustomWidth('')
    setCustomHeight('')
  }

  const prepareJobs = () => {
    if (!selectedSizes.length) return
    setStatus('preparing')
    setJobs(selectedSizes)
    // Stub: real rendering will be wired into your existing resizer engine
    setTimeout(() => {
      setStatus('rendering')
      setTimeout(() => {
        setStatus('zipping')
        setTimeout(() => {
          setStatus('idle')
        }, 600)
      }, 900)
    }, 400)
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Bulk Resizer</h1>
        <p className="text-gray-600">
          Batch Etsy sizes, mugs, KDP, and more — queue multiple exports and download everything as a single ZIP.
        </p>
      </div>

      <div className="rounded-card bg-white shadow-card p-6 space-y-5">
        {/* Status bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand.ink/10 text-brand.ink">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm">LDDTools.lol • Bulk Resizer</div>
              <div className="text-xs text-gray-500">
                Drop one design, export many sizes, ship it.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2">
              <span className="uppercase tracking-wide text-gray-500">Status</span>
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium',
                  status === 'idle' && 'bg-gray-100 text-gray-700',
                  status === 'preparing' && 'bg-sky-100 text-sky-700',
                  status === 'rendering' && 'bg-emerald-100 text-emerald-700',
                  status === 'zipping' && 'bg-purple-100 text-purple-700'
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {status !== 'idle' && <Loader2 className="h-3 w-3 animate-spin" />}
                {status === 'idle' && 'Idle'}
                {status === 'preparing' && 'Preparing jobs…'}
                {status === 'rendering' && 'Rendering sizes…'}
                {status === 'zipping' && 'Creating ZIP…'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wide text-gray-500">Mode</span>
              <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1">
                {[
                  { id: 'safe', label: 'Safe' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'turbo', label: 'Turbo' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPerfMode(m.id as PerfMode)}
                    className={[
                      'px-2 py-1 text-[11px] rounded-full',
                      perfMode === m.id
                        ? 'bg-brand.ink text-white'
                        : 'text-gray-600 hover:bg-white'
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {m.label}
                  </button>
                ))}
                <Zap className="h-3 w-3 text-brand.ink ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Source image */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Source artwork
              </span>
              {fileName && (
                <span className="text-[11px] text-gray-500 truncate max-w-[9rem]">
                  {fileName}
                </span>
              )}
            </div>
            <button
              type="button"
              className="flex-1 min-h-[180px] rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-gray-500 flex flex-col items-center justify-center gap-2 hover:border-brand.ink hover:text-gray-700 transition-colors"
            >
              <ImageIcon className="h-7 w-7 mb-1 text-gray-400" />
              <span className="text-sm">
                Drop a PNG or click to browse
              </span>
              <span className="text-[11px] text-gray-400">
                Transparency preserved • Ideal for POD masters
              </span>
            </button>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-gray-500">
              <div>
                <dt className="uppercase">Resolution</dt>
                <dd className="text-gray-800">–</dd>
              </div>
              <div>
                <dt className="uppercase">File size</dt>
                <dd className="text-gray-800">–</dd>
              </div>
              <div>
                <dt className="uppercase">Format</dt>
                <dd className="text-gray-800">PNG</dd>
              </div>
            </dl>
          </div>

          {/* Column 2: Size presets */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Target sizes
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800"
              >
                <Settings2 className="h-3 w-3" />
                Manage presets
              </button>
            </div>

            {/* Tabs */}
            <div className="inline-flex rounded-full bg-white border border-gray-200 p-1 text-xs mb-2">
              <button
                type="button"
                onClick={() => setActiveTab('pod')}
                className={[
                  'px-3 py-1 rounded-full',
                  activeTab === 'pod'
                    ? 'bg-brand.ink text-white'
                    : 'text-gray-600'
                ].join(' ')}
              >
                POD
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className={[
                  'px-3 py-1 rounded-full',
                  activeTab === 'social'
                    ? 'bg-brand.ink text-white'
                    : 'text-gray-600'
                ].join(' ')}
              >
                Social
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={[
                  'px-3 py-1 rounded-full',
                  activeTab === 'custom'
                    ? 'bg-brand.ink text-white'
                    : 'text-gray-600'
                ].join(' ')}
              >
                Custom
              </button>
            </div>

            {/* Select all / clear */}
            <div className="flex items-center justify-between text-[11px] mb-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-2 py-1 rounded-lg bg-transparent text-gray-500 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
              <span className="text-gray-500">
                Selected:{' '}
                <span className="font-semibold text-gray-800">
                  {selectedSizes.length}
                </span>
              </span>
            </div>

            {/* Preset list (POD tab only for now) */}
            <div className="flex-1 min-h-[150px] max-h-[220px] overflow-auto rounded-lg border border-gray-200 bg-white">
              <div className="divide-y divide-gray-100 text-xs">
                {POD_PRESETS.map(preset => (
                  <label
                    key={preset.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(preset.id)}
                        onChange={() => toggleSize(preset.id)}
                        className="h-3 w-3 rounded border-gray-300 text-brand.ink focus:ring-brand.ink"
                      />
                      <span className="text-gray-900 font-medium">
                        {preset.label}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {preset.note}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom size input */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <input
                type="number"
                value={customWidth}
                onChange={e => setCustomWidth(e.target.value)}
                placeholder="Width"
                className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand.ink"
              />
              <span className="text-gray-400">×</span>
              <input
                type="number"
                value={customHeight}
                onChange={e => setCustomHeight(e.target.value)}
                placeholder="Height"
                className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand.ink"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="ml-1 inline-flex items-center gap-1 rounded-lg bg-brand.ink text-white px-3 py-1 text-xs hover:opacity-95"
              >
                <Settings2 className="h-3 w-3" />
                Add size
              </button>
            </div>
          </div>

          {/* Column 3: Queue */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Render queue
              </span>
              <button
                type="button"
                onClick={() => setJobs([])}
                className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>

            <div className="flex-1 min-h-[140px] max-h-[220px] overflow-auto rounded-lg border border-gray-200 bg-white text-xs">
              {jobs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-[11px] px-4 text-center">
                  Selected sizes will appear here as jobs once you start a run.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {jobs.map(job => (
                    <div
                      key={job}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">{job.replace('x', ' × ')}</p>
                        <p className="text-[11px] text-gray-500">
                          {status === 'rendering'
                            ? 'Rendering…'
                            : status === 'zipping'
                            ? 'Packing into ZIP…'
                            : 'Queued'}
                        </p>
                      </div>
                      <span className="rounded-full bg-gray-50 border border-gray-200 px-2 py-1 text-[11px] text-gray-600">
                        {status === 'rendering'
                          ? 'Working'
                          : status === 'zipping'
                          ? 'Zipping'
                          : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={prepareJobs}
              disabled={!selectedSizes.length || status !== 'idle'}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand.ink px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {status === 'idle' ? 'Render & Download ZIP' : 'Working…'}
            </button>
            <p className="mt-1 text-[11px] text-gray-500">
              Performance mode controls how many images run in parallel once you hook this into your resizer engine.{' '}
              <span className="font-medium text-gray-700">Turbo</span> is best for strong machines,{' '}
              <span className="font-medium text-gray-700">Safe</span> for older laptops.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
