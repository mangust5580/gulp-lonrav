// config/audio.js
import { env } from '#gulp/utils/env.js'

export const audio = {
  outSubdir: 'audio',
  concurrency: env.isProd ? 2 : 1,

  // EBU R128 loudness normalization (обычно даёт самый заметный UX-эффект)
  loudnorm: {
    enabled: true,
    i: -16,
    tp: -1.5,
    lra: 11,
  },

  opus: {
    enabled: true,
    ext: '.opus',
    // 64–96k для речи, 96–128k для музыки. Берём универсально.
    bitrate: env.isProd ? '96k' : '64k',
  },

  mp3: {
    enabled: true,
    ext: '.mp3',
    // LAME VBR quality: 2 (лучше) .. 5 (меньше вес)
    vbrQuality: env.isProd ? 3 : 5,
  },
}
