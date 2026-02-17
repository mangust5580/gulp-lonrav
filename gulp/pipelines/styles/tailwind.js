import path from 'node:path'
import gulp from 'gulp'

import { paths } from '#config/paths.js'
import { plugins } from '#config/plugins.js'
import { styles } from '#config/styles.js'
import { withPlumber } from '#gulp/utils/errors.js'
import { getPostcssPlugins } from '#gulp/utils/postcss-plugins.js'

export const stylesTailwind = async () => {
  const postcssPlugins = await getPostcssPlugins('tailwind')

  return gulp
    .src(paths.styles.entryTailwind)
    .pipe(withPlumber('styles:tailwind'))
    .pipe(plugins.gulpIf(styles.sourcemaps, plugins.sourcemaps.init()))
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(plugins.gulpIf(styles.sourcemaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest(path.join(paths.out, paths.styles.dest)))
    .pipe(plugins.browserSync.stream({ match: '**/*.css' }))
}
