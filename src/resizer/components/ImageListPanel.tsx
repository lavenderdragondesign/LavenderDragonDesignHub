import React from 'react';
import { UploadedImage } from '../types';

interface ImageListPanelProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
}

const ImageListPanel: React.FC<ImageListPanelProps> = ({ images, onRemove }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col gap-2 max-h-[360px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-100">Selected Images</span>
        <span className="text-[11px] text-slate-400">{images.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {images.length === 0 && (
          <p className="text-[11px] text-slate-500">No images uploaded yet.</p>
        )}
        {images.map(img => (
          <div
            key={img.id}
            className="flex items-center justify-between gap-2 rounded-lg bg-slate-800/70 px-2 py-1.5"
          >
            <div className="min-w-0">
              <p className="text-[11px] text-slate-100 truncate">{img.name}</p>
              <p className="text-[10px] text-slate-500">
                {img.width}×{img.height}
              </p>
            </div>
            <button
              className="text-[10px] text-rose-400 hover:text-rose-300"
              onClick={() => onRemove(img.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageListPanel;
