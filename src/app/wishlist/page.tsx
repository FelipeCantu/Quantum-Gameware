// src/app/wishlist/page.tsx: saved gear (DESIGN.md, "Account"). Loading from Sanity, remove and add to
// cart are unchanged. Cards on white plates like the shop; sale items show the before price struck
// through. The old "track price changes" line is gone: nothing tracks prices.
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import AccountNav from '@/components/ui/AccountNav';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { Product } from '@/types';

function WishlistContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, isLoading: wishlistLoading } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isAddingAll, setIsAddingAll] = useState(false);

  // Fetch products based on wishlist IDs
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlist || wishlist.length === 0) {
        setWishlistItems([]);
        setIsLoadingProducts(false);
        return;
      }

      try {
        setIsLoadingProducts(true);
        const query = `*[_type == "product" && slug.current in $slugs] {
          _id,
          name,
          "slug": slug.current,
          price,
          originalPrice,
          description,
          "image": image.asset->url,
          "category": category->name,
          "brand": coalesce(brand->name, brand),
          inStock,
          rating,
          isNew
        }`;

        const products = await client.fetch(query, { slugs: wishlist });
        console.log('Fetched wishlist products:', products);
        setWishlistItems(products);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleRemoveFromWishlist = async (slug: string) => {
    setRemovingItems(prev => new Set(prev).add(slug));

    const success = await removeFromWishlist(slug);

    if (success) {
      setWishlistItems(prev => prev.filter(item => item.slug !== slug));
    }

    setRemovingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(slug);
      return newSet;
    });
  };

  const handleAddToCart = (item: Product) => {
    addToCart(item);
  };

  const handleAddAllToCart = () => {
    setIsAddingAll(true);

    // Filter and add only items that are in stock
    const inStockItems = wishlistItems.filter(item => item.inStock);

    // Add each item to cart
    inStockItems.forEach(item => {
      addToCart(item);
    });

    // Brief delay for visual feedback
    setTimeout(() => {
      setIsAddingAll(false);
    }, 500);
  };

  const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const loadingAny = isLoadingProducts || wishlistLoading;
  const inStockCount = wishlistItems.filter((i) => i.inStock).length;

  return (
    <>
      <div className="acct-head">
        <PageHead
          still
          title="Wishlist"
          text="Gear you saved for later. The price you see is the price."
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Wishlist' }]}
        />
      </div>
      <AccountNav />

      <div className="dash">
        {loadingAny ? (
          <p className="field__hint" aria-busy="true">Loading your wishlist…</p>
        ) : wishlistItems.length > 0 ? (
          <>
            <div className="saved-bar">
              <p>
                <span className="mono">{wishlistItems.length}</span> saved · <span className="mono">{money(wishlistItems.reduce((sum, item) => sum + item.price, 0))}</span> together
                {inStockCount < wishlistItems.length && <span className="field__hint"> · {wishlistItems.length - inStockCount} out of stock</span>}
              </p>
              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={isAddingAll || wishlistItems.every(item => !item.inStock)}
                aria-busy={isAddingAll}
                className="btn btn--solid btn--sm"
              >
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">{isAddingAll ? 'Adding…' : `Add ${inStockCount === wishlistItems.length ? 'all' : `${inStockCount} in stock`} to cart`}</span>
              </button>
            </div>

            <ul className="saved-grid">
              {wishlistItems.map((item) => {
                const removing = removingItems.has(item.slug);
                const onSale = item.originalPrice && item.originalPrice > item.price;
                return (
                  <li key={item.slug} className="saved" data-removing={removing ? '' : undefined}>
                    <Link href={`/products/${item.slug}`} className="saved__plate" aria-hidden="true" tabIndex={-1}>
                      {item.image
                        ? <Image src={item.image} alt="" fill sizes="(max-width: 720px) 50vw, 280px" />
                        : <span className="line__none">{item.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</span>}
                      {!item.inStock && <span className="chip chip--ink saved__chip">Out of stock</span>}
                      {onSale && item.inStock && <span className="chip chip--gill saved__chip">Sale</span>}
                    </Link>
                    <div className="saved__body">
                      {(item.brand || item.category) && (
                        <p className="saved__meta">{[item.brand, item.category].filter(Boolean).join(' / ')}</p>
                      )}
                      <h2 className="saved__name"><Link href={`/products/${item.slug}`}>{item.name}</Link></h2>
                      <p className="saved__price">
                        <span className="mono">{money(item.price)}</span>
                        {onSale && <s className="mono saved__was">{money(item.originalPrice!)}</s>}
                        {item.rating ? <span className="saved__rating mono" aria-label={`Rated ${item.rating} out of 5`}>★ {item.rating}</span> : null}
                      </p>
                    </div>
                    <div className="saved__actions">
                      <button type="button" onClick={() => handleAddToCart(item)} disabled={!item.inStock} className="btn btn--solid btn--sm">
                        <span className="btn__fill" aria-hidden="true" />
                        <span className="btn__label">{item.inStock ? 'Add to cart' : 'Out of stock'}</span>
                      </button>
                      <button type="button" onClick={() => handleRemoveFromWishlist(item.slug)} disabled={removing} className="linklike">
                        {removing ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="dash-empty">
            <p>Nothing saved yet. Tap the heart on any product to keep it here.</p>
            <Link href="/products" className="btn btn--solid" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Browse the gear</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function WishlistPage() {
  return (
    <AuthGuard requireAuth={true}>
      <WishlistContent />
    </AuthGuard>
  );
}
