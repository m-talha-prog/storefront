// Manual responsive-image helper — this is a Vite SPA (no Next.js `next/image`
// server-side pipeline), so optimization has to work with what the mock
// catalog actually gives us: fixed remote URLs from Unsplash and iStock.
//
// Unsplash's image API accepts a `w` query param and returns a resized,
// content-negotiated (`auto=format` → serves AVIF/WebP where supported)
// image — so for Unsplash URLs we can build a real `srcset` for free,
// without needing an image CDN or build-time processing of our own.
// iStock URLs bake a fixed size into the URL itself (`s=1024x1024`) and
// don't expose a documented resize param, so those safely fall back to a
// single `src` rather than guessing at an API we don't control.

const RESIZABLE_HOSTS = ['images.unsplash.com', 'plus.unsplash.com']

function isResizable(url) {
  try {
    return RESIZABLE_HOSTS.includes(new URL(url).hostname)
  } catch {
    return false
  }
}

function withWidth(url, width) {
  const next = new URL(url)
  next.searchParams.set('w', String(width))
  // Drop any baked-in height so the width param drives a proportionally
  // scaled image instead of a cropped one.
  next.searchParams.delete('h')
  return next.toString()
}

/**
 * Build `src`/`srcset`/`sizes` props for a remote product image.
 *
 * @param {string} url - the product's original image URL
 * @param {number[]} widths - candidate widths to generate, ascending
 * @param {string} sizes - the `sizes` attribute describing rendered width
 * @returns {{src: string, srcSet: string|undefined, sizes: string|undefined}}
 */
export function getResponsiveImageProps(url, widths, sizes) {
  if (!url || !isResizable(url)) {
    return { src: url, srcSet: undefined, sizes: undefined }
  }

  const srcSet = widths.map((width) => `${withWidth(url, width)} ${width}w`).join(', ')

  // Middle width as the fallback `src` for browsers that ignore srcset.
  const fallbackWidth = widths[Math.floor(widths.length / 2)]

  return {
    src: withWidth(url, fallbackWidth),
    srcSet,
    sizes,
  }
}

// Shared width ladders so callers stay consistent instead of picking
// arbitrary numbers per component.
export const CARD_IMAGE_WIDTHS = [160, 240, 320, 480]
export const THUMBNAIL_IMAGE_WIDTHS = [64, 96, 128]
export const GALLERY_IMAGE_WIDTHS = [400, 600, 800, 1000]