// src/app/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ReturnRequestForm from '@/components/ReturnRequestForm';
import { ReturnService } from '@/services/returnService';

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
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const orderId = params?.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !user) {
        setError('Order not found');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        console.log('📦 Fetching order details for:', orderId);

        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Order details response:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Order details fetched:', data);

          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setError('Order not found');
          }
        } else {
          const errorData = await response.json();
          console.error('❌ Failed to fetch order:', errorData);
          setError(errorData.message || 'Failed to load order');
        }
      } catch (error) {
        console.error('❌ Error fetching order:', error);
        setError('Network error while loading order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

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

  const canRequestReturn = (): boolean => {
    if (!order) return false;
    // Can only return delivered orders
    if (order.status !== 'delivered') return false;

    // Check if within 30-day return window
    const orderDate = new Date(order.createdAt);
    return ReturnService.canReturnOrder(orderDate);
  };

  const hasExistingReturn = (): boolean => {
    if (!order) return false;
    const returns = ReturnService.getReturnsByOrderId(order.id);
    return returns.some(r => !['cancelled', 'completed'].includes(r.status));
  };

  const handleReturnSuccess = () => {
    setShowReturnForm(false);
    setShowReturnSuccess(true);
    setTimeout(() => setShowReturnSuccess(false), 5000);
  };

  const canCancelOrder = (): boolean => {
    if (!order) return false;
    // Can only cancel pending or confirmed orders
    return ['processing', 'confirmed'].includes(order.status);
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmCancel = confirm(
      `Are you sure you want to cancel this order?\n\nOrder #${order.orderNumber}\n\nThis action cannot be undone.`
    );

    if (!confirmCancel) return;

    setIsCancelling(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Order cancelled successfully');
        setShowCancelSuccess(true);
        setTimeout(() => setShowCancelSuccess(false), 5000);
        // Reload order data
        window.location.reload();
      } else {
        console.error('❌ Failed to cancel order:', data);
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      alert('Network error while cancelling order');
    } finally {
      setIsCancelling(false);
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

                {/* Temporary testing button - remove in production */}
                {order.status !== 'delivered' && (
                  <button
                    onClick={async () => {
                      if (confirm('Mark this order as delivered? (For testing returns)')) {
                        try {
                          const token = localStorage.getItem('authToken');
                          const response = await fetch(`/api/orders/${order.id}/update-status`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ status: 'delivered' })
                          });

                          if (response.ok) {
                            window.location.reload();
                          } else {
                            alert('Failed to update status');
                          }
                        } catch (error) {
                          console.error('Error:', error);
                          alert('Error updating status');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    🧪 Mark as Delivered (Test)
                  </button>
                )}

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
                        <p className="font-semibold text-white">${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-white/70 text-sm">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each</p>
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
                    <span>${(order.total - order.shipping.cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span>{order.shipping.cost === 0 ? 'FREE' : `$${order.shipping.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                {/* Cancel Order Button */}
                {canCancelOrder() && (
                  <div className="bg-red-500/10 border-2 border-red-400/30 rounded-xl p-4 space-y-3">
                    <button
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-red-500/30"
                    >
                      {isCancelling ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel Order
                        </>
                      )}
                    </button>
                    <p className="text-xs text-red-300/80 text-center">
                      You can cancel this order while it's still processing
                    </p>
                  </div>
                )}

                {canRequestReturn() && !hasExistingReturn() && (
                  <button
                    onClick={() => setShowReturnForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                    </svg>
                    Request Return
                  </button>
                )}

                {hasExistingReturn() && (
                  <div className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 rounded-xl font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Return Pending
                  </div>
                )}

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

      {/* Return Request Form Modal */}
      {showReturnForm && order && (
        <ReturnRequestForm
          order={order}
          onSuccess={handleReturnSuccess}
          onCancel={() => setShowReturnForm(false)}
        />
      )}

      {/* Success Messages */}
      {showReturnSuccess && (
        <div className="fixed top-4 right-4 z-[10000] bg-green-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400/30 animate-slide-in">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Return Request Submitted!</p>
              <p className="text-sm text-green-100">We'll process your return shortly.</p>
            </div>
          </div>
        </div>
      )}

      {showCancelSuccess && (
        <div className="fixed top-4 right-4 z-[10000] bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-2xl border border-red-400/30 animate-slide-in">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Order Cancelled Successfully!</p>
              <p className="text-sm text-red-100">Your refund will be processed shortly.</p>
            </div>
          </div>
        </div>
      )}

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