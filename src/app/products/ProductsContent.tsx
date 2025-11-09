'use client';

import { useTheme } from '@/context/ThemeContext';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { Product } from '@/types';

export default function ProductsContent({ products }: { products: Product[] }) {
  const { getBgClass, getTextClass, getSecondaryTextClass, getCardBgClass, getBorderClass } = useTheme();

  return (
    <section className={`${getBgClass()} py-20`}>
      <div className="container mx-auto px-4">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className={`${getCardBgClass()} rounded-3xl p-12 max-w-md mx-auto shadow-sm border ${getBorderClass()}`}>
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className={`w-8 h-8 ${getSecondaryTextClass()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold ${getTextClass()} mb-4`}>No Products Available</h2>
              <p className={`${getSecondaryTextClass()} mb-6`}>
                We couldn&apos;t find any products in our catalog. Check back soon for new gaming gear!
              </p>
              <Link
                href="/"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg inline-block"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
