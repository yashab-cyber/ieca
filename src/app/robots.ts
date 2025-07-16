import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/admin',
          '/admin/',
          '/_next/',
          '/private/',
          '/temp/',
          '/uploads/chat/',
          '/uploads/avatars/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/admin',
          '/admin/',
          '/_next/',
          '/private/',
          '/temp/',
          '/uploads/chat/',
          '/uploads/avatars/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/admin',
          '/admin/',
          '/_next/',
          '/private/',
          '/temp/',
          '/uploads/chat/',
          '/uploads/avatars/',
        ],
      },
    ],
    sitemap: 'https://ieca.in/sitemap.xml',
    host: 'https://ieca.in'
  }
}
