// src/app/cart/page.tsx: the cart, step 1 of checkout (DESIGN.md, "Cart and checkout"). Lines on white
// plates with a quantity stepper | a sticky receipt. Removed from the old page: a promo code field that
// was never applied and a hard-coded "you might also like" product with a dead Add button.
"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { LinePlate, Qty, StepsStrip, Totals, money } from '@/components/commerce/Shop';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="void">
        <h1 className="void__title">Your cart is empty.</h1>
        <p className="void__text">Every price is the price. Pick something and it waits here until you check out.</p>
        <div className="void__ctas">
          <Link href="/products" className="btn btn--solid" data-fill>
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Shop all gear</span>
          </Link>
          <Link href="/categories" className="btn btn--line">
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Browse categories</span>
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const estimatedTax = getCartTotal() * 0.08; // 8% tax estimate
  const finalTotal = getCartTotal() + estimatedTax;

  return (
    <>
      <header className="shop-head">
        <StepsStrip current={1} />
        <h1 className="shop-head__title">Your cart</h1>
        <p className="shop-head__meta"><span className="mono">{itemCount}</span> item{itemCount === 1 ? '' : 's'} ready for checkout</p>
      </header>

      <div className="shop">
        <section className="shop__main" aria-label="Items in your cart">
          <ul className="lines">
            {items.map((item) => (
              <li key={item._id} className="line">
                <LinePlate image={item.image} name={item.name} />
                <div>
                  <p className="line__name"><Link href={`/products/${item.slug}`}>{item.name}</Link></p>
                  <p className="line__meta">{item.brand} · <span className="mono">{money(item.price)}</span> each</p>
                </div>
                <p className="line__total">{money(item.price * item.quantity)}</p>
                <div className="line__controls">
                  <Qty value={item.quantity} name={item.name} onChange={(n) => updateQuantity(item._id, n)} />
                  <button type="button" className="linklike" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1.25rem' }}><Link href="/products" className="text-link" style={{ fontSize: 'var(--t-s)' }}>Keep shopping</Link></p>
        </section>

        <aside className="shop__side" aria-labelledby="sum-title">
          <div className="receipt">
            <h2 id="sum-title" className="receipt__title">Summary</h2>
            <Totals subtotal={getCartTotal()} shipping={0} tax={estimatedTax} total={finalTotal} taxLabel="Estimated tax" count={itemCount} />
            <p className="receipt__note">Tax is final at checkout.</p>
            <div className="receipt__actions">
              <Link href="/cart/checkout" className="btn btn--solid btn--block" data-fill>
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Check out</span>
              </Link>
            </div>
            <ul className="receipt__trust">
              <li>Free shipping on every order</li>
              <li><Link href="/returns">30-day returns</Link> on most items</li>
              <li>Checkout over an encrypted connection</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
