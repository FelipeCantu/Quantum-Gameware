// src/app/products/[slug]/NotFound.tsx
// A product that was never observed (DESIGN.md 404 voice), with real ways back into the store.
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="pdp-missing" aria-labelledby="pdp-missing-title">
      <p className="pdp-missing__code mono" aria-hidden="true">404</p>
      <h1 id="pdp-missing-title" className="pdp-missing__title">This product was never observed.</h1>
      <p className="pdp-missing__text">
        The link may be old, or the product has left the catalog. Everything we carry is one click away.
      </p>
      <div className="pdp-missing__ctas">
        <Link href="/products" className="btn btn--solid">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">See all gear</span>
        </Link>
        <Link href="/categories" className="btn btn--line">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Shop by category</span>
        </Link>
      </div>
    </section>
  );
}
