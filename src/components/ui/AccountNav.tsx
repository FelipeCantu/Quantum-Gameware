// src/components/ui/AccountNav.tsx: the tab rail shared by every account page (DESIGN.md, "Forms and
// account"). The current page is marked with aria-current and the gill underline; sign out sits at
// the end. Replaces the emoji pill bars that each account page used to carry its own copy of.
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const tabs = [
  { label: 'Overview', href: '/account' },
  { label: 'Orders', href: '/orders' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Membership', href: '/membership' },
  { label: 'Settings', href: '/settings' },
];

export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, isAuthenticated } = useAuth();

  const onSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="acct-nav" aria-label="Account">
      <ul className="acct-nav__list">
        {tabs.map((t) => {
          const current = pathname === t.href || (t.href !== '/account' && pathname.startsWith(`${t.href}/`));
          return (
            <li key={t.href}>
              <Link href={t.href} className="acct-nav__tab" aria-current={current ? 'page' : undefined}>{t.label}</Link>
            </li>
          );
        })}
      </ul>
      {isAuthenticated && (
        <button type="button" className="acct-nav__out" onClick={onSignOut}>Sign out</button>
      )}
    </nav>
  );
}
