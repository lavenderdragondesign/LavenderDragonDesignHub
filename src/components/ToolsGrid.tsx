import React from 'react';
import { Link } from 'react-router-dom';

const ToolsGrid: React.FC = () => {
  const tools = [
    {
      name: 'Bulk Resizer',
      description: 'Resize images into multiple POD & mockup sizes, with ZIP export and custom presets.',
      to: '/resizer',
      status: 'Live'
    },
    {
      name: 'Grid Mockup Generator',
      description: 'Generate product grids and previews. (Planned)',
      to: '#',
      status: 'Coming soon'
    },
    {
      name: 'LDD Upscaler',
      description: 'Local/online AI upscaling for clean, crisp artwork. (Planned)',
      to: '#',
      status: 'Coming soon'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map(tool => (
        <div
          key={tool.name}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{tool.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">
                {tool.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">{tool.description}</p>
          </div>
          <div className="mt-4">
            {tool.to === '#' ? (
              <span className="text-[11px] text-slate-500">Coming soon</span>
            ) : (
              <Link
                to={tool.to}
                className="inline-flex items-center text-[11px] text-lddemerald hover:underline"
              >
                Open tool
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsGrid;
