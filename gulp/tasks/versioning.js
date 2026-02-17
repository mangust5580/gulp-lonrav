import fs from 'node:fs/promises'
import path from 'node:path'

import gulp from 'gulp'
import rev from 'gulp-rev'
import revRewrite from 'gulp-rev-rewrite'

import { env } from '#gulp/utils/env.js'
import { paths } from '#config/paths.js'
import { features } from '#config/features.js'
import { versioning } from '#config/versioning.js'

const getAssetsGlobs = () => {
  const include = versioning.include || {}
  const byGroup = versioning.globsByGroup || {}

  const selected = Object.entries(byGroup)
    .filter(([k]) => Boolean(include[k]))
    .flatMap(([, v]) => (Array.isArray(v) ? v : []))
    .filter(Boolean)

  return selected.length ? selected : versioning.assetsGlobs || []
}

const runStream = stream =>
  new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

export const versioningTask = async () => {
  if (!env.isProd) return
  if (!features.versioning?.enabled) return

  const assetsGlobAbs = getAssetsGlobs().map(g => path.join(paths.out, g))
  const manifestPath = path.join(paths.out, versioning.manifestName)

  await runStream(
    gulp
      .src(assetsGlobAbs, { base: paths.out, allowEmpty: true })
      .pipe(rev())
      .pipe(gulp.dest(paths.out))
      .pipe(rev.manifest(versioning.manifestName))
      .pipe(gulp.dest(paths.out)),
  )

  const manifest = await fs.readFile(manifestPath)
  await runStream(
    gulp
      .src(path.join(paths.out, ...versioning.rewriteGlobs), { allowEmpty: true })
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest(paths.out)),
  )
}
