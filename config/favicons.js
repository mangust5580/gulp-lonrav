// config/favicons.js
export const favicons = {
  // имена файлов (в корне dist/public)
  files: {
    svg: 'favicon.svg',
    ico: 'favicon.ico',
    apple: 'apple-touch-icon.png',
    manifest: 'manifest.webmanifest',
    pwa192: 'icon-192.png',
    pwa512: 'icon-512.png',
    maskable: 'icon-mask.png',
  },

  // базовые размеры (минимальный набор, актуальный в 2025–2026)
  sizes: {
    apple: 180,
    pwa192: 192,
    pwa512: 512,
    ico: [32, 48],
  },

  // manifest (минимально полезный набор; можно расширить позже)
  manifest: {
    name: 'Project',
    short_name: 'Project',
    display: 'standalone',
    start_url: '/',
    background_color: '#ffffff',
    theme_color: '#ffffff',
  },
}
