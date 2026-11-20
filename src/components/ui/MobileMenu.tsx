// src/components/ui/MobileMenu.tsx: the phone menu (DESIGN.md). A full-height sheet under the
// header: primary links at display size, departments as an accordion, search, account and contact.
// Links arrive as offset ghosts and collapse into place. Header.tsx owns the open state, the
// scroll lock and Escape. While open, everything outside the menu and the menu button is inert,
// so focus stays inside; focus returns to the menu button on close unless a link was followed.
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { prefersReducedMotion } from '@/engine';
import { navigate } from '@/engine/next';
import { nav, site } from '@/data/site';
import type { NavGroup } from '@/data/taxonomy';

interface MobileMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
  effectiveTheme: 'light' | 'dark';
  groups: NavGroup[];
}

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export default function MobileMenu({ isMenuOpen, closeMenu, groups }: MobileMenuProps) {
  const pathname = usePathname();
  const { toggleCart, getCartCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const followed = useRef(false);
  const cartCount = getCartCount();

  useEffect(() => setMounted(true), []);

  // Focus in on open; back to the menu button on close, unless the close came from following a link
  // (the new page owns focus then).
  useEffect(() => {
    if (isMenuOpen) {
      wasOpen.current = true;
      followed.current = false;
      panelRef.current?.querySelector<HTMLElement>('a, button, input, summary')?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      wasOpen.current = false;
      if (!followed.current) document.querySelector<HTMLElement>('.menu-btn')?.focus({ preventScroll: true });
    }
  }, [isMenuOpen, mounted]);

  // Modal containment: make every sibling along the menu button's ancestor chain inert (main,
  // footer, the rest of the header, floating widgets), leaving only the button and the menu live.
  useEffect(() => {
    const panel = panelRef.current;
    const btn = document.querySelector<HTMLElement>('.menu-btn');
    if (!isMenuOpen || !panel || !btn) return;
    const made: HTMLElement[] = [];
    for (let node: HTMLElement | null = btn; node && node !== document.body; node = node.parentElement) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const sib of Array.from(parent.children) as HTMLElement[]) {
        if (sib === node || sib === panel || sib.contains(panel) || sib.inert || sib.tagName === 'SCRIPT') continue;
        sib.inert = true;
        made.push(sib);
      }
    }
    return () => made.forEach((el) => { el.inert = false; });
  }, [isMenuOpen, mounted]);

  // The menu only exists below 1024px: close it if the viewport grows past that.
  useEffect(() => {
    if (!isMenuOpen) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) closeMenu(); };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isMenuOpen, closeMenu]);

  // Opening motion: each item arrives as an offset ghost and collapses into place.
  useEffect(() => {
    const panel = panelRef.current;
    if (!isMenuOpen || !panel || prefersReducedMotion()) return;
    const items = panel.querySelectorAll<HTMLElement>('[data-menu-item]');
    const tween = gsap.fromTo(
      items,
      { x: -14, opacity: 0, textShadow: '-6px 0 0 rgb(38 51 255 / 0.55), 6px 0 0 rgb(255 79 154 / 0.55)' },
      { x: 0, opacity: 1, textShadow: '0px 0 0 rgb(38 51 255 / 0), 0px 0 0 rgb(255 79 154 / 0)', duration: 0.7, ease: 'expo.out', stagger: 0.04, clearProps: 'textShadow' },
    );
    return () => { tween.kill(); };
  }, [isMenuOpen, mounted]);

  if (!mounted || !isMenuOpen) return null;

  const follow = () => { followed.current = true; closeMenu(); };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    follow();
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const onSignOut = async () => {
    await signOut();
    closeMenu();
  };

  return createPortal(
    <div ref={panelRef} id="mobile-menu" className="mmenu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="mmenu__top">
        <button type="button" className="mmenu__close" onClick={closeMenu}>
          Close menu
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
      <nav aria-label="Primary" className="mmenu__primary">
        <ul>
          {[{ label: 'Home', href: '/' }, ...nav].map((item) => (
            <li key={item.href} data-menu-item>
              <Link
                href={item.href}
                onClick={follow}
                className="mmenu__big"
                aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="mmenu__section" aria-labelledby="mmenu-depts">
        <h2 id="mmenu-depts" className="mmenu__label" data-menu-item>Shop by department</h2>
        <div className="mmenu__depts">
          {groups.map((g) => (
            <details key={g.slug} className="mmenu__dept" data-menu-item open={pathname.startsWith(g.href) || g.leaves.some((l) => pathname === l.href)}>
              <summary className="mmenu__summary">
                <span>{g.name}</span>
                <svg className="mmenu__chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              </summary>
              <ul className="mmenu__leaves">
                {g.leaves.map((l) => (
                  <li key={l.slug}>
                    <Link href={l.href} onClick={follow} className="mmenu__leaf" aria-current={pathname === l.href ? 'page' : undefined}>
                      {l.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={g.href} onClick={follow} className="mmenu__leaf mmenu__leaf--all" aria-current={pathname === g.href ? 'page' : undefined}>
                    All {g.name.toLowerCase()}
                  </Link>
                </li>
              </ul>
            </details>
          ))}
        </div>
      </section>

      <form className="mmenu__search" role="search" onSubmit={onSearch} data-menu-item>
        <label htmlFor="mmenu-q" className="mmenu__label">Search the catalog</label>
        <div className="mmenu__search-row">
          <input id="mmenu-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mouse, headset, Razer" className="mmenu__input" />
          <button type="submit" className="btn btn--solid">
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Search</span>
          </button>
        </div>
      </form>

      <section className="mmenu__section" aria-labelledby="mmenu-you">
        <h2 id="mmenu-you" className="mmenu__label" data-menu-item>Your account</h2>
        {isAuthenticated && user ? (
          <div className="mmenu__account" data-menu-item>
            <p className="mmenu__user">
              <span>{user.name}</span>
              <span className="mmenu__muted">{user.email}</span>
            </p>
            <div className="mmenu__pair">
              <Link href="/account" onClick={follow} className="btn btn--line">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Account</span>
              </Link>
              <button type="button" onClick={onSignOut} className="btn btn--line">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Sign out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mmenu__pair" data-menu-item>
            <Link href="/auth/signin" onClick={follow} className="btn btn--solid">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Sign in</span>
            </Link>
            <Link href="/auth/signup" onClick={follow} className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Create account</span>
            </Link>
          </div>
        )}
        <div className="mmenu__utility" data-menu-item>
          <button type="button" className="mmenu__util" onClick={() => { toggleCart(); follow(); }}>
            Cart <span className="mono">{cartCount}</span>
          </button>
          <Link href="/wishlist" onClick={follow} className="mmenu__util">Wishlist</Link>
          <Link href="/orders" onClick={follow} className="mmenu__util">Orders</Link>
        </div>
      </section>

      <p className="mmenu__contact" data-menu-item>
        <a href={site.phone.href} className="text-link">{site.phone.label}</a>
        <span className="mmenu__muted"> · {site.shippingLine}</span>
      </p>
    </div>,
    document.body,
  );
}
