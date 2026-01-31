// config/i18n.js

export const i18n = {
  // Включается через config/features.js -> features.i18n.enabled
  locales: ['ru', 'en'],
  defaultLocale: 'ru',

  // Стратегия URL: всегда префиксы /ru/... и /en/...
  urlStrategy: 'prefix',

  // Словари
  dictionaries: {
    dir: 'src/data/locales',
    // форматы: только JSON (для минимализма и предсказуемости)
    ext: 'json',
  },

  // Критический контракт качества
  strictMissingKeys: true,
}
