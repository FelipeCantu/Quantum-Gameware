// src/app/categories/page.tsx
import { getProducts } from '@/sanity/lib/queries';
import Link from 'next/link';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import CategoriesContent from './CategoriesContent';

// Server-side function to group products by category
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

export default async function CategoriesPage() {
  try {
    // Fetch products server-side
    const products = await getProducts();
    const productCategories = groupProductsByCategory(products);

    // Create product count map
    const productCounts: { [key: string]: number } = {};
    productCategories.forEach(pc => {
      const matchingCategory = categories.find(c =>
        c.name.toLowerCase().includes(pc.name.toLowerCase().split(' ')[1]) ||
        pc.name.toLowerCase().includes(c.name.toLowerCase())
      );
      if (matchingCategory) {
        productCounts[matchingCategory.slug] = pc.count;
      }
    });

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
                Discover premium gaming gear organized by category. Hover to see them in action.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid Section */}
        <CategoriesContent productCategories={productCategories} productCounts={productCounts} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching categories:', error);

    return (
      <div className="min-h-screen">
        {/* Error state omitted for brevity - keep your existing error handling */}
      </div>
    );
  }
}