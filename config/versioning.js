// config/versioning.js

export const versioning = {
  // enabled переключается через config/features.js -> features.versioning.enabled
  // В dev отключено оркестратором, независимо от этого флага.

  // Which asset groups should be revisioned (hashed) in build/preview.
  // Defaults keep revisioning focused on compiled code (CSS/JS).
  // Enable images/fonts if you need deterministic cache-busting for them.
  include: {
    styles: true,
    scripts: true,
    images: false,
    fonts: false,
  },

  globsByGroup: {
    styles: ['styles/**/*.{css,map}'],
    scripts: ['scripts/**/*.{js,map}'],
    images: ['images/**/*.{png,jpg,jpeg,webp,avif,gif,ico,svg}'],
    fonts: ['fonts/**/*.{woff,woff2,ttf,otf,eot}'],
  },

  // Backward-compatible default list (kept; task will prefer include+globsByGroup)
  assetsGlobs: ['styles/**/*.{css,map}', 'scripts/**/*.{js,map}'],

  // Rewrite целевых файлов
  rewriteGlobs: ['**/*.html'],

  // Manifest
  manifestName: 'rev-manifest.json',
}
