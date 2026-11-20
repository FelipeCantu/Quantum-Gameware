// src/components/Cart.tsx: the cart drawer (DESIGN.md, "Cart and checkout"). It wipes in from the right
// edge like the menu, lists lines on white plates with a quantity stepper, and keeps the subtotal and
// the way to checkout pinned at the bottom. A modal dialog: Escape and the scrim close it, focus moves
// in on open and back to the header cart button on close. Styles in styles/commerce.css.
'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { LinePlate, Qty, money } from '@/components/commerce/Shop';

export default function Cart() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  // closeCart is a new function on every provider render; keep the latest in a ref so the open/close
  // effect below runs only when isOpen changes (otherwise each quantity change would steal focus).
  const closeRef = useRef(closeCart);
  closeRef.current = closeCart;

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      document.querySelector<HTMLElement>('.cart-btn')?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="drawer">
      <div className="drawer__scrim" onClick={closeCart} aria-hidden="true" />
      <div ref={panelRef} className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1}>
        <div className="drawer__head">
          <h2 id="drawer-title" className="drawer__title">
            Cart <span className="drawer__count">{itemCount} item{itemCount === 1 ? '' : 's'}</span>
          </h2>
          <button type="button" className="drawer__close" onClick={closeCart}>
            Close
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <p>Nothing in the cart yet.</p>
              <Link href="/products" onClick={closeCart} className="btn btn--solid">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Browse the gear</span>
              </Link>
            </div>
          ) : (
            <ul className="lines">
              {items.map((item) => (
                <li key={item._id} className="line line--compact">
                  <LinePlate image={item.image} name={item.name} />
                  <div>
                    <p className="line__name"><Link href={`/products/${item.slug}`} onClick={closeCart}>{item.name}</Link></p>
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
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot">
            <dl className="receipt__rows">
              <div className="receipt__row"><dt>Shipping</dt><dd className="receipt__free">Free</dd></div>
              <div className="receipt__total"><dt>Subtotal</dt><dd>{money(getCartTotal())}</dd></div>
            </dl>
            <p className="receipt__note">Tax is added at checkout.</p>
            <Link href="/cart" onClick={closeCart} className="btn btn--solid btn--block" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Review cart and check out</span>
            </Link>
            <button type="button" onClick={closeCart} className="btn btn--line btn--block">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Keep shopping</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
