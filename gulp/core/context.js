// gulp/core/context.js
// Shared build context passed through pipeline builders.

import { env } from '#gulp/utils/env.js'
import { normalizeStage } from '#gulp/core/stage.js'
import { getConfig } from '#gulp/core/config.js'

export const createContext = ({ stage }) => {
  const s = normalizeStage(stage)
  const config = getConfig({ stage: s })

  return {
    stage: s,
    env,

    // Optional performance profiling for pipelines/tasks.
    // Enable via: PROFILE=1 gulp build
    profile: Boolean(process.env.PROFILE) && process.env.PROFILE !== '0',

    // Full normalized config block (single source of truth)
    config,

    // Convenience accessors (kept for existing code)
    engines: config.engines,
    features: config.features,
    paths: config.paths,
    project: config.project,
    site: config.site,
    plugins: config.plugins,
  }
}
