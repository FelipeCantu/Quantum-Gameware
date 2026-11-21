// src/app/orders/[id]/page.tsx: one order (DESIGN.md, "Account"). Loading, cancel, return and the
// development-only status button are unchanged. Items on plates | a sticky receipt with the actions.
// Fixed: the page rendered a second footer; /tracking and /support links pointed at pages that do not exist.
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { LinePlate } from '@/components/commerce/Shop';
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

  // Status marker class (styles/forms.css .status--*).
  const getStatusColor = (status: Order['status']) => `status--${status}`;

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

  const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return <div className="auth-wait" aria-busy="true">Loading order details</div>;
  }

  if (error || !order) {
    return (
      <div className="void">
        <h1 className="void__title">Order not found.</h1>
        <p className="void__text">It does not exist, or it belongs to another account.</p>
        <div className="void__ctas">
          <Link href="/orders" className="btn btn--solid">
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Back to orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const placed = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <header className="shop-head">
        <nav aria-label="Breadcrumb">
          <ol className="page-head__crumbs">
            <li><Link href="/">Home</Link><span aria-hidden="true"> / </span></li>
            <li><Link href="/orders">Orders</Link><span aria-hidden="true"> / </span></li>
            <li><span aria-current="page" className="mono">{order.orderNumber}</span></li>
          </ol>
        </nav>
        <h1 className="shop-head__title">Order <span className="mono" style={{ fontSize: '0.55em', letterSpacing: '-0.02em', fontWeight: 500 }}>{order.orderNumber}</span></h1>
        <p className="shop-head__meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', alignItems: 'center' }}>
          <span>Placed {placed}</span>
          <span className={`status ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </p>
      </header>

      <div className="shop">
        <div className="shop__main" style={{ display: 'grid', gap: 'calc(var(--u) * 4)' }}>
          {showReturnSuccess && (
            <div className="alert alert--ok" role="status">
              <p className="alert__title">Return request sent</p>
              <p className="alert__text">We&apos;ll process your return shortly.</p>
            </div>
          )}
          {showCancelSuccess && (
            <div className="alert alert--ok" role="status">
              <p className="alert__title">Order cancelled</p>
              <p className="alert__text">Your refund will be processed shortly.</p>
            </div>
          )}

          <section className="co-sec" aria-labelledby="od-items">
            <h2 id="od-items" className="co-sec__title">Items</h2>
            <ul className="lines">
              {order.items.map((item) => (
                <li key={item.id} className="line">
                  <LinePlate image={item.image} name={item.name} />
                  <div>
                    <p className="line__name">{item.name}</p>
                    <p className="line__meta">Qty <span className="mono">{item.quantity}</span> · <span className="mono">{money(item.price)}</span> each</p>
                  </div>
                  <p className="line__total">{money(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="co-sec" aria-labelledby="od-ship">
            <h2 id="od-ship" className="co-sec__title">Delivery and payment</h2>
            <dl className="stats">
              <div className="stats__cell">
                <dt className="stats__k">Shipping address</dt>
                <dd className="stats__note" style={{ color: 'var(--c-fg)', fontSize: 'var(--t-body)' }}>{order.shipping.address}</dd>
              </div>
              <div className="stats__cell">
                <dt className="stats__k">Method</dt>
                <dd className="stats__note" style={{ color: 'var(--c-fg)', fontSize: 'var(--t-body)' }}>{order.shipping.method}</dd>
              </div>
              {order.payment && (
                <div className="stats__cell">
                  <dt className="stats__k">Paid with</dt>
                  <dd className="stats__note" style={{ color: 'var(--c-fg)', fontSize: 'var(--t-body)' }}>
                    {({ credit_card: 'Credit card', paypal: 'PayPal', apple_pay: 'Apple Pay', google_pay: 'Google Pay' } as Record<string, string>)[order.payment.method] ?? order.payment.method}{order.payment.last4 && <> ending <span className="mono">{order.payment.last4}</span></>}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Testing button - the API rejects non-admins in production */}
          {process.env.NODE_ENV !== 'production' && order.status !== 'delivered' && (
            <div className="note-box">
              <button
                type="button"
                className="text-link"
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
              >
                Mark as delivered
              </button>{' '}
              <span>(development only, for testing returns)</span>
            </div>
          )}
        </div>

        <aside className="shop__side" aria-labelledby="od-sum">
          <div className="receipt">
            <h2 id="od-sum" className="receipt__title">Summary</h2>
            <dl className="receipt__rows">
              <div className="receipt__row"><dt>Subtotal</dt><dd>{money(order.total - order.shipping.cost)}</dd></div>
              <div className="receipt__row"><dt>Shipping</dt><dd className={order.shipping.cost === 0 ? 'receipt__free' : undefined}>{order.shipping.cost === 0 ? 'Free' : money(order.shipping.cost)}</dd></div>
              <div className="receipt__total"><dt>Total</dt><dd>{money(order.total)}</dd></div>
            </dl>
            <div className="receipt__actions">
              {canCancelOrder() && (
                <>
                  <button type="button" onClick={handleCancelOrder} disabled={isCancelling} aria-busy={isCancelling} className="btn btn--line btn--block danger__btn">
                    <span className="btn__fill" aria-hidden="true" />
                    <span className="btn__label">{isCancelling ? 'Cancelling…' : 'Cancel order'}</span>
                  </button>
                  <p className="receipt__note">You can cancel while the order is still processing.</p>
                </>
              )}
              {canRequestReturn() && !hasExistingReturn() && (
                <button type="button" onClick={() => setShowReturnForm(true)} className="btn btn--solid btn--block">
                  <span className="btn__fill" aria-hidden="true" />
                  <span className="btn__label">Request a return</span>
                </button>
              )}
              {hasExistingReturn() && <span className="status status--processing">Return pending</span>}
            </div>
            <ul className="receipt__trust">
              <li><Link href="/orders">Back to orders</Link></li>
              <li><Link href="/contact">Need help with this order</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {showReturnForm && order && (
        <ReturnRequestForm
          order={order}
          onSuccess={handleReturnSuccess}
          onCancel={() => setShowReturnForm(false)}
        />
      )}
    </>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard requireAuth={true}>
      <OrderDetailContent />
    </AuthGuard>
  );
}
