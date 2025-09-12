"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

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
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Make sure the product has a valid slug
  if (!product.slug) {
    console.error('Product missing slug:', product);
    return (
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl border border-white/20 p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-gray-800 text-center text-sm font-medium">
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
        group relative bg-white/20 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-2xl 
        transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30
        hover:bg-white/25 transform hover:scale-[1.02] flex flex-col h-full
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${encodeURIComponent(product.slug)}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className={`relative w-full ${imageClasses[imageAspectRatio]} bg-white/5 overflow-hidden`}>
          {/* FIX APPLIED HERE: Check for product.image before rendering the Image component */}
          {product.image && !imageError ? (
            <>
              {/* Loading placeholder */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-white/10 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <div className="text-gray-700 text-center">
                <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">Image unavailable</span>
              </div>
            </div>
          )}
          
          {/* Badges Container */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                NEW
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className={`
              absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}>
              <button 
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                title="Add to favorites"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to favorites logic here
                }}
              >
                <svg className="w-4 h-4 text-gray-600 group-hover/btn:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          )}

          {/* Stock Status Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white/90 text-gray-900 px-6 py-3 rounded-2xl font-semibold shadow-lg">
                Out of Stock
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1 relative">
        {/* Subtle dark gradient behind text for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-b-3xl"></div>
        
        {/* Brand and Category */}
        <div className="flex items-center gap-2 text-sm text-gray-800 mb-3 relative z-10">
          <span className="font-medium">{product.brand}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span>{product.category}</span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${encodeURIComponent(product.slug)}`} className="relative z-10">
          <h3 className="font-bold text-lg mb-3 text-gray-900 hover:text-blue-700 transition-colors line-clamp-2 leading-tight min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed flex-1 relative z-10">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="flex text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating!) ? 'text-yellow-500' : 'text-gray-400'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-700">({product.rating})</span>
          </div>
        )}
        
        {/* Price and Action */}
        <div className="mt-auto relative z-10">
          {/* Price */}
          <div className="mb-4">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <span className="text-lg text-gray-600 line-through">${product.originalPrice}</span>
                <span className="text-sm text-green-700 font-semibold">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`
              w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 
              transform active:scale-95 flex items-center justify-center gap-2 relative z-20
              ${product.inStock 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]' 
                : 'bg-white/30 text-gray-700 cursor-not-allowed border border-gray-300'
              }
            `}
          >
            {product.inStock ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
}