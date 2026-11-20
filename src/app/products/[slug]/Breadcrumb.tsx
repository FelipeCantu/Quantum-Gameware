// src/app/products/[slug]/Breadcrumb.tsx
// Home / Department / Leaf / product, from the taxonomy (data/taxonomy.ts).
import Link from 'next/link';
import { Product } from '@/types';
import { getCategoryBySlug } from '@/data/categories';
import { departmentOfCategory } from '@/data/taxonomy';

interface BreadcrumbProps {
  product: Product;
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  const leaf = product.categorySlug ? getCategoryBySlug(product.categorySlug) : undefined;
  const dept = product.categorySlug ? departmentOfCategory(product.categorySlug) : undefined;

  const crumbs: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' },
    dept ? { label: dept.name, href: `/categories/${dept.slug}` } : { label: 'All gear', href: '/products' },
    ...(leaf ? [{ label: leaf.name, href: `/categories/${leaf.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <nav aria-label="Breadcrumb" className="pdp__crumbs">
      <ol>
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`}>
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            {i < crumbs.length - 1 && <span aria-hidden="true"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
