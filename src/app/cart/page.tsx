"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
          <div className="max-w-lg mx-auto text-center px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
              <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-6">Your Cart is Empty</h1>
              <p className="text-white/80 mb-10 text-lg leading-relaxed">
                Ready to gear up? Explore our premium gaming accessories and find your perfect setup.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const estimatedTax = getCartTotal() * 0.08; // 8% tax estimate
  const finalTotal = getCartTotal() + estimatedTax;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern - same as hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-white/80 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">Shopping Cart</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
                <p className="text-white/80 text-lg">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center text-white/80 hover:text-white font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add More Items
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-sm border border-white/20 overflow-hidden">
                <div className="p-6 bg-white/10 backdrop-blur-sm border-b border-white/20">
                  <h2 className="text-2xl font-semibold text-white">
                    Items in Your Cart
                  </h2>
                </div>
                
                <div className="divide-y divide-white/10">
                  {items.map((item, index) => (
                    <div 
                      key={item._id} 
                      className="p-6 hover:bg-white/5 transition-colors group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Product Image */}
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl mx-auto lg:mx-0 bg-white/10">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                            <div className="text-center lg:text-left">
                              <h3 className="text-xl font-semibold text-white mb-2">
                                <Link 
                                  href={`/products/${item.slug}`} 
                                  className="hover:text-blue-300 transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              <div className="flex items-center justify-center lg:justify-start gap-3 text-white/70">
                                <span className="font-medium">{item.brand}</span>
                                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                <span>${item.price} each</span>
                              </div>
                            </div>
                            <div className="text-center lg:text-right mt-4 lg:mt-0">
                              <div className="text-3xl font-bold text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center justify-center lg:justify-start">
                              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30">
                                <button 
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="px-4 py-3 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                  </svg>
                                </button>
                                <div className="px-6 py-3 bg-white/10 border-x border-white/20 font-semibold text-lg min-w-[80px] text-center text-white">
                                  {item.quantity}
                                </div>
                                <button 
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  className="px-4 py-3 hover:bg-white/20 transition-colors text-white"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="flex items-center justify-center text-red-400 hover:text-red-300 font-medium transition-colors bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-xl border border-red-400/30"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove Item
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-sm border border-white/20 sticky top-32">
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-t-3xl border-b border-white/20">
                  <h2 className="text-2xl font-semibold text-white">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Order details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-white/80">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-medium text-white">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span>Shipping</span>
                      <div className="text-right">
                        <span className="text-green-400 font-semibold">FREE</span>
                        <div className="text-xs text-white/60">On all orders</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span>Estimated Tax</span>
                      <span className="font-medium text-white">${estimatedTax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-white">Total</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            ${finalTotal.toFixed(2)}
                          </div>
                          <div className="text-sm text-white/60">
                            Final price at checkout
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg">
                      Proceed to Checkout
                    </button>
                    
                    <Link
                      href="/products"
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-2xl font-medium border border-white/30 hover:border-white/50 transition-all duration-300 text-center block backdrop-blur-sm"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Trust indicators */}
                  <div className="space-y-4 pt-6 border-t border-white/20">
                    <div className="flex items-center text-sm text-white/80">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>Fast & free shipping worldwide</span>
                    </div>
                  </div>

                  {/* Promo code section */}
                  <div className="pt-6 border-t border-white/20">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-white/80 hover:text-white transition-colors">
                        <span className="font-medium">Have a promo code?</span>
                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-4 space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            className="flex-1 px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                          />
                          <button className="px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                            Apply
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              {/* Recommended products */}
              <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-sm border border-white/20">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">You might also like</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">Gaming Mouse Pad</h4>
                        <p className="text-sm text-white/70">Extended RGB mousepad</p>
                        <p className="text-lg font-bold text-white">$29.99</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium h-fit">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}