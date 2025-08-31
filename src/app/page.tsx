// src/app/page.tsx
import { getProducts, getFeaturedProducts } from '../sanity/lib/queries'
import ProductGrid from '@/components/ProductGrid';
import Hero from '@/components/ui/Hero';

export default async function Home() {
  // Add error handling since your queries might fail during initial setup
  let products = [];
  let featuredProducts = [];
  
  try {
    [products, featuredProducts] = await Promise.all([
      getProducts(),
      getFeaturedProducts()
    ]);
  } catch (error) {
    console.error('Error fetching products:', error);
    // You can handle the error gracefully here
  }

  return (
    <div>
      <Hero />
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <ProductGrid products={featuredProducts} />
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">All Products</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}