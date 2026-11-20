// src/components/ui/DocPage.tsx: long-form policy pages (DESIGN.md, "Info and policy pages").
// PageHead, then a contents rail beside the prose. Children are <section id> blocks with an <h2>;
// `toc` lists them in order. The rail marks the section being read (DocToc).
import PageHead from './PageHead';
import DocToc from './DocToc';

export default function DocPage({
  title,
  text,
  meta,
  crumbs,
  toc,
  children,
}: {
  title: string;
  text?: string;
  meta?: string;
  crumbs?: { label: string; href?: string }[];
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHead title={title} text={text} meta={meta} crumbs={crumbs ?? [{ label: 'Home', href: '/' }, { label: title }]} />
      <div className="doc">
        <aside className="doc__rail" aria-label="On this page">
          <DocToc items={toc} />
        </aside>
        <div className="doc__body prose-q">{children}</div>
      </div>
    </>
  );
}
