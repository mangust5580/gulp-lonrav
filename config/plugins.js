import browserSyncCreator from 'browser-sync'
import fileInclude from 'gulp-file-include'
import plumber from 'gulp-plumber'
import posthtml from 'gulp-posthtml'
import gulpIf from 'gulp-if'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'

export const plugins = {
  browserSync: browserSyncCreator.create(),
  fileInclude,
  plumber,
  posthtml,
  gulpIf,
  sourcemaps,
  postcss,
}
