// src/components/ui/MobileMenu.tsx: the phone and tablet menu (DESIGN.md, "Menu"). Cobalt and gill
// bands sweep in from the trigger's edge, offset in time, and fold into one panel: the page
// transition's collapse, played at menu scale. Primary links arrive as offset ghosts and snap into
// place; touching or hovering one re-excites its ghosts. Full screen on phones, a right sidebar over
// a scrim from 640px. Closing plays the fold in reverse before unmounting.
// Header.tsx owns the open state, the scroll lock and Escape. While open, everything outside the
// menu and the menu button is inert, so focus stays inside; focus returns to the menu button on
// close unless a link was followed.
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const SHUT = 'inset(0% 0% 0% 100%)';
const OPEN = 'inset(0% 0% 0% 0%)';

export default function MobileMenu({ isMenuOpen, closeMenu, groups }: MobileMenuProps) {
  const pathname = usePathname();
  const { toggleCart, getCartCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  // Stays true through the closing fold, so the menu can leave instead of vanishing.
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);
  const followed = useRef(false);
  const cartCount = getCartCount();

  useEffect(() => setMounted(true), []);

  useEffect(() => { if (isMenuOpen) setVisible(true); }, [isMenuOpen]);

  // Open: bands and panel sweep in from the right, offset; then the links collapse into place.
  // Close: the panel folds back out the same edge, then the menu unmounts.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!visible || !root) return;
    const q = gsap.utils.selector(root);
    tlRef.current?.kill();

    if (prefersReducedMotion()) {
      if (!isMenuOpen) setVisible(false);
      return;
    }

    const layers = [q('.mmenu__band--a')[0], q('.mmenu__band--b')[0], panelRef.current];
    if (isMenuOpen) {
      const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
      tl.set(root, { pointerEvents: 'auto' })
        .set(q('.mmenu__inner'), { clearProps: 'opacity,transform' }, 0)
        .fromTo(q('.mmenu__scrim'), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(layers, { clipPath: SHUT }, { clipPath: OPEN, duration: 0.75, stagger: 0.07 }, 0)
        .fromTo(
          q('.mmenu__ghost--a'),
          { x: -26, opacity: 0.85 },
          { x: 0, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 },
          0.38,
        )
        .fromTo(
          q('.mmenu__ghost--b'),
          { x: 26, opacity: 0.85 },
          { x: 0, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 },
          0.38,
        )
        .fromTo(
          q('.mmenu__big'),
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 },
          0.42,
        )
        .fromTo(
          q('[data-menu-item]'),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.035 },
          0.55,
        )
        .set(q('.mmenu__ghost'), { clearProps: 'transform,opacity' });
      tlRef.current = tl;
    } else {
      const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: () => setVisible(false) });
      tl.set(root, { pointerEvents: 'none' })
        .to(q('.mmenu__inner'), { opacity: 0, x: 24, duration: 0.3, ease: 'power2.in' }, 0)
        .to([...layers].reverse(), { clipPath: SHUT, duration: 0.6, stagger: 0.06 }, 0.08)
        .to(q('.mmenu__scrim'), { opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.2);
      tlRef.current = tl;
    }
  }, [isMenuOpen, visible]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  // Focus in on open; back to the menu button on close, unless the close came from following a link
  // (the new page owns focus then).
  useEffect(() => {
    if (isMenuOpen && visible) {
      wasOpen.current = true;
      followed.current = false;
      panelRef.current?.focus({ preventScroll: true });
    } else if (!isMenuOpen && wasOpen.current) {
      wasOpen.current = false;
      if (!followed.current) document.querySelector<HTMLElement>('.menu-btn')?.focus({ preventScroll: true });
    }
  }, [isMenuOpen, visible]);

  // Modal containment: make every sibling along the menu button's ancestor chain inert (main,
  // footer, the rest of the header, floating widgets), leaving only the button and the menu live.
  useEffect(() => {
    const root = rootRef.current;
    const btn = document.querySelector<HTMLElement>('.menu-btn');
    if (!isMenuOpen || !visible || !root || !btn) return;
    const made: HTMLElement[] = [];
    for (let node: HTMLElement | null = btn; node && node !== document.body; node = node.parentElement) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const sib of Array.from(parent.children) as HTMLElement[]) {
        if (sib === node || sib === root || sib.contains(root) || sib.inert || sib.tagName === 'SCRIPT') continue;
        sib.inert = true;
        made.push(sib);
      }
    }
    return () => made.forEach((el) => { el.inert = false; });
  }, [isMenuOpen, visible]);

  // The menu only exists below 1024px: close it if the viewport grows past that.
  useEffect(() => {
    if (!isMenuOpen) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) closeMenu(); };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isMenuOpen, closeMenu]);

  if (!mounted || !visible) return null;

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

  const primary = [{ label: 'Home', href: '/' }, ...nav];

  return createPortal(
    <div ref={rootRef} className="mmenu-root">
      <div className="mmenu__scrim" onClick={closeMenu} aria-hidden="true" />
      <div className="mmenu__band mmenu__band--a" aria-hidden="true" />
      <div className="mmenu__band mmenu__band--b" aria-hidden="true" />
      <div ref={panelRef} id="mobile-menu" className="mmenu" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1}>
        <div className="mmenu__inner">
          <div className="mmenu__top">
            <p className="mmenu__where">
              <span className="mmenu__muted">You are on</span>
              <span className="mono">{pathname}</span>
            </p>
          </div>

          <nav aria-label="Primary" className="mmenu__primary">
            <ul>
              {primary.map((item) => (
                <li key={item.href} className="mmenu__row">
                  <span className="mmenu__ghost mmenu__ghost--a" aria-hidden="true">{item.label}</span>
                  <span className="mmenu__ghost mmenu__ghost--b" aria-hidden="true">{item.label}</span>
                  <Link
                    href={item.href}
                    onClick={follow}
                    className="mmenu__big"
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                  >
                    <span className="mmenu__word">{item.label}</span>
                    <span className="mmenu__path mono" aria-hidden="true">{item.href}</span>
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
                    <span className="mmenu__summary-end">
                      <span className="mono mmenu__muted">{g.leaves.length}</span>
                      <svg className="mmenu__chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                    </span>
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
        </div>
      </div>
    </div>,
    document.body,
  );
}
