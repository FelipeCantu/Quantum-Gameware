// src/app/page.tsx: home (DESIGN.md composition: hero, category index, team picks, statement).
import Link from 'next/link';
import { getProducts } from '../sanity/lib/queries';
import type { Product } from '@/types';
import Hero from '@/components/home/Hero';
import CategoryIndex from '@/components/home/CategoryIndex';
import ProductGrid from '@/components/ProductGrid';
import { brandCount, hasPhoto } from '@/lib/catalog';
import { catalogTree } from '@/data/taxonomy';
import { site } from '@/data/site';

export const revalidate = 60;

type Listed = Product & { isFeatured?: boolean };

export default async function Home() {
  let products: Listed[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  const featured = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => Number(hasPhoto(b)) - Number(hasPhoto(a)))
    .slice(0, 8);
  const tree = catalogTree(products);
  const leafCount = tree.reduce((n, d) => n + d.leaves.length, 0);

  const facts = [
    { value: String(products.length), label: 'products in the catalog' },
    { value: String(brandCount(products)), label: 'brands, from Logitech to Herman Miller' },
    { value: String(leafCount), label: `kinds of gear in ${tree.length} departments` },
    { value: '$0', label: 'shipping, on every order' },
  ];

  return (
    <>
      <Hero />

      <section className="section section--tight" aria-labelledby="index-title">
        <div className="section-head">
          <h2 id="index-title" className="section-head__title" data-split="lines">Everything for the desk</h2>
          <p className="section-head__text">Four departments, every category with what is in it right now. Pick one to see the gear.</p>
        </div>
        <CategoryIndex groups={tree} />
      </section>

      {featured.length > 0 && (
        <section className="section" aria-labelledby="picks-title">
          <div className="section-head section-head--row">
            <h2 id="picks-title" className="section-head__title" data-split="lines">Picked by the team</h2>
            <Link href="/products" className="text-link">See all {products.length} products</Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      <section className="statement" aria-labelledby="statement-title">
        <h2 id="statement-title" className="sr-only">How we price</h2>
        <p className="statement__text" data-split="lines">{site.pricing}</p>
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label} className="facts__item" data-reveal="up">
              <dt className="facts__label">{f.label}</dt>
              <dd className="facts__value mono">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
