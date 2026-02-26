import { createRequire } from 'node:module'

import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

import { styles } from '#config/styles.js'

const require = createRequire(import.meta.url)

const unwrapDefault = mod => mod && (mod.default ?? mod)

function requireOptional(name, hint) {
  try {
    return unwrapDefault(require(name))
  } catch {
    throw new Error(
      `[postcss] Missing dependency: "${name}" (required for ${hint}). Install: pnpm i -D ${name} (or npm i -D ${name}).`,
    )
  }
}

/**
 * Returns PostCSS plugins for a given styles engine.
 * NOTE: Optional deps (tailwind/postcss-import) are loaded lazily and synchronously.
 */
export const getPostcssPlugins = engine => {
  const plugins = []

  if (engine === 'css') {
    const postcssImport = requireOptional('postcss-import', 'styles.engine="css"')
    plugins.push(postcssImport())
  }

  if (engine === 'tailwind') {
    const tailwindPostcss = requireOptional('@tailwindcss/postcss', 'styles.engine="tailwind"')
    plugins.push(tailwindPostcss())
  }

  if (styles.postcss.autoprefixer) plugins.push(autoprefixer())
  if (styles.postcss.cssnano) plugins.push(cssnano())

  return plugins
}
