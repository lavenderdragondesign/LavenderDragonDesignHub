import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Coffee } from 'lucide-react'
import { TOOLS } from '../toolsConfig'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const primaryTools = TOOLS.filter(tool => tool.status !== 'lab')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand.ink text-white font-bold">
              L
            </span>
            <div className="leading-tight">
              <div className="font-semibold">LDDTools.lol</div>
              <div className="text-xs text-gray-500">Your POD + Etsy toolbox</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {primaryTools.map(tool => (
              <NavLink
                key={tool.id}
                to={tool.path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
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
            className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-3 py-1.5 text-xs font-medium hover:bg-amber-200"
          >
            <Coffee className="h-4 w-4" />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} LavenderDragonDesign</span>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hover:text-gray-700">
              Privacy
            </a>
            <a href="/terms" className="hover:text-gray-700">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
