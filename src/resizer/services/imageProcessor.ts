import { UploadedImage, ResizeOptions, ResizeSize } from '../resizer/types';

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawImageToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  options: ResizeOptions
): HTMLCanvasElement {
  const canvas = createCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  if (!options.keepTransparency) {
    ctx.fillStyle = options.padColor || '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  const srcWidth = img.naturalWidth;
  const srcHeight = img.naturalHeight;
  let drawWidth = targetWidth;
  let drawHeight = targetHeight;
  let dx = 0;
  let dy = 0;

  const srcAspect = srcWidth / srcHeight;
  const targetAspect = targetWidth / targetHeight;

  if (options.mode === 'contain') {
    if (srcAspect > targetAspect) {
      drawWidth = targetWidth;
      drawHeight = targetWidth / srcAspect;
    } else {
      drawHeight = targetHeight;
      drawWidth = targetHeight * srcAspect;
    }
    dx = (targetWidth - drawWidth) / 2;
    dy = (targetHeight - drawHeight) / 2;
  } else if (options.mode === 'cover') {
    let scale = Math.max(targetWidth / srcWidth, targetHeight / srcHeight);
    drawWidth = srcWidth * scale;
    drawHeight = srcHeight * scale;
    dx = (targetWidth - drawWidth) / 2;
    dy = (targetHeight - drawHeight) / 2;
  } else if (options.mode === 'stretch') {
    drawWidth = targetWidth;
    drawHeight = targetHeight;
  } else if (options.mode === 'pad') {
    if (srcAspect > targetAspect) {
      drawWidth = targetWidth;
      drawHeight = targetWidth / srcAspect;
    } else {
      drawHeight = targetHeight;
      drawWidth = targetHeight * srcAspect;
    }
    dx = (targetWidth - drawWidth) / 2;
    dy = (targetHeight - drawHeight) / 2;
  }

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

  // Simple optional sharpen placeholder: real sharpen would require convolution.
  // Here we just leave it as-is to keep performance good.
  return canvas;
}

export async function resizeImageToSize(
  uploaded: UploadedImage,
  size: ResizeSize,
  options: ResizeOptions
): Promise<Blob> {
  const img = new Image();
  img.src = uploaded.url;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
  });

  const canvas = drawImageToCanvas(img, size.width, size.height, options);
  const mimeType =
    uploaded.file.type === 'image/jpeg' && !options.convertJpgToPng
      ? 'image/jpeg'
      : 'image/png';

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Failed to export canvas'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.92
    );
  });
}
