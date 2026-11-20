// 404 for unknown department or category slugs: the designed page with a real status.
import CategoryNotFound from './CategoryNotFound';

export default function NotFound() {
  return (
    <section className="page-head">
      <CategoryNotFound />
    </section>
  );
}
