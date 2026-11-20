'use client';
// Facet panel for the Catalog: category, brand, price, stock and the leaf's attribute filters.
// Counts are faceted: each option counts the products it would show with every other filter kept.
// Rendered once, in the desktop column or inside the phone sheet (Catalog decides where).
import { useEffect, useId, useRef, useState } from 'react';
import type { Product } from '@/types';
import type { FilterConfig } from '@/config/categoryFilters';
import { categories } from '@/data/categories';
import { formatPrice } from '@/lib/catalog';
import { applyFilters, parseRange, type CatalogState } from './filtering';

type Props = {
  products: Product[];
  state: CatalogState;
  update: (patch: Partial<CatalogState>) => void;
  configs: FilterConfig[];
  showCategoryFilter: boolean;
  bounds: { lo: number; hi: number };
};

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Group({ title, active, children }: { title: string; active?: number; children: React.ReactNode }) {
  return (
    <details className="facet" open>
      <summary className="facet__head">
        <span>{title}</span>
        {active ? <span className="facet__badge mono">{active}</span> : null}
        <svg className="facet__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </summary>
      <fieldset className="facet__body">
        <legend className="sr-only">{title}</legend>
        {children}
      </fieldset>
    </details>
  );
}

function Option({ label, count, checked, onChange, type = 'checkbox', name }: {
  label: string; count?: number; checked: boolean; onChange: () => void; type?: 'checkbox' | 'radio'; name?: string;
}) {
  const disabled = count === 0 && !checked;
  return (
    <label className={`facet__opt ${disabled ? 'is-off' : ''}`}>
      <input type={type} name={name} className="facet__input" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="facet__box" aria-hidden="true" />
      <span className="facet__label">{label}</span>
      {count !== undefined && (
        <>
          <span className="facet__count mono" aria-hidden="true">{count}</span>
          <span className="sr-only"> ({count} product{count === 1 ? '' : 's'})</span>
        </>
      )}
    </label>
  );
}

/** Two native range inputs over one track, plus number fields for typing a value. The thumbs move a
 *  local draft; the filter commits when the pointer lets go, or 300ms after the last key or edit,
 *  so dragging does not re-filter, re-animate and announce on every step. */
