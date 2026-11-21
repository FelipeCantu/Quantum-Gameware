// src/app/cart/orders/page.tsx: orders placed on this device (DESIGN.md, "Cart and checkout"), the
// history guest checkout keeps in localStorage via OrderService. The page crashed on load: it used Order
// and OrderService without importing them. Details open in place instead of a modal; a "Track package"
// button that did nothing is gone. Signed-in shoppers are pointed to their account order history.
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, OrderService } from '@/services/orderService';
import PageHead from '@/components/ui/PageHead';
import { LinePlate, SummaryLine, Totals, money } from '@/components/commerce/Shop';

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const userOrders = OrderService.getOrders();
    setOrders(userOrders);
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shipping.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dateLong = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <PageHead
        title="Your orders"
        text="Orders placed on this device. Signed in? Your full history is in your account."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Your orders' }]}
      />

      <div className="dash" style={{ paddingTop: 0 }}>
        <form role="search" className="help-search" style={{ marginTop: 0 }} onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className="sr-only">Search by order number or email</label>
          <input
            type="search"
            id="search"
            className="field__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order number or email"
          />
        </form>

        {filteredOrders.length === 0 ? (
          <div className="dash-empty">
            <p>{searchTerm ? 'No order matches that search.' : 'No orders on this device yet.'}</p>
            <div className="dash-sec__actions">
              <Link href="/products" className="btn btn--solid">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Browse the gear</span>
              </Link>
              <Link href="/orders" className="btn btn--line">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Account orders</span>
              </Link>
            </div>
          </div>
        ) : (
          <ul className="order-cards">
            {filteredOrders.map((order) => {
              const open = selectedOrder?.id === order.id;
              return (
                <li key={order.id} className="order-card">
                  <div className="order-card__head">
                    <div>
                      <h2 className="order-card__no mono">{order.id}</h2>
                      <p className="order-card__date">Placed {dateLong(order.createdAt)} · arrives by {dateLong(order.estimatedDelivery)}</p>
                    </div>
                    <span className={`status status--${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    <p className="order-card__total mono">{money(order.totals.total)}</p>
                  </div>

                  {!open && (
                    <ul className="order-card__items">
                      {order.items.slice(0, 4).map((item, index) => (
                        <li key={index} className="order-card__item">
                          <LinePlate image={item.image} name={item.name} />
                          <div>
                            <p className="order-card__name">{item.name}</p>
                            <p className="line__meta">Qty <span className="mono">{item.quantity}</span></p>
                          </div>
                        </li>
                      ))}
                      {order.items.length > 4 && <li className="order-card__more mono">+{order.items.length - 4} more</li>}
                    </ul>
                  )}

                  {open && (
                    <div id={`order-${order.id}`} className="order-card__detail">
                      <ul className="lines">
                        {order.items.map((item, index) => (
                          <SummaryLine key={index} name={item.name} image={item.image} quantity={item.quantity} lineTotal={item.price * item.quantity} />
                        ))}
                      </ul>
                      <div style={{ display: 'grid', gap: '1.25rem', alignContent: 'start' }}>
                        <p className="ship-to" style={{ display: 'block' }}>
                          <span className="ship-to__k">Shipping to</span>
                          {order.shipping.firstName} {order.shipping.lastName}<br />
                          {order.shipping.address}<br />
                          {order.shipping.city}, {order.shipping.state} <span className="mono">{order.shipping.zipCode}</span>
                          {order.shipping.country ? <><br />{order.shipping.country}</> : null}
                        </p>
                        <p className="ship-to" style={{ display: 'block' }}>
                          <span className="ship-to__k">Paid with</span>
                          {order.payment.cardType}{order.payment.last4 && order.payment.last4 !== '****' ? <> ending <span className="mono">{order.payment.last4}</span></> : null}
                          <br /><span className="mono" style={{ color: 'var(--c-muted)', fontSize: 'var(--t-xs)', overflowWrap: 'anywhere' }}>{order.payment.transactionId}</span>
                        </p>
                        <Totals subtotal={order.totals.subtotal} shipping={order.totals.shipping} tax={order.totals.tax} total={order.totals.total} />
                      </div>
                    </div>
                  )}

                  <div className="order-card__actions">
                    <button
                      type="button"
                      className="btn btn--line btn--sm"
                      aria-expanded={open}
                      aria-controls={`order-${order.id}`}
                      onClick={() => setSelectedOrder(open ? null : order)}
                    >
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">{open ? 'Hide details' : 'Details'}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
