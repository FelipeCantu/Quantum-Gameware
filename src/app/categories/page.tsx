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

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts: Product[] = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* … loading UI unchanged … */}
      </div>
    );
  }

  const categories = groupProductsByCategory(products);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* background stuff unchanged */}

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* header unchanged */}

          {categories.length === 0 ? (
            /* … empty state unchanged … */
            <div> … </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="group bg-white/10 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 animate-fade-in hover:bg-white/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/categories/${encodeURIComponent(category.name.toLowerCase())}`}>
                    <div className="relative h-64 bg-white/10 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.count} {category.count === 1 ? 'product' : 'products'}
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {category.name}
                        </h3>
                        {/* arrow svg */}
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

          {/* CTA unchanged */}
        </div>
      </div>
    </div>
  );
}
