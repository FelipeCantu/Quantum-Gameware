// src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/sanity/lib/queries';
import Link from 'next/link';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import ProductGrid from '@/components/ProductGrid';

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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Loading categories...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
            <div className="text-center text-white text-xl">{error}</div>
          </div>
        </section>
      </div>
    );
  }

  const productCategories = groupProductsByCategory(products);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Same gradient background as home */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center space-x-2 text-white/80 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">Categories</span>
            </nav>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Shop by Category
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover premium gaming gear organized by category. Find exactly what you need to level up your setup.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid Section - Same styling as home page */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Browse All Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect gaming gear for your setup
            </p>
          </div>

          {/* All Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {categories.map((category, index) => {
              // Find matching products for this category
              const matchingProducts = productCategories.find(pc => 
                pc.name.toLowerCase().includes(category.name.toLowerCase().split(' ')[1]) ||
                category.name.toLowerCase().includes(pc.name.toLowerCase())
              );
              const productCount = matchingProducts ? matchingProducts.count : 0;
              
              return (
                <div
                  key={category.slug}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 animate-fade-in hover:bg-gray-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/categories/${category.slug}`}>
                    {/* Category Icon/Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden flex items-center justify-center">
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Product Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                        {productCount} {productCount === 1 ? 'product' : 'products'}
                      </div>
                      
                      {/* Price Range Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${category.priceRange.min}+
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-2">
                        {category.description}
                      </p>

                      {/* Quick Features */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {category.features.slice(0, 2).map((feature, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {feature.split(' ').slice(0, 2).join(' ')}
                            </span>
                          ))}
                        </div>
                        
                        {/* Popular Brands Preview */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Popular:</span>
                          <span>{category.popularBrands.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Current Product Categories (if any exist) */}
          {productCategories.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Categories with Products
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Browse our current inventory organized by category
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productCategories.map((category, index) => (
                  <div
                    key={category.name}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 animate-fade-in"
                    style={{ animationDelay: `${(categories.length + index) * 100}ms` }}
                  >
                    <Link href={`/categories/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                      {/* Category Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Product Count Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                          {category.count} {category.count === 1 ? 'product' : 'products'}
                        </div>
                        
                        {/* Category Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl opacity-60">🎮</div>
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <svg 
                            className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          Explore our {category.name.toLowerCase()} collection featuring premium gaming gear.
                        </p>

                        {/* Preview Products */}
                        <div className="flex -space-x-2">
                          {category.products.slice(0, 3).map((product, i) => (
                            <div 
                              key={product._id} 
                              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center text-xs"
                              style={{ zIndex: 3 - i }}
                            >
                              🎮
                            </div>
                          ))}
                          {category.count > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                              +{category.count - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Categories CTA */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 text-center shadow-sm">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our complete collection of gaming accessories and find your perfect setup.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                View All Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}