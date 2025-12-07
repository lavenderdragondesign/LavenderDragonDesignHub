
import React, { useRef, useState } from 'react'
import { Image as ImageIcon, Zap, Loader2, Download, Trash2, Settings2 } from 'lucide-react'
import JSZip from 'jszip'
import AppShell from '../components/AppShell'

type PerfMode = 'safe' | 'balanced' | 'turbo'

interface SizePreset {
  id: string
  label: string
  note: string
}

const POD_PRESETS: SizePreset[] = [
  { id: '4500x5400', label: '4500 × 5400', note: 'Standard POD (15×18" at 300 DPI)' },
  { id: '3000x3000', label: '3000 × 3000', note: 'Legacy square (10×10" at 300 DPI)' },
  { id: '1024x1024', label: '1024 × 1024', note: 'Square preview (1024×1024)' },
  { id: '1500x2000', label: '1500 × 2000', note: 'Mockup base (5×6.67" at 300 DPI)' },
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

interface ImageInfo {
  width: number
  height: number
  sizeKB: number
  format: string
}

interface ImageItem {
  id: string
  fileName: string
  src: string
  info: ImageInfo
  element: HTMLImageElement
}

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
  // PNG signature
  if (
    png[0] !== 0x89 || png[1] !== 0x50 || png[2] !== 0x4E || png[3] !== 0x47 ||
    png[4] !== 0x0D || png[5] !== 0x0A || png[6] !== 0x1A || png[7] !== 0x0A
  ) {
    return pngArrayBuffer
  }

  const ppm = Math.round(dpi / 0.0254)

  // pHYs chunk (length 9)
  const chunk = new Uint8Array(4 + 4 + 9 + 4)
  // length 9
  chunk[0] = 0; chunk[1] = 0; chunk[2] = 0; chunk[3] = 9
  // type 'pHYs'
  chunk[4] = 0x70; chunk[5] = 0x48; chunk[6] = 0x59; chunk[7] = 0x73

  const dv = new DataView(chunk.buffer)
  dv.setUint32(8, ppm)
  dv.setUint32(12, ppm)
  chunk[16] = 1 // meter

  const crc = crc32ForPng(chunk.subarray(4, 17))
  chunk[17] = (crc >>> 24) & 255
  chunk[18] = (crc >>> 16) & 255
  chunk[19] = (crc >>> 8) & 255
  chunk[20] = crc & 255

  // Insert after IHDR (33 bytes in)
  const out = new Uint8Array(png.length + chunk.length)
  out.set(png.subarray(0, 33), 0)
  out.set(chunk, 33)
  out.set(png.subarray(33), 33 + chunk.length)

  return out.buffer
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

  const [images, setImages] = useState<ImageItem[]>([])
  const [activeImageId, setActiveImageId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const activeImage = images.find(img => img.id === activeImageId) ?? images[0] ?? null

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

  const loadFileToImageItem = (file: File): Promise<ImageItem> => {
    return new Promise((resolve, reject) => {
      const sizeKB = Math.round(file.size / 1024)
      const format = file.type || 'image'

      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result
        if (!result || typeof result !== 'string') {
          reject(new Error('Failed to read file'))
          return
        }

        const img = new Image()
        img.onload = () => {
          const info: ImageInfo = {
            width: img.width,
            height: img.height,
            sizeKB,
            format
          }
          const item: ImageItem = {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fileName: file.name,
            src: result,
            info,
            element: img
          }
          resolve(item)
        }
        img.onerror = err => {
          reject(err || new Error('Failed to load image'))
        }
        img.src = result
      }
      reader.onerror = err => reject(err || new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
    const files = event.target.files
    if (!files || !files.length) return

    try {
      const fileArray = Array.from(files)
      const newItems = await Promise.all(fileArray.map(loadFileToImageItem))
      setImages(prev => {
        const merged = [...prev, ...newItems]
        if (!activeImageId && merged.length > 0) {
          setActiveImageId(merged[0].id)
        }
        return merged
      })
    } catch (err) {
      console.error(err)
    } finally {
      event.target.value = ''
    }
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
    if (!activeImage || !selectedSizes.length) return

    const allIds = Array.from(new Set([...selectedSizes, ...customSizes]))
    const parsedJobs: Job[] = allIds
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

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const srcW = activeImage.element.width
        const srcH = activeImage.element.height

        const scale = Math.max(job.width / srcW, job.height / srcH)
        const drawW = srcW * scale
        const drawH = srcH * scale
        const offsetX = (job.width - drawW) / 2
        const offsetY = (job.height - drawH) / 2

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(activeImage.element, offsetX, offsetY, drawW, drawH)

        const blob: Blob | null = await new Promise(resolve =>
          canvas.toBlob(b => resolve(b), 'image/png', 1.0)
        )
        if (!blob) throw new Error('Failed to create PNG')

        let arrayBuffer = await blob.arrayBuffer()
        arrayBuffer = setPngDPI(arrayBuffer, 300)

        const baseName = (activeImage.fileName || 'design').replace(/\.[^.]+$/, '')
        const outName = `${baseName}_${job.width}x${job.height}_300dpi.png`

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
    const baseName = (activeImage.fileName || 'design').replace(/\.[^.]+$/, '')
    link.href = url
    link.download = `${baseName}_resized_300dpi.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setStatus('idle')
  }

  const handleRunClick = async () => {
    if (!activeImage || !selectedSizes.length || status !== 'idle') return
    await runJobsAndZip()
  }

  const formatLabel =
    activeImage?.info.format?.toLowerCase().includes('png')
      ? 'PNG'
      : activeImage?.info.format?.toUpperCase() || '—'

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-purple-900">
          Bulk Resizer
        </h1>
        <p className="text-purple-800 text-sm md:text-base max-w-2xl">
          Purple control room edition. Drop one or more PNG masters, pick your sizes, and download a ZIP
          of 300&nbsp;DPI-ready PNGs.
        </p>
      </div>

      <div className="rounded-3xl border border-purple-300 bg-gradient-to-br from-purple-100 via-violet-100 to-purple-200 p-6 md:p-8 space-y-6 shadow-xl">
        {/* Status bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-md">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-base md:text-lg text-purple-950">
                LDDTools.lol · Bulk Resizer
              </div>
              <div className="text-[11px] md:text-xs text-purple-700">
                POD presets · mockup sizes · multi-image ZIP export
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs md:text-sm">
            <div className="flex flex-col gap-1">
              <span className="uppercase tracking-wide text-purple-700 text-[11px]">
                Status
              </span>
              <span
                className={[
                  'inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-medium text-[11px] md:text-xs border',
                  status === 'idle' && 'bg-white text-black border-purple-200',
                  status === 'preparing' && 'bg-amber-100 text-black border-amber-300',
                  status === 'rendering' && 'bg-emerald-100 text-black border-emerald-300',
                  status === 'zipping' && 'bg-fuchsia-100 text-black border-fuchsia-300'
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

            <div className="flex flex-col gap-1">
              <span className="uppercase tracking-wide text-purple-700 text-[11px]">
                Mode
              </span>
              <div className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-white px-1">
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
                      'px-3 py-1 text-[11px] rounded-full border',
                      perfMode === m.id
                        ? 'bg-purple-300 border-purple-500 text-black'
                        : 'bg-white border-transparent text-black hover:border-purple-300'
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {m.label}
                  </button>
                ))}
                <Zap className="h-3 w-3 text-purple-700 ml-1" />
              </div>
              <div className="text-[11px] text-purple-800">
                Current:{' '}
                <span className="font-semibold">
                  {perfMode === 'safe' && 'Safe · single-job'}
                  {perfMode === 'balanced' && 'Balanced · good default'}
                  {perfMode === 'turbo' && 'Turbo · max threads'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Source images */}
          <div className="rounded-2xl border border-purple-300 bg-purple-50/80 p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wide text-purple-800 uppercase">
                Source artwork
              </span>
              {activeImage && (
                <span className="text-[11px] text-purple-700 truncate max-w-[10rem]">
                  {activeImage.fileName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBrowseClick}
              className="flex-1 min-h-[200px] rounded-2xl border border-dashed border-purple-300 bg-white/70 px-4 py-6 text-center text-purple-700 flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-white transition-colors"
            >
              <ImageIcon className="h-10 w-10 mb-1 text-purple-500" />
              <span className="text-sm md:text-base text-black">
                Drop PNGs or click to browse / pick a folder
              </span>
              <span className="text-[11px] text-purple-700">
                Multi-select supported · Transparency preserved
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              {...({ webkitdirectory: true } as any)}
              accept="image/png,image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {activeImage && (
              <div className="mt-3 rounded-xl border border-purple-300 bg-white p-2">
                <img
                  src={activeImage.src}
                  alt={activeImage.fileName}
                  className="w-full max-h-64 object-contain rounded-lg bg-purple-100"
                />
              </div>
            )}

            <dl className="mt-3 grid grid-cols-3 gap-3 text-[11px] text-purple-800">
              <div>
                <dt className="uppercase mb-0.5">Resolution</dt>
                <dd className="text-black text-xs">
                  {activeImage ? `${activeImage.info.width} × ${activeImage.info.height}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="uppercase mb-0.5">File size</dt>
                <dd className="text-black text-xs">
                  {activeImage ? `${activeImage.info.sizeKB} KB` : '—'}
                </dd>
              </div>
              <div>
                <dt className="uppercase mb-0.5">Format</dt>
                <dd className="text-black text-xs">
                  {formatLabel}
                </dd>
              </div>
            </dl>

            {images.length > 0 && (
              <div className="mt-3">
                <div className="text-[11px] text-purple-800 mb-1 flex items-center justify-between">
                  <span>
                    Images added:{' '}
                    <span className="font-semibold text-black">
                      {images.length}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map(img => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImageId(img.id)}
                      className={[
                        'flex-shrink-0 w-20 rounded-xl border p-1 bg-white flex flex-col items-center',
                        activeImage && activeImage.id === img.id
                          ? 'border-purple-500'
                          : 'border-purple-200'
                      ].join(' ')}
                    >
                      <img
                        src={img.src}
                        alt={img.fileName}
                        className="w-full h-12 object-cover rounded-lg mb-1"
                      />
                      <span className="text-[10px] text-purple-800 truncate w-full px-1">
                        {img.fileName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Sizes */}
          <div className="rounded-2xl border border-purple-300 bg-purple-50/80 p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wide text-purple-800 uppercase">
                Target sizes
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] text-purple-800"
              >
                <Settings2 className="h-3 w-3" />
                Manage presets
              </button>
            </div>

            {/* Tabs */}
            <div className="inline-flex rounded-full bg-white border border-purple-300 p-1 text-xs mb-2">
              <button
                type="button"
                onClick={() => setActiveTab('pod')}
                className={[
                  'px-3 py-1 rounded-full',
                  activeTab === 'pod'
                    ? 'bg-purple-300 text-black font-semibold'
                    : 'text-black'
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
                    ? 'bg-purple-300 text-black font-semibold'
                    : 'text-black'
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
                    ? 'bg-purple-300 text-black font-semibold'
                    : 'text-black'
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
                  className="px-3 py-1.5 rounded-full bg-white text-black border border-purple-300"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-3 py-1.5 rounded-full bg-white text-black border border-purple-200"
                >
                  Clear
                </button>
              </div>
              <span className="text-purple-800">
                Selected:{' '}
                <span className="font-semibold text-black">
                  {selectedSizes.length}
                </span>
              </span>
            </div>

            {/* Lists */}
            <div className="flex-1 min-h-[150px] max-h-[230px] overflow-auto rounded-xl border border-purple-200 bg-white/80">
              <div className="divide-y divide-purple-100 text-xs">
                {activeTab === 'pod' && (
                  <>
                    {POD_PRESETS.map(preset => (
                      <label
                        key={preset.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-purple-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(preset.id)}
                            onChange={() => toggleSize(preset.id)}
                            className="h-3 w-3 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-black font-medium">
                            {preset.label}
                          </span>
                          <span className="text-[11px] text-purple-700">
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
                      <div className="px-3 py-3 text-[11px] text-purple-700">
                        Add a custom width and height below, then click “Add size”.
                      </div>
                    ) : (
                      customSizes.map(id => (
                        <label
                          key={id}
                          className="flex items-center justify-between px-3 py-2 hover:bg-purple-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(id)}
                              onChange={() => toggleSize(id)}
                              className="h-3 w-3 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-black font-medium">
                              {id.replace('x', ' × ')}
                            </span>
                            <span className="text-[11px] text-purple-700">
                              Custom size
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </>
                )}
                {activeTab === 'social' && (
                  <div className="px-3 py-3 text-[11px] text-purple-700">
                    Social presets coming soon — for now, use custom or POD sizes.
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
                className="w-28 rounded-full border border-purple-300 bg-white px-3 py-1 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <span className="text-purple-700">×</span>
              <input
                type="number"
                value={customHeight}
                onChange={e => setCustomHeight(e.target.value)}
                placeholder="Height"
                className="w-28 rounded-full border border-purple-300 bg-white px-3 py-1 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-white text-black px-4 py-1.5 text-xs font-semibold border border-purple-400"
              >
                <Settings2 className="h-3 w-3" />
                Add size
              </button>
            </div>
          </div>

          {/* Column 3: Queue */}
          <div className="rounded-2xl border border-purple-300 bg-purple-50/80 p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wide text-purple-800 uppercase">
                Render queue
              </span>
              <button
                type="button"
                onClick={() => setJobs([])}
                className="inline-flex items-center gap-1 text-[11px] text-purple-800"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>

            <div className="flex-1 min-h-[150px] max-h-[230px] overflow-auto rounded-xl border border-purple-200 bg-white/80 text-xs">
              {jobs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-purple-700 text-[11px] px-4 text-center">
                  When you run a batch, each selected size will appear here as a job.
                </div>
              ) : (
                <div className="divide-y divide-purple-100">
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div>
                        <p className="text-black font-medium">
                          {job.id.replace('x', ' × ')}
                        </p>
                        <p className="text-[11px] text-purple-700">
                          {job.status === 'working'
                            ? 'Rendering…'
                            : job.status === 'done'
                            ? 'Ready in ZIP'
                            : job.status === 'error'
                            ? 'Error – skipped'
                            : 'Queued'}
                        </p>
                      </div>
                      <span className="rounded-full bg-white border border-purple-300 px-3 py-1 text-[11px] text-black">
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
              disabled={!selectedSizes.length || status !== 'idle' || !activeImage}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm md:text-base font-semibold text-black border border-purple-500 shadow-md hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-5 w-5" />
              {status === 'idle' ? 'Render & Download ZIP' : 'Working…'}
            </button>
            <p className="mt-1 text-[11px] text-purple-800 leading-relaxed">
              Exported PNGs are sized for 300 DPI workflows (for example, 4500×5400 = 15×18 inches at 300 DPI).
              Most POD sites only care about pixel resolution, which this tool locks in for you.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
