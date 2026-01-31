// config/scaffold.js
// Controls whether the build creates missing boilerplate in dev.

export const scaffold = {
  // "auto"  -> create minimal required dirs/files in dev (optional)
  // "strict" -> never create; missing structure fails immediately
  // Default: strict (no silent generation). Enable "auto" per-project if desired.
  mode: 'strict',

  // Only allow auto-scaffold in dev (never in build/CI)
  devOnly: true,

  // Keep logs minimal (only when something was created)
  verbose: false,
}
