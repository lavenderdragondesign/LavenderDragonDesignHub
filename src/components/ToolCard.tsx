import React from 'react'
import { Link } from 'react-router-dom'

export default function ToolCard({ icon, title, description, to, badge }:{
  icon: React.ReactNode, title: string, description: string, to: string, badge?: string
}) {
  return (
    <div className="relative rounded-card bg-white shadow-card p-6 hover:shadow-xl transition-shadow">
      {badge && <div className="absolute right-4 top-4 text-[10px] rounded-full bg-yellow-100 text-yellow-800 px-2 py-1">{badge}</div>}
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-5">{description}</p>
      <Link to={to} className="inline-flex rounded-xl bg-brand.ink text-white px-4 py-2 text-sm hover:opacity-95">Open Tool</Link>
    </div>
  )
}
