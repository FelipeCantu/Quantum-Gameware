// src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

// Group products by category
function groupProductsByCategory(products: Product[]) {
  const categoryMap = new Map<string, Product[]>();
  
  products.forEach(product => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, []);
    }
    categoryMap.get(product.category)!.push(product);
  });
  
  return Array.from(categoryMap.entries()).map(([name, products]) => ({
    name,
    products,
    count: products.length,
    // Use first product&apos;s image as category image
    image: products[0]?.image || '/placeholder-category.jpg'
  }));
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
          <div className="text-center text-white text-xl">{error}</div>
        </div>
      </div>
    );
  }

  const categories = groupProductsByCategory(products);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <nav className="flex items-center justify-center space-x-2 text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">Categories</span>
            </nav>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover premium gaming gear organized by category. Find exactly what you need to level up your setup.
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-white/20">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No Categories Found</h3>
                <p className="text-white/80 mb-6">
                  We&apos;re setting up our product categories. Check back soon!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 animate-fade-in hover:bg-white/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/categories/${encodeURIComponent(category.name.toLowerCase())}`}>
                    {/* Category Image */}
                    <div className="relative h-64 bg-white/10 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-category.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      {/* Product Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.count} {category.count === 1 ? 'product' : 'products'}
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {category.name}
                        </h3>
                        <svg 
                          className="w-6 h-6 text-white/60 group-hover:text-blue-300 transform group-hover:translate-x-1 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      <p className="text-white/80 mb-6 leading-relaxed">
                        Explore our {category.name.toLowerCase()} collection featuring premium gaming gear.
                      </p>

                      {/* Preview Products */}
                      <div className="flex -space-x-2">
                        {category.products.slice(0, 3).map((product, i) => (
                          <div 
                            key={product._id} 
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-sm bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            style={{ zIndex: 3 - i }}
                          >
                            <div className="text-xs">📦</div>
                          </div>
                        ))}
                        {category.count > 3 && (
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-xs font-semibold text-white">
                            +{category.count - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Featured Categories CTA */}
          {categories.length > 0 && (
            <div className="mt-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Browse our complete collection of gaming accessories and find your perfect setup.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}