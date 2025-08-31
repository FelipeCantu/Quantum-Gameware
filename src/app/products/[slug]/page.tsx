// src/app/products/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getProduct, getProducts } from '../../../sanity/lib/queries';
import { Product } from '@/types';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params first
  const { slug } = await params;
  const product: Product = await getProduct(slug);

  // Instead of notFound(), show a friendly message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Available</h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the product you're looking for. It might be out of stock or no longer available.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-gray-600">{product.brand}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600">{product.category}</span>
          </div>

          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="ml-2 text-gray-600">({product.rating})</span>
            </div>
          )}

          <div className="mb-6">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
                <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {product.compatibility && product.compatibility.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Compatibility</h3>
              <div className="flex flex-wrap gap-2">
                {product.compatibility.map((platform, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center">
              {product.inStock ? (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getProducts();
  
  // Return empty array if no products to avoid build errors
  if (!products || products.length === 0) {
    return [];
  }
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}