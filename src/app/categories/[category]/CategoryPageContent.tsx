'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { Product } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';

interface CategoryData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  features: string[];
  popularBrands: string[];
  compatibility: string[];
  priceRange: { min: number; max: number };
  image: string;
  video?: string;
}

interface CategoryPageContentProps {
  categoryData: CategoryData;
  categoryProducts: Product[];
}

export default function CategoryPageContent({ categoryData, categoryProducts }: CategoryPageContentProps) {
  const { getBgClass, getTextClass, getSecondaryTextClass, getCardBgClass, getBorderClass } = useTheme();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(categoryProducts);

  // Update filtered products when category products change
  useEffect(() => {
    setFilteredProducts(categoryProducts);
  }, [categoryProducts]);

  return (
    <>
      {/* Features Section */}
      <section className={`${getBgClass()} py-16 border-b ${getBorderClass()}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Key Features */}
            <div className="relative bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 backdrop-blur-lg border border-blue-300/50 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-6">Key Features</h3>
                <ul className="space-y-3">
                  {categoryData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Popular Brands */}
            <div className="relative bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 backdrop-blur-lg border border-blue-300/50 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-6">Popular Brands</h3>
                <div className="space-y-3">
                  {categoryData.popularBrands.map((brand, index) => (
                    <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 text-gray-700 font-medium border border-purple-200/50">
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compatibility */}
            <div className="relative bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 backdrop-blur-lg border border-blue-300/50 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-6">Compatibility</h3>
                <div className="flex flex-wrap gap-3">
                  {categoryData.compatibility.map((platform, index) => (
                    <span key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 text-gray-700 font-medium border border-purple-200/50">
                      {platform}
                    </span>
                  ))}
                </div>
                <div className="mt-6 text-gray-600">
                  <div className="text-lg font-semibold text-gray-900 mb-2">Price Range</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${categoryData.priceRange.min} - ${categoryData.priceRange.max}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={`${getBgClass()} py-20`}>
        <div className="container mx-auto px-4">
          {/* Products with Filters and Sorting */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className={`${getCardBgClass()} rounded-3xl p-12 max-w-md mx-auto border ${getBorderClass()} shadow-sm`}>
                <div className="text-6xl mb-6">{categoryData.icon}</div>
                <h3 className={`text-2xl font-semibold ${getTextClass()} mb-3`}>No Products Yet</h3>
                <p className={`${getSecondaryTextClass()} mb-6`}>
                  We&apos;re working on adding {categoryData.name.toLowerCase()} to our catalog. Check back soon!
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Browse Other Categories
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <CategoryFilter
                products={categoryProducts}
                onFilterChange={setFilteredProducts}
                selectedCategory={categoryData.slug}
              />

              {/* Products Grid */}
              <div className="mb-16">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold ${getTextClass()} mb-2`}>
                      All {categoryData.name}
                    </h2>
                    <p className={`${getSecondaryTextClass()} text-sm`}>
                      Showing {filteredProducts.length} of {categoryProducts.length} products
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-5 py-3 rounded-xl ${getCardBgClass()} border-2 ${getBorderClass()} shadow-md`}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
                          <span className={`${getSecondaryTextClass()} text-sm font-medium`}>Results:</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                          {filteredProducts.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <ProductGrid products={filteredProducts} />
                ) : (
                  <div className={`${getCardBgClass()} rounded-2xl border-2 border-dashed ${getBorderClass()} p-12 text-center`}>
                    <div className="max-w-md mx-auto">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className={`text-xl font-bold ${getTextClass()} mb-2`}>No Products Found</h3>
                      <p className={`${getSecondaryTextClass()} mb-6`}>
                        Try adjusting your filters or search criteria to find what you're looking for.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {categoryProducts.length} total products available
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Related Categories */}
          <div className="relative bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 backdrop-blur-lg border border-blue-300/50 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden">
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-purple-200/60 to-indigo-200/60 rounded-3xl"></div>
            {/* Floating elements for more color */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-8 text-center">
                Explore More Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/categories/keyboards" className="group bg-gradient-to-br from-white/80 to-blue-50/80 hover:from-white/95 hover:to-blue-100/95 backdrop-blur-lg rounded-2xl p-6 text-center transition-all duration-300 border border-blue-300/50 hover:border-blue-400/70 shadow-lg hover:shadow-xl hover:scale-105">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⌨️</div>
                  <div className="text-gray-800 font-bold">Keyboards</div>
                </Link>
                <Link href="/categories/mice" className="group bg-gradient-to-br from-white/80 to-purple-50/80 hover:from-white/95 hover:to-purple-100/95 backdrop-blur-lg rounded-2xl p-6 text-center transition-all duration-300 border border-purple-300/50 hover:border-purple-400/70 shadow-lg hover:shadow-xl hover:scale-105">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🖱️</div>
                  <div className="text-gray-800 font-bold">Mice</div>
                </Link>
                <Link href="/categories/headsets" className="group bg-gradient-to-br from-white/80 to-indigo-50/80 hover:from-white/95 hover:to-indigo-100/95 backdrop-blur-lg rounded-2xl p-6 text-center transition-all duration-300 border border-indigo-300/50 hover:border-indigo-400/70 shadow-lg hover:shadow-xl hover:scale-105">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🎧</div>
                  <div className="text-gray-800 font-bold">Headsets</div>
                </Link>
                <Link href="/categories/monitors" className="group bg-gradient-to-br from-white/80 to-blue-50/80 hover:from-white/95 hover:to-blue-100/95 backdrop-blur-lg rounded-2xl p-6 text-center transition-all duration-300 border border-blue-300/50 hover:border-blue-400/70 shadow-lg hover:shadow-xl hover:scale-105">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🖥️</div>
                  <div className="text-gray-800 font-bold">Monitors</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
