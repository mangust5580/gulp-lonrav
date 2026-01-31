// gulp/pipelines/templates/html/posthtml.js
import { env } from '#gulp/utils/env.js'
import { templates } from '#config/templates.js'
import { expressionsPlugin } from '#gulp/pipelines/templates/html/expressions.js'

const removeDevAttrsPlugin = () => (tree) => {
  tree.match({ attrs: true }, (node) => {
    if (!node.attrs) return node
    delete node.attrs['data-dev']
    delete node.attrs['data-debug']
    return node
  })

  return tree
}

export const getPosthtmlPlugins = ({ locals = {}, enableExpressions = false } = {}) => {
  const cfg = templates.html
  const p = []

  if (cfg.posthtml.enabled && cfg.posthtml.prodOnlyTransforms) {
    p.push(removeDevAttrsPlugin())
  }

  if (enableExpressions && cfg.expressions?.enabled) {
    p.push(
      expressionsPlugin({
        ...locals,
        isProd: env.isProd,
        isDev: env.isDev,
      })
    )
  }

  // ✅ ВАЖНО: htmlnano удалён. HTML-минификация делается отдельным шагом после PostHTML.

  return p
}
