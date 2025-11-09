// src/app/wishlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { Product } from '@/types';

function WishlistContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, isLoading: wishlistLoading } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isAddingAll, setIsAddingAll] = useState(false);

  // Fetch products based on wishlist IDs
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlist || wishlist.length === 0) {
        setWishlistItems([]);
        setIsLoadingProducts(false);
        return;
      }

      try {
        setIsLoadingProducts(true);
        const query = `*[_type == "product" && slug.current in $slugs] {
          _id,
          name,
          "slug": slug.current,
          price,
          originalPrice,
          description,
          "image": image.asset->url,
          "category": category->name,
          "brand": coalesce(brand->name, brand),
          inStock,
          rating,
          isNew
        }`;

        const products = await client.fetch(query, { slugs: wishlist });
        console.log('Fetched wishlist products:', products);
        setWishlistItems(products);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleRemoveFromWishlist = async (slug: string) => {
    setRemovingItems(prev => new Set(prev).add(slug));

    const success = await removeFromWishlist(slug);

    if (success) {
      setWishlistItems(prev => prev.filter(item => item.slug !== slug));
    }

    setRemovingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(slug);
      return newSet;
    });
  };

  const handleAddToCart = (item: Product) => {
    addToCart(item);
  };

  const handleAddAllToCart = () => {
    setIsAddingAll(true);

    // Filter and add only items that are in stock
    const inStockItems = wishlistItems.filter(item => item.inStock);

    // Add each item to cart
    inStockItems.forEach(item => {
      addToCart(item);
    });

    // Brief delay for visual feedback
    setTimeout(() => {
      setIsAddingAll(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">My Wishlist</h1>
            <p className="text-white/70 text-base sm:text-lg">Save items for later and track price changes</p>
          </div>

          {/* Wishlist Content */}
          <div>
            {isLoadingProducts || wishlistLoading ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-white/70 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-white/70">Loading your wishlist...</p>
                </div>
              </div>
            ) : wishlistItems.length > 0 ? (
              <div className="space-y-6">
                {/* Wishlist Summary */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Wishlist
                      </h2>
                      <p className="text-white/70 text-sm sm:text-base">
                        Total value: ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={handleAddAllToCart}
                      disabled={isAddingAll || wishlistItems.every(item => !item.inStock)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingAll ? (
                        <>
                          <svg className="w-4 h-4 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add All to Cart'
                      )}
                    </button>
                  </div>
                </div>

                {/* Wishlist Items */}
                <div className="grid gap-6">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.slug}
                      className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6 transition-all duration-300 ${
                        removingItems.has(item.slug) ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                            <div className="w-full lg:w-48 h-48 bg-white/5 rounded-xl overflow-hidden relative">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 192px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                  <div className="text-gray-400 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm">No Image</span>
                                  </div>
                                </div>
                              )}
                              {/* Stock indicator */}
                              {!item.inStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between h-full">
                              <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                                {/* Brand and Category */}
                                {(item.brand || item.category) && (
                                  <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                                    {item.brand && <span className="font-medium">{item.brand}</span>}
                                    {item.brand && item.category && <span className="w-1 h-1 bg-white/50 rounded-full"></span>}
                                    {item.category && <span>{item.category}</span>}
                                  </div>
                                )}

                                {/* Product Name */}
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">
                                  {item.name}
                                </h3>

                                {/* Rating */}
                                {item.rating && (
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-400 text-sm">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(item.rating!) ? 'text-yellow-400' : 'text-white/30'}>
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    <span className="text-white/70 text-sm">({item.rating})</span>
                                  </div>
                                )}

                                {/* Price */}
                                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4">
                                  <span className="text-xl sm:text-2xl font-bold text-white">${item.price}</span>
                                  {item.originalPrice && item.originalPrice > item.price && (
                                    <>
                                      <span className="text-base sm:text-lg text-white/60 line-through">${item.originalPrice}</span>
                                      <span className="text-xs sm:text-sm text-green-400 font-semibold">
                                        Save ${(item.originalPrice - item.price).toFixed(2)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 sm:gap-3 lg:ml-6">
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  disabled={!item.inStock}
                                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                                    item.inStock
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105'
                                      : 'bg-white/20 text-white/60 cursor-not-allowed'
                                  }`}
                                >
                                  {item.inStock ? (
                                    <>
                                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      Add to Cart
                                    </>
                                  ) : (
                                    'Out of Stock'
                                  )}
                                </button>

                                <button
                                  onClick={() => handleRemoveFromWishlist(item.slug)}
                                  disabled={removingItems.has(item.slug)}
                                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-red-500/20 text-white hover:text-red-200 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                                >
                                  {removingItems.has(item.slug) ? (
                                    <>
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Removing...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Remove
                                    </>
                                  )}
                                </button>

                                <Link
                                  href={`/products/${item.slug}`}
                                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-semibold transition-colors text-sm sm:text-base"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4">💝</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
                <p className="text-white/70 mb-6 text-sm sm:text-base">
                  Discover amazing gaming gear and save your favorites for later!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                >
                  Explore Products
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AuthGuard requireAuth={true}>
      <WishlistContent />
    </AuthGuard>
  );
}