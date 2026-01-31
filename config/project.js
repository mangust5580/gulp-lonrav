export const project = {
  server: {
    port: 3000,
    open: false,
    notify: false,
    ui: false,
    cors: true,
  },

  // Настройки watch (dev)
  watch: {
    // Один общий rebuild на «пакет» изменений (IDE save может менять сразу несколько файлов)
    debounceMs: 150,

    // Ждём, пока файл «допишется» (особенно важно на Windows)
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100,
    },
  },
}
