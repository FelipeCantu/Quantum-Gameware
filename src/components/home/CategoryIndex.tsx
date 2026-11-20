'use client';
// Category index (DESIGN.md, home section 2): grouped by department. Each department opens with a
// mono label row that links to the department page, then its stocked categories as full-width rows
// with live counts. On fine pointers a photo from the category floats beside the pointer; on touch
// each row shows a thumb (useIndexPreview).
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIndexPreview } from '@/components/useIndexPreview';
import type { DepartmentTree } from '@/data/taxonomy';

const plural = (n: number) => `${n} product${n === 1 ? '' : 's'}`;

export default function CategoryIndex({ groups }: { groups: DepartmentTree[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const leaves = groups.flatMap((g) => g.leaves);

  useIndexPreview(listRef, previewRef, () => setActive(null));

  return (
    <div className="index">
      <ol className="index__list" ref={listRef}>
        {groups.map((g) => (
          <li key={g.slug} className="index__group">
            <Link
              href={`/categories/${g.slug}`}
              className="index__dept"
              onPointerEnter={() => setActive(null)}
            >
              <span className="index__dept-name">{g.name}</span>
              <span className="index__dept-count mono">{plural(g.count)}</span>
            </Link>
            <ul>
              {g.leaves.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="index__row"
                    onPointerEnter={() => setActive(c.preview ? c.slug : null)}
                    onFocus={() => setActive(null)}
                  >
                    <span className="index__name">{c.name}</span>
                    <span className="index__count mono">{plural(c.count)}</span>
                    {c.preview && (
                      <span className="index__thumb" aria-hidden="true">
                        <Image src={c.preview} alt="" fill sizes="64px" />
                      </span>
                    )}
                    <svg className="index__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className={`index__preview ${active ? 'is-on' : ''}`} ref={previewRef} aria-hidden="true">
        {leaves.filter((c) => c.preview).map((c) => (
          <Image
            key={c.slug}
            src={c.preview!}
            alt=""
            fill
            sizes="280px"
            className={c.slug === active ? 'is-active' : ''}
          />
        ))}
      </div>
    </div>
  );
}
