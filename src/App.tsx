import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
} from 'react'
import {
  Sparkles,
  Image as ImageIcon,
  Ruler,
  Grid3X3,
  FileText,
  MonitorCog,
  Zap,
  Upload,
  Trash2,
  Download,
  Plus,
} from 'lucide-react'
import JSZip from 'jszip'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom'

type OutputFormat = 'png' | 'jpg' | 'both'

interface SourceFile {
  id: string;
  name: string;
  width: number;
  height: number;
  file: File;
}

interface SizePreset {
  id: string;
  width: number;
  height: number;
}

interface QueueItem {
  id: string;
  sourceId: string;
  sourceName: string;
  sizeLabel: string;
  width: number;
  height: number;
  status: 'pending' | 'processing' | 'done' | 'error';
}

const POD_PRESETS: {
  id: string;
  label: string;
  width: number;
  height: number;
}[] = [
  {
    id: 'POD Default – 4500x5400',
    label: 'POD Default',
    width: 4500,
    height: 5400,
  },
  {
    id: 'Tumbler Wrap – 2790x2460',
    label: 'Tumbler Wrap',
    width: 2790,
    height: 2460,
  },
  {
    id: 'Square – 1024x1024',
    label: 'Square',
    width: 1024,
    height: 1024,
  },
  {
    id: 'Standard Mockup – 2000x1500',
    label: 'Standard Mockup',
    width: 2000,
    height: 1500,
  },
  {
    id: '11oz Mug (SwiftPOD) – 2625x1050',
    label: '11oz Mug (SwiftPOD)',
    width: 2625,
    height: 1050,
  },
  {
    id: '11oz Mug (District) – 2475x1156',
    label: '11oz Mug (District)',
    width: 2475,
    height: 1156,
  },
];

// Splash overlay
function SplashOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const seen = window.localStorage.getItem('lddtools_splash_seen')
      if (!seen) {
        setVisible(true)
      }
    } catch {
      // ignore
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('lddtools_splash_seen', '1')
      }
    } catch {
      // ignore
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
      <div className="w-[400px] max-w-[95vw] rounded-2xl bg-white shadow-2xl p-6 text-slate-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-purple-500 via-emerald-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
            LDD
          </div>
          <div>
            <div className="text-base font-semibold">Welcome to LDDTools.lol</div>
            <div className="text-xs text-slate-500">
              Little tools for big POD chaos.
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 mb-3">
          This toolbox is where upscalers, resizers, mockup generators and Windows tweaks all live together. First stop: the Bulk POD Resizer.
        </p>

        <button
          onClick={dismiss}
          className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-slate-50 text-xs font-semibold py-2 hover:bg-slate-800"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          Enter LDDTools
        </button>
        <p className="mt-2 text-xs text-slate-400 text-center">
          This splash only shows once per browser.
        </p>
      </div>
    </div>
  )
}

