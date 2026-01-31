// gulp/utils/notify.js
// Optional desktop notifications.
// IMPORTANT: do not import gulp-notify at module scope to avoid warnings/noise
// and to keep CI/dev deterministic.

import { features } from '#config/features.js'

let cachedNotify = null

async function getNotify() {
  if (!features.notifications?.enabled) return null
  if (cachedNotify) return cachedNotify

  // Lazy import – only when explicitly enabled.
  const mod = await import('gulp-notify')
  cachedNotify = mod.default ?? mod
  return cachedNotify
}

export async function notifyError({ title, message }) {
  try {
    const notify = await getNotify()
    if (!notify) return

    // gulp-notify API
    notify.onError({ title, message })({})
  } catch {
    // ignore notification failures
  }
}
