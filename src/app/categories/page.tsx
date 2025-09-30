// src/app/categories/page.tsx
import { getProducts } from '@/sanity/lib/queries';
import Link from 'next/link';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import EnhancedCategoryGrid from '@/components/ui/EnhancedCategoryGrid';

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
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Browse All Categories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find the perfect gaming gear for your setup
              </p>
            </div>

            {/* Enhanced Category Grid with Video Hover */}
            <EnhancedCategoryGrid categories={categories} productCounts={productCounts} />

            {/* Current Product Categories (if any exist) */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productCategories.map((category, index) => {
                    // Find matching category data to get the icon and image
                    const categoryData = categories.find(c =>
                      c.name.toLowerCase().includes(category.name.toLowerCase().split(' ')[1]) ||
                      category.name.toLowerCase().includes(c.name.toLowerCase())
                    );

                    return (
                      <Link
                        key={category.name}
                        href={`/categories/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 animate-fade-in"
                        style={{ animationDelay: `${(categories.length + index) * 100}ms` }}
                      >
                        {/* Category Image with Overlay */}
                        <div className="relative h-56 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                          {/* Product Image (if available) */}
                          {category.image && category.image !== '/placeholder-category.jpg' ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : categoryData?.image ? (
                            <img
                              src={categoryData.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            // Fallback gradient with icon
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                              <div className="text-8xl opacity-40">
                                {categoryData?.icon || '🎮'}
                              </div>
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                          {/* Product Count Badge */}
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            {category.count} {category.count === 1 ? 'product' : 'products'}
                          </div>

                          {/* Category Icon - Floating */}
                          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                            <span className="text-3xl">
                              {categoryData?.icon || '🎮'}
                            </span>
                          </div>
                        </div>

                        {/* Category Info */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
                              {category.name}
                            </h3>
                            <svg
                              className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>

                          <p className="text-gray-600 mb-5 leading-relaxed">
                            Explore our {category.name.toLowerCase()} collection featuring premium gaming gear and accessories.
                          </p>

                          {/* Product Preview Avatars */}
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-3">
                              {category.products.slice(0, 4).map((product, i) => (
                                <div
                                  key={product._id}
                                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                                  style={{ zIndex: 4 - i }}
                                  title={product.name}
                                >
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-lg">
                                      {categoryData?.icon || '🎮'}
                                    </span>
                                  )}
                                </div>
                              ))}
                              {category.count > 4 && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md">
                                  +{category.count - 4}
                                </div>
                              )}
                            </div>

                            {/* View All Button */}
                            <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-700 hover:text-white rounded-xl font-medium transition-all duration-300 text-sm group-hover:shadow-lg">
                              View All
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-3xl transition-all duration-500 pointer-events-none" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Featured Categories CTA */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 text-center shadow-sm">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                Can&apos;t Find What You&apos;re Looking For?
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
  } catch (error) {
    console.error('Error fetching categories:', error);

    return (
      <div className="min-h-screen">
        {/* Error state omitted for brevity - keep your existing error handling */}
      </div>
    );
  }
}