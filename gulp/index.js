import gulp from 'gulp'

import { STAGES } from '#gulp/constants.js'

import { clean } from '#gulp/tasks/clean.js'
import { serverTask } from '#gulp/tasks/server.js'
import { watchTask } from '#gulp/tasks/watch.js'

import { createBuildPipeline, createDevPipeline } from '#gulp/core/pipeline.js'

export { clean }

export const build = createBuildPipeline({ stage: STAGES.BUILD })

// Fast production build: no lint (useful for local iteration), but still validates structure.
export const buildFast = createBuildPipeline({ stage: STAGES.BUILD_FAST })

export const dev = createDevPipeline({ serverTask, watchTask })

// Предпросмотр продакшн-сборки: сначала выполняет build-пайплайн, затем поднимает сервер на папке public
export const preview = gulp.series(
  createBuildPipeline({ stage: STAGES.PREVIEW }),
  (done) => serverTask(done)
)


//
// Exit-mode checks (no long-running server/watch)
// Useful for CI / stability validation.
//
export const devCheck = build;
export const previewCheck = build;
