// src/app/about/page.tsx: about (DESIGN.md, "About page"). Every number is computed from Sanity at
// build time; the only owner claims are the owner's own words from the old page.
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/sanity/lib/queries';
import type { Product } from '@/types';
import { formatPrice, hasPhoto } from '@/lib/catalog';
import { site } from '@/data/site';
import BrandIndex, { type BrandRow } from '@/components/about/BrandIndex';
import Spectrum, { type SpectrumItem } from '@/components/about/Spectrum';
import mascot from '../../../public/qg-axolotl-rbg.png';

export const revalidate = 60;

const description =
  'Who we are and how we price: one fair price per product, free shipping on every order, no countdown timers. Every number on this page comes from the live catalog.';

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: { canonical: '/about' },
  openGraph: { title: `About ${site.name}`, description, url: '/about' },
};

// Common retail habits (left) and what this store does instead (right). The left column is a
// generic illustration, not a quote from any real store.
const LEDGER = [
  {
    elsewhere: 'Was $249.99. Now $119.99.',
    here: 'No inflated list prices to make a discount look bigger. We set a fair price on day one.',
  },
  {
    elsewhere: 'Sale ends in 04:59:12',
    here: 'No countdown timers. When something is on sale, both prices stay on the page and you decide when you are ready.',
  },
  {
    elsewhere: 'Shipping: $14.99, added at checkout',
    here: 'Shipping is free on every order, and the product page says so before you reach the cart.',
  },
  {
    elsewhere: 'Hurry, only 2 left!',
    here: 'Stock reads in stock or out of stock. We never count down units to rush you.',
  },
];

const QUOTE = 'We price our products fairly from day one.';

function facts(products: Product[]) {
  const prices = products.map((p) => p.price).sort((a, b) => a - b);
  const onSale = products.filter((p) => p.originalPrice && p.originalPrice > p.price).length;
  return [
    { value: formatPrice(prices[0]), label: 'the lowest price in the store' },
    { value: formatPrice(prices[Math.floor(prices.length / 2)]), label: 'the middle of the range' },
    { value: String(onSale), label: 'on sale right now, each one showing its price before' },
    { value: String(prices.filter((p) => p < 50).length), label: 'products under $50' },
  ];
}

