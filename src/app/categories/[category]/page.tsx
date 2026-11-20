// src/app/categories/[category]/page.tsx: one route for departments (/categories/control) and leaf
// categories (/categories/mice). Both get a page head, a rail of siblings and the shared Catalog;
// a leaf adds a spec readout computed from what is in stock. See DESIGN.md, catalog pages.
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import Catalog from '@/components/catalog/Catalog';
import CatalogRail from '@/components/catalog/Rail';
import { getProducts } from '@/sanity/lib/queries';
import { getCategoryBySlug, getAllCategorySlugs } from '@/data/categories';
import { catalogTree, departmentOfCategory, departments, getDepartment } from '@/data/taxonomy';
import { formatPrice } from '@/lib/catalog';
import { notFound } from 'next/navigation';

/** Route param to slug; a malformed escape ("%E0") is treated as unknown, not a 500. */
function toSlug(raw: string) {
  try { return decodeURIComponent(raw); } catch { return ''; }
}

export const revalidate = 60;

type Props = { params: Promise<{ category: string }> };

const plural = (n: number) => `${n} product${n === 1 ? '' : 's'}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const slug = toSlug(category);
  const dept = getDepartment(slug);
  if (dept) return { title: dept.name, description: dept.blurb };
  const leaf = getCategoryBySlug(slug);
  if (leaf) return { title: leaf.name, description: leaf.description };
  return { title: 'Category not found' };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const slug = toSlug(category);
  const products = await getProducts();
  const tree = catalogTree(products);

  // ----- Department -----
  const dept = getDepartment(slug);
  if (dept) {
    const node = tree.find((d) => d.slug === dept.slug);
    const inDept = products.filter((p) => p.department === dept.slug);
    const rail = [
      { label: `All ${dept.name.toLowerCase()}`, href: `/categories/${dept.slug}`, count: inDept.length, current: true },
      ...(node?.leaves ?? []).map((l) => ({ label: l.name, href: `/categories/${l.slug}`, count: l.count })),
    ];
    return (
      <>
        <PageHead
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/categories' }, { label: dept.name }]}
          title={dept.name}
          text={dept.blurb}
          meta={`${plural(inDept.length)} in ${node?.leaves.length ?? 0} categories`}
        />
        <div className="catalog-page">
          <CatalogRail items={rail} label={`${dept.name} categories`} />
          <Suspense>
            <Catalog products={inDept} heading={`All ${dept.name.toLowerCase()}`} showCategoryFilter />
          </Suspense>
        </div>
      </>
    );
  }

  // ----- Leaf category -----
  const leaf = getCategoryBySlug(slug);
  if (!leaf) notFound();

  const parent = departmentOfCategory(leaf.slug);
  const node = tree.find((d) => d.slug === parent?.slug);
  const inLeaf = products.filter((p) => p.categorySlug === leaf.slug);
  const prices = inLeaf.map((p) => p.price).filter((n) => Number.isFinite(n));
  const brands = new Set(inLeaf.map((p) => p.brand).filter(Boolean));
  const crumbs = [
    { label: 'Home', href: '/' },
    ...(parent ? [{ label: parent.name, href: `/categories/${parent.slug}` }] : []),
    { label: leaf.name },
  ];
  const rail = parent && node
    ? [
        { label: `All ${parent.name.toLowerCase()}`, href: `/categories/${parent.slug}`, count: node.count },
        ...node.leaves.map((l) => ({ label: l.name, href: `/categories/${l.slug}`, count: l.count, current: l.slug === leaf.slug })),
      ]
    : [];

  return (
    <>
      <PageHead crumbs={crumbs} title={leaf.name} text={leaf.description} meta={plural(inLeaf.length)} />

      <div className="catalog-page">
        {inLeaf.length > 0 && (
          <section aria-label={`${leaf.name} at a glance`}>
          <dl className="specs">
            <div className="specs__item">
              <dt>Price span</dt>
              <dd className="mono">
                {prices.length > 1 && Math.min(...prices) !== Math.max(...prices)
                  ? `${formatPrice(Math.min(...prices))} to ${formatPrice(Math.max(...prices))}`
                  : formatPrice(prices[0] ?? 0)}
              </dd>
            </div>
            <div className="specs__item">
              <dt>Brands</dt>
              <dd className="mono">{brands.size}</dd>
            </div>
            <div className="specs__item specs__item--wide">
              <dt>Works with</dt>
              <dd>{leaf.compatibility.join(', ')}</dd>
            </div>
          </dl>
          </section>
        )}

        {rail.length > 0 && <CatalogRail items={rail} label={`More in ${parent!.name.toLowerCase()}`} />}

        {inLeaf.length > 0 ? (
          <Suspense>
            <Catalog products={inLeaf} categorySlug={leaf.slug} heading={`All ${leaf.name.toLowerCase()}`} />
          </Suspense>
        ) : (
          <div className="qempty">
            <p className="qempty__title">Nothing in stock here yet.</p>
            <p className="qempty__text">We are still choosing which {leaf.name.toLowerCase()} to carry.</p>
            <Link href={parent ? `/categories/${parent.slug}` : '/categories'} className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">{parent ? `See all ${parent.name.toLowerCase()}` : 'All categories'}</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return [...departments.map((d) => d.slug), ...getAllCategorySlugs()].map((category) => ({ category }));
}
