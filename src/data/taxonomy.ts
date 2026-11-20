// Store taxonomy: four departments over the leaf categories in data/categories.ts.
// Sanity still holds the original flat categories ("Gaming Mice", ...). Every product is
// normalised here on the way out of the query layer, so pages, filters and menus all read one
// consistent shape: clean leaf name, leaf slug and department.
//
// Data fixes the owner should make in Studio (until then they are applied here):
// - Delete "ASUS ROG Swift PG27AQDM" (no photo); it duplicates the OLED listing.
// - Move "Corsair Gaming Desk Pad - Extended" from Accessories to Mouse Pads.
// - Add a "Stream Gear" category and move "Elgato Stream Deck MK.2" into it.
import type { Product } from '@/types';
import { categories, type CategoryData } from './categories';

export type DepartmentSlug = 'control' | 'audio' | 'display' | 'setup';

export interface Department {
  slug: DepartmentSlug;
  name: string;
  blurb: string;
  /** Leaf category slugs, in display order. */
  categories: string[];
}

export const departments: Department[] = [
  {
    slug: 'control',
    name: 'Control',
    blurb: 'Everything your hands touch: mice, keyboards, controllers and the surface under them.',
    categories: ['mice', 'keyboards', 'controllers', 'mousepads'],
  },
  {
    slug: 'audio',
    name: 'Audio',
    blurb: 'What you hear and how you are heard: headsets, speakers and microphones.',
    categories: ['headsets', 'speakers', 'microphones'],
  },
  {
    slug: 'display',
    name: 'Display',
    blurb: 'Where the game happens: high refresh monitors and VR.',
    categories: ['monitors', 'vr-headsets'],
  },
  {
    slug: 'setup',
    name: 'Setup & Stream',
    blurb: 'The rest of the desk: the chair, the stream kit and the small things that tidy it up.',
    categories: ['chairs', 'stream', 'webcams', 'accessories'],
  },
];

/** Sanity category name → leaf slug. */
const fromSanity: Record<string, string> = {
  'Gaming Mice': 'mice',
  'Gaming Keyboards': 'keyboards',
  'Gaming Controllers': 'controllers',
  'Mouse Pads': 'mousepads',
  'Gaming Headsets': 'headsets',
  'Gaming Speakers': 'speakers',
  'Gaming Microphones': 'microphones',
  'Gaming Monitors': 'monitors',
  'VR Headsets': 'vr-headsets',
  'Gaming Chairs': 'chairs',
  'Gaming Webcams': 'webcams',
  'Gaming Accessories': 'accessories',
};

/** Products filed in the wrong Sanity category, by product slug → leaf slug. */
const refile: Record<string, string> = {
  'corsair-gaming-desk-pad-extended': 'mousepads',
  'elgato-stream-deck-mk2': 'stream',
};

/** Duplicate listings kept out of the store, by product slug. */
const hidden = new Set(['asus-rog-swift-pg27aqdm']);

const bySlug = new Map(categories.map((c) => [c.slug, c]));
const deptOf = new Map(departments.flatMap((d) => d.categories.map((c) => [c, d] as const)));

export const getDepartment = (slug: string) => departments.find((d) => d.slug === slug);
export const departmentOfCategory = (categorySlug: string) => deptOf.get(categorySlug);

/** Leaf slug for a product, whether its category is the Sanity name or already normalised. */
export function leafSlug(p: Pick<Product, 'slug' | 'category' | 'categorySlug'>) {
  if (p.categorySlug) return p.categorySlug;
  if (refile[p.slug]) return refile[p.slug];
  if (fromSanity[p.category]) return fromSanity[p.category];
  return categories.find((c) => c.name === p.category)?.slug;
}

/** Applies the taxonomy to products fresh from Sanity. Safe to run twice. */
export function normalizeProducts<T extends Product>(products: T[]): T[] {
  return products.filter((p) => !hidden.has(p.slug)).map(normalizeProduct);
}

export function normalizeProduct<T extends Product>(p: T): T {
  let leaf = bySlug.get(leafSlug(p) ?? '');
  if (!leaf) {
    // A Sanity category this file does not know yet: keep the product findable under Accessories
    // and say so, rather than letting it drop out of every department.
    console.warn(`[taxonomy] "${p.name}" is in unmapped category "${p.category}"; showing it under Accessories. Map it in src/data/taxonomy.ts.`);
    leaf = bySlug.get('accessories')!;
  }
  return { ...p, category: leaf.name, categorySlug: leaf.slug, department: deptOf.get(leaf.slug)?.slug };
}

export const isHiddenProduct = (slug: string) => hidden.has(slug);

export type LeafCount = { name: string; slug: string; count: number; preview?: string; data: CategoryData };
export type DepartmentTree = Department & { leaves: LeafCount[]; count: number; preview?: string };

/** Departments with their stocked leaf categories. Empty leaves and departments are left out. */
export function catalogTree(products: Product[]): DepartmentTree[] {
  return departments
    .map((d) => {
      const leaves = d.categories
        .map((slug) => bySlug.get(slug)!)
        .map((c) => {
          const inCat = products.filter((p) => leafSlug(p) === c.slug);
          const preview = inCat.find((p) => typeof p.image === 'string' && p.image.length > 0)?.image;
          return { name: c.name, slug: c.slug, count: inCat.length, preview, data: c };
        })
        .filter((l) => l.count > 0);
      const count = leaves.reduce((n, l) => n + l.count, 0);
      return { ...d, leaves, count, preview: leaves.find((l) => l.preview)?.preview };
    })
    .filter((d) => d.count > 0);
}

export type NavLeaf = { name: string; slug: string; href: string };
export type NavGroup = { slug: DepartmentSlug; name: string; href: string; leaves: NavLeaf[] };

/** Menu tree for client components. `stocked` (leaf slugs with products, computed in the root
 *  layout) hides empty categories; without it every leaf is listed. */
export function navGroups(stocked?: string[]): NavGroup[] {
  // An empty list means the catalog failed to load; list every leaf rather than empty menus.
  const keep = stocked?.length ? new Set(stocked) : null;
  return departments
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      href: `/categories/${d.slug}`,
      leaves: d.categories
        .filter((s) => !keep || keep.has(s))
        .map((s) => ({ name: bySlug.get(s)!.name, slug: s, href: `/categories/${s}` })),
    }))
    .filter((g) => g.leaves.length > 0);
}

/** Leaf slugs that have at least one product. */
export const stockedSlugs = (products: Product[]) =>
  [...new Set(products.map((p) => leafSlug(p)).filter((s): s is string => !!s))];
