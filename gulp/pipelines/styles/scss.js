import path from 'node:path'
import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import * as dartSass from 'sass'

import { paths } from '#config/paths.js'
import { plugins } from '#config/plugins.js'
import { styles } from '#config/styles.js'
import { withPlumber } from '#gulp/utils/errors.js'
import { getPostcssPlugins } from '#gulp/utils/postcss-plugins.js'

const sass = gulpSass(dartSass)

export const stylesScss = async () => {
  const postcssPlugins = await getPostcssPlugins('scss')

  return gulp
    // fail-fast: no allowEmpty
    .src(paths.styles.entryScss)
    .pipe(withPlumber('styles:scss'))
    .pipe(plugins.gulpIf(styles.sourcemaps, plugins.sourcemaps.init()))
    .pipe(sass(styles.sass).on('error', sass.logError))
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(plugins.gulpIf(styles.sourcemaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest(path.join(paths.out, paths.styles.dest)))
    // Stream only CSS to BrowserSync (ignore sourcemaps to reduce log noise)
    .pipe(plugins.browserSync.stream({ match: '**/*.css' }))
}
