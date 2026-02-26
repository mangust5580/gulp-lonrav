import {env} from '#gulp/utils/env.js'
import {engines} from '#config/engines.js'
import { loadUserConfig } from '#gulp/utils/load-user-config.js'

const baseScripts = {
  engine: engines.scripts,
  sourcemaps: env.isDev,
  minify: env.isProd,
  target: 'es2018',
  format: 'esm',
  /**
   * Code splitting (dynamic import chunks).
   * Default: off (faster builds, simpler output).
   * Requires ESM output when enabled.
   */
  splitting: false,
  outfile: 'main.js',
}

export const scripts = await loadUserConfig(baseScripts, 'scripts')
