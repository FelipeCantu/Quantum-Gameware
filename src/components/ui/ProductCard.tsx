// src/components/ui/ProductCard.tsx
'use client';

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
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
        <p className="text-red-500">Error: Product missing slug</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${encodeURIComponent(product.slug)}`}>
        <div className="relative h-60 w-full">
          <Image
            src={imageError ? '/placeholder-product.jpg' : product.image}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${encodeURIComponent(product.slug)}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <span className="text-gray-600 text-sm">{product.brand}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-600 text-sm">{product.category}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}