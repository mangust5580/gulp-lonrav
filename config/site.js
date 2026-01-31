const envUrl = (process.env.SITE_URL || '').trim()
const envBasePath = (process.env.SITE_BASE_PATH || '').trim()

const normalizeSiteUrl = (url) => String(url || '').trim().replace(/\/+$/g, '')

const normalizeBasePath = (basePath) => {
  let bp = String(basePath || '').trim()
  if (bp === '/') bp = ''
  if (bp && !bp.startsWith('/')) bp = `/${bp}`
  bp = bp.replace(/\/+$/g, '')
  return bp
}

export const site = {
  siteUrl: normalizeSiteUrl(envUrl || ''),
  basePath: normalizeBasePath(envBasePath || ''),
}