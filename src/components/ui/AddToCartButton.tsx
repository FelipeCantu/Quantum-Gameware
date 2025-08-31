// src/components/ui/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          -
        </button>
        <span className="px-4 py-2">{quantity}</span>
        <button
          onClick={() => setQuantity(prev => prev + 1)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          +
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}