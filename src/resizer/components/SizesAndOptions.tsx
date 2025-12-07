import React, { useState } from 'react';
import { ResizeOptions, ResizeSize } from '../types';

interface SizesAndOptionsProps {
  allSizes: ResizeSize[];
  selectedSizeIds: string[];
  onToggleSize: (id: string) => void;
  onAddCustomSize: (width: number, height: number) => void;
  resizeOptions: ResizeOptions;
  onResizeOptionsChange: (opts: ResizeOptions) => void;
  filenamePattern: string;
  onFilenamePatternChange: (pattern: string) => void;
}

const SizesAndOptions: React.FC<SizesAndOptionsProps> = ({
  allSizes,
  selectedSizeIds,
  onToggleSize,
  onAddCustomSize,
  resizeOptions,
  onResizeOptionsChange,
  filenamePattern,
  onFilenamePatternChange
}) => {
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');

  const handleAddCustom = () => {
    const w = parseInt(customWidth, 10);
    const h = parseInt(customHeight, 10);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return;
    onAddCustomSize(w, h);
    setCustomWidth('');
    setCustomHeight('');
  };

  const updateOption = <K extends keyof ResizeOptions>(key: K, value: ResizeOptions[K]) => {
    onResizeOptionsChange({ ...resizeOptions, [key]: value });
  };

  const isSelected = (id: string) => selectedSizeIds.includes(id);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-100">Recommended Sizes</p>
            <p className="text-[11px] text-slate-500">
              Click to select the POD & mockup sizes you need.
            </p>
          </div>
          <span className="text-[11px] text-slate-400">
            {selectedSizeIds.length} selected
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {allSizes.map(size => (
            <button
              key={size.id}
              type="button"
              onClick={() => onToggleSize(size.id)}
              className={`text-left rounded-xl border px-3 py-2 transition text-xs ${
                isSelected(size.id)
                  ? 'border-lddpurple bg-lddpurple/20 text-white'
                  : 'border-slate-700 bg-slate-900 hover:border-lddpurple/60 hover:bg-slate-900/80'
              }`}
            >
              <p className="font-semibold">{size.label ?? 'Custom'}</p>
              <p className="text-[11px] text-slate-300">
                {size.width}×{size.height}
              </p>
            </button>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-800 mt-1 space-y-2">
          <p className="text-[11px] text-slate-300">Add custom size</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customWidth}
              onChange={e => setCustomWidth(e.target.value)}
              placeholder="Width"
              className="w-24 rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-[11px] text-slate-100"
            />
            <span className="text-[11px] text-slate-500">×</span>
            <input
              type="number"
              value={customHeight}
              onChange={e => setCustomHeight(e.target.value)}
              placeholder="Height"
              className="w-24 rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-[11px] text-slate-100"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="px-3 py-1 rounded-md bg-slate-800 text-[11px] text-slate-100 hover:bg-slate-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-100">Resize options</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <span className="w-24 text-slate-300">Mode</span>
              <select
                value={resizeOptions.mode}
                onChange={e => updateOption('mode', e.target.value as any)}
                className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-[11px]"
              >
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
                <option value="stretch">Stretch</option>
                <option value="pad">Pad</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={resizeOptions.maintainAspect}
                onChange={e => updateOption('maintainAspect', e.target.checked)}
                className="rounded border-slate-600 bg-slate-950"
              />
              <span>Maintain aspect ratio</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={resizeOptions.keepTransparency}
                onChange={e => updateOption('keepTransparency', e.target.checked)}
                className="rounded border-slate-600 bg-slate-950"
              />
              <span>Keep transparency (PNG)</span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={resizeOptions.convertJpgToPng}
                onChange={e => updateOption('convertJpgToPng', e.target.checked)}
                className="rounded border-slate-600 bg-slate-950"
              />
              <span>Convert JPG to PNG</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={resizeOptions.sharpen}
                onChange={e => updateOption('sharpen', e.target.checked)}
                className="rounded border-slate-600 bg-slate-950"
              />
              <span>Light sharpen (placeholder)</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-24 text-slate-300">Pad color</span>
              <input
                type="color"
                value={resizeOptions.padColor}
                onChange={e => updateOption('padColor', e.target.value)}
                className="w-10 h-7 rounded border border-slate-700 bg-slate-950"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-100">Filename pattern</p>
        <input
          type="text"
          value={filenamePattern}
          onChange={e => onFilenamePatternChange(e.target.value)}
          className="w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-[11px] text-slate-100"
        />
        <p className="text-[10px] text-slate-500">
          Use tokens: {{'{{basename}}'}}, {{'{{width}}'}}, {{'{{height}}'}}, {{'{{profile}}'}}.
        </p>
      </div>
    </div>
  );
};

export default SizesAndOptions;
