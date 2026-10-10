import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/signup', '/checkout', '/dashboard/*', '/admin/*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://invesone.com'}/sitemap.xml`,
  };
}
