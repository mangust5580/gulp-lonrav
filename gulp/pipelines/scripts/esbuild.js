import path from 'node:path'
import { build as esbuild } from 'esbuild'

import { paths } from '#config/paths.js'
import { scripts } from '#config/scripts.js'
import { plugins } from '#config/plugins.js'

export const scriptsEsbuild = async () => {
  const outdir = path.join(paths.out, paths.scripts.dest)

  await esbuild({
    entryPoints: [paths.scripts.entry],
    bundle: true,
    outdir,
    entryNames: path.parse(scripts.outfile).name,
    sourcemap: scripts.sourcemaps,
    minify: scripts.minify,
    target: scripts.target,
    format: scripts.format,
    platform: 'browser',
    splitting: true,
    logLevel: 'info',
  })

  plugins.browserSync.reload()
}