function brandRows(products: Product[]): BrandRow[] {
  const map = new Map<string, BrandRow>();
  products.forEach((p) => {
    if (!p.brand) return;
    const row = map.get(p.brand) ?? { name: p.brand, count: 0 };
    row.count += 1;
    if (!row.preview && hasPhoto(p)) row.preview = p.image;
    map.set(p.brand, row);
  });
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default async function AboutPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  const brands = brandRows(products);
  const spectrum: SpectrumItem[] = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    price: p.price,
    was: p.originalPrice && p.originalPrice > p.price ? p.originalPrice : undefined,
  }));
  const sorted = [...products].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];
  const dearest = sorted[sorted.length - 1];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${site.name}`,
    url: `${site.url}/about`,
    description,
    mainEntity: { '@type': 'OnlineStore', name: site.name, url: site.url, telephone: site.phone.label },
  };

  return (
    <>
      {/* 1. Hero: the interference field (src/motion/fringes.ts). Server-rendered observed. */}
      <section className="ahero is-observed" data-fringes aria-labelledby="about-title">
        <div className="ahero__stage">
          <div className="ahero__field" data-fringe-field aria-hidden="true" />
          <nav aria-label="Breadcrumb" className="ahero__crumbs">
            <ol className="page-head__crumbs">
              <li><Link href="/">Home</Link><span aria-hidden="true"> / </span></li>
              <li><span aria-current="page">About</span></li>
            </ol>
          </nav>
          <div className="ahero__copy">
            <h1 id="about-title" className="ahero__title" data-split="lines" data-intro>
              One price, observed.
            </h1>
            <span className="ahero__line" data-fringe-line aria-hidden="true" />
            <div className="ahero__below">
              <p className="ahero__lede" data-reveal="fade" data-intro data-delay="0.35">
                {site.name} is a small online store for gaming and streaming gear. Plenty of shops show a price
                that won&rsquo;t sit still: a list price, a discount, a timer, shipping at the end. We show one.
              </p>
              <dl className="ahero__readout mono" data-reveal="fade" data-intro data-delay="0.5">
                <div><dt>Waves</dt><dd>2</dd></div>
                <div><dt>Fringes</dt><dd data-fringe-count>1</dd></div>
                <div className="ahero__state">
                  <dt className="sr-only">State</dt>
                  <dd><span className="readout__dot" aria-hidden="true" /><span data-observe-state>Observed</span></dd>
                </div>
              </dl>
            </div>
          </div>
          <p className="ahero__hint" aria-hidden="true">Scroll to observe</p>
        </div>
      </section>

      {/* 2. The owner's words */}
      <section className="aquote" aria-labelledby="quote-title">
        <h2 id="quote-title" className="sr-only">Our pricing rule</h2>
        <figure className="aquote__figure">
          <blockquote className="aquote__mark" data-collapse>
            <p className="aquote__text">{QUOTE}</p>
            <p className="aquote__ghost aquote__ghost--q" aria-hidden="true">{QUOTE}</p>
            <p className="aquote__ghost aquote__ghost--g" aria-hidden="true">{QUOTE}</p>
          </blockquote>
          <figcaption className="aquote__cite mono">{site.name}, on pricing</figcaption>
        </figure>
        <div className="aquote__story">
          <p data-reveal="up">
            We are gamers and streamers ourselves. {site.name} is the store we wanted while building our own
            desks: one place for the mouse, the mic and the chair, priced without games.
          </p>
          {cheapest && dearest && (
            <p data-reveal="up" data-delay="0.1">
              Today that means {products.length} products from {brands.length} brands, from {formatPrice(cheapest.price)} for
              the {cheapest.name} to {formatPrice(dearest.price)} for the {dearest.name}. All of it follows the same rule.
            </p>
          )}
        </div>
      </section>

      {/* 3. Elsewhere / here */}
      <section className="ledger" aria-labelledby="ledger-title">
        <div className="ledger__head">
          <h2 id="ledger-title" className="section-head__title" data-split="lines">What you won&rsquo;t see here</h2>
          <p className="section-head__text">Four habits that are common in online retail, and what we do instead.</p>
        </div>
        <ol className="ledger__rows">
          {LEDGER.map((row) => (
            <li key={row.elsewhere} className="ledger__row" data-collapse>
              <div className="ledger__else">
                <span className="ledger__k mono">Elsewhere</span>
                <span className="ledger__claim">
                  <s className="ledger__claim-text">{row.elsewhere}</s>
                  <span className="ledger__ghost ledger__ghost--q" aria-hidden="true">{row.elsewhere}</span>
                  <span className="ledger__ghost ledger__ghost--g" aria-hidden="true">{row.elsewhere}</span>
                </span>
              </div>
              <div className="ledger__here">
                <span className="ledger__k mono">Here</span>
                <p className="ledger__fact">{row.here}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Every price on one line */}
      {spectrum.length > 1 && (
        <section className="section aprices" aria-labelledby="prices-title">
          <div className="section-head section-head--row">
            <h2 id="prices-title" className="section-head__title" data-split="lines">Every price, on one line</h2>
            <p className="section-head__text">The whole catalog, cheapest on the left. Point at the line, or drag along it, to read a product.</p>
          </div>
          <Spectrum items={spectrum} />
          <dl className="facts aprices__facts">
            {facts(products).map((f) => (
              <div key={f.label} className="facts__item" data-reveal="up">
                <dt className="facts__label">{f.label}</dt>
                <dd className="facts__value mono" data-measure>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 5. The mascot */}
      <section className="amascot" aria-labelledby="mascot-title">
        <div className="amascot__plate" data-collapse>
          <Image
            src={mascot}
            alt="The Quantum Gameware mascot: a cobalt axolotl with pink gills, curled into a C"
            className="amascot__img"
            sizes="(min-width: 900px) 40vw, 90vw"
          />
          <Image src={mascot} alt="" aria-hidden="true" className="amascot__ghost amascot__ghost--q" sizes="(min-width: 900px) 40vw, 90vw" />
          <Image src={mascot} alt="" aria-hidden="true" className="amascot__ghost amascot__ghost--g" sizes="(min-width: 900px) 40vw, 90vw" />
        </div>
        <div className="amascot__copy">
          <h2 id="mascot-title" className="section-head__title" data-split="lines">Why an axolotl</h2>
          <p data-reveal="up">An axolotl can regrow a lost limb, and keeps doing it all its life.</p>
          <p data-reveal="up">
            A setup grows the same way: a mouse first, a mic when you start streaming, a better chair when the old
            one gives out. Whatever the next piece is, we want it to be on our shelf.
          </p>
          <p data-reveal="up">
            Its colours are ours too. The cobalt body and the pink gills are the two colours you see settling into
            place all over this site.
          </p>
        </div>
      </section>

      {/* 6. Brands */}
      {brands.length > 0 && (
        <section className="section section--tight" aria-labelledby="brands-title">
          <div className="section-head section-head--row">
            <h2 id="brands-title" className="section-head__title" data-split="lines">On the shelf</h2>
            <p className="section-head__text">{brands.length} brands. Pick one to see everything we carry from it.</p>
          </div>
          <BrandIndex brands={brands} />
        </section>
      )}

      {/* 7. Finale */}
      <section className="afinale" aria-labelledby="finale-title">
        <h2 id="finale-title" className="afinale__title" data-split="lines">Start with one piece.</h2>
        <div className="afinale__row">
          <p className="afinale__text">
            Questions before you buy? Call us on{' '}
            <a href={site.phone.href} className="text-link">{site.phone.label}</a> or{' '}
            <Link href="/contact" className="text-link">send us a message</Link>.
          </p>
          <div className="hero__ctas afinale__ctas">
            <Link href="/products" className="btn btn--solid" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Shop all gear</span>
            </Link>
            <Link href="/contact" className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Contact us</span>
            </Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
