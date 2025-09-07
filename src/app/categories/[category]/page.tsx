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
          <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                We couldn&apos;t find the category you&apos;re looking for.
              </p>
              <div className="space-y-4">
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full"
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
      </div>
    );
  }

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
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
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

          {/* Hero Section */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div className="px-8 py-12 lg:px-16">
                <div className="text-6xl mb-4">{categoryData.icon}</div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  {categoryData.name}
                </h1>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  {categoryData.description}
                </p>
                <div className="flex items-center gap-4 text-white/70">
                  <span className="bg-white/20 px-4 py-2 rounded-full">
                    {categoryProducts.length} Products
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full">
                    ${categoryData.priceRange.min} - ${categoryData.priceRange.max}
                  </span>
                </div>
              </div>

              {/* Category Image */}
              <div className="relative h-80 lg:h-96">
                <div className="absolute inset-4 bg-white/10 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-8xl opacity-60">{categoryData.icon}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Key Features */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
              <ul className="space-y-3">
                {categoryData.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/80">
                    <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Brands */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Popular Brands</h3>
              <div className="space-y-3">
                {categoryData.popularBrands.map((brand, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3 text-white/80 font-medium">
                    {brand}
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Compatibility</h3>
              <div className="flex flex-wrap gap-3">
                {categoryData.compatibility.map((platform, index) => (
                  <span key={index} className="bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                    {platform}
                  </span>
                ))}
              </div>
              <div className="mt-6 text-white/70">
                <div className="text-lg font-semibold text-white mb-2">Price Range</div>
                <div className="text-2xl font-bold text-green-400">
                  ${categoryData.priceRange.min} - ${categoryData.priceRange.max}
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Sort Options */}
          {categoryProducts.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">Sort by:</span>
                  <select className="px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white">
                    <option value="newest" className="bg-gray-800">Newest First</option>
                    <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                    <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                    <option value="name" className="bg-gray-800">Name A-Z</option>
                    <option value="rating" className="bg-gray-800">Highest Rated</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">View:</span>
                  <div className="flex items-center bg-white/20 rounded-lg p-1">
                    <button className="p-2 rounded-md bg-white/20 shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-md">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-white/20">
                <div className="text-6xl mb-6">{categoryData.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">No Products Yet</h3>
                <p className="text-white/80 mb-6">
                  We&apos;re working on adding {categoryData.name.toLowerCase()} to our catalog. Check back soon!
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Browse Other Categories
                </Link>
              </div>
            </div>
          ) : (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  All {categoryData.name}
                </h2>
                <span className="text-white/80">
                  {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <ProductGrid products={categoryProducts} />
            </div>
          )}

          {/* Related Categories */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Explore More Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/categories/keyboards" className="group bg-white/10 hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3">⌨️</div>
                <div className="text-white font-medium">Keyboards</div>
              </Link>
              <Link href="/categories/mice" className="group bg-white/10 hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3">🖱️</div>
                <div className="text-white font-medium">Mice</div>
              </Link>
              <Link href="/categories/headsets" className="group bg-white/10 hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3">🎧</div>
                <div className="text-white font-medium">Headsets</div>
              </Link>
              <Link href="/categories/monitors" className="group bg-white/10 hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3">🖥️</div>
                <div className="text-white font-medium">Monitors</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({
    category: slug,
  }));
}