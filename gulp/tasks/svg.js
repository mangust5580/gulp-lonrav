import path from 'node:path'
import fs from 'node:fs/promises'

import { globSafe, toPosix } from '#gulp/utils/glob.js'
import { logger } from '#gulp/utils/logger.js'
import { optimize as svgoOptimize } from 'svgo'

import { paths } from '#config/paths.js'
import { plugins } from '#config/plugins.js'
import { svg } from '#config/svg.js'
import { env } from '#gulp/utils/env.js'
import { notifyError } from '#gulp/utils/notify.js'

const outDir = path.join(paths.out, svg.outSubdir)

async function ensureDirForFile(fileAbs) {
  await fs.mkdir(path.dirname(fileAbs), { recursive: true })
}

export const svgTask = async () => {
  try {
    await fs.mkdir(outDir, { recursive: true })

    const base = paths.assets.imagesBase

    const files = await globSafe(toPosix(paths.assets.svgs), {
      onlyFiles: true,
      absolute: true,

      ignore: [toPosix(paths.assets.icons)],
    })

    if (!files.length) return

    const doOptimize = env.isProd ? Boolean(svg.optimize?.prod) : Boolean(svg.optimize?.dev)
    const svgoCfg = svg.optimize?.svgoConfig ?? { multipass: true, plugins: [] }

    await Promise.all(
      files.map(async abs => {
        const rel = toPosix(path.relative(base, abs))
        const destAbs = path.join(outDir, rel)

        await ensureDirForFile(destAbs)

        if (!doOptimize) {
          await fs.copyFile(abs, destAbs)
          return
        }

        const raw = await fs.readFile(abs, 'utf8')
        const result = svgoOptimize(raw, svgoCfg)
        await fs.writeFile(destAbs, result.data, 'utf8')
      }),
    )
      if (env.isDev) plugins.browserSync.stream()
  } catch (err) {
    await notifyError({ title: 'svg', message: err?.message || String(err) })
    logger.error('svg', err?.stack || err?.message || String(err))
    if (env.isProd) throw err
  }
}
