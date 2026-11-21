// src/app/orders/page.tsx: order history (DESIGN.md, "Account"). Data loading, the return window
// check and the return request flow are unchanged. Order cards: number in mono, status marker, total,
// item plates and the actions that apply. Dead links fixed: /tracking (no such page) now opens the order
// details, /support (no such page) now goes to /contact.
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import AccountNav from '@/components/ui/AccountNav';
import { LinePlate } from '@/components/commerce/Shop';
import ReturnRequestForm from '@/components/ReturnRequestForm';
import { ReturnService } from '@/services/returnService';
import { Order as OrderType } from '@/services/orderService';

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
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

function OrdersPageContent() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      // Only fetch if user is authenticated
      if (!isAuthenticated || !user) {
        console.log('👤 User not authenticated yet');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('❌ No auth token found');
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        console.log('📦 Fetching orders for user:', user.email);
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Orders API response status:', response.status);
        const data = await response.json();
        console.log('📊 Orders API response data:', data);

        if (response.ok) {
          console.log(`✅ Orders fetched successfully: ${data.orders?.length || 0} orders`);
          setOrders(data.orders || []);
        } else {
          console.error('❌ Failed to fetch orders:', response.status, data);
          setError(`Failed to load orders: ${data.message || data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        setError('Network error while loading orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  // Status marker class (styles/forms.css .status--*).
  const getStatusColor = (status: string) => `status--${status}`;

  const canRequestReturn = (order: Order): boolean => {
    // Can only return delivered orders
    if (order.status !== 'delivered') return false;

    // Check if within 30-day return window
    const orderDate = new Date(order.createdAt);
    return ReturnService.canReturnOrder(orderDate);
  };

  const hasExistingReturn = (orderId: string): boolean => {
    const returns = ReturnService.getReturnsByOrderId(orderId);
    return returns.some(r => !['cancelled', 'completed'].includes(r.status));
  };

  const handleReturnSuccess = () => {
    setReturnOrderId(null);
    setShowReturnSuccess(true);
    setTimeout(() => setShowReturnSuccess(false), 5000);
  };

  const selectedOrder = orders.find(o => o.id === returnOrderId);

  const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const head = (
    <>
      <div className="acct-head">
        <PageHead
          still
          title="Orders"
          text="Every order, its status and what you can still do with it."
          meta={user ? `Signed in as ${user.email}` : undefined}
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Orders' }]}
        />
      </div>
      <AccountNav />
    </>
  );

  if (loading) {
    return (
      <>
        {head}
        <div className="dash"><p className="field__hint" aria-busy="true">Loading your orders…</p></div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {head}
        <div className="dash">
          <div className="alert alert--error" role="alert">
            <p className="alert__title">Your orders did not load</p>
            <p className="alert__text">{error}</p>
          </div>
          <div className="dash-sec__actions">
            <button type="button" onClick={() => window.location.reload()} className="btn btn--solid">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Try again</span>
            </button>
            <Link href="/account" className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Back to account</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {head}
      <div className="dash">
        {showReturnSuccess && (
          <div className="alert alert--ok" role="status">
            <p className="alert__title">Return request sent</p>
            <p className="alert__text">We&apos;ll review it and email you shortly.</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="dash-empty">
            <p>No orders yet. When you place one, it shows up here with its status and tracking.</p>
            <Link href="/products" className="btn btn--solid" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Browse the gear</span>
            </Link>
          </div>
        ) : (
          <ul className="order-cards">
            {orders.map((order) => (
              <li key={order.id} className="order-card">
                <div className="order-card__head">
                  <div>
                    <h2 className="order-card__no mono">{order.orderNumber}</h2>
                    <p className="order-card__date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`status ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  <p className="order-card__total mono">{money(order.total)}</p>
                </div>

                <ul className="order-card__items">
                  {order.items.slice(0, 4).map((item, index) => (
                    <li key={index} className="order-card__item">
                      <LinePlate image={item.image} name={item.name} />
                      <div>
                        <p className="order-card__name">{item.name}</p>
                        <p className="line__meta"><span className="mono">{item.quantity}</span> × <span className="mono">{money(item.price)}</span></p>
                      </div>
                    </li>
                  ))}
                  {order.items.length > 4 && <li className="order-card__more mono">+{order.items.length - 4} more</li>}
                </ul>

                <div className="order-card__actions">
                  <Link href={`/orders/${order.id}`} className="btn btn--solid btn--sm">
                    <span className="btn__fill" aria-hidden="true" />
                    <span className="btn__label">{order.status === 'shipped' ? 'Details and tracking' : 'Details'}</span>
                  </Link>
                  {canRequestReturn(order) && !hasExistingReturn(order.id) && (
                    <button type="button" onClick={() => setReturnOrderId(order.id)} className="btn btn--line btn--sm">
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">Request a return</span>
                    </button>
                  )}
                  {hasExistingReturn(order.id) && <span className="status status--processing">Return pending</span>}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="dash-sec">
          <div className="dash-sec__head"><h2 className="dash-sec__title">Shortcuts</h2></div>
          <ul className="rows">
            {[
              { t: 'Check a return', href: '/returns-status' },
              { t: 'Return policy', href: '/returns' },
              { t: 'Need help with an order', href: '/contact' },
            ].map((r) => (
              <li key={r.href}>
                <Link href={r.href}>
                  <span className="rows__t" style={{ fontSize: 'var(--t-body)' }}>{r.t}</span>
                  <span className="rows__go" aria-hidden="true">{r.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {returnOrderId && selectedOrder && (
          <ReturnRequestForm
            order={{
              ...selectedOrder,
              shipping: {
                firstName: '',
                lastName: '',
                email: user?.email || '',
                phone: '',
                address: selectedOrder.shipping.address,
                apartment: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
              },
              payment: {
                last4: '',
                cardType: '',
                transactionId: '',
              },
              totals: {
                subtotal: selectedOrder.total,
                tax: 0,
                shipping: selectedOrder.shipping.cost,
                total: selectedOrder.total,
              },
              createdAt: new Date(selectedOrder.createdAt),
              estimatedDelivery: new Date(),
            }}
            onSuccess={handleReturnSuccess}
            onCancel={() => setReturnOrderId(null)}
          />
        )}
      </div>
    </>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard requireAuth={true}>
      <OrdersPageContent />
    </AuthGuard>
  );
}
