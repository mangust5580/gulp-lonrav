export const project = {
  server: {
    port: 3000,
    open: false,
    notify: false,
    ui: false,
    cors: true,
  },
  watch: {
    debounceMs: 150,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100,
    },
  },
}
