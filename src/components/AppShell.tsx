import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Coffee } from 'lucide-react'
import { TOOLS } from '../toolsConfig'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const primaryTools = TOOLS.filter(tool => tool.status !== 'lab')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand.ink text-white font-bold text-xl shadow-md shadow-slate-900/60">
              L
            </span>
            <div className="leading-tight">
              <div className="font-semibold text-base">LDDTools.lol</div>
              <div className="text-[11px] text-slate-400">Your POD · Etsy · System toolbox</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            {primaryTools.map(tool => (
              <NavLink
                key={tool.id}
                to={tool.path}
                className={({ isActive }) =>
                  [
                    'transition-colors',
                    isActive
                      ? 'text-brand.neon font-semibold'
                      : 'text-slate-300 hover:text-white'
                  ].join(' ')
                }
              >
                {tool.shortName ?? tool.name}
              </NavLink>
            ))}
          </nav>

          <a
            href="https://www.buymeacoffee.com/lavenderdragon"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400/90 text-slate-950 px-3.5 py-1.5 text-xs font-semibold shadow-md shadow-amber-500/40 hover:bg-amber-300"
          >
            <Coffee className="h-4 w-4" />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/95">
        <div className="mx-auto max-w-6xl px-5 py-5 text-[11px] text-slate-500 flex items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} LavenderDragonDesign</span>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hover:text-slate-300">
              Privacy
            </a>
            <a href="/terms" className="hover:text-slate-300">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
