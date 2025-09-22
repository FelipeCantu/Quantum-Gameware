"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    last4: string;
    cardType: string;
    transactionId: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  status: string;
  createdAt: Date;
  estimatedDelivery: Date;
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent back navigation to checkout
    const handlePopState = () => {
      router.replace('/products');
    };

    window.addEventListener('popstate', handlePopState);

    // Get order from URL params or localStorage
    const getOrderData = async () => {
      const orderId = searchParams.get('order');
      
      if (orderId) {
        try {
          // Try to get order from localStorage first
          const savedOrders = localStorage.getItem('userOrders');
          if (savedOrders) {
            const orders = JSON.parse(savedOrders);
            const foundOrder = orders.find((o: Order) => o.id === orderId);
            if (foundOrder) {
              setOrder({
                ...foundOrder,
                createdAt: new Date(foundOrder.createdAt),
                estimatedDelivery: new Date(foundOrder.estimatedDelivery)
              });
              setLoading(false);
              return;
            }
          }

          // If not found in localStorage, try to import and get from OrderService
          const { OrderService } = await import('@/services/paymentService');
          const foundOrder = OrderService.getOrderById(orderId);
          if (foundOrder) {
            setOrder(foundOrder);
          }
        } catch (error) {
          console.error('Error loading order:', error);
        }
      }
      
      setLoading(false);
    };

    getOrderData();

    return () => window.removeEventListener('popstate', handlePopState);
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your order...</p>
        </div>
      </div>
    );
  }

  const defaultOrderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
            
            {/* Success Icon Animation */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-16 h-16 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Celebration particles */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-4 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping animation-delay-1000"></div>
                <div className="absolute -bottom-2 -left-4 w-5 h-5 bg-blue-400 rounded-full animate-ping animation-delay-2000"></div>
              </div>

              {/* Success Message */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                Order Confirmed! 🎉
              </h1>
              <p className="text-white/80 mb-8 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                Thank you for your purchase! Your gaming gear is on its way to level up your setup.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Order Details Card */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Order Number:</span>
                    <span className="text-white font-mono font-bold text-lg">
                      {order?.id || defaultOrderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Order Date:</span>
                    <span className="text-white font-semibold">
                      {order?.createdAt ? order.createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Estimated Delivery:</span>
                    <span className="text-white font-semibold">
                      {order?.estimatedDelivery ? order.estimatedDelivery.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : estimatedDelivery.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Total Amount:</span>
                    <span className="text-white font-bold text-xl">
                      ${order?.totals.total.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Details Card */}
              {order?.shipping && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping Address
                  </h2>
                  <div className="text-white/90">
                    <p className="font-semibold">{order.shipping.firstName} {order.shipping.lastName}</p>
                    <p>{order.shipping.address}</p>
                    <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                    <div className="mt-3 flex items-center text-green-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free Standard Shipping
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            {order?.items && order.items.length > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Your Items ({order.items.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                        <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="space-y-4 mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Confirmation Email Sent</h3>
                    <p className="text-white/70 text-sm">
                      Check your inbox at {order?.shipping.email || 'your email'} for order confirmation and tracking details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Order Processing</h3>
                    <p className="text-white/70 text-sm">We're preparing your items for shipment (1-2 business days).</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">On Its Way</h3>
                    <p className="text-white/70 text-sm">Track your package and get delivery updates via email and SMS.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Continue Shopping
                </Link>
                
                <Link
                  href="/cart/orders"
                  className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Track All Orders
                </Link>
                
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <p className="text-white/80 mb-4">Need help with your order?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <a href="mailto:support@gamegear.com" className="text-white hover:text-green-300 transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@gamegear.com
                  </a>
                  <a href="tel:+1-800-GAMEGEAR" className="text-white hover:text-green-300 transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    1-800-GAMEGEAR
                  </a>
                  <Link href="/support" className="text-white hover:text-green-300 transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Live Chat Support
                  </Link>
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <p className="text-white/80 mb-4">Share your gaming setup with friends!</p>
              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-bold">f</span>
                </button>
                <button className="w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-bold">t</span>
                </button>
                <button className="w-12 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-bold">ig</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 