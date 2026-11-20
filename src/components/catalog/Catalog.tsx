'use client';
// The one listing component (DESIGN.md, "Catalog component"): toolbar with search, sort and a
// result readout, a facet column (desktop) or bottom sheet (phone), removable filter chips, and a
// grid whose cards collapse into their new places when the result set changes (GSAP Flip).
// State lives in the query string so a filtered view can be shared.
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import type { Product } from '@/types';
import { getFiltersForCategory } from '@/config/categoryFilters';
import { categories } from '@/data/categories';
import { formatPrice } from '@/lib/catalog';
import { prefersReducedMotion } from '@/engine';
import ProductGrid from '@/components/ProductGrid';
import Facets from './Facets';
import Readout from './Readout';
import {
  applyFilters, emptyState, liveConfigs, parseRange, parseState, priceBounds, sortProducts, sorts, writeState,
  type CatalogState, type SortKey,
} from './filtering';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

export type CatalogProps = {
  products: Product[];
  categorySlug?: string;
  heading: string;
  showCategoryFilter?: boolean;
};

export default function Catalog(props: CatalogProps) {
  // useSearchParams needs a Suspense boundary for static rendering; the fallback is the same
  // listing without its controls.
  return (
    <Suspense fallback={<CatalogShell {...props} />}>
      <CatalogLive key={`${props.categorySlug ?? ''}:${props.heading}`} {...props} />
    </Suspense>
  );
}

function CatalogShell({ products, heading }: CatalogProps) {
  return (
    <section className="catalog" aria-label={heading}>
      <div className="catalog__bar"><h2 className="catalog__title">{heading}</h2></div>
      <ProductGrid products={sortProducts(products, 'featured', new Map(products.map((p, i) => [p._id, i])))} priorityCount={4} />
    </section>
  );
}

