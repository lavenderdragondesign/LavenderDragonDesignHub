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
  Construction,
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
  const [fading, setFading] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const seen = window.localStorage.getItem('lddtools_splash_seen')
      if (!seen) setVisible(true)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = window.setTimeout(() => {
      setFading(true)
      window.setTimeout(() => {
        setVisible(false)
        try {
          window.localStorage.setItem('lddtools_splash_seen', '1')
        } catch {
          // ignore
        }
      }, 450)
    }, 1900)
    return () => window.clearTimeout(t)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center bg-white',
        'transition-opacity duration-500',
        fading ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="w-[560px] max-w-[95vw] px-8 py-10 rounded-3xl border border-[var(--ldd-border)] bg-white shadow-xl text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-3xl bg-[var(--ldd-green-soft)] border-2 border-[var(--ldd-green)] flex items-center justify-center text-2xl font-black text-[var(--ldd-green-dark)]">
          LDD
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          LDDTools.lol
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Loading creative tools…
        </p>

        <div className="mt-7 text-sm text-slate-600">
          (This splash only shows once per browser.)
        </div>
      </div>
    </div>
  )
}


// Landing page
function LandingPage() {
  const navigate = useNavigate()

  const tools: {
    id: string
    title: string
    desc: string
    icon: React.ReactNode
    route: string
    enabled: boolean
  }[] = [
    {
      id: 'resize',
      title: 'Bulk Resizer',
      desc: 'Resize designs, inject 300 DPI, export clean packs.',
      icon: <Ruler className="w-7 h-7 text-[var(--ldd-green-dark)]" />,
      route: '/resize',
      enabled: true,
    },
    {
      id: 'upscale',
      title: 'LDD Upscaler',
      desc: 'Local-first upscaling for AI art + vectors.',
      icon: <ImageIcon className="w-7 h-7 text-slate-600" />,
      route: '#',
      enabled: false,
    },
    {
      id: 'grid',
      title: 'Grid Mockup Generator',
      desc: 'Etsy-ready bundle grids and mockups.',
      icon: <Grid3X3 className="w-7 h-7 text-slate-600" />,
      route: '#',
      enabled: false,
    },
    {
      id: 'pdf',
      title: 'Branded PDF Maker',
      desc: 'Pretty download inserts with logo + links.',
      icon: <FileText className="w-7 h-7 text-slate-600" />,
      route: '#',
      enabled: false,
    },
    {
      id: 'wintweak',
      title: 'LDD WinTweaker',
      desc: 'Windows performance presets tuned for AI + Affinity.',
      icon: <MonitorCog className="w-7 h-7 text-slate-600" />,
      route: '#',
      enabled: false,
    },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          LDD Tools Hub
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl">
          Pick a tool and go make money. (Or at least make pixels behave.)
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (!tool.enabled) return
                navigate(tool.route)
              }}
              className={[
                'relative text-left rounded-3xl border p-6 flex flex-col justify-between',
                'w-[320px] h-[320px]',
                tool.enabled
                  ? 'bg-white border-[var(--ldd-border)] hover:shadow-xl hover:border-[var(--ldd-green)] transition cursor-pointer'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
              ].join(' ')}
            >
              {!tool.enabled && (
                <div className="absolute inset-0 rounded-3xl bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Construction className="w-10 h-10 text-gray-400" />
                  <span className="text-sm font-extrabold uppercase tracking-wider text-gray-500">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={[
                    'shrink-0 rounded-2xl p-3 border',
                    tool.enabled
                      ? 'bg-[var(--ldd-green-soft)] border-[var(--ldd-green)]'
                      : 'bg-white border-gray-200',
                  ].join(' ')}
                >
                  {tool.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {tool.title}
                  </h2>
                  <p className="mt-2 text-base text-slate-600 leading-snug">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div
                  className={[
                    'w-full rounded-2xl px-5 py-4 text-base font-extrabold text-center',
                    tool.enabled
                      ? 'bg-[var(--ldd-green)] text-white hover:bg-[var(--ldd-green-dark)] transition'
                      : 'bg-gray-300 text-gray-500',
                  ].join(' ')}
                >
                  {tool.enabled ? 'Open Tool' : 'Unavailable'}
                </div>
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
    <div className="min-h-[calc(100vh-56px)] bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[var(--ldd-green-soft)] border-2 border-[var(--ldd-green)] flex items-center justify-center">
              <Ruler className="w-6 h-6 text-[var(--ldd-green-dark)]" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Bulk Resizer
              </h1>
              <p className="mt-2 text-lg text-slate-600 max-w-2xl">
                Drop multiple images once, export every size you need into one ZIP.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="shrink-0 rounded-2xl border border-[var(--ldd-border)] bg-white px-5 py-3 text-base font-bold text-slate-900 hover:bg-gray-50 transition"
        >
          ← Back to hub
        </Link>
      </div>

      <div className="pb-12">
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

  

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function crc32(buf: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint32BE(buf: Uint8Array, offset: number, value: number) {
  buf[offset] = (value >>> 24) & 0xff;
  buf[offset + 1] = (value >>> 16) & 0xff;
  buf[offset + 2] = (value >>> 8) & 0xff;
  buf[offset + 3] = value & 0xff;
}

function injectPngDpi(bytes: Uint8Array, dpi: number): Uint8Array {
  const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== PNG_SIG[i]) return bytes;
  }
  const ppu = Math.round(dpi * 39.3701); // pixels per meter
  let offset = 8;
  let physOffset = -1;
  let insertAfter = -1;

  while (offset + 8 < bytes.length) {
    const length =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3];
    const typeOffset = offset + 4;
    const dataOffset = offset + 8;
    const type = String.fromCharCode(
      bytes[typeOffset],
      bytes[typeOffset + 1],
      bytes[typeOffset + 2],
      bytes[typeOffset + 3],
    );
    if (type === "IHDR") {
      insertAfter = offset + 8 + length + 4; // after IHDR (len+type+data+crc)
    } else if (type === "pHYs") {
      physOffset = offset;
      break;
    }
    offset = offset + 8 + length + 4;
  }

  if (physOffset !== -1) {
    const out = bytes.slice();
    const dataOffset = physOffset + 8;
    writeUint32BE(out, dataOffset, ppu);
    writeUint32BE(out, dataOffset + 4, ppu);
    out[dataOffset + 8] = 1; // unit: meter
    const typeAndData = out.slice(physOffset + 4, physOffset + 4 + 4 + 9);
    const crc = crc32(typeAndData);
    writeUint32BE(out, physOffset + 8 + 9, crc);
    return out;
  }

  if (insertAfter === -1) return bytes;

  const chunkData = new Uint8Array(9);
  writeUint32BE(chunkData, 0, ppu);
  writeUint32BE(chunkData, 4, ppu);
  chunkData[8] = 1;
  const chunkType = new Uint8Array([112, 72, 89, 115]); // "pHYs"
  const typeAndData = new Uint8Array(4 + chunkData.length);
  typeAndData.set(chunkType, 0);
  typeAndData.set(chunkData, 4);
  const crc = crc32(typeAndData);

  const chunk = new Uint8Array(4 + 4 + 9 + 4);
  writeUint32BE(chunk, 0, 9);
  chunk.set(chunkType, 4);
  chunk.set(chunkData, 8);
  writeUint32BE(chunk, 8 + 9, crc);

  const before = bytes.slice(0, insertAfter);
  const after = bytes.slice(insertAfter);
  const out = new Uint8Array(before.length + chunk.length + after.length);
  out.set(before, 0);
  out.set(chunk, before.length);
  out.set(after, before.length + chunk.length);
  return out;
}

function injectJpegDpi(bytes: Uint8Array, dpi: number): Uint8Array {
  // minimal JFIF handler
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return bytes; // not JPEG
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (marker === 0xe0) {
      const id = String.fromCharCode(
        bytes[offset + 4],
        bytes[offset + 5],
        bytes[offset + 6],
        bytes[offset + 7],
        bytes[offset + 8],
      );
      if (id === "JFIF\0") {
        const out = bytes.slice();
        const unitsOffset = offset + 9; // after "JFIF\0" + version(2)
        const xDenOffset = unitsOffset + 1;
        const yDenOffset = unitsOffset + 3;
        out[unitsOffset] = 1; // dots per inch
        out[xDenOffset] = (dpi >> 8) & 0xff;
        out[xDenOffset + 1] = dpi & 0xff;
        out[yDenOffset] = (dpi >> 8) & 0xff;
        out[yDenOffset + 1] = dpi & 0xff;
        return out;
      }
    }
    if (length < 2) break;
    offset += 2 + length;
  }
  return bytes;
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

          // Simple stretch to target size
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

          const quality = asFormat === 'image/jpeg' ? 0.92 : undefined
          const dataUrl = canvas.toDataURL(asFormat, quality as any)
          const base64 = dataUrl.split(',')[1]
          let bytes = base64ToBytes(base64)

          if (tag300dpi) {
            if (asFormat === 'image/png') {
              bytes = injectPngDpi(bytes, 300)
            } else {
              bytes = injectJpegDpi(bytes, 300)
            }
          }

          const blob = new Blob([bytes], { type: asFormat })
          resolve(blob)
        } catch (err) {
          reject(err as Error)
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
    <div className="max-w-6xl mx-auto px-6 pb-12">
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
            className="text-base px-4 py-2 rounded-2xl border border-[var(--ldd-border)] text-slate-700 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition"
          >
            Clear all images
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-3">
          <div className="rounded-3xl border border-[var(--ldd-border)] bg-white p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-slate-900">
              <Upload className="w-4 h-4 text-[var(--ldd-green-dark)]" />
              Upload Images
            </div>
            <button
              onClick={handleOpenFileDialog}
              className="w-full mt-3 border-2 border-dashed border-[var(--ldd-border)] rounded-3xl py-10 flex flex-col items-center justify-center gap-2 text-lg font-bold hover:border-[var(--ldd-green)] hover:bg-[var(--ldd-green-soft)] transition"
            >
              <Upload className="w-5 h-5 text-[var(--ldd-green-dark)]" />
              <span>Drag & drop into window or click to browse</span>
              <span className="text-sm text-slate-600">
                PNG or JPG • Multiple files allowed
              </span>
            </button>
            <p className="text-base text-slate-600 mt-2">
              Files added:{' '}
              <span className="text-[var(--ldd-green-dark)] font-medium">
                {sources.length}
              </span>
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--ldd-border)] bg-white p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">Output Sizes</span>
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
                  className="px-2 py-1 rounded-full border border-[var(--ldd-border)] bg-white hover:border-[var(--ldd-green)] text-left"
                >
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-xs text-slate-600">
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
                className="w-28 px-4 py-3 rounded-2xl bg-white border-2 border-[var(--ldd-border)] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--ldd-green)]"
              />
              <span>x</span>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                placeholder="Height"
                className="w-28 px-4 py-3 rounded-2xl bg-white border-2 border-[var(--ldd-border)] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--ldd-green)]"
              />
              <button
                onClick={handleAddCustomSize}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--ldd-green)] text-white text-lg font-extrabold hover:bg-[var(--ldd-green-dark)] transition"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>

            <div className="mt-1 flex flex-wrap gap-1">
              {sizes.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-[var(--ldd-border)] text-xs"
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
                <span className="text-sm text-slate-600">
                  Add at least one size to enable resizing.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--ldd-border)] bg-white p-8 space-y-4 shadow-sm text-sm">
            <div className="text-xs font-semibold text-slate-900">
              Options
            </div>

            <div className="flex items-center justify-between">
              <span>Format</span>
              <select
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as OutputFormat)
                }
                className="bg-white border-2 border-[var(--ldd-border)] rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--ldd-green)]"
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
                className="bg-white border-2 border-[var(--ldd-border)] rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--ldd-green)]"
              >
                <option value="transparent">Transparent</option>
                <option value="white">White</option>
              </select>
            </div>

            <button
              onClick={handleResizeAll}
              disabled={!hasImages || !hasSizes || isProcessing}
              className={`mt-4 w-full inline-flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-lg font-extrabold ${
                !hasImages || !hasSizes || isProcessing
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[var(--ldd-green)] text-white hover:bg-[var(--ldd-green-dark)]'
              }`}
            >
              <Zap className="w-6 h-6" />
              {isProcessing ? 'Processing...' : 'Resize All'}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="rounded-3xl border border-[var(--ldd-border)] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-lg font-extrabold text-slate-900 mb-2">
              <ImageIcon className="w-4 h-4 text-[var(--ldd-green-dark)]" />
              Selected Images
            </div>
            {sources.length === 0 ? (
              <p className="text-sm text-slate-600">
                No images yet. Add at least one file to begin.
              </p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className="flex items-center justify-between text-sm rounded-lg bg-white border border-[var(--ldd-border)] px-2 py-1.5"
                  >
                    <span className="truncate max-w-[200px]">
                      {src.name}
                    </span>
                    <span className="text-slate-600">
                      {src.width} x {src.height}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[var(--ldd-border)] bg-white p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900">
                Resize Queue
              </span>
              <button
                onClick={handleClearQueue}
                className="text-sm text-slate-600 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="flex-1 space-y-1 max-h-56 overflow-y-auto pr-1 text-sm">
              {queue.length === 0 && (
                <p className="text-sm text-slate-600">
                  Queue is empty. Click “Resize All” to generate tasks.
                </p>
              )}

              {queue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-white border border-[var(--ldd-border)] px-2 py-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate max-w-[220px]">
                      {item.sourceName} → {item.sizeLabel}
                    </span>
                    <span
                      className={
                        item.status === 'done'
                          ? 'text-[var(--ldd-green-dark)]'
                          : item.status === 'processing'
                          ? 'text-amber-300'
                          : item.status === 'error'
                          ? 'text-rose-300'
                          : 'text-slate-600'
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 border-t border-[var(--ldd-border)] pt-2">
              <button
                disabled={!zipBlob || !allDone}
                onClick={handleDownloadZip}
                className={`w-full inline-flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-lg font-extrabold ${
                  !zipBlob || !allDone
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[var(--ldd-green)] text-white hover:bg-[var(--ldd-green-dark)]'
                }`}
              >
                <Download className="w-6 h-6" />
                Download ZIP
              </button>
              <p className="mt-1 text-sm text-slate-600">
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
      <nav className="h-14 border-b border-[var(--ldd-border)] bg-white flex items-center">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--ldd-green-soft)] border-2 border-[var(--ldd-green)] flex items-center justify-center text-sm font-black text-[var(--ldd-green-dark)]">
              LDD
            </div>
            <span className="text-base font-extrabold text-slate-900">
              LDDTools.lol
            </span>
          </Link>
          <div className="hidden sm:block text-sm text-slate-500">
            White UI · Green buttons · Resizer is live
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
