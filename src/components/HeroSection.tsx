import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
          LDDTools.lol
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl">
          A focused toolkit for image-heavy workflows: batch resizing, mockups, upscaling,
          and more. Built by LavenderDragonDesign for real POD and dev pipelines.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/resizer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lddpurple text-sm font-medium shadow-lg shadow-lddpurple/40 hover:bg-lddpurple/90"
          >
            Open Bulk Resizer
          </Link>
          <a
            href="https://www.buymeacoffee.com/lavenderdragon"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-200 hover:border-lddemerald/70 hover:text-white"
          >
            Support the tools
          </a>
        </div>
      </div>
      <div className="w-full lg:w-80 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs text-slate-300">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">
          Current Highlight
        </p>
        <p className="text-sm font-semibold text-white">Bulk Resizer v1</p>
        <p>
          Resize multiple images into POD-ready sizes in one pass. Includes presets for
          POD Default, tumblers, mugs & mockups plus custom sizes and ZIP export.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
