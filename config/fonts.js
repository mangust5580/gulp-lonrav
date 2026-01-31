import { env } from '#gulp/utils/env.js'

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
    // Подавлять известный шум в dev
    suppressInDev: true,
    // В prod по умолчанию тоже подавляем известный шум, чтобы логи были чистыми
    suppressInProd: true,

    // Какие строки в stderr считать «шумом»
    patterns: [
      // ttf2woff2 / woff2 часто печатает это на Windows
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
