// src/app/categories/page.tsx: the department atlas (DESIGN.md, catalog pages). One sticky split
// per department: name, count and blurb pinned left; its categories as index rows and a strip of
// photographed products on the right. Only stocked categories are listed.
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import { getProducts } from '@/sanity/lib/queries';
import { catalogTree } from '@/data/taxonomy';
import { hasPhoto } from '@/lib/catalog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop by department',
  description: 'Control, audio, display and the rest of the setup: every category we stock, with what is in it right now.',
};

const plural = (n: number) => `${n} product${n === 1 ? '' : 's'}`;

export default async function CategoriesPage() {
  const products = await getProducts();
  const tree = catalogTree(products);
  const leafCount = tree.reduce((n, d) => n + d.leaves.length, 0);

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
        title="Shop by department"
        text="Four departments, one desk. Start with what your hands touch and work outward."
        meta={`${products.length} products in ${leafCount} categories`}
      />

      <div className="atlas">
        {tree.map((d) => {
          const shots = products.filter((p) => p.department === d.slug && hasPhoto(p)).slice(0, 4);
          return (
            <section key={d.slug} className="atlas__dept" aria-labelledby={`dept-${d.slug}`}>
              <div className="atlas__aside">
                <h2 id={`dept-${d.slug}`} className="atlas__name" data-split="lines">{d.name}</h2>
                <p className="atlas__count mono">{plural(d.count)}</p>
                <p className="atlas__blurb">{d.blurb}</p>
                <Link href={`/categories/${d.slug}`} className="text-link">
                  See all {d.name.toLowerCase()}
                </Link>
              </div>

              <div className="atlas__body">
                <ul className="atlas__rows">
                  {d.leaves.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/categories/${c.slug}`} className="index__row">
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

                {shots.length > 0 && (
                  <ul className="atlas__strip" aria-label={`From ${d.name.toLowerCase()}`}>
                    {shots.map((p) => (
                      <li key={p._id} data-reveal="up">
                        <Link href={`/products/${p.slug}`} className="atlas__item">
                          <span className="atlas__plate">
                            <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 14vw, 45vw" />
                          </span>
                          <span className="atlas__plate-name">{p.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
