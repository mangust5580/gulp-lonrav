export const svg = {
  outSubdir: 'images',
  optimize: {
    dev: false,
    prod: true,
    svgoConfig: {
      multipass: true,
      plugins: [
        {name: 'preset-default'},
        {name: 'removeViewBox', active: false},
        {name: 'cleanupIds', active: false},
      ],
    },
  },

  sprite: {
    enabled: true,
    outSubdir: 'icons',
    filename: 'sprite.svg',
    symbolIdPrefix: 'icon-',
    optimize: {
      dev: true,
      prod: true,
      svgoConfig: {
        multipass: true,
        plugins: [
          {name: 'preset-default'},
          {name: 'removeViewBox', active: false},
          {name: 'cleanupIds', active: false},
        ],
      },
    },
  },
}
