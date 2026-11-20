// src/app/products/[slug]/RelatedProducts.tsx
// More from the same leaf category, in the shared product grid.
import Link from 'next/link';
import { Product } from '@/types';
import ProductGrid from '@/components/ProductGrid';

interface RelatedProductsProps {
  products: Product[];
  category?: string;
  categorySlug?: string;
}

export default function RelatedProducts({ products, category, categorySlug }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="section pdp-related" aria-labelledby="related-title">
      <div className="section-head section-head--row">
        <h2 id="related-title" className="section-head__title" data-split="lines">
          {category ? `More ${category.toLowerCase()}` : 'More like this'}
        </h2>
        <Link href={categorySlug ? `/categories/${categorySlug}` : '/products'} className="text-link">
          {category ? `See all ${category.toLowerCase()}` : 'See all gear'}
        </Link>
      </div>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}
