// config/seo.js
import { site } from '#config/site.js'

export const seo = {
  // Использовать trailing slash в URL сайта (влияет на sitemap)
  trailingSlash: false,

  // robots.txt
  robots: {
    // если нужно, можно задать кастомное содержимое целиком
    // content: "User-agent: *\nDisallow:" 
    allowAll: true,
  },

  // sitemap
  sitemap: {
    // 'single' (один файл) или 'index' (sitemapindex + per-locale)
    mode: 'index',
    changefreq: 'weekly',
    priority: 0.5,
  },

  // вычисления URL
  url: {
    siteUrl: site.siteUrl,
    basePath: site.basePath,
  },
}
