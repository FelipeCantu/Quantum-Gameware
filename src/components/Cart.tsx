'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getCartTotal
  } = useCart();
  const { effectiveTheme } = useTheme();

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      {/* Background overlay with blur */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Cart panel - NOW WITH PROPER SCROLLING */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg flex flex-col">
        <div className={`
          ${effectiveTheme === 'light' ? 'bg-white' : 'bg-gray-900'} h-full shadow-2xl transform transition-transform duration-300 ease-out flex flex-col
          ${isAnimating ? 'translate-x-0' : 'translate-x-full'}
        `}>

          {/* Header - FIXED AT TOP */}
          <div className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${
            effectiveTheme === 'light'
              ? 'border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'
              : 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-800'
          }`}>
            <div>
              <h2 className={`text-2xl font-bold ${effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Shopping Cart
              </h2>
              <p className={`text-sm ${effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button
              onClick={closeCart}
              className={`p-2 rounded-xl transition-colors group ${
                effectiveTheme === 'light' ? 'hover:bg-white/80' : 'hover:bg-white/10'
              }`}
            >
              <svg className={`h-6 w-6 transition-colors ${
                effectiveTheme === 'light'
                  ? 'text-gray-400 group-hover:text-gray-600'
                  : 'text-gray-400 group-hover:text-gray-200'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* MAIN CONTENT AREA - THIS IS WHERE SCROLLING HAPPENS */}
          <div className="flex-1 flex flex-col min-h-0">
            {items.length === 0 ? (
              /* Empty cart - Centered content */
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    effectiveTheme === 'light'
                      ? 'bg-gradient-to-br from-blue-100 to-purple-100'
                      : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30'
                  }`}>
                    <svg className={`w-12 h-12 ${effectiveTheme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Your cart is empty
                  </h3>
                  <p className={`mb-6 leading-relaxed ${effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Discover amazing gaming gear and add some items to get started!
                  </p>
                  <button
                    onClick={closeCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* SCROLLABLE CART ITEMS - THIS IS THE KEY SCROLLING AREA */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {items.map((item, index) => (
                    <div
                      key={item._id}
                      className={`group rounded-2xl p-4 border hover:shadow-lg transition-all duration-300 ${
                        effectiveTheme === 'light'
                          ? 'bg-white border-gray-100'
                          : 'bg-gray-800 border-gray-700'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Product image */}
                        <div className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl ${
                          effectiveTheme === 'light' ? 'bg-gray-50' : 'bg-gray-700'
                        }`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold truncate ${
                                effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                <Link
                                  href={`/products/${item.slug}`}
                                  onClick={closeCart}
                                  className={`transition-colors ${
                                    effectiveTheme === 'light' ? 'hover:text-blue-600' : 'hover:text-blue-400'
                                  }`}
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              <p className={`text-sm ${effectiveTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {item.brand}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className={`p-1 transition-colors ml-2 ${
                                effectiveTheme === 'light'
                                  ? 'text-gray-400 hover:text-red-500'
                                  : 'text-gray-500 hover:text-red-400'
                              }`}
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity controls */}
                            <div className={`flex items-center rounded-xl overflow-hidden border ${
                              effectiveTheme === 'light'
                                ? 'bg-gray-50 border-gray-200'
                                : 'bg-gray-700 border-gray-600'
                            }`}>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className={`px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  effectiveTheme === 'light'
                                    ? 'hover:bg-gray-200 text-gray-700'
                                    : 'hover:bg-gray-600 text-gray-200'
                                }`}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <div className={`px-4 py-2 border-x font-semibold text-sm min-w-[60px] text-center ${
                                effectiveTheme === 'light'
                                  ? 'bg-white border-gray-200 text-gray-900'
                                  : 'bg-gray-800 border-gray-600 text-white'
                              }`}>
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className={`px-3 py-2 transition-colors ${
                                  effectiveTheme === 'light'
                                    ? 'hover:bg-gray-200 text-gray-700'
                                    : 'hover:bg-gray-600 text-gray-200'
                                }`}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className={`font-bold ${effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className={`text-xs ${effectiveTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                ${item.price} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER - FIXED AT BOTTOM */}
                <div className={`border-t p-6 space-y-4 flex-shrink-0 ${
                  effectiveTheme === 'light'
                    ? 'border-gray-100 bg-gray-50'
                    : 'border-gray-700 bg-gray-800'
                }`}>
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-lg">
                    <span className={`font-medium ${effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Subtotal
                    </span>
                    <span className={`font-bold text-2xl ${effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping info */}
                  <div className={`flex items-center justify-center gap-2 text-sm p-3 rounded-xl ${
                    effectiveTheme === 'light'
                      ? 'text-gray-600 bg-green-50'
                      : 'text-gray-300 bg-green-900/20'
                  }`}>
                    <svg className={`w-4 h-4 ${effectiveTheme === 'light' ? 'text-green-600' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on all orders</span>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-center block"
                    >
                      View Cart & Checkout
                    </Link>

                    <button
                      onClick={closeCart}
                      className={`w-full px-6 py-3 rounded-2xl font-medium border transition-all duration-300 ${
                        effectiveTheme === 'light'
                          ? 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300'
                          : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security badge */}
                  <div className={`flex items-center justify-center gap-2 text-xs pt-2 ${
                    effectiveTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM SCROLLBAR STYLES - THIS MAKES THE SCROLLBAR LOOK GOOD */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${effectiveTheme === 'light' ? '#cbd5e1 #f1f5f9' : '#4b5563 #1f2937'};
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${effectiveTheme === 'light' ? '#f1f5f9' : '#1f2937'};
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}