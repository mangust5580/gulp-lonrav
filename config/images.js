export const images = {
  extensions: {
    raster: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'],
    vector: [],
  },

  dev: {
    mode: 'derived',
    allowEmpty: true,
    concurrency: 16,
    retina: { enabled: true, suffix: '@2x', scale: 2, generate1xFrom2x: true },
    formats: { webp: true, avif: true },
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
