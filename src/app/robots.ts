// /robots.txt: everything public is crawlable; the CMS, API and account pages are not.
import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/api/', '/account', '/cart', '/checkout', '/orders', '/settings', '/auth'] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
