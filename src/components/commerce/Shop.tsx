// src/components/commerce/Shop.tsx: shared pieces for the cart drawer, cart, checkout and success
// pages (DESIGN.md, "Cart and checkout"): the step strip, the quantity stepper, a line item on a white
// plate, and the receipt totals. Styles in styles/commerce.css.
import Image from 'next/image';
import Link from 'next/link';

export const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STEPS = [
  { label: 'Cart', href: '/cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Done' },
];

/** The four-step strip. `current` is 1-based; earlier steps are marked done (the cart links back). */
export function StepsStrip({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="steps-strip" aria-label="Checkout steps">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        return (
          <li key={s.label} aria-current={n === current ? 'step' : undefined} data-done={done ? '' : undefined}>
            {done && s.href && current < 4 ? <Link href={s.href}>{s.label}</Link> : s.label}
            {done && <span className="sr-only"> (done)</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function Qty({ value, onChange, name }: { value: number; onChange: (n: number) => void; name: string }) {
  return (
    <div className="qty" role="group" aria-label={`Quantity of ${name}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={`One fewer ${name}`}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`One more ${name}`}>+</button>
    </div>
  );
}

export function LinePlate({ image, name }: { image?: string; name: string }) {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="line__plate">
      {image
        ? <Image src={image} alt="" fill sizes="88px" />
        : <span className="line__none" aria-hidden="true">{initials}</span>}
    </div>
  );
}

/** A read-only line (checkout and success summaries). */
export function SummaryLine({ name, image, quantity, lineTotal, href }: { name: string; image?: string; quantity: number; lineTotal: number; href?: string }) {
  return (
    <li className="line line--compact">
      <LinePlate image={image} name={name} />
      <div>
        <p className="line__name">{href ? <Link href={href}>{name}</Link> : name}</p>
        <p className="line__meta">Qty <span className="mono">{quantity}</span></p>
      </div>
      <p className="line__total">{money(lineTotal)}</p>
    </li>
  );
}

/** Subtotal, shipping, tax and the one total. */
export function Totals({ subtotal, shipping, tax, total, taxLabel = 'Tax', count, children }: {
  subtotal: number; shipping: number; tax: number; total: number; taxLabel?: string; count?: number; children?: React.ReactNode;
}) {
  return (
    <dl className="receipt__rows">
      <div className="receipt__row"><dt>Subtotal{count !== undefined ? ` (${count} item${count === 1 ? '' : 's'})` : ''}</dt><dd>{money(subtotal)}</dd></div>
      <div className="receipt__row"><dt>Shipping</dt><dd className={shipping === 0 ? 'receipt__free' : undefined}>{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
      <div className="receipt__row"><dt>{taxLabel}</dt><dd>{money(tax)}</dd></div>
      <div className="receipt__total"><dt>Total</dt><dd>{money(total)}</dd></div>
      {children}
    </dl>
  );
}
