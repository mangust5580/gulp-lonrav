// config/svg.js
export const svg = {
  // plain SVG из src/assets/images/**/*.svg должны жить рядом с растровыми — в images
  outSubdir: 'images',

  optimize: {
    dev: false,
    prod: true,
    svgoConfig: {
      multipass: true,
      // svgo v4: removeViewBox / cleanupIds подключаются отдельными плагинами
      plugins: [
        { name: 'preset-default' },
        { name: 'removeViewBox', active: false },
        { name: 'cleanupIds', active: false },
      ],
    },
  },

  sprite: {
    enabled: true,

    // sprite — это UI-иконки → логично хранить в icons
    outSubdir: 'icons',

    filename: 'sprite.svg',
    symbolIdPrefix: 'icon-',

    optimize: {
      dev: true,
      prod: true,
      svgoConfig: {
        multipass: true,
        plugins: [
          { name: 'preset-default' },
          { name: 'removeViewBox', active: false },
          { name: 'cleanupIds', active: false },
        ],
      },
    },
  },
}
