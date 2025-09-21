// src/app/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: OrderItem[];
  shipping: {
    address: string;
    method: string;
    cost: number;
  };
  payment?: {
    method: string;
    last4?: string;
  };
}

function OrderDetailContent() {
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    // Mock order data based on ID
    const mockOrders: Record<string, Order> = {
      'ORD-2024-001': {
        id: 'order_1',
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        total: 299.99,
        createdAt: '2024-01-15T10:30:00Z',
        items: [
          {
            id: 'item_1',
            name: 'Gaming Mechanical Keyboard',
            price: 149.99,
            quantity: 1,
          },
          {
            id: 'item_2',
            name: 'Gaming Mouse',
            price: 79.99,
            quantity: 1,
          }
        ],
        shipping: {
          address: '123 Gaming St, Tech City, TC 12345',
          method: 'Standard Shipping',
          cost: 0
        },
        payment: {
          method: 'Credit Card',
          last4: '4242'
        }
      },
      'ORD-2024-002': {
        id: 'order_2',
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        total: 149.99,
        createdAt: '2024-01-20T14:15:00Z',
        items: [
          {
            id: 'item_3',
            name: 'Gaming Headset',
            price: 149.99,
            quantity: 1,
          }
        ],
        shipping: {
          address: '123 Gaming St, Tech City, TC 12345',
          method: 'Express Shipping',
          cost: 15.99
        },
        payment: {
          method: 'Credit Card',
          last4: '4242'
        }
      },
      'ORD-2024-003': {
        id: 'order_3',
        orderNumber: 'ORD-2024-003',
        status: 'processing',
        total: 89.99,
        createdAt: '2024-01-25T09:20:00Z',
        items: [
          {
            id: 'item_4',
            name: 'Gaming Controller',
            price: 89.99,
            quantity: 1,
          }
        ],
        shipping: {
          address: '123 Gaming St, Tech City, TC 12345',
          method: 'Standard Shipping',
          cost: 0
        },
        payment: {
          method: 'Credit Card',
          last4: '4242'
        }
      }
    };

    const foundOrder = mockOrders[orderId];
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError('Order not found');
    }
    setLoading(false);
  }, [orderId]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      case 'shipped': return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-200 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8">
              <h1 className="text-2xl font-bold text-red-200 mb-4">Order Not Found</h1>
              <p className="text-red-300 mb-6">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link
                href="/orders"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                ← Back to Orders
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/orders" className="hover:text-white transition-colors">Orders</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{order.orderNumber}</span>
          </nav>

          {/* Order Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Order {order.orderNumber}</h1>
                <p className="text-white/70">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                
                {order.status === 'shipped' && (
                  <Link
                    href={`/tracking/${order.id}`}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 text-center"
                  >
                    Track Package
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
                
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                        <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-white/70 text-sm">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Details */}
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal</span>
                    <span>${(order.total - order.shipping.cost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span>{order.shipping.cost === 0 ? 'FREE' : `$${order.shipping.cost.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Shipping Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-white/70 text-sm">Shipping Address</p>
                    <p className="text-white">{order.shipping.address}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Shipping Method</p>
                    <p className="text-white">{order.shipping.method}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {order.payment && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Payment Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-white/70 text-sm">Payment Method</p>
                      <p className="text-white">
                        {order.payment.method}
                        {order.payment.last4 && ` ending in ${order.payment.last4}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="w-full flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors border border-white/30"
                >
                  ← Back to Orders
                </Link>
                
                <Link
                  href="/support"
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-colors"
                >
                  Need Help?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard requireAuth={true}>
      <OrderDetailContent />
    </AuthGuard>
  );
}