import { env } from '#gulp/utils/env.js'
import { templates } from '#config/templates.js'
import { styles } from '#config/styles.js'
import { scripts } from '#config/scripts.js'

export const build = {
  isProd: env.isProd,
  isDev: env.isDev,

  templates: {
    engine: templates.engine,
  },

  styles: {
    engine: styles.engine,
  },

  scripts: {
    engine: scripts.engine,
  },
}
