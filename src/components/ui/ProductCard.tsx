"use client";
// Product card (DESIGN.md): a white plate where the photo arrives as cobalt and gill ghosts that
// collapse when the card is observed (scrolled into view), and re-excite slightly on hover.
// Products without a photo get an honest "not photographed yet" plate set from their initials.
// Cart, wishlist, sign-in and toast behaviour is unchanged from the previous card.

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, hasPhoto, initials } from '@/lib/catalog';
import SignInAlert from './SignInAlert';
import Toast from './Toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
  imageAspectRatio?: 'square' | 'wide' | 'tall';
  /** Eager-load the photo (first row above the fold). */
  priority?: boolean;
}

export default function ProductCard({
  product,
  className = '',
  showQuickActions = true,
  imageAspectRatio = 'wide',
  priority = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [observed, setObserved] = useState(false);
  const [showSignInAlert, setShowSignInAlert] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const ref = useRef<HTMLElement>(null);

  // Observation: collapse the ghosts the first time the card is mostly in view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setObserved(true);
        io.disconnect();
      }
    }, { rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!product.slug) return null;

  const inWishlist = isInWishlist(product.slug);
  const href = `/products/${encodeURIComponent(product.slug)}`;
  const photo = hasPhoto(product) && !imageError;
  const onSale = !!product.originalPrice && product.originalPrice > product.price;
  const discount = onSale ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const shortCategory = product.category?.replace(/^Gaming /, '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowSignInAlert(true);
      return;
    }
    const wasInWishlist = inWishlist;
    setIsWishlistLoading(true);
    const success = await toggleWishlist(product.slug);
    setIsWishlistLoading(false);
    if (success) {
      setToastMessage(wasInWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
      setToastType(wasInWishlist ? 'info' : 'success');
    } else {
      setToastMessage('Could not update your wishlist. Try again.');
      setToastType('error');
    }
    setShowToast(true);
  };

  return (
    <article
      ref={ref}
      className={`qcard qcard--${imageAspectRatio} ${observed ? 'is-observed' : ''} ${product.inStock ? '' : 'is-out'} ${className}`}
    >
      <Link href={href} className="qcard__plate" tabIndex={-1} aria-hidden="true" aria-label={product.name}>
        {photo ? (
          <>
            <Image src={product.image} alt="" fill sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw" className="qcard__ghost qcard__ghost--q" priority={priority} />
            <Image src={product.image} alt="" fill sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw" className="qcard__ghost qcard__ghost--g" priority={priority} />
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              className="qcard__img"
              priority={priority}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <span className="qcard__blank">
            <span className="qcard__glyph qcard__ghost qcard__ghost--q">{initials(product.name)}</span>
            <span className="qcard__glyph qcard__ghost qcard__ghost--g">{initials(product.name)}</span>
            <span className="qcard__glyph">{initials(product.name)}</span>
            <span className="qcard__blank-note">Not photographed yet</span>
          </span>
        )}
        <span className="qcard__flags">
          {product.isNew && <span className="chip chip--ink">New</span>}
          {onSale && <span className="chip chip--gill">{discount}% off</span>}
          {!product.inStock && <span className="chip">Out of stock</span>}
        </span>
      </Link>

      <div className="qcard__body">
        <p className="qcard__meta">
          {product.brand}
          {shortCategory && <span aria-hidden="true"> / </span>}
          {shortCategory && <span className="sr-only">, </span>}
          {shortCategory}
        </p>
        <h3 className="qcard__name">
          <Link href={href} className="qcard__link">{product.name}</Link>
        </h3>
        <p className="qcard__price">
          <span className="sr-only">Price </span>
          <span className="mono">{formatPrice(product.price)}</span>
          {onSale && (
            <>
              <span className="sr-only">, was </span>
              <s className="mono qcard__was">{formatPrice(product.originalPrice!)}</s>
            </>
          )}
          {typeof product.rating === 'number' && (
            <span className="qcard__rating mono">
              <span aria-hidden="true">★ </span>
              <span className="sr-only">Rated </span>
              {product.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span>
            </span>
          )}
        </p>
        <div className="qcard__actions">
          <button type="button" className="btn btn--sm" onClick={handleAddToCart} disabled={!product.inStock}>
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">{product.inStock ? 'Add to cart' : 'Sold out'}</span>
          </button>
          {showQuickActions && (
            <button
              type="button"
              className={`icon-btn wish ${inWishlist ? 'is-on' : ''}`}
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              aria-pressed={inWishlist}
              aria-label={`${inWishlist ? 'Remove' : 'Save'} ${product.name} ${inWishlist ? 'from' : 'to'} wishlist`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <SignInAlert
        isOpen={showSignInAlert}
        onClose={() => setShowSignInAlert(false)}
        message="Sign in to save items to your wishlist and see them on any device."
      />
      <Toast message={toastMessage} type={toastType} isOpen={showToast} onClose={() => setShowToast(false)} />
    </article>
  );
}
