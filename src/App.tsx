import logo from './assets/logo.png'
import './index.css'

type Card = {
  title: string
  desc: string
  href: string
  features: string[]
}

const CARDS: Card[] = [
  {
    title: "LavenderDragonDesign's PDF Generator",
    desc: "Branded Etsy download PDFs with clickable buttons.",
    href: "/pdf",
    features: ["Drag & drop builder", "Clickable download button", "Print-ready export"],
  },
  {
    title: "MyDesigns Enhancer",
    desc: "Speed helpers for MyDesigns workflows.",
    href: "/md",
    features: ["Workflow shortcuts", "Less clicking, more doing", "Built for POD sellers"],
  },
  {
    title: "Bulk Image Resizer",
    desc: "Resize designs to POD-ready sizes.",
    href: "/resize",
    features: ["Batch resize", "Common POD presets", "Fast exports"],
  },
  {
    title: "AI Upscaler",
    desc: "Upscale images for sharper prints.",
    href: "/upscale",
    features: ["Enhance detail", "Cleaner edges", "Print-focused output"],
  },
  {
    title: "Prompt Engine",
    desc: "POD-safe prompts (fast + organized).",
    href: "/prompts",
    features: ["Prompt + negative blocks", "IP-safe focus", "Copy-ready outputs"],
  },
  {
    title: "Grid Mockup Generator",
    desc: "Listing preview grids that look pro.",
    href: "/grid",
    features: ["Smart layouts", "Title banners", "Quick exports"],
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
            <p>Pick a tool. Get stuff done. Repeat. ☕</p>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="grid" aria-label="Tool launcher">
          {CARDS.map((c) => (
            <a key={c.href} href={c.href} className="card">
              <div className="cardInner">
                <h2>{c.title}</h2>
                <p className="desc">{c.desc}</p>
                <ul className="features">
                  {c.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
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
