// src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

// Type definitions for your data
interface Product {
  _id: string;
  name: string;
  image: string;
  category: string;
}

interface CategoryGroup {
  name: string;
  products: Product[];
  count: number;
  image: string;
}

// Group products by category
function groupProductsByCategory(products: Product[]): CategoryGroup[] {
  const categoryMap = new Map<string, Product[]>();

  products.forEach((product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, []);
    }
    categoryMap.get(product.category)!.push(product);
  });

  return Array.from(categoryMap.entries()).map(([name, prods]) => ({
    name,
    products: prods,
    count: prods.length,
    image: prods[0]?.image || '/placeholder-category.jpg',
  }));
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts: Product[] = await getProducts();
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 pt-24 pb-16 flex items-center justify-center">
          <div className="text-white text-xl">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 pt-24 pb-16 flex items-center justify-center">
          <div className="text-white text-xl">{error}</div>
        </div>
      </div>
    );
  }

  const categories = groupProductsByCategory(products);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-50 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Product Categories
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore our wide range of gaming products organized by category
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white text-xl mb-2">No categories found</div>
              <p className="text-white/70">Please check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30"
                >
                  <Link href={`/categories/${encodeURIComponent(category.name.toLowerCase())}`}>
                    <div className="relative h-64 bg-white/10 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-category.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.count} {category.count === 1 ? 'product' : 'products'}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {category.name}
                        </h3>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>

                      <p className="text-white/80 mb-6 leading-relaxed">
                        Explore our {category.name.toLowerCase()} collection featuring premium gaming gear.
                      </p>

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

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}