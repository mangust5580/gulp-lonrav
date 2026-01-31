// gulp/tasks/favicons.js
import path from 'node:path'
import fs from 'node:fs/promises'
import fssync from 'node:fs'

import { paths } from '#config/paths.js'
import { favicons as cfg } from '#config/favicons.js'
import { features } from '#config/features.js'
import { plugins } from '#config/plugins.js'
import { env } from '#gulp/utils/env.js'
import { lazyDefault } from '#gulp/utils/lazy.js'
import { notifyError } from '#gulp/utils/notify.js'
import { logger } from '#gulp/utils/logger.js'

async function writeFile(abs, data) {
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, data)
}

export const faviconsTask = async () => {
  try {
    if (features.favicons?.enabled === false) return

    const srcAbs = paths.assets.faviconSvg
    const outRoot = paths.out

    // dist/public может быть удалён clean-задачей — гарантируем, что директория существует
    await fs.mkdir(outRoot, { recursive: true })

    if (!fssync.existsSync(srcAbs)) {
      const msg =
        `[favicons] Source not found: ${srcAbs}. ` +
        `Create src/assets/favicons/favicon.svg or disable the module in config/features.js (features.favicons.enabled=false).`

      // Dev: не валим сервер портфолио-заглушками
      if (!env.isProd) {
        logger.warn('favicons', msg)
        return
      }

      // Build: по умолчанию строгие
      if (features.favicons?.requireSourceInBuild !== false) {
        throw new Error(msg)
      }

      logger.warn('favicons', msg)
      return
    }

    // 1) SVG favicon (копируем как есть)
    const svgOutAbs = path.join(outRoot, cfg.files.svg)
    await fs.copyFile(srcAbs, svgOutAbs)

    // Heavy deps are only needed when we actually generate derived assets.
    const sharp = await lazyDefault('sharp')
    const pngToIco = await lazyDefault('png-to-ico')

    if (!sharp || !pngToIco) {
      throw new Error('[favicons] Failed to load required dependencies (sharp/png-to-ico).')
    }

    // 2) PNG derived from SVG
    const svgBuffer = await fs.readFile(srcAbs)

    const applePng = await sharp(svgBuffer)
      .resize(cfg.sizes.apple, cfg.sizes.apple, { fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer()

    const pwa192 = await sharp(svgBuffer)
      .resize(cfg.sizes.pwa192, cfg.sizes.pwa192, { fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer()

    const pwa512 = await sharp(svgBuffer)
      .resize(cfg.sizes.pwa512, cfg.sizes.pwa512, { fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer()

    // maskable: по-хорошему нужен отдельный арт с безопасной зоной,
    // но как базовый вариант — тот же 512 (лучше, чем ничего).
    const maskable = pwa512

    await writeFile(path.join(outRoot, cfg.files.apple), applePng)
    await writeFile(path.join(outRoot, cfg.files.pwa192), pwa192)
    await writeFile(path.join(outRoot, cfg.files.pwa512), pwa512)
    await writeFile(path.join(outRoot, cfg.files.maskable), maskable)

    // 3) favicon.ico (32/48)
    const icoPngs = await Promise.all(
      cfg.sizes.ico.map((size) =>
        sharp(svgBuffer)
          .resize(size, size, { fit: 'contain', background: '#ffffff' })
          .png()
          .toBuffer()
      )
    )

    const icoBuf = await pngToIco(icoPngs)
    await writeFile(path.join(outRoot, cfg.files.ico), icoBuf)

    // 4) manifest.webmanifest
    const manifest = {
      ...cfg.manifest,
      icons: [
        { src: `/${cfg.files.pwa192}`, type: 'image/png', sizes: '192x192' },
        { src: `/${cfg.files.maskable}`, type: 'image/png', sizes: '512x512', purpose: 'maskable' },
        { src: `/${cfg.files.pwa512}`, type: 'image/png', sizes: '512x512' },
      ],
    }

    await writeFile(
      path.join(outRoot, cfg.files.manifest),
      Buffer.from(JSON.stringify(manifest, null, 2))
    )

    plugins.browserSync.stream()
  } catch (err) {
    // Сообщаем об ошибке и выводим её в консоль
    await notifyError({ title: 'favicons', message: err?.message || String(err) })
    logger.error('favicons', err?.stack || err?.message || String(err))
    if (env.isProd) throw err
  }
}
