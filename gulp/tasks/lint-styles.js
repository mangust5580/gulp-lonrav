// gulp/tasks/lint-styles.js
import path from 'node:path'
import { spawn } from 'node:child_process'

import { env } from '#gulp/utils/env.js'
import { lint } from '#config/lint.js'
import { logger } from '#gulp/utils/logger.js'

export const lintStylesTask = (cb) => {
  // ВЫКЛЮЧЕНО В КОНФИГЕ → просто пропускаем
  if (!lint.enabled?.styles) {
    cb()
    return
  }

  // Avoid "shell:true" (Node DEP0190). Run stylelint via node + cli js.
  const stylelintCli = path.resolve('node_modules', 'stylelint', 'bin', 'stylelint.js')

  // glob из конфига
  const globs = lint.globs?.styles?.length ? lint.globs.styles : ['src/**/*.{css,scss}']
  const args = [stylelintCli, ...globs]

  const proc = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: env.isProd ? 'production' : 'development',
    },
  })

  proc.on('error', (err) => cb(err))

  proc.on('close', (code) => {
    if (code !== 0) {
      if (lint.strict?.styles !== false) {
        cb(new Error(`Stylelint failed with code ${code}`))
        return
      }

      // НЕБЛОКИРУЮЩИЙ РЕЖИМ
      logger.warn('lint:styles', `Stylelint failed (code ${code}), but build continues`)
      cb()
      return
    }

    cb()
  })
}
