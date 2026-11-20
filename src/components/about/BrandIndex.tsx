'use client';
// About, "On the shelf" (DESIGN.md): every brand in the catalog with its live count, in two columns
// on wide screens. Each row opens the catalog filtered to that brand. Same index treatment as the
// home categories: the name shifts width on hover, a product photo floats beside the pointer.
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIndexPreview } from '@/components/useIndexPreview';

export type BrandRow = { name: string; count: number; preview?: string };

const plural = (n: number) => `${n} product${n === 1 ? '' : 's'}`;

export default function BrandIndex({ brands }: { brands: BrandRow[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  useIndexPreview(listRef, previewRef, () => setActive(null));

  return (
    <div className="index">
      <ul className="index__list brands" ref={listRef}>
        {brands.map((b) => (
          <li key={b.name}>
            <Link
              href={`/products?brand=${encodeURIComponent(b.name)}`}
              className="index__row"
              onPointerEnter={() => setActive(b.preview ? b.name : null)}
              onFocus={() => setActive(null)}
            >
              <span className="index__name">{b.name}</span>
              <span className="index__count mono">{plural(b.count)}</span>
              {b.preview && (
                <span className="index__thumb" aria-hidden="true">
                  <Image src={b.preview} alt="" fill sizes="64px" />
                </span>
              )}
              <svg className="index__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </Link>
          </li>
        ))}
      </ul>
      <div className={`index__preview ${active ? 'is-on' : ''}`} ref={previewRef} aria-hidden="true">
        {brands.filter((b) => b.preview).map((b) => (
          <Image key={b.name} src={b.preview!} alt="" fill sizes="280px" className={b.name === active ? 'is-active' : ''} />
        ))}
      </div>
    </div>
  );
}
