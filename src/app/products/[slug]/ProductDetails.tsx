// src/app/products/[slug]/ProductDetails.tsx
// Details below the fold (DESIGN.md): the description, then a spec table as a definition list,
// features and platforms. Only real data from Sanity is shown; empty attributes are left out.
import { Product, CategoryAttributes } from '@/types';

const units: Partial<Record<keyof CategoryAttributes, string>> = {
  dpiRange: ' DPI',
  weight: ' g',
  driverSize: ' mm',
  screenSize: '"',
  refreshRate: ' Hz',
  maxWeight: ' lb',
  reclineAngle: '°',
  thickness: ' mm',
  powerOutput: ' W',
};

const labels: Partial<Record<keyof CategoryAttributes, string>> = {
  dpiRange: 'Max DPI',
  hdr: 'HDR',
  rgbLighting: 'RGB lighting',
  micType: 'Microphone type',
};

const humanize = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace(/ (\w)/g, (_, c) => ` ${c.toLowerCase()}`);

function formatValue(key: keyof CategoryAttributes, v: unknown): string | null {
  if (v == null || v === '') return null;
  if (Array.isArray(v)) return v.length ? v.join(', ') : null;
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') return `${v.toLocaleString('en-US')}${units[key] ?? ''}`;
  if (typeof v === 'string') return v;
  return null;
}

export default function ProductDetails({ product }: { product: Product }) {
  const attrs = Object.entries(product.categoryAttributes || {})
    .map(([k, v]) => {
      const key = k as keyof CategoryAttributes;
      const value = formatValue(key, v);
      return value ? { label: labels[key] ?? humanize(k), value } : null;
    })
    .filter((x): x is { label: string; value: string } => !!x);

  const specs = [
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category },
    ...attrs,
  ].filter((s) => s.value);

  const features = product.features?.filter(Boolean) ?? [];
  const platforms = product.compatibility?.filter(Boolean) ?? [];

  return (
    <section className="pdp-details" aria-labelledby="details-title">
      <h2 id="details-title" className="pdp-details__title" data-split="lines">The details</h2>

      {product.description && (
        <p className="pdp-details__lede">{product.description}</p>
      )}

      <div className="pdp-details__groups">
        <details className="disclosure" open>
          <summary className="disclosure__summary">
            <span className="disclosure__title">Specifications</span>
            <span className="disclosure__count mono">{specs.length}<span className="sr-only"> items</span></span>
            <svg className="disclosure__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="1.6" /></svg>
          </summary>
          <dl className="spec">
            {specs.map((s) => (
              <div key={s.label} className="spec__row">
                <dt className="spec__k">{s.label}</dt>
                <dd className="spec__v mono">{s.value}</dd>
              </div>
            ))}
          </dl>
        </details>

        {features.length > 0 && (
          <details className="disclosure" open>
            <summary className="disclosure__summary">
              <span className="disclosure__title">Features</span>
              <span className="disclosure__count mono">{features.length}<span className="sr-only"> items</span></span>
              <svg className="disclosure__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="1.6" /></svg>
            </summary>
            <ul className="pdp-features" role="list">
              {features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </details>
        )}

        {platforms.length > 0 && (
          <details className="disclosure">
            <summary className="disclosure__summary">
              <span className="disclosure__title">Works with</span>
              <span className="disclosure__count mono">{platforms.length}<span className="sr-only"> items</span></span>
              <svg className="disclosure__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="1.6" /></svg>
            </summary>
            <ul className="pdp-platforms" role="list">
              {platforms.map((p) => <li key={p} className="chip">{p}</li>)}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
