import { env } from '#gulp/utils/env.js'
import { loadUserConfig } from '#gulp/utils/load-user-config.js'

const baseConfig = {
  engine: 'scss',
  sourcemaps: env.isDev,
  sass: {
    loadPaths: ['src/styles'],
  },
  postcss: {
    autoprefixer: true,
    cssnano: env.isProd,
  },
}

export const styles = await loadUserConfig(baseConfig, 'styles')
