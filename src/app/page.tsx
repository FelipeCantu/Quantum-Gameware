// src/app/page.tsx
import { getProducts, getFeaturedProducts } from '../sanity/lib/queries'
import ProductGrid from '@/components/ProductGrid';
import Hero from '@/components/ui/Hero';

// Add revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  try {
    const [products, featuredProducts] = await Promise.all([
      getProducts(),
      getFeaturedProducts()
    ]);

    return (
      <div>
        <Hero />
        
        {/* Featured Products Section with proper background */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our hand-picked selection of premium gaming gear
              </p>
            </div>
            <ProductGrid products={Array.isArray(featuredProducts) ? featuredProducts : []} />
          </div>
        </section>
        
        {/* All Products Section with different background */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">All Products</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Browse our complete collection of gaming accessories
              </p>
            </div>
            <ProductGrid products={Array.isArray(products) ? products : []} />
          </div>
        </section>
      </div>
    );
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    return (
      <div>
        <Hero />
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h2>
              <p className="text-red-600">Please try refreshing the page or check back later.</p>
              <p className="text-sm text-red-500 mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}