// Shared head for inner pages (DESIGN.md): breadcrumbs, a display title, one line of context and a
// measured meta line. Replaces the old dark banner with gradient blobs.
import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function PageHead({
  title,
  text,
  meta,
  crumbs = [],
}: {
  title: string;
  text?: string;
  meta?: string;
  crumbs?: Crumb[];
}) {
  return (
    <header className="page-head">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="page-head__crumbs">
            {crumbs.map((c, i) => (
              <li key={c.label}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true"> / </span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="page-head__title" data-split="lines" data-intro>{title}</h1>
      {text && <p className="page-head__text">{text}</p>}
      {meta && <p className="page-head__meta mono">{meta}</p>}
    </header>
  );
}
