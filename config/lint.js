// config/lint.js
// Только данные. Управление линтерами — отсюда.

export const lint = {
  /**
   * Включение/выключение линтинга
   * Если styles=false — lintStylesTask просто делает cb() и сборка идёт дальше.
   */
  enabled: {
    styles: false, // <-- поставь true/false как тебе нужно
    scripts: true,
  },

  /**
   * Строгость: ломать ли сборку при ошибках линтера
   * strict=false полезно, когда линтер включён “для информации”.
   */
  strict: {
    styles: true,
    scripts: true,
  },

  /**
   * Globs вынесены сюда по вашей договорённости.
   * Для текущей реализации stylelint на Windows используем одну строку (через shell).
   */
  globs: {
    styles: ['src/**/*.{css,scss}'],
    scripts: ['src/**/*.{js,ts,tsx,jsx}'],
  },
}
