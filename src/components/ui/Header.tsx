// components/ui/Header.tsx
// Instrument-bar header (DESIGN.md): wordmark, primary nav with the current page marked, a
// categories disclosure, and the existing search, account, cart and mobile menu pieces.
// It steps aside on scroll down and returns on scroll up (html.header-away, set in motion/setup.ts).
"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { navGroups } from '@/data/taxonomy';
import { nav } from '@/data/site';
import MobileMenu from './MobileMenu';
import SearchDropdown from './SearchDropdown';
import UserMenu from './UserMenu';

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export default function Header({ stocked }: { stocked?: string[] }) {
  const pathname = usePathname();
  const groups = useMemo(() => navGroups(stocked), [stocked]);
  const { effectiveTheme } = useTheme();
  const { toggleCart, getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatsOpen, setIsCatsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLLIElement>(null);
  const scrollPositionRef = useRef(0);

  // Close transient panels on navigation.
  useEffect(() => {
    setIsCatsOpen(false);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  // Outside click and Escape close the categories panel and search.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(t)) setIsSearchOpen(false);
      if (catsRef.current && !catsRef.current.contains(t)) setIsCatsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Closing unmounts or hides the focused element: hand focus back to the panel's toggle.
      const active = document.activeElement;
      for (const ref of [searchRef, catsRef]) {
        if (ref.current && active && ref.current.contains(active)) ref.current.querySelector<HTMLElement>('button')?.focus();
      }
      setIsCatsOpen(false);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Mobile menu scroll lock (kept from the previous header).
  useEffect(() => {
    const body = document.body.style;
    if (isMenuOpen) {
      scrollPositionRef.current = window.scrollY;
      body.overflow = 'hidden';
      body.position = 'fixed';
      body.top = `-${scrollPositionRef.current}px`;
      body.width = '100%';
    } else {
      body.overflow = '';
      body.position = '';
      body.top = '';
      body.width = '';
      if (scrollPositionRef.current > 0) window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' });
    }
    return () => {
      body.overflow = '';
      body.position = '';
      body.top = '';
      body.width = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link href="/" className="wordmark">
          <Image src="/nextgens-logo-blue.png" alt="Quantum Gameware home" width={34} height={34} className="wordmark__mark" priority />
          <span className="wordmark__text" aria-hidden="true">
            <span>Quantum</span>
            <span>Gameware</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {nav.map((item) =>
              item.href === '/categories' ? (
                <li
                  key={item.href}
                  className="site-nav__cats"
                  ref={catsRef}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsCatsOpen(false); }}
                >
                  <button
                    type="button"
                    className="draw site-nav__link"
                    aria-expanded={isCatsOpen}
                    aria-controls="cats-panel"
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                    onClick={() => setIsCatsOpen((o) => !o)}
                  >
                    {item.label}
                    <svg className="site-nav__chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </button>
                  <div
                    id="cats-panel"
                    className="cats-panel"
                    hidden={!isCatsOpen}
                    onClick={(e) => { if ((e.target as Element).closest('a')) setIsCatsOpen(false); }}
                  >
                    <div className="cats-panel__grid">
                      {groups.map((g) => (
                        <div key={g.slug} className="cats-panel__group">
                          <Link href={g.href} className="cats-panel__dept draw">{g.name}</Link>
                          <ul>
                            {g.leaves.map((c) => (
                              <li key={c.slug}>
                                <Link href={c.href} className="draw" aria-current={pathname === c.href ? 'page' : undefined}>{c.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="cats-panel__foot">
                      <Link href="/categories" className="cats-panel__all">All departments</Link>
                      <Link href="/products" className="cats-panel__all">All gear</Link>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="draw site-nav__link"
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="site-actions">
          <div className="site-actions__search" ref={searchRef}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Search products"
              aria-expanded={isSearchOpen}
              aria-controls={isSearchOpen ? 'search-panel' : undefined}
              onClick={() => setIsSearchOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-5.2-5.2M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            <SearchDropdown isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          </div>

          <UserMenu isScrolled effectiveTheme={effectiveTheme} />

          <button
            type="button"
            className="icon-btn cart-btn"
            onClick={toggleCart}
            aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Cart, empty'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16l-1.2 12.1a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 7Zm4 0a4 4 0 1 1 8 0" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            {cartCount > 0 && <span className="cart-btn__count">{cartCount > 99 ? '99+' : cartCount}</span>}
          </button>

          <button
            type="button"
            className="menu-btn"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((o) => !o)}
          >
            Menu
          </button>
        </div>
      </div>

      <MobileMenu isMenuOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} effectiveTheme={effectiveTheme} groups={groups} />
    </header>
  );
}
