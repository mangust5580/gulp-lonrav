import { env } from '#gulp/utils/env.js'
import { engines } from '#config/engines.js'

export const scripts = {
  engine: engines.scripts,

  sourcemaps: env.isDev,
  minify: env.isProd,

  target: 'es2018',

  // ESM output
  format: 'esm',
  outfile: 'main.js',
}