// Landing page
function LandingPage() {
  const navigate = useNavigate()

  const tools = [
    {
      title: 'Bulk POD Resizer',
      desc: 'Resize multiple designs into all your POD sizes in one run.',
      icon: <Ruler className="w-5 h-5 text-emerald-500" />,
      route: '/resize',
      badge: 'New',
    },
    {
      title: 'LDD Upscaler',
      desc: 'Local-first upscaling for AI art and vectors (coming here soon).',
      icon: <ImageIcon className="w-5 h-5 text-purple-500" />,
      route: '#',
      badge: 'Soon',
    },
    {
      title: 'Grid Mockup Generator',
      desc: 'Etsy-ready bundle grids and mockups (hook to existing app).',
      icon: <Grid3X3 className="w-5 h-5 text-cyan-500" />,
      route: '#',
      badge: 'External',
    },
    {
      title: 'Branded PDF Maker',
      desc: 'Pretty download inserts with your logo and links.',
      icon: <FileText className="w-5 h-5 text-amber-500" />,
      route: '#',
      badge: 'Soon',
    },
    {
      title: 'LDD WinTweaker',
      desc: 'Windows performance presets tuned for AI + Affinity.',
      icon: <MonitorCog className="w-5 h-5 text-pink-500" />,
      route: '#',
      badge: 'Script',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-48px)] bg-slate-950 flex flex-col">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <h1 className="text-base font-semibold text-white mb-1">
          LDDTools.lol
        </h1>
        <p className="text-xs text-slate-400 max-w-xl">
          A tiny control center for all your LavenderDragonDesign tools. Pick a card and go build something.
        </p>
      </div>

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.title}
              onClick={() => {
                if (tool.route === '#') return
                navigate(tool.route)
              }}
              className="group text-left rounded-2xl bg-white shadow border border-slate-200 hover:border-emerald-400/60 transition-all p-4 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl bg-slate-100 p-2">
                  {tool.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {tool.title}
                    </h2>
                    {tool.badge && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-900 text-white">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {tool.desc}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-500 flex items-center justify-between">
                <span>
                  {tool.route === '/resize'
                    ? 'Open resizer'
                    : tool.route === '#'
                    ? 'Hook this up later'
                    : 'Open tool'}
                </span>
                <Zap className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Bulk Resizer page wrapper
function BulkResizerPage() {
  return (
    <div className="min-h-[calc(100vh-48px)] bg-slate-950 text-slate-100 flex flex-col">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-300" />
            <h1 className="text-sm font-semibold">
              Bulk POD Resizer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drop multiple images once, export all your POD Resize-tab sizes into a single ZIP.
          </p>
        </div>
        <Link
          to="/"
          className="text-sm px-2 py-1 rounded-lg border border-slate-700 text-slate-200 hover:border-emerald-400"
        >
          ← Back to tools
        </Link>
      </div>

      <div className="flex-1">
        <BulkResizer />
      </div>
    </div>
  )
}

// BulkResizer component
function BulkResizer() {
  const [sources, setSources] = useState<SourceFile[]>([])
  const [sizes, setSizes] = useState<SizePreset[]>([])
  const [customWidth, setCustomWidth] = useState<string>('')
  const [customHeight, setCustomHeight] = useState<string>('')
  const [format, setFormat] = useState<OutputFormat>('png')
  const [background, setBackground] = useState<'transparent' | 'white'>(
    'transparent'
  )
  const [tag300dpi, setTag300dpi] = useState<boolean>(true)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [zipBlob, setZipBlob] = useState<Blob | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const hasImages = sources.length > 0
  const hasSizes = sizes.length > 0
  const allDone =
    queue.length > 0 && queue.every((item) => item.status === 'done')

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files).filter((f) =>
      ['image/png', 'image/jpeg', 'image/jpg'].includes(f.type)
    )
    if (fileArray.length === 0) return

    fileArray.forEach((file) => {
      const img = new Image()
      img.onload = () => {
        setSources((prev) => [
          ...prev,
          {
            id:
              file.name +
              '-' +
              file.lastModified +
              '-' +
              Math.random().toString(36).slice(2, 7),
            name: file.name,
            width: img.width,
            height: img.height,
            file,
          },
        ])
      }
      img.onerror = () => {
        console.error('Failed to load image:', file.name)
      }
      const url = URL.createObjectURL(file)
      img.src = url
    })

    e.target.value = ''
  }

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleAddCustomSize = () => {
    const w = parseInt(customWidth, 10)
    const h = parseInt(customHeight, 10)
    if (!w || !h) return
    const id = `${w}x${h}`
    if (!sizes.find((s) => s.id === id)) {
      setSizes((prev) => [...prev, { id, width: w, height: h }])
    }
    setCustomWidth('')
    setCustomHeight('')
  }

  const handleRemoveSize = (id: string) => {
    setSizes((prev) => prev.filter((s) => s.id !== id))
  }

  function getBasename(name: string): string {
    const dot = name.lastIndexOf('.')
    return dot === -1 ? name : name.slice(0, dot)
  }

  const resizeImage = (
    file: File,
    targetWidth: number,
    targetHeight: number,
    asFormat: 'image/png' | 'image/jpeg',
    bg: 'transparent' | 'white'
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = targetWidth
          canvas.height = targetHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('No 2D context'))
            return
          }

          if (asFormat === 'image/jpeg' || bg === 'white') {
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, targetWidth, targetHeight)
          } else {
            ctx.clearRect(0, 0, targetWidth, targetHeight)
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'))
                return
              }

              if (tag300dpi) {
                // placeholder for future DPI metadata
              }

              resolve(blob)
            },
            asFormat,
            asFormat === 'image/jpeg' ? 0.92 : undefined
          )
        } catch (err) {
          reject(err)
        }
      }
      img.onerror = () => reject(new Error('Image load error'))
      const url = URL.createObjectURL(file)
      img.src = url
    })
  }

  const buildQueue = (): QueueItem[] => {
    const items: QueueItem[] = []
    for (const src of sources) {
      for (const size of sizes) {
        items.push({
          id: `${src.id}-${size.id}`,
          sourceId: src.id,
          sourceName: src.name,
          sizeLabel: `${size.width}x${size.height}`,
          width: size.width,
          height: size.height,
          status: 'pending',
        })
      }
    }
    return items
  }

  const handleResizeAll = async () => {
    if (!hasImages || !hasSizes || isProcessing) return

    setZipBlob(null)
    const initialQueue = buildQueue()
    setQueue(initialQueue)
    setIsProcessing(true)

    const zip = new JSZip()

    try {
      for (const item of initialQueue) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'processing' } : q
          )
        )

        const src = sources.find((s) => s.id === item.sourceId)
        if (!src) {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'error' } : q
            )
          )
          continue
        }

        const base = getBasename(src.name)
        const folder = zip.folder(base) ?? zip.folder(base)

        const formats: ('image/png' | 'image/jpeg')[] = []
        if (format === 'png' || format === 'both') formats.push('image/png')
        if (format === 'jpg' || format === 'both') formats.push('image/jpeg')

        for (const f of formats) {
          const blob = await resizeImage(
            src.file,
            item.width,
            item.height,
            f,
            background
          )
          const ext = f === 'image/png' ? 'png' : 'jpg'
          const fileName = `${base}_${item.width}x${item.height}.${ext}`
          folder?.file(fileName, blob)
        }

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'done' } : q
          )
        )
      }

      const outBlob = await zip.generateAsync({ type: 'blob' })
      setZipBlob(outBlob)
    } catch (err) {
      console.error(err)
      setQueue((prev) =>
        prev.map((q) =>
          q.status === 'pending' || q.status === 'processing'
            ? { ...q, status: 'error' }
            : q
        )
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadZip = () => {
    if (!zipBlob) return
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'LDD-Bulk-Resized.zip'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleClearQueue = () => {
    setQueue([])
    setZipBlob(null)
  }

  const handleClearSources = () => {
    setSources([])
    setQueue([])
    setZipBlob(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {sources.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleClearSources}
            className="text-sm px-2 py-1 rounded-lg border border-slate-700 text-slate-200 hover:border-rose-400 hover:text-rose-300"
          >
            Clear all images
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)] gap-4">
        <section className="space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Upload className="w-4 h-4 text-emerald-300" />
              Upload Images
            </div>
            <button
              onClick={handleOpenFileDialog}
              className="w-full mt-1 border border-dashed border-slate-700 rounded-xl py-5 flex flex-col items-center justify-center gap-1 text-xs hover:border-emerald-400 hover:bg-slate-900/80"
            >
              <Upload className="w-5 h-5 text-emerald-300" />
              <span>Drag & drop into window or click to browse</span>
              <span className="text-xs text-slate-500">
                PNG or JPG • Multiple files allowed
              </span>
            </button>
            <p className="text-sm text-slate-500 mt-1">
              Files added:{' '}
              <span className="text-emerald-300 font-medium">
                {sources.length}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Output Sizes</span>
            </div>

            <div className="flex flex-wrap gap-1 text-sm">
              {POD_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (!sizes.find((s) => s.id === p.id)) {
                      setSizes((prev) => [
                        ...prev,
                        { id: p.id, width: p.width, height: p.height },
                      ])
                    }
                  }}
                  className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950 hover:border-emerald-400 text-left"
                >
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-xs text-slate-400">
                    {p.width} × {p.height}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                placeholder="Width"
                className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-sm"
              />
              <span>x</span>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                placeholder="Height"
                className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-sm"
              />
              <button
                onClick={handleAddCustomSize}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            <div className="mt-1 flex flex-wrap gap-1">
              {sizes.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-950 border border-slate-700 text-xs"
                >
                  {s.id}
                  <button
                    onClick={() => handleRemoveSize(s.id)}
                    className="hover:text-rose-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              {sizes.length === 0 && (
                <span className="text-xs text-slate-500">
                  Add at least one size to enable resizing.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-2 text-sm">
            <div className="text-xs font-semibold text-slate-200">
              Options
            </div>

            <div className="flex items-center justify-between">
              <span>Format</span>
              <select
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as OutputFormat)
                }
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="both">PNG + JPG</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span>Background</span>
              <select
                value={background}
                onChange={(e) =>
                  setBackground(e.target.value as 'transparent' | 'white')
                }
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm"
              >
                <option value="transparent">Transparent</option>
                <option value="white">White</option>
              </select>
            </div>

            <button
              onClick={handleResizeAll}
              disabled={!hasImages || !hasSizes || isProcessing}
              className={`mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                !hasImages || !hasSizes || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              <Zap className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Resize All'}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-2">
              <ImageIcon className="w-4 h-4 text-emerald-300" />
              Selected Images
            </div>
            {sources.length === 0 ? (
              <p className="text-xs text-slate-500">
                No images yet. Add at least one file to begin.
              </p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className="flex items-center justify-between text-sm rounded-lg bg-slate-950 border border-slate-800 px-2 py-1.5"
                  >
                    <span className="truncate max-w-[200px]">
                      {src.name}
                    </span>
                    <span className="text-slate-500">
                      {src.width} x {src.height}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">
                Resize Queue
              </span>
              <button
                onClick={handleClearQueue}
                className="text-sm text-slate-500 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="flex-1 space-y-1 max-h-56 overflow-y-auto pr-1 text-sm">
              {queue.length === 0 && (
                <p className="text-xs text-slate-500">
                  Queue is empty. Click “Resize All” to generate tasks.
                </p>
              )}

              {queue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate max-w-[220px]">
                      {item.sourceName} → {item.sizeLabel}
                    </span>
                    <span
                      className={
                        item.status === 'done'
                          ? 'text-emerald-300'
                          : item.status === 'processing'
                          ? 'text-amber-300'
                          : item.status === 'error'
                          ? 'text-rose-300'
                          : 'text-slate-400'
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 border-t border-slate-800 pt-2">
              <button
                disabled={!zipBlob || !allDone}
                onClick={handleDownloadZip}
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  !zipBlob || !allDone
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                <Download className="w-4 h-4" />
                Download ZIP
              </button>
              <p className="mt-1 text-sm text-slate-500">
                ZIP includes all resized files, grouped by original filename.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// App shell with router and top bar
function AppShell() {
  return (
    <Router>
      <SplashOverlay />
      <nav className="h-12 border-b border-slate-900 bg-slate-950 flex items-center">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-purple-500 via-emerald-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              LDD
            </div>
            <span className="text-xs font-semibold text-slate-100">
              LDDTools.lol
            </span>
          </Link>
          <div className="text-xs text-slate-500">
            White card hub · /resize for Bulk POD Resizer
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resize" element={<BulkResizerPage />} />
      </Routes>
    </Router>
  )
}

export default AppShell
