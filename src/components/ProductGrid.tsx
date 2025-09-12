"use client";

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
      <div className="text-center py-16">
        <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
          <p className="text-gray-500">Check back soon for new gaming gear!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {products.map((product, index) => {
        // Debug each product
        console.log('Rendering product:', product.name, 'slug:', product.slug);
        
        return (
          <div
            key={product._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
}