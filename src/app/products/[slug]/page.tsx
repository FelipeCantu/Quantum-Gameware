// src/app/products/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getProduct, getProducts, getRelatedProducts } from '../../../sanity/lib/queries';
import { Product } from '@/types';
import AddToCartButton from '@/components/ui/AddToCartButton';
import WishlistButton from '@/components/ui/WishlistButton';
import { Metadata } from 'next';
import ProductImageGallery from './ProductImageGallery';
import ProductInfoTabs from './ProductInfoTabs';
import Breadcrumb from './Breadcrumb';
import TrustSignals from './TrustSignals';
import NotFound from './NotFound';
import RelatedProducts from './RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return <NotFound />;
  }

  const relatedProducts = await getRelatedProducts(product._id, product.category, 8);

  return (
    <div className="min-h-screen">
      {/* Product Details Section with Enhanced Dark Background */}
      <div className="relative overflow-hidden">
        {/* Enhanced Background with gradient and pattern */}
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

        <div className="relative z-10 pt-24 pb-8 md:pt-28 md:pb-12 lg:pt-32 lg:pb-16">
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 md:mb-6 lg:mb-8">
            <Breadcrumb product={product} />
          </div>

          {/* Main Content Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 mb-12 md:mb-16 lg:mb-20">
              {/* Product Images */}
              <div className="order-1 lg:order-1">
                <ProductImageGallery product={product} />
              </div>

              {/* Product Info */}
              <div className="space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-2">
                {/* Product Header */}
                <div className="space-y-3 md:space-y-4 lg:space-y-6">
                  {/* Brand and Category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 md:px-3 md:py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm">
                      {product.brand}
                    </span>
                    <span className="px-2 py-1 md:px-3 md:py-1 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating and Reviews */}
                  {product.rating && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-base md:text-lg lg:text-xl ${
                              i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-white/30'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-white/80 font-medium text-sm md:text-base">
                          {product.rating}/5 ({Math.floor(Math.random() * 500) + 100} reviews)
                        </span>
                        <button className="text-blue-300 hover:text-blue-200 font-medium text-xs md:text-sm text-left sm:text-center">
                          Read Reviews →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 md:gap-4">
                          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            ${product.price}
                          </span>
                          <span className="text-lg sm:text-xl md:text-2xl text-white/60 line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full inline-block w-fit">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                          <span className="text-green-400 font-semibold text-sm md:text-base">
                            Save ${(product.originalPrice - product.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm border ${
                    product.inStock 
                      ? 'bg-green-500/20 border-green-400/30' 
                      : 'bg-red-500/20 border-red-400/30'
                  }`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                        product.inStock ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                      }`} />
                      <span className={`font-semibold text-sm md:text-base ${
                        product.inStock ? 'text-green-200' : 'text-red-200'
                      }`}>
                        {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                      </span>
                    </div>
                    <span className={`text-xs md:text-sm ${
                      product.inStock ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {product.inStock 
                        ? 'Ready to ship within 24 hours' 
                        : "We'll notify you when it's back"
                      }
                    </span>
                  </div>
                </div>

                {/* Tabbed Content */}
                <div className="order-4 lg:order-3">
                  <ProductInfoTabs product={product} />
                </div>

                {/* Add to Cart Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl border border-white/20 p-4 md:p-6 order-3 lg:order-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <AddToCartButton product={product} />
                    </div>
                    <WishlistButton productSlug={product.slug} productName={product.name} variant="compact" />
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="order-5">
                  <TrustSignals />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}

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