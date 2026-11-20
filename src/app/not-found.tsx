// src/app/not-found.tsx: the site 404 (DESIGN.md). "Nothing here was observed." The number stays
// in superposition: its cobalt and gill ghosts never collapse onto it.
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="lost" aria-labelledby="lost-title">
      <p className="lost__code" aria-hidden="true">
        <span className="lost__ghost lost__ghost--q">404</span>
        <span className="lost__ghost lost__ghost--g">404</span>
        <span>404</span>
      </p>
      <h1 id="lost-title" className="lost__title">Nothing here was observed.</h1>
      <p className="lost__text">The page moved or never existed. The gear is still where it was.</p>
      <div className="lost__ctas">
        <Link href="/products" className="btn btn--solid">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Browse all gear</span>
        </Link>
        <Link href="/categories" className="btn btn--line">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Shop by department</span>
        </Link>
      </div>
    </section>
  );
}
