import React from 'react'
import { Link } from 'react-router-dom'

export default function ToolCard({
  icon,
  title,
  description,
  to,
  badge
}: {
  icon: React.ReactNode
  title: string
  description: string
  to: string
  badge?: string
}) {
  return (
    <div className="relative rounded-card bg-slate-900/90 border border-slate-700 shadow-card p-7 hover:border-slate-400/80 hover:shadow-2xl hover:shadow-slate-900/70 transition-all">
      {badge && (
        <div className="absolute right-4 top-4 text-[10px] uppercase tracking-wide rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/40 px-2 py-1">
          {badge}
        </div>
      )}
      <div className="mb-5 text-brand.neon">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-slate-50">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      <Link
        to={to}
        className="inline-flex rounded-xl bg-brand.neon text-slate-950 px-5 py-2.5 text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-transform shadow-md shadow-emerald-400/30"
      >
        Open tool
      </Link>
    </div>
  )
}
