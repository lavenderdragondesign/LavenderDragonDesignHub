import React, { useState } from 'react';
import {
  DEFAULT_INITIAL_SIZES,
  DEFAULT_EXPORT_OPTIONS,
  DEFAULT_FILENAME_PATTERN,
  DEFAULT_RESIZE_OPTIONS
} from './constants';
import {
  AppStatus,
  ExportOptions,
  ProgressState,
  ResizeOptions,
  ResizeSize,
  UploadedImage
} from './types';
import UploadSection from './components/UploadSection';
import ImageListPanel from './components/ImageListPanel';
import SizesAndOptions from './components/SizesAndOptions';
import { createZipExport } from './services/zipService';

const BulkResizer: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [allSizes, setAllSizes] = useState<ResizeSize[]>(DEFAULT_INITIAL_SIZES);
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([
    'pod-default-4500x5400'
  ]);
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>(DEFAULT_RESIZE_OPTIONS);
  const [exportOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);
  const [filenamePattern, setFilenamePattern] = useState<string>(DEFAULT_FILENAME_PATTERN);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [progress, setProgress] = useState<ProgressState>({
    current: 0,
    total: 0,
    message: ''
  });

  const handleImagesAdded = (newImages: UploadedImage[]) => {
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id != id));
  };

  const toggleSize = (id: string) => {
    setSelectedSizeIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const addCustomSize = (width: number, height: number) => {
    const id = `custom-${width}x${height}-${Date.now()}`;
    const newSize: ResizeSize = { id, width, height, label: 'Custom' };
    setAllSizes(prev => [...prev, newSize]);
    setSelectedSizeIds(prev => [...prev, id]);
  };

  const canExport = images.length > 0 && selectedSizeIds.length > 0 && status !== 'processing';

  const handleExport = async () => {
    if (!canExport) return;
    const sizes = allSizes.filter(s => selectedSizeIds.includes(s.id));
    if (sizes.length === 0) return;

    setStatus('processing');
    setProgress({ current: 0, total: images.length * sizes.length, message: 'Starting…' });
    try {
      const blob = await createZipExport(
        images,
        sizes,
        resizeOptions,
        exportOptions,
        filenamePattern,
        (p: ProgressState) => setProgress(p)
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ldd-bulk-resizer.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('completed');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs text-slate-300">
            {images.length === 0
              ? 'No images yet. Start by uploading PNG or JPG files.'
              : `${images.length} image${images.length === 1 ? '' : 's'} loaded.`}
          </p>
          <p className="text-[11px] text-slate-500">
            {selectedSizeIds.length} size{selectedSizeIds.length === 1 ? '' : 's'} selected.
          </p>
        </div>
        <button
          type="button"
          disabled={!canExport}
          onClick={handleExport}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            canExport
              ? 'bg-lddpurple text-white shadow-lg shadow-lddpurple/40 hover:bg-lddpurple/90'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {status === 'processing' ? 'Processing…' : 'Export ZIP'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] gap-4 h-full">
          <div className="flex flex-col gap-4">
            <UploadSection onImagesAdded={handleImagesAdded} />
            <ImageListPanel images={images} onRemove={handleRemoveImage} />
          </div>
          <SizesAndOptions
            allSizes={allSizes}
            selectedSizeIds={selectedSizeIds}
            onToggleSize={toggleSize}
            onAddCustomSize={addCustomSize}
            resizeOptions={resizeOptions}
            onResizeOptionsChange={setResizeOptions}
            filenamePattern={filenamePattern}
            onFilenamePatternChange={setFilenamePattern}
          />
        </div>
      </div>

      {status === 'processing' && (
        <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3 text-xs">
          <div className="h-10 w-10 rounded-full border-2 border-slate-600 border-t-lddpurple animate-spin" />
          <p className="text-slate-200">{progress.message || 'Processing…'}</p>
          {progress.total > 0 && (
            <div className="w-64">
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-lddpurple"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((progress.current / progress.total) * 100)
                    )}%`
                  }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400 text-center">
                {progress.current} / {progress.total}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkResizer;
