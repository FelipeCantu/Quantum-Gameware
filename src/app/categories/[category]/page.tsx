// src/app/categories/[category]/page.tsx
import { getProducts } from '@/sanity/lib/queries';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { getCategoryBySlug, getAllCategorySlugs } from '@/data/categories';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  // Get category data
  const categoryData = getCategoryBySlug(decodedCategory);
  
  // Get all products and filter by category
  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter(
    product => product.category.toLowerCase() === categoryData?.name.toLowerCase() ||
               product.category.toLowerCase().includes(decodedCategory.toLowerCase())
  );

  if (!categoryData) {
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
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
            <div className="max-w-md mx-auto text-center px-4">
              <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  We couldn't find the category you're looking for.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/categories"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Browse All Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Same gradient background as home */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
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
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">{categoryData.name}</span>
            </nav>

            {/* Category Header */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-8xl mb-4 lg:mb-0">{categoryData.icon}</div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {categoryData.name}
                </h1>
                <p className="text-xl text-white/80 mb-6 leading-relaxed max-w-2xl">
                  {categoryData.description}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/70">
                  <span className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {categoryProducts.length} Products
                  </span>
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium">
                    ${categoryData.priceRange.min} - ${categoryData.priceRange.max}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated to match Explore More Categories */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
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

      {/* Products Section - Same styling as home page */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          {/* Filter and Sort Options - Updated to match Explore More Categories */}
          {categoryProducts.length > 0 && (
            <div className="relative bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg rounded-3xl border border-blue-300/50 p-6 mb-8 shadow-lg">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Sort by:</span>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 text-gray-700">
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">View:</span>
                    <div className="flex items-center bg-gray-100/70 backdrop-blur-sm rounded-lg p-1">
                      <button className="p-2 rounded-md bg-white/80 shadow-sm">
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-md">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl p-12 max-w-md mx-auto border border-gray-100 shadow-sm">
                <div className="text-6xl mb-6">{categoryData.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Products Yet</h3>
                <p className="text-gray-600 mb-6">
                  We're working on adding {categoryData.name.toLowerCase()} to our catalog. Check back soon!
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
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  All {categoryData.name}
                </h2>
                <span className="text-gray-600">
                  {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <ProductGrid products={categoryProducts} />
            </div>
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
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({
    category: slug,
  }));
}