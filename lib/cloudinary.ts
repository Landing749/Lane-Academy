const CLOUD_NAME = 'damr6r9op';
const UPLOAD_PRESET = 'org-resources';

export const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}`;

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
  blur?: number;
}

/**
 * Build a Cloudinary URL from a public ID with optional transformations.
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    blur,
  } = options;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    crop && width ? `c_${crop}` : '',
    gravity ? `g_${gravity}` : '',
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    blur ? `e_blur:${blur}` : '',
  ]
    .filter(Boolean)
    .join(',');

  return `${CLOUDINARY_BASE}/image/upload/${transforms}/${publicId}`;
}

/**
 * Generate a tiny blurred placeholder for lazy loading.
 */
export function buildBlurPlaceholder(publicId: string): string {
  return buildCloudinaryUrl(publicId, {
    width: 20,
    height: 14,
    quality: 30,
    blur: 400,
  });
}

/**
 * Generate a srcset string for responsive images.
 */
export function buildSrcSet(publicId: string, widths: number[] = [400, 800, 1200]): string {
  return widths
    .map((w) => `${buildCloudinaryUrl(publicId, { width: w })} ${w}w`)
    .join(', ');
}

export const UPLOAD_CONFIG = {
  cloudName: CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET,
};
