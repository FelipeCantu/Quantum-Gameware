// src/app/page.tsx - Updated with 3D Hero
import { getProducts, getFeaturedProducts } from '../sanity/lib/queries'
import Hero3D from '@/components/ui/Hero3D'; // New 3D Hero component
import HomeContent from './HomeContent';
// import Hero from '@/components/ui/Hero'; // Old hero (commented out)

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
        {/* NEW: 3D Hero Section */}
        <Hero3D />

        {/* OLD: Replace this line with the above */}
        {/* <Hero /> */}

        {/* Themed product sections */}
        <HomeContent featuredProducts={featuredProducts} products={products} />
      </div>
    );
    
  } catch (error) {
    console.error('Error fetching products:', error);

    return (
      <div>
        {/* Even in error state, show the 3D Hero */}
        <Hero3D />
        <HomeContent featuredProducts={[]} products={[]} />
      </div>
    );
  }
}