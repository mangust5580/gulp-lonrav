import path from 'node:path'

import { paths } from '#config/paths.js'
import { features } from '#config/features.js'
import { templatesPipeline } from '#gulp/pipelines/templates/index.js'
import { getI18nConfig, makeI18nContext } from '#gulp/utils/i18n.js'

const runStream = (stream) =>
  new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

export const templatesTask = async () => {
  const i18n = getI18nConfig()

  // i18n выключен → один проход в корень out
  if (!features.i18n?.enabled) {
    const ctx = makeI18nContext(i18n.defaultLocale, 'templates')
    const stream = await templatesPipeline({ locals: ctx })
    await runStream(stream)
    return
  }

  // i18n включён → рендер по локалям в out/<locale>
  for (const locale of i18n.locales) {
    const ctx = makeI18nContext(locale, `templates:${locale}`)
    const dest = path.join(paths.out, locale)
    const stream = await templatesPipeline({ locals: ctx, dest })
    await runStream(stream)
  }
}
