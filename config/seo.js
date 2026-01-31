import {site} from '#config/site.js'

export const seo = {
  trailingSlash: false,

  robots: {
    allowAll: true,
  },

  sitemap: {
    mode: 'index',
    changefreq: 'weekly',
    priority: 0.5,
  },

  url: {
    siteUrl: site.siteUrl,
    basePath: site.basePath,
  },
}
