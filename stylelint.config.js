// stylelint.config.js
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
  ],

  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/public/**',
    '**/.git/**',
  ],

  rules: {
    // Практичный минимум для SCSS-проектов
    'no-descending-specificity': null, // часто мешает на реальных BEM-структурах
    'selector-class-pattern': null,     // не навязываем regex на классы (BEM/не BEM)

    // SCSS: разрешаем директивы/ат-правила без "Unknown"
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
  },
}
