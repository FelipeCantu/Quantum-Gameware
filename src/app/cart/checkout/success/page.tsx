// src/app/cart/checkout/success/page.tsx: order placed, step 4 of 4 (DESIGN.md, "Cart and checkout").
// The order lookup and confirmation email logic is unchanged. The moment of arrival: "Order placed."
// arrives as cobalt and gill ghosts that collapse into one line, then the order number, delivery date
// and total as a readout. Removed: a placeholder 1-800 number, a link to a /support page that does not
// exist, share buttons that did nothing, and a random order number shown when the order was missing.
'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepsStrip, SummaryLine, Totals, money } from '@/components/commerce/Shop';
import { site } from '@/data/site';

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

// Email status types
type EmailStatus = 'sending' | 'sent' | 'failed' | 'not_sent';

function LoadingScreen() {
  return <div className="auth-wait" aria-busy="true">Loading your order</div>;
}

const emailCopy: Record<EmailStatus, { title: string; text: (email?: string) => string; tone: string } | null> = {
  sending: { title: 'Sending your confirmation', text: () => 'Your order confirmation email is on its way.', tone: '' },
  sent: { title: 'Confirmation sent', text: (email) => `Check ${email || 'your inbox'} for the receipt and tracking.`, tone: 'alert--ok' },
  failed: { title: 'The email did not go out', text: () => 'Your order is confirmed. Write to us if you need the receipt.', tone: 'alert--error' },
  not_sent: null,
};

function EmailStatusBanner({ status, customerEmail }: { status: EmailStatus; customerEmail?: string }) {
  const config = emailCopy[status];
  if (!config) return null;
  return (
    <div className={`alert ${config.tone}`} role="status">
      <p className="alert__title">{config.title}</p>
      <p className="alert__text">{config.text(customerEmail)}</p>
    </div>
  );
}

