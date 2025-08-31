// src/app/products/page.tsx
import { getProducts } from '@/sanity/lib/queries';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Available</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products in our catalog.
            </p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-8">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          <ProductGrid products={products} />
        </>
      )}
    </div>
  );
}