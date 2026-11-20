// src/components/ui/DocToc.tsx: the contents rail for DocPage. An IntersectionObserver marks the
// section crossing the upper third of the viewport as current (aria-current), so the rail always
// names where the reader is. On phones the list folds into a disclosure (pages.css).
'use client';

import { useEffect, useState } from 'react';

export default function DocToc({ items }: { items: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const list = (
    <ol className="toc">
      {items.map((i) => (
        <li key={i.id}>
          <a href={`#${i.id}`} aria-current={current === i.id ? 'true' : undefined}>{i.label}</a>
        </li>
      ))}
    </ol>
  );

  // Desktop shows the list as a sticky rail; phones get a folded disclosure. CSS shows one of them.
  return (
    <>
      <div className="doc__rail-desk">
        <p className="doc__rail-label">On this page</p>
        {list}
      </div>
      <details className="doc__rail-fold">
        <summary>Contents, {items.length} sections</summary>
        {list}
      </details>
    </>
  );
}