// CatalogLive only renders on the client (useSearchParams under Suspense bails out of static
// rendering), so the first render can read the media query and phones never mount the facets in
// the hidden column first.
const desktopQuery = '(min-width: 1024px)';
const useDesktop = () => {
  const [desktop, setDesktop] = useState(() => typeof window === 'undefined' || window.matchMedia(desktopQuery).matches);
  useEffect(() => {
    const mq = window.matchMedia(desktopQuery);
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
};

function CatalogLive({ products, categorySlug, heading, showCategoryFilter = false }: CatalogProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const [state, setState] = useState<CatalogState>(() => parseState(new URLSearchParams(params.toString())));
  /** The query string this component last wrote, so its own writes are not read back as outside changes. */
  const lastWritten = useRef(params.toString());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);
  /** Where focus goes after a chip or Clear all removes the control that had it. */
  const focusAfter = useRef<number | 'title' | null>(null);
  const [announce, setAnnounce] = useState('');
  const desktop = useDesktop();
  const sheetRef = useRef<HTMLDialogElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const flipTl = useRef<gsap.core.Timeline | null>(null);
  const titleId = `catalog-${categorySlug ?? 'all'}`;

  const order = useMemo(() => new Map(products.map((p, i) => [p._id, i])), [products]);
  const bounds = useMemo(() => priceBounds(products), [products]);
  const configs = useMemo(() => liveConfigs(products, categorySlug ? getFiltersForCategory(categorySlug) : []), [products, categorySlug]);
  const results = useMemo(
    () => sortProducts(applyFilters(products, state, configs), state.sort, order),
    [products, state, configs, order],
  );
  const resultKey = results.map((p) => p._id).join('|');

  /** Every state change goes through here so the grid's current layout is recorded for Flip. */
  const update = (patch: Partial<CatalogState>) => {
    const items = resultsRef.current?.querySelectorAll('.qgrid > li');
    if (items?.length && !prefersReducedMotion()) {
      // Finish any Flip in flight first, or the snapshot records its half-moved inline styles.
      flipTl.current?.kill();
      Flip.killFlipsOf(items, true);
      flipState.current = Flip.getState(items);
    }
    setState((s) => ({ ...s, ...patch }));
  };

  useLayoutEffect(() => {
    const st = flipState.current;
    flipState.current = null;
    const items = resultsRef.current?.querySelectorAll('.qgrid > li');
    if (!st || !items?.length) return;
    flipTl.current = Flip.from(st, {
      targets: items,
      duration: 0.6,
      ease: 'expo.out',
      stagger: 0.015,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, clearProps: 'opacity,transform' }),
    });
  }, [resultKey]);

  useEffect(() => () => { flipTl.current?.kill(); }, []);

  // Mirror to the query string; search is debounced so typing does not flood history state.
  // history.replaceState keeps useSearchParams in sync without a server round trip.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = writeState(state, new URLSearchParams(window.location.search)).toString();
      if (next === window.location.search.replace(/^\?/, '')) return;
      lastWritten.current = next;
      window.history.replaceState(window.history.state, '', next ? `${pathname}?${next}` : pathname);
    }, state.q ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [state, pathname]);

  // Follow the URL when it changes from outside: header search to /products?q=, back and forward.
  const query = params.toString();
  useEffect(() => {
    if (query === lastWritten.current) return;
    lastWritten.current = query;
    update(parseState(new URLSearchParams(query)));
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Screen readers hear the settled count once, not every keystroke or slider step.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = window.setTimeout(() => setAnnounce(`${results.length} product${results.length === 1 ? '' : 's'}`), 500);
    return () => window.clearTimeout(t);
  }, [results.length, resultKey]);

  // Removing a chip unmounts the button that had focus: move it to the neighbouring chip, or the heading.
  useEffect(() => {
    const target = focusAfter.current;
    if (target === null) return;
    focusAfter.current = null;
    const buttons = chipsRef.current?.querySelectorAll<HTMLButtonElement>('.fchip');
    if (typeof target === 'number' && buttons?.length) buttons[Math.min(target, buttons.length - 1)].focus();
    else titleRef.current?.focus();
  });

  // Close the sheet if the viewport grows into the desktop layout.
  useEffect(() => { if (desktop && sheetRef.current?.open) sheetRef.current.close(); }, [desktop]);

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const chips: { key: string; label: string; clear: () => void }[] = [
    ...(state.q.trim() ? [{ key: 'q', label: `“${state.q.trim()}”`, clear: () => update({ q: '' }) }] : []),
    ...state.cats.map((c) => ({ key: `c-${c}`, label: catName(c), clear: () => update({ cats: state.cats.filter((x) => x !== c) }) })),
    ...state.brands.map((b) => ({ key: `b-${b}`, label: b, clear: () => update({ brands: state.brands.filter((x) => x !== b) }) })),
    ...(state.min !== null || state.max !== null
      ? [{ key: 'price', label: `${formatPrice(state.min ?? bounds.lo)} to ${formatPrice(state.max ?? bounds.hi)}`, clear: () => update({ min: null, max: null }) }]
      : []),
    ...(state.stock ? [{ key: 'stock', label: 'In stock', clear: () => update({ stock: false }) }] : []),
    ...configs.flatMap((c) => {
      const v = state.attrs[c.id];
      if (!v) return [];
      const drop = () => { const attrs = { ...state.attrs }; delete attrs[c.id]; update({ attrs }); };
      if (c.type === 'range') {
        const r = parseRange(v);
        return r ? [{ key: c.id, label: `${c.label}: ${r[0]} to ${r[1]}${c.unit ? ` ${c.unit}` : ''}`, clear: drop }] : [];
      }
      const labels = v.split(',').map((x) => c.options?.find((o) => String(o.value) === x)?.label ?? x);
      return [{ key: c.id, label: c.type === 'boolean' ? c.label : `${c.label}: ${labels.join(', ')}`, clear: drop }];
    }),
  ];
  const clearAll = () => update({ ...emptyState, sort: state.sort });
  const clearAllFocus = () => { focusAfter.current = 'title'; clearAll(); };

  if (products.length === 0) {
    return (
      <section className="catalog" aria-labelledby={titleId}>
        <div className="catalog__bar"><h2 id={titleId} className="catalog__title">{heading}</h2></div>
        <ProductGrid products={[]} />
      </section>
    );
  }

  const facets = (
    <Facets products={products} state={state} update={update} configs={configs} showCategoryFilter={showCategoryFilter} bounds={bounds} />
  );

  return (
    <section className="catalog" aria-labelledby={titleId}>
      <div className="catalog__bar">
        <h2 id={titleId} className="catalog__title" ref={titleRef} tabIndex={-1}>{heading}</h2>
        <p className="catalog__count">
          <Readout value={results.length} className="catalog__num" />
          <span className="catalog__of" aria-hidden="true"> of <span className="mono">{products.length}</span></span>
          <span className="sr-only">{results.length} of {products.length} products</span>
        </p>
        <p className="sr-only" role="status">{announce}</p>
        <div className="catalog__tools">
          <label className="catalog__search">
            <span className="sr-only">Search {heading.toLowerCase()}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.6" /></svg>
            <input type="search" value={state.q} placeholder="Search by name or brand" onChange={(e) => update({ q: e.target.value })} />
          </label>
          <label className="catalog__sort">
            <span className="catalog__sort-k">Sort</span>
            <select value={state.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
              {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <button
            type="button" className="btn btn--line btn--sm catalog__filter-btn" aria-haspopup="dialog"
            onClick={() => sheetRef.current?.showModal()}
          >
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Filters{chips.length ? ` (${chips.length})` : ''}</span>
          </button>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="catalog__chips" aria-label="Active filters" ref={chipsRef}>
          {chips.map((c, i) => (
            <li key={c.key}>
              <button type="button" className="fchip" onClick={() => { focusAfter.current = i; c.clear(); }}>
                <span>{c.label}</span>
                <span className="sr-only">, remove filter</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </li>
          ))}
          {chips.length > 1 && (
            <li><button type="button" className="catalog__clear" onClick={clearAllFocus}>Clear all</button></li>
          )}
        </ul>
      )}

      <div className="catalog__body">
        <aside className="catalog__aside" aria-label="Filters">{desktop && facets}</aside>

        <div className="catalog__results" ref={resultsRef}>
          {results.length > 0 ? (
            <ProductGrid products={results} priorityCount={4} />
          ) : (
            <div className="qempty">
              <p className="qempty__title">Nothing measured here yet.</p>
              <p className="qempty__text">No {heading.toLowerCase()} match these filters. Loosen one or start over.</p>
              <button type="button" className="btn btn--line" onClick={clearAllFocus}>
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Clear filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <dialog
        ref={sheetRef} className="sheet" aria-labelledby={`${titleId}-sheet`}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      >
        <div className="sheet__inner">
          <div className="sheet__head">
            <h2 id={`${titleId}-sheet`} className="sheet__title">Filters</h2>
            <button type="button" className="icon-btn" aria-label="Close filters" onClick={() => sheetRef.current?.close()}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </div>
          <div className="sheet__body" data-lenis-prevent>{!desktop && facets}</div>
          <div className="sheet__foot">
            <button
              type="button" className="catalog__clear" aria-disabled={chips.length === 0}
              onClick={() => { if (chips.length) clearAll(); }}
            >
              Clear all
            </button>
            <button type="button" className="btn btn--solid" onClick={() => sheetRef.current?.close()}>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Show {results.length} product{results.length === 1 ? '' : 's'}</span>
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
