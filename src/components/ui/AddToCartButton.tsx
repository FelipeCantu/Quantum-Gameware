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
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Add items to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Small delay for UX feedback
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 600);
  };

  if (!product.inStock) {
    return (
      <div className="space-y-4">
        <button
          disabled
          className="w-full bg-white/20 text-white/60 px-8 py-4 rounded-2xl font-semibold cursor-not-allowed border border-white/30"
        >
          Out of Stock
        </button>
        <p className="text-white/70 text-sm text-center">
          This item is currently unavailable. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div>
        <label className="block text-white font-medium mb-3 text-lg">Quantity</label>
        <div className="flex items-center justify-center lg:justify-start">
          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="px-6 py-4 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-6 py-4 text-white font-semibold text-lg bg-white/10 min-w-[80px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
              disabled={quantity >= 10}
              className="px-6 py-4 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`
          w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 
          transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl
          ${isAdding 
            ? 'bg-green-500 text-white cursor-wait' 
            : 'bg-white text-blue-600 hover:bg-gray-100'
          }
        `}
      >
        <div className="flex items-center justify-center gap-3">
          {isAdding ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Adding to Cart...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add {quantity > 1 ? `${quantity} ` : ''}to Cart</span>
            </>
          )}
        </div>
      </button>

      {/* Price Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex justify-between items-center text-white">
          <span className="font-medium">Total:</span>
          <span className="text-2xl font-bold">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
        {quantity > 1 && (
          <div className="text-white/70 text-sm mt-2">
            {quantity} × ${product.price} each
          </div>
        )}
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Fast shipping</span>
        </div>
      </div>
    </div>
  );
}