import {env} from '#gulp/utils/env.js'

/**
 * Настройки шрифтов.
 *
 * Примечание:
 * Пакет ttf2woff2 (через gulp-ttf2woff2) на Windows иногда пишет в stderr
 * "Parsing of the input font failed." даже в случаях, когда конвертация фактически
 * проходит и итоговый .woff2 корректно генерируется и загружается в браузере.
 *
 * Чтобы не создавать «шум» в dev-режиме, мы умеем подавлять конкретно это сообщение.
 * В prod по умолчанию подавление выключено (можно включить при необходимости).
 */
export const fonts = {
  ttf2woff2: {
    enabled: true,
  },

  warnings: {
    suppressInDev: true,
    suppressInProd: true,
    patterns: [
      /Parsing of the input font failed\.?/i,
    ],

    /**
     * Если нужно централизованно переключить подавление по окружению, можно
     * использовать env при кастомизации.
     */
    get suppress() {
      return env.isProd ? this.suppressInProd : this.suppressInDev
    },
  },
}
