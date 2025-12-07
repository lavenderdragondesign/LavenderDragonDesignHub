import JSZip from 'jszip';
import { UploadedImage, ResizeSize, ResizeOptions, ExportOptions, ProgressState } from '../resizer/types';
import { resizeImageToSize } from './imageProcessor';

export async function createZipExport(
  images: UploadedImage[],
  sizes: ResizeSize[],
  resizeOptions: ResizeOptions,
  exportOptions: ExportOptions,
  filenamePattern: string,
  onProgress?: (progress: ProgressState) => void
): Promise<Blob> {
  const zip = new JSZip();
  const total = images.length * sizes.length;
  let current = 0;

  const getBaseName = (name: string) => name.replace(/\.[^/.]+$/, '');

  for (const image of images) {
    for (const size of sizes) {
      current += 1;
      const message = `Rendering ${image.name} at ${size.width}x${size.height}`;
      if (onProgress) {
        onProgress({ current, total, message });
      }

      const blob = await resizeImageToSize(image, size, resizeOptions);

      const base = getBaseName(image.name);
      const replaced =
        filenamePattern
          .replace(/{{basename}}/g, base)
          .replace(/{{width}}/g, String(size.width))
          .replace(/{{height}}/g, String(size.height));

      const profileName = 'profile';
      const finalName = replaced.replace(/{{profile}}/g, profileName);

      const ext =
        image.file.type === 'image/jpeg' && !resizeOptions.convertJpgToPng
          ? 'jpg'
          : 'png';

      let path: string;
      if (exportOptions.folderStrategy === 'bySize') {
        path = `${size.width}x${size.height}/${finalName}.${ext}`;
      } else if (exportOptions.folderStrategy === 'byImage') {
        path = `${getBaseName(image.name)}/${finalName}.${ext}`;
      } else {
        path = `${finalName}.${ext}`;
      }

      zip.file(path, blob);
    }
  }

  if (onProgress) {
    onProgress({ current: total, total, message: 'Packing ZIP…' });
  }

  return await zip.generateAsync({ type: 'blob' });
}
