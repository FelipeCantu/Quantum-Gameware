'use client';
// About, "Every price on one line" (DESIGN.md): the whole catalog on a log price scale, one tick per
// product. A sale item also shows its before price as a faint mark joined to the real one, so the
// chart itself says what the pricing copy says. Ticks arrive offset and collapse into place in view
// ([data-collapse], CSS). Pointing along the line (or dragging on touch) reads the nearest product.
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { formatPrice } from '@/lib/catalog';

export type SpectrumItem = { name: string; slug: string; price: number; was?: number };

const GRID = [25, 50, 100, 250, 500, 1000];

export default function Spectrum({ items }: { items: SpectrumItem[] }) {
  const axisRef = useRef<HTMLDivElement>(null);
  const sorted = useMemo(() => [...items].sort((a, b) => a.price - b.price), [items]);
  const lo = Math.log(sorted[0].price);
  const hi = Math.log(Math.max(...sorted.map((s) => s.was ?? s.price)));
  const at = (v: number) => ((Math.log(v) - lo) / (hi - lo)) * 100;
  const [active, setActive] = useState<number | null>(null);
  const cheapest = sorted[0];
  const dearest = sorted[sorted.length - 1];
  const shown = active === null ? null : sorted[active];

  const read = (clientX: number) => {
    const r = axisRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((clientX - r.left) / r.width) * 100;
    let best = 0;
    sorted.forEach((s, i) => { if (Math.abs(at(s.price) - x) < Math.abs(at(sorted[best].price) - x)) best = i; });
    setActive(best);
  };

  return (
    <figure className="spectrum" data-collapse>
      <div
        className="spectrum__axis"
        ref={axisRef}
        onPointerMove={(e) => read(e.clientX)}
        onPointerDown={(e) => read(e.clientX)}
        onPointerLeave={() => setActive(null)}
        aria-hidden="true"
      >
        {GRID.filter((g) => at(g) > 2 && at(g) < 98).map((g) => (
          <span key={g} className="spectrum__grid" style={{ left: `${at(g)}%` }}>
            <span className="spectrum__grid-label mono">${g.toLocaleString('en-US')}</span>
          </span>
        ))}
        {sorted.map((s, i) => (
          <span key={s.slug} className="spectrum__item" style={{ '--i': i, '--d': `${((i * 37) % 13) - 6}` } as React.CSSProperties}>
            {s.was && (
              <span className="spectrum__was" style={{ left: `${at(s.price)}%`, width: `${at(s.was) - at(s.price)}%` }} />
            )}
            <span
              className={`spectrum__tick${s.was ? ' spectrum__tick--sale' : ''}${active === i ? ' is-active' : ''}`}
              style={{ left: `${at(s.price)}%` }}
            />
          </span>
        ))}
      </div>

      <div className="spectrum__ends">
        <p>
          <span className="spectrum__end-price mono">{formatPrice(cheapest.price)}</span>
          <Link href={`/products/${cheapest.slug}`} className="spectrum__end-name">{cheapest.name}</Link>
        </p>
        <p className="spectrum__reading" aria-hidden="true">
          {shown ? (
            <>
              <span className="mono">{formatPrice(shown.price)}</span> {shown.name}
              {shown.was && <span className="spectrum__reading-was mono"> was {formatPrice(shown.was)}</span>}
            </>
          ) : (
            'Each tick is one product'
          )}
        </p>
        <p className="spectrum__end--hi">
          <span className="spectrum__end-price mono">{formatPrice(dearest.price)}</span>
          <Link href={`/products/${dearest.slug}`} className="spectrum__end-name">{dearest.name}</Link>
        </p>
      </div>

      <figcaption className="spectrum__caption">
        All {sorted.length} products by price, on a log scale from {formatPrice(cheapest.price)} to {formatPrice(dearest.price)}.
        Pink ticks are on sale; the faint bar beside each one runs back to its price before the sale.
      </figcaption>
    </figure>
  );
}
