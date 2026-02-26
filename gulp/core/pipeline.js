import gulp from 'gulp'

import { STAGES } from '#gulp/constants.js'
import { env } from '#gulp/utils/env.js'
import { clean } from '#gulp/tasks/clean.js'
import { versioningTask } from '#gulp/tasks/versioning.js'
import { seoTask } from '#gulp/tasks/seo.js'

import { createContext } from '#gulp/core/context.js'
import { getCompileLayers, getEnabledCompileIds } from '#gulp/core/registry.js'
import { profileTask } from '#gulp/core/profiler.js'

process.env.NODE_ENV = env.isProd ? 'production' : 'development'

const noop = done => done()

const toSeries = tasks => (tasks.length ? gulp.series(...tasks) : noop)
const toParallelOrSeries = tasks => (tasks.length > 1 ? gulp.parallel(...tasks) : tasks[0] || noop)

/**
 * Topologically sorts a small dependency graph for predictable post steps.
 */
const topoSort = nodes => {
  const byId = new Map(nodes.map(n => [n.id, n]))
  const indeg = new Map()
  const deps = new Map()

  for (const n of nodes) {
    const d = (n.dependsOn || []).filter(x => byId.has(x))
    deps.set(n.id, new Set(d))
    indeg.set(n.id, d.length)
  }

  const remaining = new Set(nodes.map(n => n.id))
  const ordered = []

  while (remaining.size) {
    const ready = [...remaining].filter(id => (indeg.get(id) || 0) === 0)
    if (!ready.length) {
      const cycle = [...remaining].join(', ')
      throw new Error(`[pipeline] Cyclic dependsOn detected among post tasks: ${cycle}`)
    }

    ready.sort((a, b) => String(a).localeCompare(String(b)))

    for (const id of ready) {
      remaining.delete(id)
      ordered.push(byId.get(id)?.task)

      for (const otherId of remaining) {
        const otherDeps = deps.get(otherId)
        if (otherDeps && otherDeps.has(id)) {
          otherDeps.delete(id)
          indeg.set(otherId, Math.max(0, (indeg.get(otherId) || 0) - 1))
        }
      }
    }
  }

  return ordered.filter(Boolean)
}

/**
 * Builds a gulp pipeline for a stage.
 *
 * Design goals:
 * - keep orchestration in one file
 * - keep pre/post minimal for static sites
 * - compile layers are driven by the registry (enabled modules + dependsOn graph)
 */
const buildPipeline = ({ ctx, tasks }) => {
  const compileLayers = getCompileLayers(ctx)
  const steps = []

  steps.push(toSeries([tasks.clean].filter(Boolean)))

  for (const layer of compileLayers) {
    steps.push(toParallelOrSeries(layer.filter(Boolean)))
  }

  if (ctx.stage === STAGES.DEV) {
    steps.push(toSeries([tasks.server, tasks.watch].filter(Boolean)))
  } else {
    const compileIds = getEnabledCompileIds(ctx)

    const postNodes = [
      { id: 'versioning', task: tasks.versioning, dependsOn: compileIds },
      {
        id: 'seo',
        task: tasks.seo,
        dependsOn: [tasks.versioning ? 'versioning' : null].filter(Boolean),
      },
    ].filter(n => Boolean(n.task))

    if (postNodes.length) steps.push(toSeries(topoSort(postNodes)))
  }

  return toSeries(steps)
}

/**
 * Build a full compilation pipeline for the given stage.
 */
export const createBuildPipeline = ({ stage }) => {
  const ctx = createContext({ stage })
  const prof = (task, name) => profileTask(task, name, ctx)

  return buildPipeline({
    ctx,
    tasks: {
      clean: prof(clean, 'clean'),
      versioning: prof(versioningTask, 'versioning'),
      seo: prof(seoTask, 'seo'),
    },
  })
}

/**
 * Dev pipeline: compile, then serve + watch.
 */
export const createDevPipeline = ({ serverTask, watchTask }) => {
  const ctx = createContext({ stage: STAGES.DEV })
  const prof = (task, name) => profileTask(task, name, ctx)

  return buildPipeline({
    ctx,
    tasks: {
      clean: prof(clean, 'clean'),
      server: prof(serverTask, 'server'),
      watch: prof(watchTask, 'watch'),
    },
  })
}
