// src/app/products/page.tsx: every product, with the department rail and the shared Catalog.
import type { Metadata } from 'next';
import { getProducts } from '@/sanity/lib/queries';
import PageHead from '@/components/ui/PageHead';
import Catalog from '@/components/catalog/Catalog';
import CatalogRail from '@/components/catalog/Rail';
import { catalogTree } from '@/data/taxonomy';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All gear',
  description: 'Every mouse, keyboard, headset, monitor and chair in the store. Filter by brand, price and stock.',
};

export default async function ProductsPage() {
  const products = await getProducts();
  const tree = catalogTree(products);
  const rail = [
    { label: 'All gear', href: '/products', count: products.length, current: true },
    ...tree.map((d) => ({ label: d.name, href: `/categories/${d.slug}`, count: d.count })),
  ];

  return (
    <div>
      <PageHead
        crumbs={[{ label: 'Home', href: '/' }, { label: 'All gear' }]}
        title="All gear"
        text="Every product we carry, from mouse pads to chairs, at the price on the tag."
        meta={`${products.length} products in ${tree.length} departments`}
      />
      <CatalogRail items={rail} />
      <Catalog products={products} heading="Every product" showCategoryFilter />
    </div>
  );
}
