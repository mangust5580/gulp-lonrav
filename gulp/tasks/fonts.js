import path from 'node:path'
import fs from 'node:fs'
import { PassThrough } from 'node:stream'
import gulp from 'gulp'
import ttf2woff2 from 'gulp-ttf2woff2'

import { paths } from '#config/paths.js'
import { fonts } from '#config/fonts.js'
import { plugins } from '#config/plugins.js'
import { withPlumber } from '#gulp/utils/errors.js'

/**
 * Подавляет известные «шумовые» сообщения, которые некоторые нативные зависимости
 * пишут напрямую в stderr (например, ttf2woff2 на Windows).
 */
function suppressStderr({ enabled, patterns }) {
  if (!enabled) return () => {}

  const reList = Array.isArray(patterns) ? patterns : []
  const origWrite = process.stderr.write.bind(process.stderr)

  process.stderr.write = (chunk, encoding, cb) => {
    try {
      const text = Buffer.isBuffer(chunk) ? chunk.toString(encoding || 'utf8') : String(chunk)

      if (reList.some(re => re?.test?.(text))) {
        if (typeof cb === 'function') cb()
        return true
      }
    } catch {}

    return origWrite(chunk, encoding, cb)
  }

  return () => {
    process.stderr.write = origWrite
  }
}

export const fontsTask = () => {
  const fontsDir = path.join(paths.root, 'src', 'assets', 'fonts')
  if (!fs.existsSync(fontsDir)) {
    const s = new PassThrough({ objectMode: true })
    queueMicrotask(() => s.end())
    return s
  }

  const restoreStderr = suppressStderr({
    enabled: Boolean(fonts?.warnings?.suppress),
    patterns: fonts?.warnings?.patterns,
  })

  const stream = gulp
    .src(paths.fonts.src, { allowEmpty: true })
    .pipe(withPlumber('fonts'))
    .pipe(plugins.gulpIf(fonts?.ttf2woff2?.enabled !== false, ttf2woff2()))
    .pipe(gulp.dest(path.join(paths.out, paths.fonts.dest)))
    .pipe(plugins.browserSync.stream())

  const cleanup = () => restoreStderr()
  stream.on('end', cleanup)
  stream.on('finish', cleanup)
  stream.on('close', cleanup)
  stream.on('error', cleanup)

  return stream
}
