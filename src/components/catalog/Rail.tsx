// Catalog rail (DESIGN.md, catalog pages): a row of department or category links with live counts.
// Scrolls sideways on phones; the current entry is marked and scrolled into view on load.
'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export type RailItem = { label: string; href: string; count: number; current?: boolean };

export default function CatalogRail({ items, label = 'Browse' }: { items: RailItem[]; label?: string }) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !current) return;
    // Centre the current entry without moving the page (scrollIntoView would scroll the window too).
    list.scrollLeft = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
  }, []);

  return (
    <nav className="rail" aria-label={label}>
      <ul className="rail__list" ref={listRef}>
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="rail__item" aria-current={it.current ? 'page' : undefined}>
              <span className="rail__label">{it.label}</span>
              <span className="rail__count mono">{it.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
