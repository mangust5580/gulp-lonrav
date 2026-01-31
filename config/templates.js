import {env} from '#gulp/utils/env.js'
import {paths} from '#config/paths.js'
import {engines} from '#config/engines.js'

export const templates = {
  engine: engines.templates,

  data: {
    globals: 'src/shared/data/global.json',
  },

  html: {
    fileInclude: {
      prefix: '@',
      basepath: 'src',
    },

    posthtml: {
      enabled: true,
      prodOnlyTransforms: env.isProd,
    },

    expressions: {
      enabled: true,
    },

    minify: env.isProd,
    minifier: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: false,
      minifyJS: false,
    },
  },

  pug: {
    basedir: paths.src,
    pretty: env.isDev,
    doctype: 'html',
  },

  ejs: {
    options: {
      root: paths.src,
    },
  },

  nunjucks: {
    paths: [paths.src],
    envOptions: {
      noCache: env.isDev,
      watch: false,
    },
  },

  handlebars: {
    partials: ['src/shared/**/*.{hbs,html}'],
    options: {},
  },
}
