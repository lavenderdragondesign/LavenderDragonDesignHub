import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Mockup from './pages/Mockup'
import Resizer from './pages/Resizer'
import PdfBeta from './pages/PdfBeta'
import ExtensionTools from './pages/ExtensionTools'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mockup" element={<Mockup />} />
      <Route path="/resizer" element={<Resizer />} />
      <Route path="/pdf" element={<PdfBeta />} />
      <Route path="/extension" element={<ExtensionTools />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
