import React from 'react';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">LDDTools.lol</h1>
        <p className="text-slate-400">Your tool hub is ready.</p>
      </main>
    </div>
  );
}
