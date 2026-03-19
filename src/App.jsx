import { useEffect, useState, useRef } from "react";
import {
  FileArchive, FileText, LayoutGrid, Maximize2,
  Wand2, Puzzle, ExternalLink, Lock,
  Flame, ChevronRight
} from "lucide-react";

// ── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "resize",
    name: "Quick Resizer",
    desc: "Bulk resize images to any dimension with 300 DPI output. ZIP export ready.",
    url: "https://lddtools.lol/resize",
    icon: Maximize2,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.45)",
    tag: "Images",
  },
  {
    id: "compress",
    name: "Compress",
    desc: "Shrink file sizes without sacrificing quality. Fast, browser-based.",
    url: "https://lddtools.lol/compress",
    icon: FileArchive,
    accent: "#22d3ee",
    glow: "rgba(34,211,238,0.4)",
    tag: "Images",
  },
  {
    id: "upscale",
    name: "Upscale",
    desc: "AI-powered image upscaling. Enhance resolution and bring out fine detail.",
    url: null,
    icon: Wand2,
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.4)",
    tag: "Images",
    comingSoon: true,
  },
  {
    id: "grid",
    name: "Grid Mockup",
    desc: "Generate clean grid mockups for your designs. Perfect for POD previews.",
    url: "https://lddtools.lol/grid",
    icon: LayoutGrid,
    accent: "#fb923c",
    glow: "rgba(251,146,60,0.4)",
    tag: "Mockups",
  },
  {
    id: "pdf",
    name: "PDF Generator",
    desc: "Convert, merge and manipulate PDFs directly in the browser.",
    url: "https://lddtools.lol/pdf",
    icon: FileText,
    accent: "#34d399",
    glow: "rgba(52,211,153,0.4)",
    tag: "Files",
  },
  {
    id: "extension",
    name: "Extension",
    desc: "The LDD browser extension. Install to supercharge your design workflow.",
    url: "https://lddtools.lol/extension",
    icon: Puzzle,
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.4)",
    tag: "Browser",
  },
];

const TAGS = ["All", ...Array.from(new Set(TOOLS.map((t) => t.tag)))];

// ── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:    #05050f;
    --bg1:   #0b0b1e;
    --bg2:   #10102a;
    --lav:   #9333ea;
    --lav2:  #a855f7;
    --lav3:  #c084fc;
    --border: rgba(147,51,234,0.22);
    --text:  #ddd0f5;
    --muted: #6b5f87;
  }

  body {
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Particles ── */
  @keyframes rise {
    0%   { transform: translateY(100vh) scale(0); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 0.5; }
    100% { transform: translateY(-12vh) scale(1.2); opacity: 0; }
  }
  .particle {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    animation: rise linear infinite;
  }

  /* ── Mesh background ── */
  .mesh {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(147,51,234,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 80%, rgba(168,85,247,0.09) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99,21,133,0.06) 0%, transparent 70%);
  }

  /* ── Logo glow ── */
  @keyframes logoPulse {
    0%,100% { box-shadow: 0 0 25px rgba(168,85,247,0.5), 0 0 60px rgba(147,51,234,0.2); }
    50%     { box-shadow: 0 0 40px rgba(168,85,247,0.7), 0 0 90px rgba(147,51,234,0.35); }
  }

  /* ── Title shimmer ── */
  @keyframes shimmerText {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .title-shimmer {
    background: linear-gradient(90deg, #c084fc 0%, #e879f9 30%, #f0abfc 50%, #a855f7 70%, #c084fc 100%);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmerText 4s linear infinite;
  }

  /* ── Card ── */
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .tool-card {
    background: var(--bg1);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 26px 24px 22px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    animation: cardIn 0.5s ease both;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: var(--text);
  }
  .tool-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at 30% 0%, var(--card-glow, rgba(168,85,247,0.12)), transparent 65%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .tool-card:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: var(--card-accent, var(--lav2));
    box-shadow: 0 8px 40px var(--card-glow, rgba(168,85,247,0.3)), 0 2px 12px rgba(0,0,0,0.5);
  }
  .tool-card:hover::before { opacity: 1; }

  /* ── Icon ring ── */
  .icon-ring {
    width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: box-shadow 0.3s;
  }
  .tool-card:hover .icon-ring {
    box-shadow: 0 0 20px var(--card-glow, rgba(168,85,247,0.5));
  }

  /* ── Tag pill ── */
  .tag-pill {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 99px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.7px; text-transform: uppercase;
    border: 1px solid; opacity: 0.8;
  }

  /* ── Filter tabs ── */
  .filter-btn {
    padding: 7px 16px; border-radius: 99px; font-size: 12px; font-weight: 600;
    border: 1.5px solid var(--border); background: transparent; color: var(--muted);
    cursor: pointer; font-family: 'Outfit', sans-serif;
    transition: all 0.2s ease;
  }
  .filter-btn.active, .filter-btn:hover {
    background: rgba(147,51,234,0.15);
    border-color: var(--lav2);
    color: var(--lav3);
    box-shadow: 0 0 12px rgba(147,51,234,0.2);
  }

  /* ── External link arrow ── */
  .arrow-wrap {
    margin-top: auto;
    display: flex; align-items: center; justify-content: space-between;
  }
  .launch-btn {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    opacity: 0.6; transition: opacity 0.2s, transform 0.2s;
  }
  .tool-card:hover .launch-btn {
    opacity: 1;
    transform: translateX(3px);
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(147,51,234,0.35); border-radius: 99px; }

  /* ── Divider line ── */
  .grad-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(232,121,249,0.3), transparent);
  }
