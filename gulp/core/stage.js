// gulp/core/stage.js
// Stage helpers. A "stage" is a high-level mode that controls pipeline behavior.

import { STAGES } from '#gulp/constants.js'

// Re-export for convenience/compatibility (some modules import STAGES from here)
export { STAGES }

export const normalizeStage = (stage) => {
  if (!stage) return STAGES.DEV
  const values = new Set(Object.values(STAGES))
  return values.has(stage) ? stage : STAGES.DEV
}

export const isDevStage = (stage) => normalizeStage(stage) === STAGES.DEV

export const isBuildStage = (stage) => {
  const s = normalizeStage(stage)
  return s === STAGES.BUILD || s === STAGES.BUILD_FAST
}

export const isPreviewStage = (stage) => normalizeStage(stage) === STAGES.PREVIEW
