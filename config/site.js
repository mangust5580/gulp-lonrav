// config/site.js
// Publication environment settings (local / subdirectory hosting / etc.)
//
// Note: this config is intentionally data-only.
// Normalization is kept minimal and dependency-free.

const envUrl = (process.env.SITE_URL || '').trim()
const envBasePath = (process.env.SITE_BASE_PATH || '').trim()

const normalizeSiteUrl = (url) => String(url || '').trim().replace(/\/+$/g, '')

// basePath: '' or '/repo-name' (no trailing slash)
const normalizeBasePath = (basePath) => {
  let bp = String(basePath || '').trim()
  if (bp === '/') bp = ''
  if (bp && !bp.startsWith('/')) bp = `/${bp}`
  bp = bp.replace(/\/+$/g, '')
  return bp
}

export const site = {
  // Absolute URL is needed for sitemap/hreflang.
  // Examples:
  // - https://example.com
  // - https://example.com
  siteUrl: normalizeSiteUrl(envUrl || ''),

  // For subdirectory hosting project: '/repo-name'
  // For domain root: ''
  basePath: normalizeBasePath(envBasePath || ''),
}