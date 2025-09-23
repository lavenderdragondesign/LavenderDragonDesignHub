import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Coffee } from 'lucide-react'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand.ink text-white font-bold">L</span>
            <div className="leading-tight">
              <div className="font-semibold">LDDTools.lol</div>
              <div className="text-xs text-gray-500">Your POD + Etsy toolbox</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/mockup" className={({isActive}) => isActive ? "text-brand.ink font-medium" : "text-gray-600 hover:text-gray-900"}>Mockup</NavLink>
            <NavLink to="/resizer" className={({isActive}) => isActive ? "text-brand.ink font-medium" : "text-gray-600 hover:text-gray-900"}>Resizer</NavLink>
            <NavLink to="/pdf" className={({isActive}) => isActive ? "text-brand.ink font-medium" : "text-gray-600 hover:text-gray-900"}>PDF</NavLink>
            <NavLink to="/extension" className={({isActive}) => isActive ? "text-brand.ink font-medium" : "text-gray-600 hover:text-gray-900"}>Extension</NavLink>
          </nav>
          <a href="https://www.buymeacoffee.com/lavenderdragon" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-brand.ink px-4 py-2 text-white text-sm shadow hover:opacity-95">
            <Coffee className="h-4 w-4" /> Buy Me a Coffee
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} LavenderDragonDesign</span>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hover:text-gray-700">Privacy</a>
            <a href="/terms" className="hover:text-gray-700">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
