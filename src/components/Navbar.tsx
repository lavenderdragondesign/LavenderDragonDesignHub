import React from 'react';

export function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Lavender Dragon Design"
            className="h-9 w-9 rounded-full shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-200 tracking-wide">
              LDDTools.lol
            </span>
            <span className="text-[11px] text-slate-400">
              Lavender Dragon Design Tools Hub
            </span>
          </div>
        </a>
      </div>
    </header>
  );
}
