import { ResizeOptions, ExportOptions, ResizeSize } from './types';

export const DEFAULT_INITIAL_SIZES: ResizeSize[] = [
  { id: 'pod-default-4500x5400', width: 4500, height: 5400, label: 'POD Default' },
  { id: 'tumbler-wrap-2790x2460', width: 2790, height: 2460, label: 'Tumbler Wrap' },
  { id: 'square-1024x1024', width: 1024, height: 1024, label: 'Square' },
  { id: 'standard-mockup-2000x1500', width: 2000, height: 1500, label: 'Standard Mockup' },
  { id: 'mug-swiftpod-2625x1050', width: 2625, height: 1050, label: '11oz Mug (SwiftPOD)' },
  { id: 'mug-district-2475x1156', width: 2475, height: 1156, label: '11oz Mug (District)' }
];

export const DEFAULT_RESIZE_OPTIONS: ResizeOptions = {
  mode: 'contain',
  maintainAspect: true,
  keepTransparency: true,
  convertJpgToPng: false,
  sharpen: false,
  padColor: '#ffffff'
};

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  asZip: true,
  folderStrategy: 'bySize'
};

export const DEFAULT_FILENAME_PATTERN = '{{basename}}_{{width}}x{{height}}';
