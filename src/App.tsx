import logo from './assets/logo.png'
import './index.css'

type Card = {
  title: string
  desc: string
  href: string
  features: string[]
  badges?: string[]
  embedded?: boolean
}

const CARDS: Card[] = [
  {
    title: "LavenderDragonDesign's PDF Generator",
    desc: "Branded Etsy download PDFs with clickable buttons.",
    href: "/pdf",
    badges: ["★ NEW", "★ BRANDED CUSTOM PDF"],
    features: ["Drag & drop builder", "Clickable download button", "Print-ready export"],
  },
  {
    title: 'Grid Mockup Generator',
    desc: 'Listing preview grids that look pro.',
    href: '/grid',
    features: ['Smart layouts', 'Title banners', 'Quick exports'],
  },
  {
    title: 'Bulk Image Resizer',
    desc: 'Resize designs to POD-ready sizes.',
    href: '/resize',
    features: ['Batch resize', 'POD presets', 'Fast exports'],
  },
  {
    title: 'Image Compressor & Zip Splitter',
    desc: 'Compress big PNG bundles and auto-split zips for Etsy limits.',
    href: '/compress',
    badges: ['★ NEW'],
    features: [
      'One-click PNG compression',
      'Auto zip splitting (Part1ofX)',
      'Space-saved stats',
    ],
  },
  {
    title: 'AI Upscaler',
    desc: 'Upscale images for sharper prints.',
    href: '/upscale',
    badges: ['★ IN PROGRESS'],
    features: ['Enhance detail', 'Cleaner edges', 'Print-focused output'],
  },
  {
    title: 'Scripts',
    desc: 'Now built into LavenderDragonDesign Studio desktop app.',
    href: '/scripts',
    embedded: true,
    features: ['Launch inside Studio', 'No separate site needed', 'Use the desktop app'],
  },
  {
    title: 'Extension',
    desc: 'Now handled from LavenderDragonDesign Studio desktop app.',
    href: '/extension',
    embedded: true,
    features: ['Managed in Studio', 'Desktop-first workflow', 'Open from the app'],
  },
  {
    title: 'Enhancer Script',
    desc: 'Now embedded in LavenderDragonDesign Studio desktop app.',
    href: '/enhancerscript',
    embedded: true,
    features: ['Built into Studio', 'No separate launcher', 'Use the desktop app'],
  },
]

function EmbeddedBadge() {
  return (
    <div className="embeddedBadge" aria-label="Embedded in desktop app">
      <span className="embeddedIconCard" aria-hidden="true">←</span>
      <span>Embedded in LDD Studio desktop app</span>
    </div>
  )
}

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <img src={logo} alt="LavenderDragonDesign logo" className="logo" />
          <div className="brandText">
            <h1>LavenderDragonDesign Tools</h1>
            <p>All the LDD goodies in one place.</p>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="grid" aria-label="Tool launcher">
          {CARDS.map((c) => {
            const content = (
              <>
                {c.embedded && <EmbeddedBadge />}
                <h2>{c.title}</h2>
                <p className="desc">{c.desc}</p>
                <ul className="features">
                  {c.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {c.badges && c.badges.length > 0 && (
                  <div className="badges" aria-label="Badges">
                    {c.badges.map((b) => (
                      <span key={b} className="badge">{b}</span>
                    ))}
                  </div>
                )}
              </>
            )

            return c.embedded ? (
              <div key={c.href} className="card cardDisabled" aria-disabled="true">
                {content}
              </div>
            ) : (
              <a key={c.href} href={c.href} className="card">
                {content}
              </a>
            )
          })}
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} LavenderDragonDesign • 100% Free
      </footer>
    </div>
  )
}
