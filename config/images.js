// config/images.js
// Только данные.

export const images = {
  extensions: {
    // raster-only: svg не здесь, svg уходит в svgTask / svgSpriteTask
    raster: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'],
    vector: [],
  },

  dev: {
    allowEmpty: true,
    concurrency: 16,
    retina: { enabled: false, suffix: '@2x', scale: 2, generate1xFrom2x: false },
    formats: { webp: false, avif: false },
  },

  prod: {
    allowEmpty: true,
    concurrency: 6,
    retina: { enabled: true, suffix: '@2x', scale: 2, generate1xFrom2x: true },
    formats: { webp: true, avif: true },
    quality: {
      jpeg: { quality: 78, mozjpeg: true, progressive: true },
      png: { compressionLevel: 9, palette: true },
      webp: { quality: 78 },
      avif: { quality: 50 },
    },
  },

  exclude: {
    optimize: [],
    generateFormats: [],
  },
}
