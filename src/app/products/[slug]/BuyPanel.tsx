// src/app/products/[slug]/BuyPanel.tsx
// The buy column (DESIGN.md): meta, the one h1, the price readout, stock state, quantity, add to
// cart, wishlist and the store facts. Sticky beside the gallery on desktop. On phones a buy bar
// rises from the bottom once the main button scrolls away, and steps aside over the footer.
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/catalog';
import { site } from '@/data/site';
import SignInAlert from '@/components/ui/SignInAlert';
import Toast from '@/components/ui/Toast';

const MAX_QTY = 10;

export default function BuyPanel({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);
  // Announce quantity only when the visitor changes it, not when it resets after adding.
  const [qtyNote, setQtyNote] = useState('');
  const step = (d: number) => {
    const next = Math.min(MAX_QTY, Math.max(1, qty + d));
    if (next === qty) return;
    setQty(next);
    setQtyNote(`Quantity ${next}`);
  };
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    open: false, message: '', type: 'success',
  });
  const ctaRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onSale = !!product.originalPrice && product.originalPrice > product.price;
  const saved = onSale ? product.originalPrice! - product.price : 0;
  const inWishlist = isInWishlist(product.slug);

  // Buy bar: visible while the main button is out of view, hidden again once the footer shows.
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    const footer = document.querySelector('.site-footer');
    let ctaGone = false;
    let footerIn = false;
    const sync = () => setShowBar(ctaGone && !footerIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cta) ctaGone = !e.isIntersecting && e.boundingClientRect.top < 0;
        else footerIn = e.isIntersecting;
      }
      sync();
    });
    io.observe(cta);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const add = (n: number) => {
    for (let i = 0; i < n; i++) addToCart(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setAdded(false); setQty(1); setQtyNote(''); }, 1400);
  };

  const onWish = async () => {
    if (!isAuthenticated) { setShowSignIn(true); return; }
    const was = inWishlist;
    setWishBusy(true);
    const ok = await toggleWishlist(product.slug);
    setWishBusy(false);
    setToast(ok
      ? { open: true, message: was ? 'Removed from wishlist' : 'Saved to wishlist', type: was ? 'info' : 'success' }
      : { open: true, message: 'Could not update your wishlist. Try again.', type: 'error' });
  };

  const addLabel = !product.inStock ? 'Sold out' : added ? 'Added to cart' : `Add ${qty > 1 ? `${qty} ` : ''}to cart`;

  return (
    <div className="pdp-buy">
      <div className="pdp-buy__inner">
        <p className="pdp-buy__meta">
          {product.brand}
          {product.category && <span aria-hidden="true"> / </span>}
          {product.category && <span className="sr-only">, </span>}
          {product.category}
        </p>
        <h1 className="pdp-buy__title" data-split="lines" data-intro>{product.name}</h1>

        <div className="readout pdp-buy__readout">
          <span className="readout__k">Price</span>
          <span className="readout__price mono">
            {formatPrice(product.price)}
          </span>
          {onSale ? (
            <span className="readout__name pdp-buy__was">
              <span className="sr-only">Was </span>
              <s className="mono">{formatPrice(product.originalPrice!)}</s>
              <span className="chip chip--gill">Save {formatPrice(saved)}</span>
            </span>
          ) : (
            <span className="readout__name pdp-buy__was">The price on the tag, shipping included</span>
          )}
          <span className={`readout__state ${product.inStock ? 'is-in' : 'is-out'}`}>
            <span className="readout__dot pdp-buy__dot" aria-hidden="true" />
            {product.inStock ? 'In stock' : 'Out of stock for now'}
            {typeof product.rating === 'number' && (
              <span className="pdp-buy__rating mono">
                <span aria-hidden="true">★ </span>
                <span className="sr-only">Rated </span>
                {product.rating.toFixed(1)}
                <span className="sr-only"> out of 5</span>
              </span>
            )}
          </span>
        </div>

        <div className="pdp-buy__cta" ref={ctaRef}>
          {product.inStock && (
            <div className="pdp-qty" role="group" aria-label="Quantity">
              <button type="button" className="pdp-qty__btn" onClick={() => step(-1)} aria-disabled={qty <= 1} aria-label="One fewer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
              <output className="pdp-qty__value mono" aria-label={`Quantity ${qty}`}>{qty}</output>
              <button type="button" className="pdp-qty__btn" onClick={() => step(1)} aria-disabled={qty >= MAX_QTY} aria-label="One more">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>
          )}
          <button
            type="button"
            className={`btn btn--solid pdp-buy__add ${added ? 'is-filled' : ''}`}
            onClick={() => add(qty)}
            disabled={!product.inStock}
          >
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">{addLabel}</span>
          </button>
          <button
            type="button"
            className={`icon-btn wish pdp-buy__wish ${inWishlist ? 'is-on' : ''}`}
            onClick={onWish}
            disabled={wishBusy}
            aria-pressed={inWishlist}
            aria-label="Wishlist"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <p className="sr-only" aria-live="polite">{added ? `${product.name} added to cart` : qtyNote}</p>
        </div>

        {qty > 1 && product.inStock && (
          <p className="pdp-buy__total">
            <span>{qty} at {formatPrice(product.price)}</span>
            <span className="mono">{formatPrice(product.price * qty)}</span>
          </p>
        )}

        <ul className="pdp-facts" role="list">
          <li className="pdp-facts__item">
            <span className="pdp-facts__k">Shipping</span>
            <span>{site.shippingLine}</span>
          </li>
          <li className="pdp-facts__item">
            <span className="pdp-facts__k">Returns</span>
            <Link href="/returns" className="text-link">How returns work</Link>
          </li>
          <li className="pdp-facts__item">
            <span className="pdp-facts__k">Warranty</span>
            <Link href="/warranty" className="text-link">What the warranty covers</Link>
          </li>
        </ul>
      </div>

      <div className={`pdp-bar ${showBar ? 'is-on' : ''}`} aria-hidden={!showBar} inert={!showBar}>
        <div className="pdp-bar__text">
          <span className="pdp-bar__name">{product.name}</span>
          <span className="pdp-bar__price mono">{formatPrice(product.price)}</span>
        </div>
        <button type="button" className={`btn btn--solid btn--sm ${added ? 'is-filled' : ''}`} onClick={() => add(1)} disabled={!product.inStock}>
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">{!product.inStock ? 'Sold out' : added ? 'Added' : 'Add to cart'}</span>
        </button>
      </div>

      <SignInAlert
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        message="Sign in to save items to your wishlist and see them on any device."
      />
      <Toast message={toast.message} type={toast.type} isOpen={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))} />
    </div>
  );
}
