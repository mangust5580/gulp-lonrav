import path from 'node:path'
import fs from 'node:fs/promises'

import { globSafe, toPosix, isMatch } from '#gulp/utils/glob.js'
import { logger } from '#gulp/utils/logger.js'

let sharp

import { paths } from '#config/paths.js'
import { plugins } from '#config/plugins.js'
import { images } from '#config/images.js'
import { env } from '#gulp/utils/env.js'
import { lazyDefault } from '#gulp/utils/lazy.js'
import { notifyError } from '#gulp/utils/notify.js'

const outDir = path.join(paths.out, 'images')

async function asyncPool(limit, items, iteratorFn) {
  const ret = []
  const executing = new Set()

  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)
    executing.add(p)

    const clean = () => executing.delete(p)
    p.then(clean).catch(clean)

    if (executing.size >= limit) await Promise.race(executing)
  }

  return Promise.all(ret)
}

function makeExtSets(cfg) {
  const raster = new Set((cfg.extensions?.raster ?? []).map(e => e.toLowerCase()))
  const vector = new Set((cfg.extensions?.vector ?? []).map(e => e.toLowerCase()))
  return { raster, vector }
}

function shouldSkip(relPosix, patterns) {
  if (!patterns?.length) return false
  return isMatch(relPosix, patterns)
}

function isRetina2x(filePath, suffix) {
  const base = path.basename(filePath)
  return base.includes(`${suffix}.`)
}

function stripRetinaSuffix(fileName, suffix) {
  return fileName.replace(suffix, '')
}

async function copyFilePreserveDirs(fileAbs, relFromBase) {
  const destAbs = path.join(outDir, relFromBase)
  await fs.mkdir(path.dirname(destAbs), { recursive: true })
  await fs.copyFile(fileAbs, destAbs)
}

async function processRaster(fileAbs, relFromBase, cfg) {
  const ext = path.extname(fileAbs).toLowerCase()
  const dirRel = path.dirname(relFromBase)
  const baseName = path.basename(relFromBase, ext)

  const destDir = path.join(outDir, dirRel)
  await fs.mkdir(destDir, { recursive: true })

  const src = sharp(fileAbs, { failOn: 'none' })
  const meta = await src.metadata()

  const q = cfg.quality || {}
  const jpegQ = q.jpeg || {}
  const pngQ = q.png || {}
  const webpQ = q.webp || {}
  const avifQ = q.avif || {}

  const formats = cfg.formats || {}
  const genWebp = Boolean(formats.webp)
  const genAvif = Boolean(formats.avif)

  const retina = cfg.retina || {}
  const retinaEnabled = Boolean(retina.enabled)
  const retinaSuffix = retina.suffix ?? '@2x'
  const retinaScale = Number(retina.scale ?? 2)
  const gen1xFrom2x = Boolean(retina.generate1xFrom2x)

  const writeOptimized = async (targetBaseName, resizeScale) => {
    const img = sharp(fileAbs, { failOn: 'none' })

    const doResize = resizeScale && meta.width && meta.height
    const outW = doResize ? Math.max(1, Math.round(meta.width / resizeScale)) : undefined
    const outH = doResize ? Math.max(1, Math.round(meta.height / resizeScale)) : undefined

    if (doResize) img.resize(outW, outH, { fit: 'inside' })

    if (ext === '.jpg' || ext === '.jpeg') {
      await img
        .jpeg({
          quality: jpegQ.quality ?? 78,
          mozjpeg: jpegQ.mozjpeg ?? true,
          progressive: jpegQ.progressive ?? true,
        })
        .toFile(path.join(destDir, `${targetBaseName}${ext}`))
    } else if (ext === '.png') {
      await img
        .png({
          compressionLevel: pngQ.compressionLevel ?? 9,
          palette: pngQ.palette ?? true,
        })
        .toFile(path.join(destDir, `${targetBaseName}${ext}`))
    } else if (ext === '.gif') {
      await fs.copyFile(fileAbs, path.join(destDir, `${targetBaseName}${ext}`))
    } else if (ext === '.webp') {
      await img
        .webp({ quality: webpQ.quality ?? 78 })
        .toFile(path.join(destDir, `${targetBaseName}.webp`))
    } else if (ext === '.avif') {
      await img
        .avif({ quality: avifQ.quality ?? 50 })
        .toFile(path.join(destDir, `${targetBaseName}.avif`))
    } else {
      await fs.copyFile(fileAbs, path.join(destDir, `${targetBaseName}${ext}`))
    }

    if (genWebp && ext !== '.webp' && ext !== '.gif') {
      await sharp(fileAbs, { failOn: 'none' })
        .resize(outW, outH, { fit: 'inside' })
        .webp({ quality: webpQ.quality ?? 78 })
        .toFile(path.join(destDir, `${targetBaseName}.webp`))
    }

    if (genAvif && ext !== '.avif' && ext !== '.gif') {
      await sharp(fileAbs, { failOn: 'none' })
        .resize(outW, outH, { fit: 'inside' })
        .avif({ quality: avifQ.quality ?? 50 })
        .toFile(path.join(destDir, `${targetBaseName}.avif`))
    }
  }

  await writeOptimized(baseName, null)

  if (retinaEnabled && gen1xFrom2x && isRetina2x(fileAbs, retinaSuffix)) {
    const oneXBase = stripRetinaSuffix(baseName, retinaSuffix)
    await writeOptimized(
      oneXBase,
      Number.isFinite(retinaScale) && retinaScale > 0 ? retinaScale : 2,
    )
  }
}

export const imagesTask = async () => {
  try {
    await fs.mkdir(outDir, { recursive: true })

    const base = paths.assets.imagesBase
    const files = await globSafe(toPosix(paths.assets.images), { onlyFiles: true })

    const cfg = env.isProd ? images.prod : images.dev
    if (!files.length) {
      if (cfg.allowEmpty) return
      return
    }

    const { raster: RASTER_EXTS } = makeExtSets(images)
    const excludeOptimize = images.exclude?.optimize ?? []
    const excludeFormats = images.exclude?.generateFormats ?? []

    if (!env.isProd) {
      await asyncPool(cfg.concurrency ?? 16, files, async abs => {
        const rel = path.relative(base, abs)
        const ext = path.extname(abs).toLowerCase()
        if (!RASTER_EXTS.has(ext)) return
        await copyFilePreserveDirs(abs, rel)
      })

      plugins.browserSync.stream()
      return
    }

    sharp = await lazyDefault('sharp')
    if (!sharp) throw new Error('[images] Failed to load sharp.')

    await asyncPool(cfg.concurrency ?? 6, files, async abs => {
      const rel = path.relative(base, abs)
      const relPosix = toPosix(rel)
      const ext = path.extname(abs).toLowerCase()

      if (!RASTER_EXTS.has(ext)) return

      if (shouldSkip(relPosix, excludeOptimize)) {
        await copyFilePreserveDirs(abs, rel)
        return
      }

      const localCfg = shouldSkip(relPosix, excludeFormats)
        ? { ...cfg, formats: { ...cfg.formats, webp: false, avif: false } }
        : cfg

      await processRaster(abs, rel, localCfg)
    })

    plugins.browserSync.stream()
  } catch (err) {
    await notifyError({ title: 'images', message: err?.message || String(err) })
    logger.error('images', err?.stack || err?.message || String(err))

    if (env.isProd) throw err
  }
}
