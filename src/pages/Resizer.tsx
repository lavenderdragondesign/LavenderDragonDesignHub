import React, { useRef, useState } from 'react'
import { Image as ImageIcon, Zap, Loader2, Download, Trash2, Settings2 } from 'lucide-react'
import JSZip from 'jszip'
import AppShell from '../components/AppShell'

function crc32ForPng(buf: Uint8Array) {
  let c = ~0
  for (let n = 0; n < buf.length; n++) {
    c ^= buf[n]
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xEDB88320 & -(c & 1))
    }
  }
  return (~c) >>> 0
}

function setPngDPI(pngArrayBuffer: ArrayBuffer, dpi = 300): ArrayBuffer {
  const png = new Uint8Array(pngArrayBuffer)
  // Basic sanity check for PNG signature
  if (
    png[0] !== 0x89 || png[1] !== 0x50 || png[2] !== 0x4E || png[3] !== 0x47 ||
    png[4] !== 0x0D || png[5] !== 0x0A || png[6] !== 0x1A || png[7] !== 0x0A
  ) {
    return pngArrayBuffer
  }

  const ppm = Math.round(dpi / 0.0254)

  // Build pHYs chunk (length 9, type 'pHYs', data 9 bytes, then CRC)
  const chunk = new Uint8Array(4 + 4 + 9 + 4)
  // length = 9
  chunk[0] = 0; chunk[1] = 0; chunk[2] = 0; chunk[3] = 9
  // type 'pHYs'
  chunk[4] = 0x70; chunk[5] = 0x48; chunk[6] = 0x59; chunk[7] = 0x73

  // data: 4 bytes X, 4 bytes Y, 1 byte unit
  const dv = new DataView(chunk.buffer)
  dv.setUint32(8, ppm)     // X pixels per meter
  dv.setUint32(12, ppm)    // Y pixels per meter
  chunk[16] = 1            // unit = meter

  // CRC over type+data
  const crc = crc32ForPng(chunk.subarray(4, 17))
  chunk[17] = (crc >>> 24) & 255
  chunk[18] = (crc >>> 16) & 255
  chunk[19] = (crc >>> 8) & 255
  chunk[20] = crc & 255

  // Insert after IHDR (first chunk), which ends at byte 33
  const out = new Uint8Array(png.length + chunk.length)
  out.set(png.subarray(0, 33), 0)
  out.set(chunk, 33)
  out.set(png.subarray(33), 33 + chunk.length)

  return out.buffer
}

type PerfMode = 'safe' | 'balanced' | 'turbo'

interface SizePreset {
  id: string
  label: string
  note: string
}

const POD_PRESETS: SizePreset[] = [
  { id: '4500x5400', label: '4500 × 5400', note: 'Standard POD (15×18\" at 300 DPI)' },
  { id: '3000x3000', label: '3000 × 3000', note: 'Legacy square (10×10\" at 300 DPI)' },
  { id: '1024x1024', label: '1024 × 1024', note: 'Square preview (1024×1024)' },
  { id: '1500x2000', label: '1500 × 2000', note: 'Mockup base (5×6.67\" at 300 DPI)' },
  { id: '2625x1050', label: '2625 × 1050', note: 'Mug 11oz template' },
  { id: '2700x2025', label: '2700 × 2025', note: 'Etsy 4:3' },
  { id: '2048x2048', label: '2048 × 2048', note: 'Generic / KDP' }
]

type JobStatus = 'pending' | 'working' | 'done' | 'error'

interface Job {
  id: string
  width: number
  height: number
  status: JobStatus
}

