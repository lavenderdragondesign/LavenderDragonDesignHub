import logo from './assets/logo.png'
import './index.css'

type Card = {
  title: string
  desc: string
  href: string
  features: string[]
  badges?: string[]
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
    title: "Grid Mockup Generator",
    desc: "Listing preview grids that look pro.",
    href: "/grid",
    features: ["Smart layouts", "Title banners", "Quick exports"],
  },
  {
    title: "Bulk Image Resizer",
    desc: "Resize designs to POD-ready sizes.",
    href: "/resize",
    features: ["Batch resize", "POD presets", "Fast exports"],
  },
  {
    title: "Image Compressor & Zip Splitter",
    desc: "Compress big PNG bundles and auto-split zips for Etsy limits.",
    href: "/compress",
    badges: ["★ NEW"],
    features: [
      "One-click PNG compression",
      "Auto zip splitting (Part1ofX)",
      "Space-saved stats",
    ],
  },
  {
    title: "AI Upscaler",
    desc: "Upscale images for sharper prints.",
    href: "/upscale",
    badges: ["★ IN PROGRESS"],
    features: ["Enhance detail", "Cleaner edges", "Print-focused output"],
  },
  {
    title: "Scripts",
    desc: "Launcher for LDD scripts and automation goodies.",
    href: "/scripts",
    features: ["Tools & scripts", "Quick access", "Always expanding"],
  },
  {
    title: "Extension",
    desc: "Browser extension home base.",
    href: "/extension",
    features: ["Install & updates", "Docs", "Quick links"],
  },
  {
    title: "Enhancer Script",
    desc: "Standalone enhancer script site.",
    href: "/enhancerscript",
    features: ["Latest version", "Install steps", "Changelog"],
  },
]

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
          {CARDS.map((c) => (
            <a key={c.href} href={c.href} className="card">
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
            </a>
          ))}
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} LavenderDragonDesign • 100% Free
      </footer>
    </div>
  )
}
