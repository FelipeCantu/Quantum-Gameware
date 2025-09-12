// src/app/products/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getProduct, getProducts, getRelatedProducts } from '../../../sanity/lib/queries';
import { Product } from '@/types';
import AddToCartButton from '@/components/ui/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Metadata } from 'next';
import ProductImageGallery from './ProductImageGallery';
import ProductInfoTabs from './ProductInfoTabs';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Related Products Component
function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          You Might Also Like
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Similar products that other customers loved
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="opacity-0 animate-fade-in"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <ProductCard 
              product={product} 
              imageAspectRatio="square"
              className="h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// Main Product Page Component (Server Component)
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with gradient and pattern - same as other pages */}
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

        <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 animate-fade-in">
              <div className="text-6xl mb-6">😕</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Product Not Found
              </h1>
              <p className="text-white/80 mb-8">
                Sorry, we couldn't find the product you're looking for.
              </p>
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="block w-full bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/categories"
                  className="block w-full border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Shop by Category
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get related products
  const relatedProducts = await getRelatedProducts(product._id, product.category, 4);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern - same as header */}
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
        {/* Enhanced Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <nav className="flex items-center space-x-2 text-white/80 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <Link href="/" className="hover:text-white transition-colors font-medium">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-white transition-colors font-medium">
              Products
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-white transition-colors font-medium">
              {product.category}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium truncate">{product.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* Product Images - Client Component */}
            <div className="animate-fade-in">
              <ProductImageGallery product={product} />
            </div>

            {/* Product Info - Client Component */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {/* Product Header */}
              <div className="space-y-6">
                {/* Brand and Category */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                    {product.brand}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                {product.rating && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-xl ${
                            i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-white/30'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-white/80 font-medium">
                      {product.rating}/5 ({Math.floor(Math.random() * 500) + 100} reviews)
                    </span>
                    <button className="text-blue-300 hover:text-blue-200 font-medium text-sm">
                      Read Reviews →
                    </button>
                  </div>
                )}

                {/* Price Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="text-4xl lg:text-5xl font-bold text-white">
                          ${product.price}
                        </span>
                        <span className="text-2xl text-white/60 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                        <span className="text-green-400 font-semibold">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl lg:text-5xl font-bold text-white">
                      ${product.price}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm border ${
                  product.inStock 
                    ? 'bg-green-500/20 border-green-400/30' 
                    : 'bg-red-500/20 border-red-400/30'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    product.inStock ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`} />
                  <span className={`font-semibold ${
                    product.inStock ? 'text-green-200' : 'text-red-200'
                  }`}>
                    {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                  </span>
                  <span className={`text-sm ${
                    product.inStock ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {product.inStock 
                      ? 'Ready to ship within 24 hours' 
                      : "We'll notify you when it's back"
                    }
                  </span>
                </div>
              </div>

              {/* Tabbed Content - Client Component */}
              <ProductInfoTabs product={product} />

              {/* Add to Cart Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <AddToCartButton product={product} />
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: "🚚", text: "Free Shipping", subtext: "On orders over $50" },
                  { icon: "🛡️", text: "Warranty", subtext: "1-year coverage" },
                  { icon: "↩️", text: "Returns", subtext: "30-day policy" },
                  { icon: "🔒", text: "Secure", subtext: "Safe checkout" }
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-colors border border-white/20">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-white text-sm">{item.text}</div>
                    <div className="text-xs text-white/70">{item.subtext}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}

// Static generation functions
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
      return {
        title: 'Product Not Found - Quantum Gameware',
        description: 'The product you are looking for could not be found.',
      };
    }

    const price = product.originalPrice && product.originalPrice > product.price 
      ? `$${product.price} (was $${product.originalPrice})` 
      : `$${product.price}`;

    const description = `${product.description} ${price}. ${product.inStock ? 'In stock and ready to ship.' : 'Currently out of stock.'}`;

    return {
      title: `${product.name} - ${product.brand} | Quantum Gameware`,
      description,
      keywords: [
        product.name,
        product.brand,
        product.category,
        'gaming',
        'accessories',
        ...(product.features || [])
      ].join(', '),
      openGraph: {
        title: `${product.name} - ${product.brand}`,
        description,
        url: `/products/${slug}`,
        siteName: 'Quantum Gameware',
        images: [
          {
            url: product.image,
            width: 1200,
            height: 630,
            alt: product.name,
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${product.brand}`,
        description,
        images: [product.image],
        creator: '@quantumgameware',
      },
      robots: {
        index: product.inStock,
        follow: true,
        googleBot: {
          index: product.inStock,
          follow: true,
        },
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product - Quantum Gameware',
      description: 'Gaming accessories and gear at Quantum Gameware',
    };
  }
}