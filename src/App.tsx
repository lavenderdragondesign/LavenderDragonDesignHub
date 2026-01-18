import './index.css'

type Tool = {
  name: string
  description: string
  url: string
  emoji?: string
}

const TOOLS: Tool[] = [
  {
    name: "LavenderDragonDesign's PDF Generator",
    description: "Create branded download PDFs with clickable buttons and clean sections.",
    url: "https://lddpdf.netlify.app/",
    emoji: "🧾",
  },
]

function openTool(url: string) {
  window.location.href = url
}

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <img
            src="/src/assets/logo.png"
            alt="LavenderDragonDesign logo"
            className="logo"
          />
          <div className="brandText">
            <h1>LavenderDragonDesign Tools</h1>
            <p>Quick launcher for all your LDD apps.</p>
          </div>
        </div>
      </header>

      <main className="grid" aria-label="Tool links">
        {TOOLS.map((tool) => (
          <button
            key={tool.url}
            className="card"
            onClick={() => openTool(tool.url)}
            title={tool.url}
          >
            <div className="emoji" aria-hidden="true">{tool.emoji ?? "🔗"}</div>
            <div className="cardBody">
              <h2>{tool.name}</h2>
              <p>{tool.description}</p>
            </div>
            <div className="cardFooter">
              <span className="go">Open →</span>
              <span className="url">{tool.url.replace(/^https?:\/\//, "")}</span>
            </div>
          </button>
        ))}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} LavenderDragonDesign • 100% Free
      </footer>
    </div>
  )
}
