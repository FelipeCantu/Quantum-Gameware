// Pure catalog state: parse from and write to the query string, apply to products, sort.
// The query string is the shareable form: ?q=&sort=&brand=a,b&cat=&min=&max=&stock=1&f.<attr>=
import type { Product } from '@/types';
import type { FilterConfig } from '@/config/categoryFilters';

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export const sorts: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'rating', label: 'Rating' },
];

export interface CatalogState {
  q: string;
  sort: SortKey;
  brands: string[];
  cats: string[];
  min: number | null;
  max: number | null;
  stock: boolean;
  /** Attribute filters, serialised: multi "a,b", range "lo-hi", single "value", boolean "1". */
  attrs: Record<string, string>;
}

export const emptyState: CatalogState = { q: '', sort: 'featured', brands: [], cats: [], min: null, max: null, stock: false, attrs: {} };

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
const num = (v: string | null) => (v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);

export function parseState(sp: URLSearchParams): CatalogState {
  const sort = sp.get('sort') as SortKey | null;
  const attrs: Record<string, string> = {};
  sp.forEach((v, k) => { if (k.startsWith('f.') && v) attrs[k.slice(2)] = v; });
  return {
    q: sp.get('q') ?? '',
    sort: sort && sorts.some((s) => s.value === sort) ? sort : 'featured',
    brands: list(sp.get('brand')),
    cats: list(sp.get('cat')),
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    stock: sp.get('stock') === '1',
    attrs,
  };
}

/** Writes catalog keys onto `base` (other params are kept). */
export function writeState(s: CatalogState, base: URLSearchParams) {
  const sp = new URLSearchParams(base);
  [...sp.keys()].forEach((k) => { if (['q', 'sort', 'brand', 'cat', 'min', 'max', 'stock'].includes(k) || k.startsWith('f.')) sp.delete(k); });
  if (s.q.trim()) sp.set('q', s.q.trim());
  if (s.sort !== 'featured') sp.set('sort', s.sort);
  if (s.brands.length) sp.set('brand', s.brands.join(','));
  if (s.cats.length) sp.set('cat', s.cats.join(','));
  if (s.min !== null) sp.set('min', String(s.min));
  if (s.max !== null) sp.set('max', String(s.max));
  if (s.stock) sp.set('stock', '1');
  Object.entries(s.attrs).forEach(([k, v]) => { if (v) sp.set(`f.${k}`, v); });
  return sp;
}

export const priceBounds = (products: Product[]) => {
  if (!products.length) return { lo: 0, hi: 0 };
  const prices = products.map((p) => p.price);
  return { lo: Math.floor(Math.min(...prices)), hi: Math.ceil(Math.max(...prices)) };
};

export const parseRange = (v: string | undefined): [number, number] | null => {
  if (!v) return null;
  const [a, b] = v.split('-').map(Number);
  return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
};

function matchesAttr(p: Product, c: FilterConfig, v: string) {
  const attr = (p.categoryAttributes as Record<string, unknown> | undefined)?.[c.id];
  switch (c.type) {
    case 'range': {
      const r = parseRange(v);
      if (!r || typeof attr !== 'number') return true; // unknown values are not excluded by a range
      return attr >= r[0] && attr <= r[1];
    }
    case 'multiSelect': {
      const want = list(v);
      if (!want.length) return true;
      if (attr === undefined || attr === null) return false;
      const have = (Array.isArray(attr) ? attr : [attr]).map(String);
      return want.some((w) => have.includes(w));
    }
    case 'singleSelect':
      if (v === 'all') return true;
      return attr !== undefined && attr !== null && String(attr) === v;
    case 'boolean':
      return v !== '1' || attr === true;
    default:
      return true;
  }
}

export type Facet = 'brand' | 'cat' | 'price' | 'stock' | 'q' | `f.${string}`;

/** Products matching every filter in `s`, except the facet named in `skip` (for facet counts). */
export function applyFilters(products: Product[], s: CatalogState, configs: FilterConfig[], skip?: Facet) {
  const q = s.q.trim().toLowerCase();
  return products.filter((p) => {
    if (skip !== 'q' && q && !`${p.name} ${p.brand ?? ''} ${p.description ?? ''} ${p.category ?? ''}`.toLowerCase().includes(q)) return false;
    if (skip !== 'brand' && s.brands.length && !s.brands.includes(p.brand)) return false;
    if (skip !== 'cat' && s.cats.length && !s.cats.includes(p.categorySlug ?? '')) return false;
    if (skip !== 'price' && s.min !== null && p.price < s.min) return false;
    if (skip !== 'price' && s.max !== null && p.price > s.max) return false;
    if (skip !== 'stock' && s.stock && !p.inStock) return false;
    for (const c of configs) {
      const v = s.attrs[c.id];
      if (v && skip !== `f.${c.id}` && !matchesAttr(p, c, v)) return false;
    }
    return true;
  });
}

type Sortable = Product & { isFeatured?: boolean };

/** `products` arrive newest first (getProducts orders by _createdAt desc). */
export function sortProducts(products: Product[], sort: SortKey, order: Map<string, number>) {
  const idx = (p: Product) => order.get(p._id) ?? 0;
  const out = [...products] as Sortable[];
  switch (sort) {
    case 'newest': return out.sort((a, b) => idx(a) - idx(b));
    case 'price-asc': return out.sort((a, b) => a.price - b.price || idx(a) - idx(b));
    case 'price-desc': return out.sort((a, b) => b.price - a.price || idx(a) - idx(b));
    case 'rating': return out.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1) || idx(a) - idx(b));
    default: {
      const photo = (p: Product) => (typeof p.image === 'string' && p.image.length > 0 ? 1 : 0);
      return out.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || photo(b) - photo(a) || idx(a) - idx(b));
    }
  }
}

/** Attribute filters worth showing: at least one product in scope carries the attribute. */
export function liveConfigs(products: Product[], configs: FilterConfig[]) {
  return configs.filter((c) =>
    products.some((p) => {
      const v = (p.categoryAttributes as Record<string, unknown> | undefined)?.[c.id];
      return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0);
    }),
  );
}