export default function Resizer() {
  const [status, setStatus] = useState<'idle' | 'preparing' | 'rendering' | 'zipping'>('idle')
  const [perfMode, setPerfMode] = useState<PerfMode>('balanced')
  const [activeTab, setActiveTab] = useState<'pod' | 'social' | 'custom'>('pod')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [customSizes, setCustomSizes] = useState<string[]>([])
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])

  const [fileName, setFileName] = useState<string | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<{
    width: number
    height: number
    sizeKB: number
    format: string
  } | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    setCustomSizes(prev => (prev.includes(id) ? prev : [...prev, id]))
    setCustomWidth('')
    setCustomHeight('')
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const sizeKB = Math.round(file.size / 1024)
    const format = file.type || 'image'

    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result
      if (!result || typeof result !== 'string') return

      const img = new Image()
      img.onload = () => {
        setImageSrc(result)
        setImageElement(img)
        setImageInfo({
          width: img.width,
          height: img.height,
          sizeKB,
          format
        })
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const parseSize = (id: string): { width: number; height: number } | null => {
    const [w, h] = id.split('x').map(Number)
    if (!w || !h) return null
    return { width: w, height: h }
  }

  const getConcurrency = (mode: PerfMode) => {
    if (mode === 'safe') return 1
    if (mode === 'balanced') return 3
    return 6
  }

  const runJobsAndZip = async () => {
    if (!imageElement || !imageSrc || !selectedSizes.length) return

    const parsedJobs: Job[] = selectedSizes
      .map(id => {
        const parsed = parseSize(id)
        if (!parsed) return null
        return {
          id,
          width: parsed.width,
          height: parsed.height,
          status: 'pending' as JobStatus
        }
      })
      .filter((j): j is Job => j !== null)

    if (!parsedJobs.length) return

    setStatus('preparing')
    setJobs(parsedJobs)

    const zip = new JSZip()
    const concurrency = getConcurrency(perfMode)

    const updateJobStatus = (id: string, status: JobStatus) => {
      setJobs(prev => prev.map(job => (job.id === id ? { ...job, status } : job)))
    }

    const processJob = async (job: Job) => {
      try {
        updateJobStatus(job.id, 'working')

        const canvas = document.createElement('canvas')
        canvas.width = job.width
        canvas.height = job.height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('No canvas context')

        // Transparent background, then draw with "cover" behavior
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const srcW = imageElement.width
        const srcH = imageElement.height

        const scale = Math.max(job.width / srcW, job.height / srcH)
        const drawW = srcW * scale
        const drawH = srcH * scale
        const offsetX = (job.width - drawW) / 2
        const offsetY = (job.height - drawH) / 2

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(imageElement, offsetX, offsetY, drawW, drawH)

        const blob: Blob | null = await new Promise(resolve =>
          canvas.toBlob(b => resolve(b), 'image/png', 1.0)
        )
        if (!blob) throw new Error('Failed to create PNG')

        const baseName = (fileName || 'design').replace(/\.[^.]+$/, '')
        const outName = `${baseName}_${job.width}x${job.height}_300dpi.png`

        let arrayBuffer = await blob.arrayBuffer()
        arrayBuffer = setPngDPI(arrayBuffer, 300)
        zip.file(outName, arrayBuffer)

        updateJobStatus(job.id, 'done')
      } catch (err) {
        console.error(err)
        updateJobStatus(job.id, 'error')
      }
    }

    setStatus('rendering')

    const queue = [...parsedJobs]
    const workers: Promise<void>[] = []

    const runWorker = async () => {
      while (queue.length) {
        const job = queue.shift()
        if (!job) break
        await processJob(job)
      }
    }

    const workerCount = Math.min(concurrency, parsedJobs.length)
    for (let i = 0; i < workerCount; i++) {
      workers.push(runWorker())
    }

    await Promise.all(workers)

    setStatus('zipping')
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    const baseName = (fileName || 'design').replace(/\.[^.]+$/, '')
    link.href = url
    link.download = `${baseName}_resized_300dpi.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setStatus('idle')
  }

  const handleRunClick = async () => {
    if (!imageElement || !imageSrc || !selectedSizes.length || status !== 'idle') return
    await runJobsAndZip()
  }

  const formatLabel =
    imageInfo?.format?.toLowerCase().includes('png')
      ? 'PNG'
      : imageInfo?.format?.toUpperCase() || '—'

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-slate-50">Bulk Resizer</h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl">
          Drop a PNG master once, pick all your POD / Etsy sizes (built around 300 DPI), and download everything together as a single ZIP.
        </p>
      </div>

      <div className="rounded-card bg-slate-900/90 border border-slate-700 shadow-card p-6 md:p-8 space-y-6">
        {/* Status bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-brand.neon">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm md:text-base text-slate-100">
                LDDTools.lol · Bulk Resizer
              </div>
              <div className="text-[11px] md:text-xs text-slate-400">
                Multi-size exports · ZIP ready · Dark room friendly
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wide text-slate-500">Status</span>
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium text-[11px] md:text-xs',
                  status === 'idle' && 'bg-slate-800 text-slate-200',
                  status === 'preparing' && 'bg-sky-900/70 text-sky-200',
                  status === 'rendering' && 'bg-emerald-900/70 text-emerald-200',
                  status === 'zipping' && 'bg-fuchsia-900/70 text-fuchsia-200'
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

            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide text-slate-500">Mode</span>
                <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-1">
                  {[
                    { id: 'safe', label: 'Safe' },
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'turbo', label: 'Turbo' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPerfMode(m.id as PerfMode)}
                      className={[
                        'px-2.5 py-1 text-[11px] rounded-full',
                        perfMode === m.id
                          ? 'bg-brand.neon text-slate-50'
                          : 'text-slate-300 hover:bg-slate-800'
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {m.label}
                    </button>
                  ))}
                  <Zap className="h-3 w-3 text-brand.neon ml-1" />
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Current mode:{' '}
                <span className="font-semibold text-slate-50">
                  {perfMode === 'safe' && 'Safe · single-job, gentler'}
                  {perfMode === 'balanced' && 'Balanced · good default'}
                  {perfMode === 'turbo' && 'Turbo · max parallel jobs'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Source image */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Source artwork
              </span>
              {fileName && (
                <span className="text-[11px] text-slate-400 truncate max-w-[9rem]">
                  {fileName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBrowseClick}
              className="flex-1 min-h-[200px] rounded-xl border border-dashed border-slate-600 bg-slate-950/60 px-4 py-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2 hover:border-brand.neon hover:text-slate-100 hover:bg-slate-900/80 transition-colors"
            >
              <ImageIcon className="h-8 w-8 mb-1 text-slate-500" />
              <span className="text-sm md:text-base">
                Drop a PNG or click to browse
              </span>
              <span className="text-[11px] text-slate-500">
                Transparency preserved · Best with high-res masters
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imageSrc && (
              <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/70 p-2">
                <img
                  src={imageSrc}
                  alt={fileName ?? 'Uploaded artwork'}
                  className="w-full max-h-64 object-contain rounded-md bg-slate-900"
                />
              </div>
            )}

            <dl className="mt-3 grid grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div>
                <dt className="uppercase mb-0.5">Resolution</dt>
                <dd className="text-slate-100 text-xs">
                  {imageInfo ? `${imageInfo.width} × ${imageInfo.height}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="uppercase mb-0.5">File size</dt>
                <dd className="text-slate-100 text-xs">
                  {imageInfo ? `${imageInfo.sizeKB} KB` : '—'}
                </dd>
              </div>
              <div>
                <dt className="uppercase mb-0.5">Format</dt>
                <dd className="text-slate-100 text-xs">
                  {formatLabel}
                </dd>
              </div>
            </dl>
          </div>

          {/* Column 2: Size presets */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Target sizes
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-100"
              >
                <Settings2 className="h-3 w-3" />
                Manage presets
              </button>
            </div>

            {/* Tabs */}
            <div className="inline-flex rounded-full bg-slate-950/70 border border-slate-700 p-1 text-xs mb-2">
              <button
                type="button"
                onClick={() => setActiveTab('pod')}
                className={[
                  'px-3 py-1 rounded-full',
                  activeTab === 'pod'
                    ? 'bg-brand.neon text-slate-50'
                    : 'text-slate-300'
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
                    ? 'bg-brand.neon text-slate-50'
                    : 'text-slate-300'
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
                    ? 'bg-brand.neon text-slate-50'
                    : 'text-slate-300'
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
                  className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-100 border border-slate-700 hover:border-brand.neon"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-2.5 py-1 rounded-lg bg-transparent text-slate-400 hover:text-slate-100"
                >
                  Clear
                </button>
              </div>
              <span className="text-slate-400">
                Selected:{' '}
                <span className="font-semibold text-brand.neon">
                  {selectedSizes.length}
                </span>
              </span>
            </div>

            {/* Preset / custom list */}
            <div className="flex-1 min-h-[150px] max-h-[230px] overflow-auto rounded-lg border border-slate-700 bg-slate-950/70">
              <div className="divide-y divide-slate-800 text-xs">
                {activeTab === 'pod' && (
                  <>
                    {POD_PRESETS.map(preset => (
                      <label
                        key={preset.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-slate-900 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(preset.id)}
                            onChange={() => toggleSize(preset.id)}
                            className="h-3 w-3 rounded border-slate-500 text-brand.neon focus:ring-brand.neon bg-slate-900"
                          />
                          <span className="text-slate-100 font-medium">
                            {preset.label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {preset.note}
                          </span>
                        </div>
                      </label>
                    ))}
                  </>
                )}
                {activeTab === 'custom' && (
                  <>
                    {customSizes.length === 0 ? (
                      <div className="px-3 py-3 text-[11px] text-slate-500">
                        Add a custom width and height below, then click “Add size”.
                      </div>
                    ) : (
                      customSizes.map(id => (
                        <label
                          key={id}
                          className="flex items-center justify-between px-3 py-2 hover:bg-slate-900 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(id)}
                              onChange={() => toggleSize(id)}
                              className="h-3 w-3 rounded border-slate-500 text-brand.neon focus:ring-brand.neon bg-slate-900"
                            />
                            <span className="text-slate-100 font-medium">
                              {id.replace('x', ' × ')}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Custom size
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </>
                )}
                {activeTab === 'social' && (
                  <div className="px-3 py-3 text-[11px] text-slate-500">
                    Social presets coming soon — for now, use custom sizes or POD.
                  </div>
                )}
              </div>
            </div>

            {/* Custom size input */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <input
                type="number"
                value={customWidth}
                onChange={e => setCustomWidth(e.target.value)}
                placeholder="Width"
                className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand.neon"
              />
              <span className="text-slate-500">×</span>
              <input
                type="number"
                value={customHeight}
                onChange={e => setCustomHeight(e.target.value)}
                placeholder="Height"
                className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand.neon"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="ml-1 inline-flex items-center gap-1 rounded-lg bg-brand.neon text-slate-50 px-3 py-1 text-xs font-semibold hover:brightness-110"
              >
                <Settings2 className="h-3 w-3" />
                Add size
              </button>
            </div>
          </div>

          {/* Column 3: Queue */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Render queue
              </span>
              <button
                type="button"
                onClick={() => setJobs([])}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>

            <div className="flex-1 min-h-[150px] max-h-[230px] overflow-auto rounded-lg border border-slate-700 bg-slate-950/70 text-xs">
              {jobs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-[11px] px-4 text-center">
                  When you start a run, each selected size will appear here as a job.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div>
                        <p className="text-slate-100 font-medium">
                          {job.id.replace('x', ' × ')}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {job.status === 'working'
                            ? 'Rendering…'
                            : job.status === 'done'
                            ? 'Ready in ZIP'
                            : job.status === 'error'
                            ? 'Error – skipped'
                            : 'Queued'}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] text-slate-300">
                        {job.status === 'working'
                          ? 'Working'
                          : job.status === 'done'
                          ? 'Done'
                          : job.status === 'error'
                          ? 'Error'
                          : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRunClick}
              disabled={!selectedSizes.length || status !== 'idle' || !imageSrc || !imageElement}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand.neon px-4 py-2.5 text-sm md:text-base font-semibold text-slate-50 shadow-lg shadow-emerald-400/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {status === 'idle' ? 'Render & Download ZIP' : 'Working…'}
            </button>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Exported PNGs are sized for 300 DPI workflows (e.g. 4500×5400 = 15×18 inches at 300 DPI).  
              Most POD sites ignore embedded DPI and only care about pixel resolution, which this tool targets.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
