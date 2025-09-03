'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay with blur */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Cart panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg flex flex-col">
        <div className={`
          bg-white h-full shadow-2xl transform transition-transform duration-300 ease-out
          ${isAnimating ? 'translate-x-0' : 'translate-x-full'}
        `}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-sm text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button 
              onClick={closeCart} 
              className="p-2 hover:bg-white/80 rounded-xl transition-colors group"
            >
              <svg className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart content */}
          <div className="flex-1 flex flex-col">
            {items.length === 0 ? (
              /* Empty cart */
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
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
                {/* Cart items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={item._id} 
                      className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Product image */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
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
                              <h3 className="font-semibold text-gray-900 truncate">
                                <Link 
                                  href={`/products/${item.slug}`} 
                                  onClick={closeCart}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500">{item.brand}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity controls */}
                            <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-3 py-2 text-sm font-semibold bg-white border-x border-gray-200 min-w-[50px] text-center text-gray-900">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-200 transition-colors text-gray-700"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                ${item.price} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart footer */}
                <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-900">Subtotal</span>
                    <span className="font-bold text-2xl text-gray-900">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping info */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-xl">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-2xl font-medium border border-gray-200 transition-all duration-300 hover:border-gray-300"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
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
    </div>
  );
}