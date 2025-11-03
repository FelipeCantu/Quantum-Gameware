// src/components/CategoryProducts.tsx
'use client';

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SignInAlert from './ui/SignInAlert';
import Toast from './ui/Toast';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryProductsProps {
  products: Product[];
  categoryName: string;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name' | 'rating';
type ViewMode = 'grid' | 'list';

export default function CategoryProducts({ products, categoryName }: CategoryProductsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSignInAlert, setShowSignInAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortBy) {
      case 'price-low':
        return productsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));

      case 'price-high':
        return productsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));

      case 'name':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));

      case 'rating':
        return productsCopy.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });

      case 'newest':
      default:
        // Assume products are already sorted by newest from API
        // Or sort by _createdAt if available
        return productsCopy;
    }
  }, [products, sortBy]);

  return (
    <>
      {/* Filter and Sort Options */}
      {products.length > 0 && (
        <div className="relative bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg rounded-3xl border border-blue-300/50 p-6 mb-8 shadow-lg">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 text-gray-700 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">View:</span>
                <div className="flex items-center bg-gray-100/70 backdrop-blur-sm rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white/80 shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                    aria-label="Grid view"
                  >
                    <svg className={`w-4 h-4 ${viewMode === 'grid' ? 'text-gray-700' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list'
                        ? 'bg-white/80 shadow-sm'
                        : 'hover:bg-white/50'
                    }`}
                    aria-label="List view"
                  >
                    <svg className={`w-4 h-4 ${viewMode === 'list' ? 'text-gray-700' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Display */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            All {categoryName}
          </h2>
          <span className="text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && <ProductGrid products={sortedProducts} />}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-8">
            {sortedProducts.map((product, index) => {
              const inWishlist = isInWishlist(product.slug);
              const discountPercentage = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              const handleAddToCart = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
                setToastMessage('Added to cart! 🛒');
                setToastType('success');
                setShowToast(true);
              };

              const handleWishlistToggle = async (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();

                if (!isAuthenticated) {
                  setShowSignInAlert(true);
                  return;
                }

                const wasInWishlist = inWishlist;
                const success = await toggleWishlist(product.slug);

                if (success) {
                  if (wasInWishlist) {
                    setToastMessage('Removed from wishlist');
                    setToastType('info');
                  } else {
                    setToastMessage('Added to wishlist! ❤️');
                    setToastType('success');
                  }
                  setShowToast(true);
                } else {
                  setToastMessage('Failed to update wishlist');
                  setToastType('error');
                  setShowToast(true);
                }
              };

              return (
                <div
                  key={product._id}
                  className="group relative flex flex-col sm:flex-row gap-8 bg-gradient-to-br from-white via-white to-blue-50/30 rounded-3xl p-8 border border-gray-200/50 hover:border-blue-300/50 shadow-md hover:shadow-2xl transition-all duration-500 animate-fade-in backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Product Image */}
                  <Link
                    href={`/products/${encodeURIComponent(product.slug)}`}
                    className="relative w-full sm:w-64 h-64 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 z-10 ring-2 ring-gray-100 group-hover:ring-blue-200"
                  >
                    {product.image ? (
                      <>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
                          sizes="(max-width: 768px) 100vw, 256px"
                        />
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg className="w-20 h-20 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">No image</span>
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.isNew && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-xl backdrop-blur-sm border border-white/20 animate-pulse">
                          ✨ NEW
                        </span>
                      )}
                      {discountPercentage > 0 && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-xl backdrop-blur-sm border border-white/20">
                          🔥 -{discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Stock Status Overlay */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/90 text-gray-900 px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg">
                          Out of Stock
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      {/* Brand and Category */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 rounded-lg text-sm font-semibold shadow-sm">
                          {product.brand}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 text-purple-700 rounded-lg text-sm font-medium shadow-sm">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Name and Wishlist */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <Link href={`/products/${encodeURIComponent(product.slug)}`} className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Wishlist Button */}
                        <button
                          onClick={handleWishlistToggle}
                          className={`p-3 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0 hover:scale-110 ${
                            inWishlist
                              ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                              : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300'
                          }`}
                          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <svg
                            className={`w-6 h-6 transition-all duration-300 ${
                              inWishlist ? 'text-white' : 'text-gray-600 group-hover:text-red-500'
                            }`}
                            fill={inWishlist ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="mb-5 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
                        {product.originalPrice && product.originalPrice > product.price ? (
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              ${product.price?.toFixed(2)}
                            </span>
                            <span className="text-xl text-gray-400 line-through font-medium">${product.originalPrice?.toFixed(2)}</span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full shadow-md">
                              💰 Save ${(product.originalPrice - product.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${product.price?.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-gray-700 text-lg mb-5 leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-3 mb-5 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                          <div className="flex text-2xl">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`transition-all duration-300 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500 drop-shadow-sm' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-base text-gray-700 font-semibold">
                            {product.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-3">
                        {product.inStock ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-md">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            ✓ In Stock
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl text-sm font-bold shadow-md">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            ✗ Out of Stock
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`
                          w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                          ${product.inStock
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        {product.inStock ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Add to Cart
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                            Sold Out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sign In Alert */}
      <SignInAlert
        isOpen={showSignInAlert}
        onClose={() => setShowSignInAlert(false)}
        message="Please sign in to save items to your wishlist and access them across all your devices."
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