// Main content component that uses useSearchParams
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('not_sent');

  useEffect(() => {
    // Prevent back navigation to checkout
    const handlePopState = () => {
      router.replace('/products');
    };

    window.addEventListener('popstate', handlePopState);

    // Get order from URL params or localStorage
    const getOrderData = async () => {
      const orderId = searchParams.get('order');
      const emailSent = searchParams.get('emailSent') === 'true';
      const emailFailed = searchParams.get('emailFailed') === 'true';
      
      // Set initial email status based on URL params
      if (emailSent) {
        setEmailStatus('sent');
      } else if (emailFailed) {
        setEmailStatus('failed');
      }
      
      if (orderId) {
        try {
          // Try to get order from localStorage
          const savedOrders = localStorage.getItem('userOrders');
          if (savedOrders) {
            const orders = JSON.parse(savedOrders);
            const foundOrder = orders.find((o: Order) => o.id === orderId);
            if (foundOrder) {
              const orderWithDates = {
                ...foundOrder,
                createdAt: new Date(foundOrder.createdAt),
                estimatedDelivery: new Date(foundOrder.estimatedDelivery)
              };
              setOrder(orderWithDates);

              // If email status wasn't set from URL params, try to send confirmation
              if (!emailSent && !emailFailed) {
                await sendConfirmationEmail(orderWithDates);
              }
            }
          }
        } catch (error) {
          console.error('Error loading order:', error);
          setEmailStatus('failed');
        }
      }
      
      setLoading(false);
    };

    getOrderData();

    return () => window.removeEventListener('popstate', handlePopState);
  }, [router, searchParams]);

  const sendConfirmationEmail = async (orderData: Order) => {
    setEmailStatus('sending');
    
    try {
      // Call your API route to send the email
      const response = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            id: orderData.id,
            items: orderData.items,
            shipping: orderData.shipping,
            payment: orderData.payment,
            totals: orderData.totals,
            status: orderData.status,
            createdAt: orderData.createdAt.toISOString(),
            estimatedDelivery: orderData.estimatedDelivery.toISOString()
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailStatus('sent');
        console.log('✅ Confirmation email sent successfully');
      } else {
        setEmailStatus('failed');
        console.warn('⚠️ Failed to send confirmation email:', result.error);
      }
    } catch (error) {
      setEmailStatus('failed');
      console.error('❌ Error sending confirmation email:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const dateLong = (d: Date, weekday = false) =>
    d.toLocaleDateString('en-US', { ...(weekday ? { weekday: 'long' as const } : {}), year: 'numeric', month: 'long', day: 'numeric' });
  const placed = order?.createdAt ?? new Date();
  const arrives = order?.estimatedDelivery ?? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const itemCount = order?.items.reduce((n, i) => n + i.quantity, 0) ?? 0;

  const next = [
    {
      t: emailStatus === 'sent' ? 'Confirmation sent' : emailStatus === 'sending' ? 'Sending your confirmation' : emailStatus === 'failed' ? 'Email delivery issue' : 'Confirmation email',
      d: emailStatus === 'failed'
        ? 'Your order is confirmed, but the email failed. Write to us if you need the receipt.'
        : `The receipt and tracking go to ${order?.shipping.email || 'your email'}.`,
    },
    { t: 'We pack it', d: "Your items are prepared for shipment within 1-2 business days." },
    { t: 'On its way', d: 'You get the tracking number by email as soon as it ships.' },
  ];

  return (
    <>
      <header className="done">
        <div className="done__in">
          <StepsStrip current={4} />
          <div className="done__title" aria-hidden="true">
            <span className="done__ghost done__ghost--q" data-text="Order placed." />
            <span className="done__ghost done__ghost--g" data-text="Order placed." />
          </div>
          <h1 className="done__h1">Order placed.</h1>
          <p className="done__lede">Thank you. Here is everything, measured once.</p>
          <dl className="stats done__stats">
            <div className="stats__cell">
              <dt className="stats__k">Order</dt>
              <dd className="stats__v mono" style={{ overflowWrap: 'anywhere' }}>{order?.id ?? 'In your email'}</dd>
              <dd className="stats__note">Placed {dateLong(placed)}</dd>
            </div>
            <div className="stats__cell">
              <dt className="stats__k">Arrives by</dt>
              <dd className="stats__v">{dateLong(arrives, true)}</dd>
              <dd className="stats__note">Free standard shipping</dd>
            </div>
            <div className="stats__cell stats__cell--accent">
              <dt className="stats__k">Total paid</dt>
              <dd className="stats__v mono">{order ? money(order.totals.total) : 'See your email'}</dd>
              {order?.payment && <dd className="stats__note">{order.payment.cardType}{order.payment.last4 && order.payment.last4 !== '****' ? ` ending ${order.payment.last4}` : ''}</dd>}
            </div>
          </dl>
        </div>
      </header>

      <div className="shop">
        <div className="shop__main" style={{ display: 'grid', gap: 'calc(var(--u) * 4)' }}>
          <EmailStatusBanner status={emailStatus} customerEmail={order?.shipping.email} />

          <section className="co-sec" aria-labelledby="done-next">
            <h2 id="done-next" className="co-sec__title">What happens next</h2>
            <ol className="steps">
              {next.map((s) => (
                <li key={s.t}>
                  <span className="steps__t">{s.t}</span>
                  <span className="steps__d">{s.d}</span>
                </li>
              ))}
            </ol>
          </section>

          {order?.shipping && (
            <section className="co-sec" aria-labelledby="done-ship">
              <h2 id="done-ship" className="co-sec__title">Shipping to</h2>
              <p className="ship-to" style={{ display: 'block' }}>
                {order.shipping.firstName} {order.shipping.lastName}<br />
                {order.shipping.address}<br />
                {order.shipping.city}, {order.shipping.state} <span className="mono">{order.shipping.zipCode}</span>
              </p>
            </section>
          )}

          <div className="void__ctas done__ctas">
            <Link href="/products" className="btn btn--solid" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Keep shopping</span>
            </Link>
            <Link href="/cart/orders" className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Your orders</span>
            </Link>
            <button type="button" className="btn btn--line" onClick={() => window.print()}>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Print receipt</span>
            </button>
          </div>
          <p className="field__hint">
            Questions about this order? <Link href="/contact" className="text-link">Write to us</Link> or call <a href={site.phone.href} className="text-link">{site.phone.label}</a>.
          </p>
        </div>

        {order?.items && order.items.length > 0 && (
          <aside className="shop__side" aria-labelledby="done-items">
            <div className="receipt">
              <h2 id="done-items" className="receipt__title">Receipt</h2>
              <ul className="lines">
                {order.items.map((item, index) => (
                  <SummaryLine key={index} name={item.name} image={item.image} quantity={item.quantity} lineTotal={item.price * item.quantity} />
                ))}
              </ul>
              <Totals subtotal={order.totals.subtotal} shipping={order.totals.shipping} tax={order.totals.tax} total={order.totals.total} count={itemCount} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

// Main exported component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SuccessContent />
    </Suspense>
  );
}
