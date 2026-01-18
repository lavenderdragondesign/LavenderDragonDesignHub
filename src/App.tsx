import { useMemo, useState } from 'react'

type Tool = {
  name: string
  description: string
  url: string
  emoji?: string
  badge?: 'NEW' | 'BETA'
  category?: string
}

const TOOLS: Tool[] = [
  {
    name: "LavenderDragonDesign's PDF Generator",
    description: 'Create professional download PDFs for Etsy customers.',
    url: 'https://your-pdf-maker.netlify.app',
    emoji: '🧾',
    badge: 'BETA',
    category: 'Etsy',
  },
  {
    name: 'Bulk Image Resizer',
    description: 'Resize designs to POD-ready sizes in seconds.',
    url: 'https://your-resizer.netlify.app',
    emoji: '🖼️',
    category: 'POD',
  },
  {
    name: 'AI Upscaler',
    description: 'Upscale images for print with better detail.',
    url: 'https://your-upscaler.netlify.app',
    emoji: '✨',
    category: 'POD',
  },
  {
    name: 'Prompt Engine',
    description: 'Generate POD-safe prompts fast.',
    url: 'https://your-prompt-engine.netlify.app',
    emoji: '🧠',
    category: 'AI',
  },
  {
    name: 'Grid Mockup Generator',
    description: 'Create Etsy listing preview grids quickly.',
    url: 'https://your-grid.netlify.app',
    emoji: '🧩',
    category: 'Mockups',
  },
]

function openTool(url: string, newTab: boolean) {
  if (newTab) window.open(url, '_blank', 'noopener,noreferrer')
  else window.location.href = url
}

export default function App() {
  const [q, setQ] = useState('')
  const [openInNewTab, setOpenInNewTab] = useState(true)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return TOOLS
    return TOOLS.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      (t.category ?? '').toLowerCase().includes(term)
    )
  }, [q])

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <img src="/src/assets/logo.png" alt="LavenderDragonDesign logo" className="logo" />
          <div>
            <h1>LavenderDragonDesign Tools</h1>
            <p>One page. Big buttons. Zero fluff.</p>
          </div>
        </div>

        <div className="controls">
          <input
            className="search"
            placeholder="Search tools…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />

          <label className="toggle">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={e => setOpenInNewTab(e.target.checked)}
            />
            Open in new tab
          </label>
        </div>
      </header>

      <main className="grid">
        {filtered.map(tool => (
          <button
            key={tool.url}
            className="card"
            onClick={() => openTool(tool.url, openInNewTab)}
          >
            <div className="emoji">{tool.emoji}</div>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <span className="go">Open →</span>
          </button>
        ))}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} LavenderDragonDesign • 100% Free
      </footer>
    </div>
  )
}
