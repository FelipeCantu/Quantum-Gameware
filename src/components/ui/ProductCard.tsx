"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  // Make sure the product has a valid slug
  if (!product.slug) {
    console.error('Product missing slug:', product);
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        <p className="text-red-500 text-center">Error: Product missing slug</p>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
      <Link href={`/products/${encodeURIComponent(product.slug)}`} className="block">
        {/* Image Container */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-50 overflow-hidden">
          <Image
            src={imageError ? '/placeholder-product.jpg' : product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                NEW
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                SALE
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-6">
        {/* Brand and Category */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>{product.brand}</span>
          <span>•</span>
          <span>{product.category}</span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${encodeURIComponent(product.slug)}`}>
          <h3 className="font-semibold text-lg mb-3 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating})</span>
          </div>
        )}
        
        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95
              ${product.inStock 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}