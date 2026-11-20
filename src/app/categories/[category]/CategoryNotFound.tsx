// Unknown category slug: say so plainly and offer the way back (DESIGN.md, 404 voice).
import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <div className="qempty">
      <h1 className="page-head__title">No such category.</h1>
      <p className="qempty__text">The link may be old. Every department and category we stock is listed on one page.</p>
      <Link href="/categories" className="btn btn--solid">
        <span className="btn__fill" aria-hidden="true" />
        <span className="btn__label">All categories</span>
      </Link>
    </div>
  );
}
