// gulp/pipelines/templates/html/plugins.js
import { plugins } from '#config/plugins.js'

export const posthtmlPipe = (posthtmlPlugins) => plugins.posthtml(posthtmlPlugins)
