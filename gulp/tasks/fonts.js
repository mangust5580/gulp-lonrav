import path from 'node:path'
import fs from 'node:fs'
import { PassThrough } from 'node:stream'
import gulp from 'gulp'

import { paths } from '#config/paths.js'
import { plugins } from '#config/plugins.js'
import { withPlumber } from '#gulp/utils/errors.js'
import { env } from '#gulp/utils/env.js'

export const fontsTask = () => {
  const fontsDir = path.join(paths.root, 'src', 'assets', 'fonts')
  if (!fs.existsSync(fontsDir)) {
    const s = new PassThrough({ objectMode: true })
    queueMicrotask(() => s.end())
    return s
  }

  return gulp
    .src(paths.fonts.src, { allowEmpty: true })
    .pipe(withPlumber('fonts'))
    .pipe(gulp.dest(path.join(paths.out, paths.fonts.dest)))
    .pipe(plugins.gulpIf(env.isDev, plugins.browserSync.stream()))
}
