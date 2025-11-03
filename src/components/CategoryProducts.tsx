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
          <div className="space-y-6">
            {sortedProducts.map((product) => {
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
                  className="group relative flex flex-col sm:flex-row gap-6 bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${encodeURIComponent(product.slug)}`}
                    className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden"
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {product.isNew && (
                        <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                          NEW
                        </span>
                      )}
                      {discountPercentage > 0 && (
                        <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                          -{discountPercentage}%
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
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand and Category */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{product.brand}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{product.category}</span>
                      </div>

                      {/* Product Name and Price */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <Link href={`/products/${encodeURIComponent(product.slug)}`}>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Wishlist Button */}
                        <button
                          onClick={handleWishlistToggle}
                          className={`p-2.5 backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0 ${
                            inWishlist
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-white hover:bg-gray-50 border border-gray-200'
                          }`}
                          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <svg
                            className={`w-5 h-5 transition-colors ${
                              inWishlist ? 'text-white' : 'text-gray-600'
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
                      <div className="mb-4">
                        {product.originalPrice && product.originalPrice > product.price ? (
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                            <span className="text-lg text-gray-500 line-through">${product.originalPrice?.toFixed(2)}</span>
                            <span className="text-sm text-green-700 font-semibold">
                              Save ${(product.originalPrice - product.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-3xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({product.rating.toFixed(1)})
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {product.inStock ? (
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`
                          flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
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

                      <Link
                        href={`/products/${encodeURIComponent(product.slug)}`}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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
