import { loadUserConfig } from '#gulp/utils/load-user-config.js'
const baseLint = {
  /**
   * Включение/выключение линтинга
   * Если styles=false — lintStylesTask просто делает cb() и сборка идёт дальше.
   */
  enabled: {
    styles: false,
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

export const lint = await loadUserConfig(baseLint, 'lint')
