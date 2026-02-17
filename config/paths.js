import path from 'node:path'

import {env} from '#gulp/utils/env.js'
import {engines} from '#config/engines.js'


const root = process.cwd()

const templatesExtByEngine = {
  html: 'html',
  pug: 'pug',
  nunjucks: 'njk',
  ejs: 'ejs',
  hbs: 'hbs',
  handlebars: 'hbs',
}

const tplExt = templatesExtByEngine[engines.templates] ?? 'html'

export const paths = {
  root,
  src: path.join(root, 'src'),
  dist: path.join(root, 'dist'),
  public: path.join(root, 'public'),
  out: env.isProd ? path.join(root, 'public') : path.join(root, 'dist'),

  pages: {
    entry: path.join(root, 'src', 'pages', `**/*.${tplExt}`),
    html: path.join(root, 'src', 'pages', '**/*.html'),
    pug: path.join(root, 'src', 'pages', '**/*.pug'),
    ejs: path.join(root, 'src', 'pages', '**/*.ejs'),
    hbs: path.join(root, 'src', 'pages', '**/*.hbs'),
    nunjucks: path.join(root, 'src', 'pages', '**/*.njk'),
    watch: [
      path.join(root, 'src', 'pages', `**/*.${tplExt}`),
      path.join(root, 'src', 'shared', '**/*'),
    ],
  },

  styles: {
    entryScss: path.join(root, 'src', 'styles', 'main.scss'),
    entryCss: path.join(root, 'src', 'styles', 'main.css'),
    entryTailwind: path.join(root, 'src', 'styles', 'tailwind.css'),
    watch: path.join(root, 'src', 'styles', '**/*.{scss,css}'),
    dest: 'styles',
  },

  scripts: {
    entry: path.join(root, 'src', 'scripts', 'main.js'),
    watch: path.join(root, 'src', 'scripts', '**/*.{js,ts,tsx,jsx}'),
    dest: 'scripts',
  },

  fonts: {
    src: path.join(root, 'src', 'assets', 'fonts', '**/*.{ttf,woff,woff2,otf}'),
    watch: path.join(root, 'src', 'assets', 'fonts', '**/*.{ttf,otf,woff,woff2}'),
    dest: 'fonts',
  },

  assets: {
    imagesBase: path.join(root, 'src', 'assets', 'images'),
    images: path.join(
      root,
      'src',
      'assets',
      'images',
      '**/*.{png,jpg,jpeg,webp,avif,gif,ico}'
    ),
    iconsBase: path.join(root, 'src', 'assets', 'icons'),
    icons: path.join(root, 'src', 'assets', 'icons', '**/*.svg'),
    svgs: path.join(root, 'src', 'assets', 'images', '**/*.svg'),

    faviconsBase: path.join(root, 'src', 'assets', 'favicons'),
    favicons: path.join(root, 'src', 'assets', 'favicons', '**/*'),
    faviconSvg: path.join(root, 'src', 'assets', 'favicons', 'favicon.svg'),

    staticBase: path.join(root, 'src', 'static'),
    static: path.join(root, 'src', 'static', '**/*'),

    videoBase: path.join(root, 'src', 'assets', 'video'),
    video: path.join(root, 'src', 'assets', 'video', '**/*.{mp4,mov,m4v,webm}'),

    audioBase: path.join(root, 'src', 'assets', 'audio'),
    audio: path.join(root, 'src', 'assets', 'audio', '**/*.{wav,mp3,ogg,opus,m4a,aac,flac}'),
  },
}
