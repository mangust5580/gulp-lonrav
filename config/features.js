// config/features.js
// Единственный источник правды для опциональных модулей.

import { getCliValue } from '#gulp/utils/cli.js'

const baseFeatures = {
  // Desktop/OS notifications (опционально)
  // По умолчанию выключено, чтобы не засорять лог и избежать предупреждений Node (DEP0190).
  notifications: {
    enabled: false,
  },

  // Мультиязычность (опционально)
  i18n: {
    enabled: false,
  },

  // SEO-артефакты (для статических хостингов)
  seo: {
    enabled: true,
    sitemap: true,
    robots: true,

    /**
     * Строгость домена для sitemap/hreflang.
     * - local: чаще всего нет реального домена → пропускаем генерацию (warn).
     * - ci: в CI домен/префикс можно подставлять автоматически (через env)оматически → домен обязателен.
     */
    requireSiteUrl: {
      local: false,
      ci: true,
    },
  },

  // Cache-busting / manifest (включать только в production)
  versioning: {
    enabled: true,
    // стратегия: "hash" (имена файлов) или "query" (query-string)
    strategy: 'hash',
    manifest: true,
  },

  // Favicons / PWA-иконки (опционально)
  favicons: {
    enabled: true,

    // Если src/assets/favicons/favicon.svg отсутствует:
    // - dev: предупреждение и skip
    // - build: ошибка (если модуль включён)
    requireSourceInBuild: true,
  },

  // SVG-sprite (src/assets/icons/**/*.svg -> icons/sprite.svg)
  // Опционально: если проект не использует спрайты — отключаем и экономим время сборки.
  svgSprite: {
    enabled: true,

    // Если модуль выключен, но SVG-иконки всё же присутствуют в src/assets/icons
    // dev: warn (по умолчанию), build: error (по умолчанию)
    policy: {
      onDisabledFilesDev: 'warn',
      onDisabledFilesBuild: 'error',
    },
  },

  // Static (копирование src/static в outDir)
  // Опционально: если модуль выключен, pipeline static становится no-op.
  static: {
    enabled: true,

    // Если модуль выключен, но файлы всё же присутствуют в src/static
    // dev: warn (по умолчанию), build: error (по умолчанию)
    policy: {
      onDisabledFilesDev: 'warn',
      onDisabledFilesBuild: 'error',
    },
  },

  // Медиа (опционально)
  media: {
    audio: { enabled: false, devMode: 'copy', buildMode: 'transcode' },
    video: { enabled: false, devMode: 'copy', buildMode: 'transcode' },

    // Если модуль отключён, но файлы всё же обнаружены в src/assets/{audio,video}
    // dev: warn (по умолчанию), build: error (по умолчанию)
    policy: {
      onDisabledFilesDev: 'warn',
      onDisabledFilesBuild: 'error',
    },
  },

  // Качество (всё управляется конфигом, никаких флагов в терминале)
  quality: {
    lintOnDevStart: true,
    lintOnBuild: true,

    // Preview uses production output but should stay fast and quiet by default.
    lintOnPreview: false,

    // Structure validation (src/ tree sanity checks)
    // Fully stage-aware. No extra CLI flags.
    // Policies:
    // - off  : skip checks
    // - warn : log warning and continue
    // - fail : throw error
    validateStructure: {
      enabled: true,
      dev: 'warn',
      build: 'fail',
      preview: 'fail',
      buildFast: 'fail',

      // Rule toggles (keep minimalistic defaults)
      rules: {
        requirePages: true,
        requireScriptsEntry: true,
        requireStylesEntry: true,
        requireFaviconsSource: true,
      },
    },

    // Backward-compat switches (kept for older code paths; can be removed later).
    validateStructureOnDevStart: true,
    validateStructureOnBuild: true,
    validateStructureOnPreview: true,

    // Asset reference validation in compiled HTML/CSS.
    // dev: warn by default (can be made strict)
    // build/preview: fail by default
    validateAssets: {
      enabled: true,
      dev: 'warn',
      build: 'fail',
      preview: 'fail',

      // build:fast uses production pipelines, so broken references should fail too.
      buildFast: 'fail',

      /**
       * Проверка внутренних ссылок (роутов) в HTML.
       * По умолчанию выключено, чтобы не было ложных срабатываний.
       *
       * linksMode:
       * - off   : выключено
       * - pretty: "/about" -> "/about/index.html" (и "/about/" -> "/about/index.html")
       * - html  : "/about" -> "/about.html" (и "/about/" -> "/about/index.html")
       * - mixed : допускает оба варианта (about.html и about/index.html)
       */
      linksMode: 'off',

      // Если true, ссылки без расширения ("/about") считаются роутами и
      // валидируются по linksMode.
      allowNoExt: true,

      // Для mixed: порядок подсказки/сообщения. На проверку не влияет.
      preferIndex: true,

      // Исключения для validateAssets (подстроки или RegExp-строки вида "/.../")
      ignore: [],
    },

    validateOnBuild: false,
    budgetOnBuild: false,
  },

  // Build-time diagnostics (optional)
  reports: {
    // Outputs a short console summary + writes a JSON report inside outDir.
    // This is designed for portfolio use (quickly verify bundle weight).
    bundleSizes: {
      enabled: true,
      build: true,
      buildFast: false,
      preview: false,
      include: ['**/*.*'],
      exclude: ['**/*.map'],
      top: 20,
      writeJson: true,
      jsonFile: 'reports/bundle-sizes.json',
    },
  },
}

// Optional config profile switch.
// Profiles are a convenient way to quickly toggle optional modules for a project
// (for example: a minimal "basic" profile or disabling favicons).
// Example:
//   gulp build --profile basic
// NOTE: do not mix the nullish coalescing operator (??) with logical OR (||) without parentheses.
// Use nullish coalescing for both fallbacks.
const profile = String(getCliValue('profile') ?? process.env.GULP_LONRAV_PROFILE ?? '').trim()

const profiles = {
  // Explicit "full" profile (same as baseFeatures).
  full: {},

  basic: {
    favicons: { enabled: false },
    svgSprite: { enabled: false },
    static: { enabled: false },
    media: {
      audio: { enabled: false },
      video: { enabled: false },
    },
    // Keep the example minimal and deterministic.
    versioning: { enabled: false },
    reports: { bundleSizes: { enabled: false } },
    quality: {
      validateStructure: {
        rules: {
          // When favicons are disabled in the profile, do not require favicon.svg
          requireFaviconsSource: false,
        },
      },
    },
  },

  // Full project, but favicons module disabled.
  'no-favicons': {
    favicons: { enabled: false },
    quality: {
      validateStructure: {
        rules: {
          requireFaviconsSource: false,
        },
      },
    },
  },

  // Disable svgSprite while keeping icons in place.
  'no-sprite': {
    svgSprite: { enabled: false },
  },
}

const deepMerge = (base, extra) => {
  if (!extra || typeof extra !== 'object') return base
  const out = Array.isArray(base) ? [...base] : { ...base }

  for (const [k, v] of Object.entries(extra)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && base?.[k] && typeof base[k] === 'object') {
      out[k] = deepMerge(base[k], v)
    } else {
      out[k] = v
    }
  }

  return out
}

export const features = profiles[profile] ? deepMerge(baseFeatures, profiles[profile]) : baseFeatures