export function DualRange({ lo, hi, value, step = 1, onChange, format, label }: {
  lo: number; hi: number; value: [number, number]; step?: number; label: string;
  onChange: (v: [number, number]) => void; format: (n: number) => string;
}) {
  const [draft, setDraft] = useState(value);
  const [top, setTop] = useState<0 | 1 | null>(null);
  const dragging = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(draft);
  const uid = useId();

  // Follow the committed value when it changes from outside (a chip removed, Clear all, the URL).
  useEffect(() => {
    if (!dragging.current) { setDraft(value); latest.current = value; }
  }, [value[0], value[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const commit = () => {
    window.clearTimeout(timer.current);
    const [a, b] = latest.current;
    if (a !== value[0] || b !== value[1]) onChange(latest.current);
  };
  const set = (next: [number, number], later = true) => {
    const clamped: [number, number] = [Math.max(lo, Math.min(next[0], hi)), Math.min(hi, Math.max(next[1], lo))];
    latest.current = clamped;
    setDraft(clamped);
    window.clearTimeout(timer.current);
    if (later && !dragging.current) timer.current = window.setTimeout(commit, 300);
  };
  const press = (i: 0 | 1) => { dragging.current = true; setTop(i); };
  const release = () => { if (!dragging.current) return; dragging.current = false; commit(); };

  const span = hi - lo || 1;
  const a = ((draft[0] - lo) / span) * 100;
  const b = ((draft[1] - lo) / span) * 100;
  // When the thumbs meet, the one that can still move away sits on top.
  const front = top ?? (draft[0] >= lo + span / 2 ? 0 : 1);
  const num = (i: 0 | 1, text: string) => {
    const n = Number(text);
    if (text === '' || !Number.isFinite(n)) return;
    set(i === 0 ? [Math.min(n, draft[1]), draft[1]] : [draft[0], Math.max(n, draft[0])]);
  };

  return (
    <div className="range">
      <div className="range__track" style={{ '--a': `${a}%`, '--b': `${b}%` } as React.CSSProperties}>
        {([0, 1] as const).map((i) => (
          <input
            key={i}
            type="range" className={`range__input ${front === i ? 'is-top' : ''}`} min={lo} max={hi} step={step} value={draft[i]}
            aria-label={`${i === 0 ? 'Minimum' : 'Maximum'} ${label}`} aria-valuetext={format(draft[i])}
            onPointerDown={() => press(i)} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
            onFocus={() => setTop(i)} onBlur={commit}
            onChange={(e) => {
              const v = Number(e.target.value);
              set(i === 0 ? [Math.min(v, draft[1]), draft[1]] : [draft[0], Math.max(v, draft[0])]);
            }}
          />
        ))}
      </div>
      <div className="range__fields">
        {([0, 1] as const).map((i) => (
          <label key={i} className="range__field" htmlFor={`${uid}-${i}`}>
            <span className="range__field-k">{i === 0 ? 'Min' : 'Max'}<span className="sr-only"> {label}</span></span>
            <input
              id={`${uid}-${i}`} type="number" inputMode="numeric" className="range__num mono"
              min={lo} max={hi} step={step} value={draft[i]}
              onChange={(e) => num(i, e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default function Facets({ products, state, update, configs, showCategoryFilter, bounds }: Props) {
  const uid = useId();
  const countBy = (skip: Parameters<typeof applyFilters>[3], test: (p: Product) => boolean) =>
    applyFilters(products, state, configs, skip).filter(test).length;

  const catOptions = categories
    .map((c) => ({ slug: c.slug, name: c.name, total: products.filter((p) => p.categorySlug === c.slug).length }))
    .filter((c) => c.total > 0);
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((x, y) => x.localeCompare(y));
  const price: [number, number] = [state.min ?? bounds.lo, state.max ?? bounds.hi];

  const setAttr = (id: string, v: string | null) => {
    const attrs = { ...state.attrs };
    if (v) attrs[id] = v; else delete attrs[id];
    update({ attrs });
  };

  return (
    <div className="facets">
      {showCategoryFilter && catOptions.length > 1 && (
        <Group title="Category" active={state.cats.length}>
          {catOptions.map((c) => (
            <Option
              key={c.slug} label={c.name} checked={state.cats.includes(c.slug)}
              count={countBy('cat', (p) => p.categorySlug === c.slug)}
              onChange={() => update({ cats: toggle(state.cats, c.slug) })}
            />
          ))}
        </Group>
      )}

      {brands.length > 1 && (
        <Group title="Brand" active={state.brands.length}>
          {brands.map((b) => (
            <Option
              key={b} label={b} checked={state.brands.includes(b)}
              count={countBy('brand', (p) => p.brand === b)}
              onChange={() => update({ brands: toggle(state.brands, b) })}
            />
          ))}
        </Group>
      )}

      {bounds.hi > bounds.lo && (
        <Group title="Price" active={state.min !== null || state.max !== null ? 1 : 0}>
          <DualRange
            lo={bounds.lo} hi={bounds.hi} value={price} label="price" format={(n) => formatPrice(n)}
            step={bounds.hi - bounds.lo > 200 ? 5 : 1}
            onChange={([lo, hi]) => update({ min: lo <= bounds.lo ? null : lo, max: hi >= bounds.hi ? null : hi })}
          />
        </Group>
      )}

      <Group title="Availability" active={state.stock ? 1 : 0}>
        <Option
          label="In stock only" checked={state.stock}
          count={countBy('stock', (p) => p.inStock)}
          onChange={() => update({ stock: !state.stock })}
        />
      </Group>

      {configs.map((c) => {
        const v = state.attrs[c.id];
        const has = (p: Product, val: string) => {
          const a = (p.categoryAttributes as Record<string, unknown> | undefined)?.[c.id];
          return a !== undefined && a !== null && (Array.isArray(a) ? a.map(String) : [String(a)]).includes(val);
        };
        if (c.type === 'range' && c.min !== undefined && c.max !== undefined) {
          const r = parseRange(v) ?? [c.min, c.max];
          const fmt = (n: number) => `${n.toLocaleString('en-US')}${c.unit ? ` ${c.unit}` : ''}`;
          return (
            <Group key={c.id} title={c.label} active={v ? 1 : 0}>
              <DualRange
                lo={c.min} hi={c.max} step={c.step ?? 1} value={r} label={c.label.toLowerCase()} format={fmt}
                onChange={([lo, hi]) => setAttr(c.id, lo <= c.min! && hi >= c.max! ? null : `${lo}-${hi}`)}
              />
            </Group>
          );
        }
        if (c.type === 'multiSelect' && c.options) {
          const sel = v ? v.split(',') : [];
          const opts = c.options.map((o) => ({ ...o, value: String(o.value) }));
          return (
            <Group key={c.id} title={c.label} active={sel.length}>
              {opts.map((o) => (
                <Option
                  key={o.value} label={o.label} checked={sel.includes(o.value)}
                  count={countBy(`f.${c.id}`, (p) => has(p, o.value))}
                  onChange={() => setAttr(c.id, toggle(sel, o.value).join(',') || null)}
                />
              ))}
            </Group>
          );
        }
        if (c.type === 'singleSelect' && c.options) {
          const cur = v ?? 'all';
          return (
            <Group key={c.id} title={c.label} active={v && v !== 'all' ? 1 : 0}>
              {c.options.map((o) => {
                const val = String(o.value);
                return (
                  <Option
                    key={val} type="radio" name={`${uid}-${c.id}`} label={o.label} checked={cur === val}
                    count={val === 'all' ? undefined : countBy(`f.${c.id}`, (p) => has(p, val))}
                    onChange={() => setAttr(c.id, val === 'all' ? null : val)}
                  />
                );
              })}
            </Group>
          );
        }
        if (c.type === 'boolean') {
          return (
            <Group key={c.id} title={c.label} active={v ? 1 : 0}>
              <Option
                label={c.label} checked={v === '1'}
                count={countBy(`f.${c.id}`, (p) => (p.categoryAttributes as Record<string, unknown> | undefined)?.[c.id] === true)}
                onChange={() => setAttr(c.id, v === '1' ? null : '1')}
              />
            </Group>
          );
        }
        return null;
      })}
    </div>
  );
}
