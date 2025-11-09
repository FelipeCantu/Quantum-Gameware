'use client';

import { useTheme } from '@/context/ThemeContext';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';

export default function HomeContent({
  featuredProducts,
  products
}: {
  featuredProducts: Product[];
  products: Product[];
}) {
  const { getBgClass, getTextClass, effectiveTheme } = useTheme();

  return (
    <>
      {/* Featured Products Section with themed background */}
      <section className={`${getBgClass()} py-20`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-4xl font-bold ${getTextClass()} mb-4`}>
              Featured Products
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Discover our hand-picked selection of premium gaming gear
            </p>
          </div>
          <ProductGrid products={Array.isArray(featuredProducts) ? featuredProducts : []} />
        </div>
      </section>

      {/* All Products Section with themed background */}
      <section className={`${getBgClass()} py-20 border-t ${effectiveTheme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-4xl font-bold ${getTextClass()} mb-4`}>
              All Products
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Browse our complete collection of gaming accessories
            </p>
          </div>
          <ProductGrid products={Array.isArray(products) ? products : []} />
        </div>
      </section>
    </>
  );
}
