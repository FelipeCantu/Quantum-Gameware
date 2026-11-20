"use client";

import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from './ui/ProductCard';

interface ProductGridProps {
  products: Product[];
  /** How many leading cards load their photo eagerly (the first row above the fold). */
  priorityCount?: number;
}

export default function ProductGrid({ products, priorityCount = 0 }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="qempty">
        <p className="qempty__title">Nothing measured here yet.</p>
        <p className="qempty__text">No products match. Clear a filter or browse the full catalog.</p>
        <Link href="/products" className="btn btn--line">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">See all gear</span>
        </Link>
      </div>
    );
  }

  return (
    <ul className="qgrid" role="list">
      {products.map((product, i) => (
        <li key={product._id}>
          <ProductCard product={product} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
