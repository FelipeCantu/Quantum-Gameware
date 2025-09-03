import { getProducts, getFeaturedProducts } from '../sanity/lib/queries'
import ProductGrid from '@/components/ProductGrid';
import Hero from '@/components/ui/Hero';

export default async function Home() {
  try {
    const [products, featuredProducts] = await Promise.all([
      getProducts(),
      getFeaturedProducts()
    ]);

    return (
      <div>
        <Hero />
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductGrid products={Array.isArray(featuredProducts) ? featuredProducts : []} />
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">All Products</h2>
          <ProductGrid products={Array.isArray(products) ? products : []} />
        </section>
      </div>
    );
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    return (
      <div>
        <Hero />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h2>
            <p className="text-red-600">Please try refreshing the page or check back later.</p>
          </div>
        </div>
      </div>
    );
  }
}