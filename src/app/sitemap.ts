// /sitemap.xml: the public pages, every stocked category and every product, from the live catalog.
import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { getProducts } from '@/sanity/lib/queries';
import { stockedSlugs } from '@/data/taxonomy';

export const revalidate = 3600;

const PAGES = ['', '/products', '/categories', '/about', '/help', '/faq', '/contact', '/shipping', '/returns', '/warranty', '/privacy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);
  const now = new Date();
  return [
    ...PAGES.map((p) => ({ url: `${site.url}${p}`, lastModified: now })),
    ...[...stockedSlugs(products)].map((slug) => ({ url: `${site.url}/categories/${slug}`, lastModified: now })),
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, lastModified: now })),
  ];
}
