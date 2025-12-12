"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import SignInAlert from './SignInAlert';
import Toast from './Toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
  imageAspectRatio?: 'square' | 'wide' | 'tall';
}

export default function ProductCard({
  product,
  className = "",
  showQuickActions = true,
  imageAspectRatio = 'wide'
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { effectiveTheme, getCardBgClass } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSignInAlert, setShowSignInAlert] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const inWishlist = isInWishlist(product.slug);

  // Make sure the product has a valid slug
  if (!product.slug) {
    console.error('Product missing slug:', product);
    return (
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20 p-4 flex items-center justify-center min-h-[200px]">
        <p className="text-gray-800 text-center text-xs font-medium">
          Product data incomplete
        </p>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowSignInAlert(true);
      return;
    }

    const wasInWishlist = inWishlist;
    setIsWishlistLoading(true);
    const success = await toggleWishlist(product.slug);
    setIsWishlistLoading(false);

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

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Image aspect ratio classes
  const imageClasses = {
    'square': 'aspect-square',
    'wide': 'aspect-[4/3]',
    'tall': 'aspect-[3/4]'
  };

  return (
    <div
      className={`
        group relative ${getCardBgClass()} backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl
        transition-all duration-500 overflow-hidden
        ${effectiveTheme === 'light'
          ? 'border border-gray-200 hover:border-gray-300 hover:bg-white shadow-gray-200/50'
          : 'border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 shadow-slate-900/50'
        }
        transform hover:scale-[1.02] flex flex-col h-full
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${encodeURIComponent(product.slug)}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className={`relative w-full ${imageClasses[imageAspectRatio]} bg-white/5 overflow-hidden`}>
          {product.image && !imageError ? (
            <>
              {/* Loading placeholder */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-white/10 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
              
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`
                  object-cover transition-all duration-700 group-hover:scale-110
                  ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <div className="text-gray-700 text-center">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] sm:text-xs font-medium">No image</span>
              </div>
            </div>
          )}
          
          {/* Badges Container */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2 z-10">
            {product.isNew && (
              <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-green-500 text-white text-[9px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                NEW
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-red-500 text-white text-[9px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions - hidden on mobile */}
          {showQuickActions && (
            <div className={`
              hidden sm:flex absolute top-3 right-3 flex-col gap-2 transition-all duration-300
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}>
              <button
                className={`p-2.5 backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-xl group/btn relative ${
                  inWishlist
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/90 hover:bg-white'
                }`}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
              >
                {isWishlistLoading ? (
                  <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg
                    className={`w-4 h-4 transition-colors ${
                      inWishlist
                        ? 'text-white'
                        : 'text-gray-600 group-hover/btn:text-red-500'
                    }`}
                    fill={inWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Stock Status Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white/90 text-gray-900 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm shadow-lg">
                Out of Stock
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 relative">
        {/* Subtle dark gradient behind text for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-b-2xl sm:rounded-b-3xl"></div>
        
        {/* Brand and Category - hidden on mobile for space */}
        <div className={`hidden sm:flex items-center gap-2 text-xs md:text-sm mb-2 md:mb-3 relative z-10 ${
          effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <span className="font-medium truncate">{product.brand}</span>
          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
            effectiveTheme === 'light' ? 'bg-gray-400' : 'bg-gray-600'
          }`}></span>
          <span className="truncate">{product.category}</span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${encodeURIComponent(product.slug)}`} className="relative z-10">
          <h3 className={`font-bold text-xs sm:text-sm md:text-base mb-2 sm:mb-3 transition-colors line-clamp-2 leading-tight min-h-[2rem] sm:min-h-[2.5rem] ${
            effectiveTheme === 'light'
              ? 'text-gray-900 hover:text-blue-700'
              : 'text-white hover:text-blue-400'
          }`}>
            {product.name}
          </h3>
        </Link>

        {/* Description - reduced on mobile */}
        <p className={`text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed flex-1 relative z-10 ${
          effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {product.description}
        </p>

        {/* Rating - more compact on mobile */}
        {product.rating && (
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 relative z-10">
            <div className="flex text-yellow-500 text-xs">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating!) ? 'text-yellow-500' : effectiveTheme === 'light' ? 'text-gray-400' : 'text-gray-600'}>
                  ★
                </span>
              ))}
            </div>
            <span className={`text-[10px] sm:text-xs ${
              effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>({product.rating})</span>
          </div>
        )}
        
        {/* Price and Action */}
        <div className="mt-auto relative z-10">
          {/* Price */}
          <div className="mb-2 sm:mb-3">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className={`text-base sm:text-lg md:text-xl font-bold ${
                  effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>${product.price}</span>
                <span className={`text-xs sm:text-sm line-through ${
                  effectiveTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>${product.originalPrice}</span>
                <span className={`text-[9px] sm:text-xs font-semibold hidden sm:inline ${
                  effectiveTheme === 'light' ? 'text-green-700' : 'text-green-400'
                }`}>
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className={`text-base sm:text-lg md:text-xl font-bold ${
                effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>${product.price}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`
                flex-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-semibold text-[10px] sm:text-xs md:text-sm transition-all duration-300
                transform active:scale-95 flex items-center justify-center gap-1 sm:gap-2 relative z-20
                ${product.inStock
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  : effectiveTheme === 'light'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                    : 'bg-slate-700/50 text-gray-400 cursor-not-allowed border border-slate-600'
                }
              `}
            >
              {product.inStock ? (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                  Sold Out
                </>
              )}
            </button>

            {/* Wishlist Button - Visible on Mobile */}
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              className={`
                sm:hidden p-2 rounded-xl transition-all duration-300 shadow-lg active:scale-95 relative z-20
                ${inWishlist
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-white/90 hover:bg-white'
                }
              `}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlistLoading ? (
                <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  className={`w-4 h-4 transition-colors ${
                    inWishlist ? 'text-white' : 'text-gray-600'
                  }`}
                  fill={inWishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
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
    </div>
  );
}