import { paths } from '#config/paths.js'

import { fileIncludePipe } from '#gulp/pipelines/templates/html/file-include.js'
import { templatesSrc, templatesDest } from '#gulp/pipelines/templates/common.js'

export const templatesHtml = async (options = {}) => {
  const stream = templatesSrc(paths.pages.html, 'templates:html').pipe(fileIncludePipe())

  // expressions включаем только для engine: html
  return templatesDest(stream, { enableExpressions: true, ...options })
}
