// components/ui/SearchDropdown.tsx: header search (DESIGN.md). A combobox with live product
// suggestions from /api/search; Enter without a highlighted option opens the full catalog
// filtered by the query. Empty, it offers the four departments.
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { navigate } from '@/engine/next';
import { navGroups } from '@/data/taxonomy';
import { formatPrice } from '@/lib/catalog';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

type Hit = { name: string; slug: string; price: number; image: string | null; category: string };

const groups = navGroups();

export default function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else { setQuery(''); setHits([]); setActive(-1); }
  }, [isOpen]);

  // Debounced live suggestions; stale responses are dropped.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setHits([]); setActive(-1); setLoading(false); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`search ${res.status}`);
        const data = (await res.json()) as { results?: Hit[] };
        setHits(data.results ?? []);
        setActive(-1);
      } catch {
        // aborted or offline: keep the last suggestions
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 160);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  // Keep the highlighted option visible inside the scrolling list.
  useEffect(() => {
    if (active >= 0) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, id]);

  const go = (href: string) => { onClose(); navigate(href); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && hits[active]) return go(`/products/${hits[active].slug}`);
    const q = query.trim();
    if (q) go(`/products?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hits.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % hits.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i <= 0 ? hits.length - 1 : i - 1)); }
  };

  if (!isOpen) return null;

  const listId = `${id}-list`;
  const showHits = query.trim().length >= 2;
  const listOpen = showHits && hits.length > 0;
  const status = showHits && !loading ? `${hits.length} suggestion${hits.length === 1 ? '' : 's'}` : '';

  return (
    <div className="search-panel" id="search-panel">
      <form onSubmit={onSubmit} role="search" className="search-panel__form">
        <label htmlFor={`${id}-input`} className="sr-only">Search products</label>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="search"
          className="search-panel__input"
          placeholder="Search mice, headsets, brands"
          autoComplete="off"
          role="combobox"
          aria-expanded={listOpen}
          aria-controls={listOpen ? listId : undefined}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type="submit" className="btn btn--solid btn--sm">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Search</span>
        </button>
      </form>

      {showHits ? (
        <div className="search-panel__results">
          {listOpen && (
          <ul id={listId} role="listbox" aria-label="Suggestions" className="search-panel__list">
            {hits.map((h, i) => (
              <li key={h.slug} role="none">
                <Link
                  href={`/products/${h.slug}`}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={`search-hit ${i === active ? 'is-active' : ''}`}
                  onClick={onClose}
                  onPointerEnter={() => setActive(i)}
                  tabIndex={-1}
                >
                  <span className="search-hit__plate" aria-hidden="true">
                    {h.image && <Image src={h.image} alt="" fill sizes="44px" />}
                  </span>
                  <span className="search-hit__text">
                    <span className="search-hit__name">{h.name}</span>
                    <span className="search-hit__meta">{h.category}</span>
                  </span>
                  <span className="search-hit__price mono">{formatPrice(h.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          )}
          <p className="search-panel__note">
            {loading && !hits.length ? 'Looking…' : hits.length ? `${hits.length} close match${hits.length === 1 ? '' : 'es'}. Enter shows every result.` : 'No close matches. Enter searches the whole catalog.'}
          </p>
        </div>
      ) : (
        <nav aria-label="Departments" className="search-panel__depts">
          {groups.map((g) => (
            <Link key={g.slug} href={g.href} onClick={onClose} className="search-panel__dept draw">{g.name}</Link>
          ))}
        </nav>
      )}
      <p className="sr-only" role="status">{status}</p>
    </div>
  );
}
