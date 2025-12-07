import React, { ChangeEvent, DragEvent } from 'react';
import { UploadedImage } from '../types';

interface UploadSectionProps {
  onImagesAdded: (images: UploadedImage[]) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImagesAdded }) => {
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const arr = Array.from(files);
    const images: UploadedImage[] = [];

    for (const file of arr) {
      if (!file.type.startsWith('image/')) continue;

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      images.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        url
      });
    }

    onImagesAdded(images);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/60 px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div>
        <p className="text-sm font-medium text-white">Upload Images</p>
        <p className="text-xs text-slate-400">
          Drag & drop PNG/JPG files here or click the button to browse.
        </p>
      </div>
      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lddpurple text-xs sm:text-sm font-medium cursor-pointer shadow-md shadow-lddpurple/40 hover:bg-lddpurple/90">
        Browse files
        <input type="file" multiple className="hidden" onChange={onInputChange} />
      </label>
    </div>
  );
};

export default UploadSection;
