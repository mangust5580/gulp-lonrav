// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'

export default [
  // Игноры: артефакты сборки, зависимости
  {
    ignores: ['dist/**', 'public/**', 'node_modules/**'],
  },

  // Базовые правила JS
  js.configs.recommended,

  // Настройки для исходников
  {
    files: ['src/**/*.{js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      // Практичный минимум (можно расширять)
      'no-console': 'off', // при желании включим в prod/CI
    },
  },

  // Настройки для Gulp/Node-скриптов (конфиги, задачи)
  {
    files: ['gulp/**/*.{js,mjs}', 'config/**/*.{js,mjs}', '*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
]