`;

// ── Particles ─────────────────────────────────────────────────────────────────
function Particles() {
  const pts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    dur: Math.random() * 10 + 12,
    color: ["rgba(168,85,247,0.5)", "rgba(232,121,249,0.4)", "rgba(129,140,248,0.4)"][Math.floor(Math.random()*3)],
  }));
  return (
    <>
      {pts.map((p) => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: `${p.left}%`,
          background: `radial-gradient(circle, ${p.color}, transparent 70%)`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.dur}s`,
        }} />
      ))}
    </>
  );
}

// ── Tool Card ─────────────────────────────────────────────────────────────────
function ToolCard({ tool, delay }) {
  const Icon = tool.icon;
  const soon = tool.comingSoon;
  const accent = soon ? "#555577" : tool.accent;
  const glow   = soon ? "rgba(80,80,120,0.2)" : tool.glow;

  const inner = (
    <>
      {soon && (
        <div style={{
          position: "absolute", top: 14, right: -22,
          background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
          color: "#e9d5ff", fontSize: 9, fontWeight: 800,
          letterSpacing: 1.5, textTransform: "uppercase",
          padding: "4px 32px", transform: "rotate(35deg)",
          boxShadow: "0 2px 10px rgba(109,40,217,0.4)",
        }}>
          Soon
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="icon-ring" style={{
          background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
          border: `1.5px solid ${accent}44`,
          opacity: soon ? 0.55 : 1,
        }}>
          {soon ? <Lock size={20} color={accent} strokeWidth={1.8} /> : <Icon size={22} color={accent} strokeWidth={1.8} />}
        </div>
        <span className="tag-pill" style={{
          color: accent,
          borderColor: `${accent}44`,
          background: `${accent}11`,
          opacity: soon ? 0.6 : 1,
        }}>
          {tool.tag}
        </span>
      </div>
      <div style={{ opacity: soon ? 0.5 : 1 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: soon ? "#9988bb" : "#e8d8ff", marginBottom: 6 }}>{tool.name}</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{tool.desc}</p>
      </div>
      <div className="arrow-wrap">
        {soon ? (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#6d5a99", opacity: 0.7 }}>
            <Lock size={11} />
            <span>Coming Soon</span>
          </div>
        ) : (
          <div className="launch-btn" style={{ color: accent }}>
            <span>Open tool</span>
            <ExternalLink size={12} />
          </div>
        )}
        <ChevronRight size={16} color={accent} style={{ opacity: 0.3 }} />
      </div>
    </>
  );

  if (soon) {
    return (
      <div className="tool-card" style={{
        "--card-accent": accent, "--card-glow": glow,
        animationDelay: `${delay}s`, cursor: "default", opacity: 0.75,
      }}>
        {inner}
      </div>
    );
  }

  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card"
      style={{ "--card-accent": accent, "--card-glow": glow, animationDelay: `${delay}s` }}>
      {inner}
    </a>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!document.getElementById("ldd-hub-css")) {
      const s = document.createElement("style");
      s.id = "ldd-hub-css"; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  const visible = filter === "All" ? TOOLS : TOOLS.filter((t) => t.tag === filter);

  return (
    <div style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
      <div className="mesh" />
      <Particles />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 980, margin: "0 auto", padding: "0 24px 60px" }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header style={{ padding: "52px 0 40px", textAlign: "center" }}>
          {/* Logo badge */}
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: "0 auto 24px",
            background: "linear-gradient(135deg, #5b21b6, #7c3aed, #9333ea)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src="/logo.png" alt="LDD" style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 12 }} />
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: "var(--muted)", textTransform: "uppercase", marginBottom: 12 }}>
            Lavender Dragon Design
          </p>

          <h1 style={{ fontFamily: "Cinzel, serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.1, marginBottom: 14 }}>
            <span className="title-shimmer">Design Hub</span>
          </h1>

          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Your creative toolkit, all in one place. Launch any tool instantly.
          </p>

          <div className="grad-line" style={{ maxWidth: 500, margin: "0 auto" }} />
        </header>

        {/* ── Filter Tabs ────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {TAGS.map((tag) => (
            <button key={tag} className={`filter-btn${filter === tag ? " active" : ""}`} onClick={() => setFilter(tag)}>
              {tag}
            </button>
          ))}
        </div>

        {/* ── Grid ───────────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 18,
        }}>
          {visible.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} delay={i * 0.06} />
          ))}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer style={{ textAlign: "center", marginTop: 60, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--muted)", opacity: 0.6 }}>
            © {new Date().getFullYear()} Lavender Dragon Design · All tools open in a new tab
          </p>
        </footer>
      </div>
    </div>
  );
}
