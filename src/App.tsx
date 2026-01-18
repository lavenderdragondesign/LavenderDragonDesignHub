import logo from './assets/logo.png'
import './index.css'

type Card = {
  title: string
  desc: string
  href: string
}

const CARDS: Card[] = [
  {
    title: "LavenderDragonDesign's PDF Generator",
    desc: "Branded Etsy download PDFs with clickable buttons.",
    href: "/pdf",
  },
  {
    title: "MyDesigns Enhancer",
    desc: "Speed helpers for MyDesigns workflows.",
    href: "/md",
  },
  {
    title: "Bulk Image Resizer",
    desc: "Resize designs to POD-ready sizes.",
    href: "/resize",
  },
  {
    title: "AI Upscaler",
    desc: "Upscale images for sharper prints.",
    href: "/upscale",
  },
  {
    title: "Prompt Engine",
    desc: "POD-safe prompts (fast + organized).",
    href: "/prompts",
  },
  {
    title: "Grid Mockup Generator",
    desc: "Listing preview grids that look pro.",
    href: "/grid",
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
                <p>{c.desc}</p>
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
