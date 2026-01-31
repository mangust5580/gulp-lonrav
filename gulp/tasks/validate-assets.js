// gulp/tasks/validate-assets.js
// Validates that asset references in the built HTML/CSS point to existing files.
// Designed for portfolio-quality static builds.
//
// Policy:
// - dev: warn by default (can be made strict via config)
// - build/preview: fail (never publish broken links)

import path from 'node:path'
import fs from 'node:fs/promises'

import { paths } from '#config/paths.js'
import { site } from '#config/site.js'
import { features } from '#config/features.js'
import { globSafe, stripQueryAndHash } from '#gulp/utils/glob.js'
import { stripBasePath as stripBasePathUrl } from '#gulp/utils/url-path.js'
import { logger } from '#gulp/utils/logger.js'

const isProbablyDynamic = (v) =>
  v.includes('{{') ||
  v.includes('{%') ||
  v.includes('<%') ||
  v.includes('${') ||
  v.includes('@@') // file-include markers

const isExternalLike = (v) => {
  const s = v.trim()
  if (!s) return true
  if (s.startsWith('#')) return true
  if (s.startsWith('data:')) return true
  if (s.startsWith('mailto:')) return true
  if (s.startsWith('tel:')) return true
  if (s.startsWith('javascript:')) return true
  if (s.startsWith('http://') || s.startsWith('https://')) return true
  if (s.startsWith('//')) return true
  return false
}


const safeDecodeUri = (v) => {
  // decodeURI is appropriate for full path-like values.
  // It can throw on malformed sequences; keep original in that case.
  if (!v.includes('%')) return v
  try {
    return decodeURI(v)
  } catch {
    return v
  }
}

const hasFileExtension = (v) => {
  const base = path.basename(v)
  return base.includes('.') && !base.endsWith('.')
}


const isRouteLike = (ref) => {
  if (!ref) return false
  if (ref === '/') return true
  if (ref.endsWith('/')) return true
  // No explicit extension => likely a page route (e.g. "/about" or "about")
  return !hasFileExtension(ref)
}

const shouldIgnoreRef = (ref, cfg, raw) => {
  const list = cfg?.ignore || []
  if (!Array.isArray(list) || !list.length) return false
  const haystacks = [String(ref || '')]
  if (raw && raw !== ref) haystacks.push(String(raw))
  return list.some((rule) => {
    if (!rule) return false
    const s = String(rule)
    if (s.startsWith('/') && s.endsWith('/') && s.length > 2) {
      try {
        const re = new RegExp(s.slice(1, -1))
        return haystacks.some(h => re.test(h))
      } catch {
        return false
      }
    }
    return haystacks.some(h => h.includes(s))
  })
}

const normalizeRef = (raw) => {
  let v = String(raw || '').trim()
  if (!v) return ''
  v = v.replace(/\\/g, '/')
  v = stripQueryAndHash(v)
  v = safeDecodeUri(v)
  v = stripBasePathUrl(v, site.basePath)
  return v
}

const resolveOnDisk = (fromFile, ref) => {
  if (!ref) return null
  // Root-relative -> relative to out dir
  if (ref.startsWith('/')) return path.join(paths.out, ref.slice(1))
  // Relative -> relative to current file
  return path.resolve(path.dirname(fromFile), ref)
}

const parseHtmlRefs = (html) => {
  const out = []
  const attrRe = /\b(?:src|href|poster|xlink:href)=["']([^"']+)["']/gi
  const srcsetRe = /\bsrcset=["']([^"']+)["']/gi

  let m
  while ((m = attrRe.exec(html))) out.push(m[1])
  while ((m = srcsetRe.exec(html))) {
    const list = m[1]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    for (const item of list) {
      const url = item.split(/\s+/)[0]
      if (url) out.push(url)
    }
  }
  return out
}

const parseCssRefs = (css) => {
  const out = []
  const urlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi
  let m
  while ((m = urlRe.exec(css))) out.push(m[2])
  return out
}

const existsFile = async (filePath) => {
  try {
    const st = await fs.stat(filePath)
    return st.isFile()
  } catch {
    return false
  }
}

const severityForStage = (stage) => {
  const q = features.quality || {}
  const cfg = q.validateAssets || {}
  if (cfg.enabled === false) return 'off'

  // Default policy:
  // - dev: warn
  // - build/preview: fail
  const def = stage === 'dev' ? 'warn' : 'fail'

  // Allow overriding dev to fail via config flag:
  // quality.validateAssets = { dev: 'warn'|'fail', build: 'fail', preview: 'fail' }
  const fromCfg =
    stage === 'dev'
      ? cfg.dev
      : stage === 'build'
        ? cfg.build
        : stage === 'buildFast'
          ? cfg.buildFast
          : stage === 'preview'
            ? cfg.preview
            : undefined

  return (fromCfg || def)
}

const getLinksMode = (cfg) => {
  const mode = String(cfg?.linksMode || 'off')
  if (['off', 'pretty', 'html', 'mixed'].includes(mode)) return mode
  return 'off'
}

