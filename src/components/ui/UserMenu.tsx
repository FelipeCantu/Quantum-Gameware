// src/components/ui/UserMenu.tsx: the account control in the header (DESIGN.md, "Forms and account").
// Signed out: "Sign in" as a nav link with the drawn underline, and a small line button to create an
// account (hidden on phones, where the menu carries both). Signed in: an initials badge that opens a
// panel set like the categories panel. Escape and outside clicks close it; focus returns to the badge.
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
  isScrolled: boolean;
  effectiveTheme: 'light' | 'dark';
}

const links = [
  { label: 'Account', href: '/account' },
  { label: 'Orders', href: '/orders' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Membership', href: '/membership' },
  { label: 'Settings', href: '/settings' },
];

// The props are kept for the existing callers (Header, ActionButtons); the system styles both states.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserMenu(_props: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const handleSignOut = useCallback(async () => {
    try {
      setIsOpen(false);
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [signOut]);

  if (loading) {
    return <span className="umenu__badge umenu__badge--wait" aria-hidden="true" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="umenu__out">
        <Link href="/auth/signin" className="draw site-nav__link">Sign in</Link>
        <Link href="/auth/signup" className="btn btn--line btn--sm umenu__join">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Create account</span>
        </Link>
      </div>
    );
  }

  const initials = (user.name || 'You').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="umenu" ref={menuRef} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false); }}>
      <button
        ref={buttonRef}
        type="button"
        className="umenu__badge"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={`Account menu for ${user.name}`}
        aria-expanded={isOpen}
        aria-controls="umenu-panel"
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt="" className="umenu__avatar" />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </button>

      <div id="umenu-panel" className="umenu__panel" hidden={!isOpen}>
        <p className="umenu__who">
          <span className="umenu__name">{user.name}</span>
          <span className="umenu__mail">{user.email}</span>
          {user.role === 'admin' && <span className="chip chip--ink" style={{ justifySelf: 'start', marginTop: '0.35rem' }}>Admin</span>}
        </p>
        <ul className="umenu__list">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="umenu__link draw" onClick={() => setIsOpen(false)}>{l.label}</Link>
            </li>
          ))}
          {user.role === 'admin' && (
            <li><Link href="/admin" className="umenu__link draw" onClick={() => setIsOpen(false)}>Admin dashboard</Link></li>
          )}
        </ul>
        <button type="button" className="umenu__signout" onClick={handleSignOut}>Sign out</button>
      </div>
    </div>
  );
}
