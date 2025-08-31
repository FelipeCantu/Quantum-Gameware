// src/components/ProductGrid.tsx
'use client';

import { Product } from '@/types';
import ProductCard from './ui/ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Debug: log the products to see what we're working with
  console.log('ProductGrid received products:', products);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => {
        // Debug each product
        console.log('Rendering product:', product.name, 'slug:', product.slug);
        
        return <ProductCard key={product._id} product={product} />;
      })}
    </div>
  );
}