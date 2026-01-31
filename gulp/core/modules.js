import { features } from '#config/features.js'
import { paths } from '#config/paths.js'
import { toPosix } from '#gulp/utils/glob.js'

import { getEnabledRunTasks, getEnabledWatchRules } from '#gulp/core/registry.js'

/**
 * Returns a stable list of "work" modules that produce output into dist/public.
 * Kept for compatibility; new code should use getEnabledRunTasks(ctx).
 */
export const getWorkModules = (ctx = { features, paths }) =>
  getEnabledRunTasks(ctx).map((task, i) => ({ key: `m${i}`, task }))

/**
 * Watch rules mirror existing behavior:
 * - templates/assets reload
 * - styles/scripts rely on internal streaming/inject
 */
export const getWatchRules = (ctx = { features, paths }) => {
  const rules = getEnabledWatchRules(ctx)
  return rules.map(r => ({
    key: r.key,
    globs: Array.isArray(r.globs) ? r.globs.map(toPosix) : toPosix(r.globs),
    task: r.task,
    reload: r.action === 'reload',
  }))
}