const getRouteCandidates = (ref, cfg) => {
  const mode = getLinksMode(cfg)
  if (mode === 'off') return null

  // Root
  if (ref === '/') return ['/index.html']
  // Trailing slash implies a directory.
  if (ref.endsWith('/')) return [ref + 'index.html']

  // Only treat refs without an explicit file extension as routes.
  // ("/about" is a route; "/images/logo.png" is an asset.)
  if (hasFileExtension(ref)) return null

  // No extension: treat as route only when allowed.
  if (!cfg?.allowNoExt) return null

  if (mode === 'pretty') return [ref + '/index.html']
  if (mode === 'html') return [ref + '.html']

  // mixed
  const preferIndex = cfg?.preferIndex !== false
  return preferIndex
    ? [ref + '/index.html', ref + '.html']
    : [ref + '.html', ref + '/index.html']
}

const formatMissing = (items, limit = 30) => {
  const slice = items.slice(0, limit)
  const lines = slice
    .map((m) => {
      const refPart = m.raw && m.raw !== m.ref ? `"${m.raw}" → "${m.ref}"` : `"${m.ref}"`
      const where = m.from ? `${m.from}` : '(unknown)'
      const extra = m.checked ? ` (checked: ${m.checked})` : ''
      return `- ${where} → ${refPart} (expected: ${m.resolved})${extra}`
    })
    .join('\n')
  return lines + (items.length > limit ? `\n… and ${items.length - limit} more` : '')
}

export const createValidateAssetsTask = ({ stage }) => {
  const severity = severityForStage(stage)
  const cfg = features.quality?.validateAssets || {}
  const linksMode = getLinksMode(cfg)

  return async function validateAssetsTask() {
    if (severity === 'off') return

    const outDir = paths.out

    const htmlFiles = await globSafe([path.join(outDir, '**/*.html')])
    const cssFiles = await globSafe([path.join(outDir, '**/*.css')])

    const missing = []

    const pushMissing = (entry) => {
      missing.push({
        from: entry.from,
        raw: entry.raw,
        ref: entry.ref,
        expected: entry.expected,
        kind: entry.kind,
      })
    }

    for (const file of htmlFiles) {
      const html = await fs.readFile(file, 'utf-8')
      const refs = parseHtmlRefs(html)

      for (const raw of refs) {
        const ref = normalizeRef(raw)
        if (!ref) continue
        if (isExternalLike(ref)) continue
        if (isProbablyDynamic(raw) || isProbablyDynamic(ref)) continue
        if (shouldIgnoreRef(ref, cfg, raw)) continue
        if (linksMode === 'off' && isRouteLike(ref)) continue

        // Internal route validation (optional).
        // Allows enforcing a consistent URL strategy for static pages.
        // Controlled via config/features.js -> quality.validateAssets.linksMode
        if (linksMode !== 'off') {
          const candidates = getRouteCandidates(ref, cfg)
          if (candidates?.length) {
            const checked = candidates
              .map((c) => {
                const r = resolveOnDisk(file, c)
                return r ? path.relative(outDir, r) : null
              })
              .filter(Boolean)

            let ok = false
            for (const c of candidates) {
              const r = resolveOnDisk(file, c)
              if (r && (await existsFile(r))) {
                ok = true
                break
              }
            }
            if (!ok) {
              pushMissing({
                from: path.relative(outDir, file),
                raw,
                ref,
                expected: `one of: ${candidates.join(', ')} (checked: ${checked.join(', ')})`,
                kind: 'route',
              })
            }
            continue
          }
        }

        const resolved = resolveOnDisk(file, ref)
        if (!resolved) continue
        if (!(await existsFile(resolved))) {
          pushMissing({
            from: path.relative(outDir, file),
            raw,
            ref,
            expected: path.relative(outDir, resolved),
            kind: 'asset',
          })
        }
      }
    }

    for (const file of cssFiles) {
      const css = await fs.readFile(file, 'utf-8')
      const refs = parseCssRefs(css)

      for (const raw of refs) {
        const ref = normalizeRef(raw)
        if (!ref) continue
        if (isExternalLike(ref)) continue
        if (isProbablyDynamic(raw) || isProbablyDynamic(ref)) continue
        if (shouldIgnoreRef(ref, cfg, raw)) continue
        if (linksMode === 'off' && isRouteLike(ref)) continue

        const resolved = resolveOnDisk(file, ref)
        if (!resolved) continue
        if (!(await existsFile(resolved))) {
          pushMissing({
            from: path.relative(outDir, file),
            raw,
            ref,
            expected: path.relative(outDir, resolved),
            kind: 'asset',
          })
        }
      }
    }

    if (!missing.length) return

    const lines = missing
      .slice(0, 30)
      .map((m) => {
        const raw = String(m.raw ?? '')
        const normalized = String(m.ref ?? '')
        const showNorm = raw && raw !== normalized
        const where = `${m.from}`
        const what = showNorm ? `"${raw}" → "${normalized}"` : `"${normalized}"`
        const kind = m.kind ? `${m.kind}: ` : ''
        return `- ${where} → ${kind}${what} (expected: ${m.expected})`
      })
      .join('\n')

    const msg =
      `[assets] Missing referenced assets (${missing.length}). ` +
      `(stage=${stage}, out=${path.basename(outDir)}, basePath="${site.basePath || ''}", linksMode=${linksMode})\n` +
      lines +
      (missing.length > 30 ? `\n… and ${missing.length - 30} more` : '')

    if (severity === 'warn') {
      logger.warn('assets', msg)
      return
    }

    // fail
    throw new Error(msg)
  }
}
