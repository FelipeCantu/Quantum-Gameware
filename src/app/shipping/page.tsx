// src/app/shipping/page.tsx: shipping information (DESIGN.md, "Info and policy pages"). Numbers and
// wording come from the previous version of this page; only the layout moved to the system.
import type { Metadata } from 'next';
import PageHead from '@/components/ui/PageHead';
import Closer from '@/components/ui/Closer';

export const metadata: Metadata = {
  title: 'Shipping',
  description: 'Free standard shipping on every order, US and international, with tracking. Delivery times, processing, carriers and customs.',
};

const services = [
  { region: 'United States', name: 'Standard', time: '5 to 15 business days', price: 'Free', notes: 'Full package tracking included' },
  { region: 'United States', name: 'Express', time: '7 to 12 business days', price: 'Pricing varies', notes: 'Priority handling, tracking and insurance' },
  { region: 'International', name: 'Standard', time: '10 to 25 business days', price: 'Free', notes: 'Available to 200+ countries, tracking included' },
  { region: 'International', name: 'Express', time: '7 to 15 business days', price: 'Pricing varies', notes: 'Faster processing and transit, priority customs handling' },
];

const carriers = [
  { name: 'FedEx', role: 'Express and ground' },
  { name: 'UPS', role: 'Reliable delivery' },
  { name: 'USPS', role: 'Domestic and international' },
  { name: 'DHL', role: 'International express' },
];

const faq = [
  { q: 'When will my order ship?', a: "Orders are processed within 1-3 business days. During peak seasons and promotional periods, processing may take up to 5 business days. You'll receive tracking information via email once your order ships." },
  { q: 'Can I change my shipping address?', a: "Address changes are possible only if your order hasn't been processed yet. Contact us immediately through our contact page with your order number. Once shipped, we cannot modify the delivery address." },
  { q: 'Do you ship to PO Boxes and APO/FPO addresses?', a: 'Yes, we ship to PO Boxes and military addresses (APO/FPO) within the United States. Delivery times may be longer for these addresses.' },
  { q: 'What about customs and duties?', a: 'International customers are responsible for all customs duties, taxes, and import fees imposed by their country. These charges are separate from your order total and must be paid to your local customs office or delivery carrier.' },
  { q: 'Can I track my package?', a: "Yes. All orders include tracking. You'll receive an email with your tracking number once your order ships. You can also view tracking information in your account dashboard." },
  { q: 'What if my package is lost or damaged?', a: "All shipments are tracked and insured. If your package is lost in transit or arrives damaged, contact us within 48 hours with photos of any damage. We'll work with the carrier to resolve the issue and provide a replacement or refund." },
];

export default function ShippingPage() {
  return (
    <>
      <PageHead
        title="Shipping"
        text="Standard shipping is free on every order, with no minimum. Every package is tracked."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help' }, { label: 'Shipping' }]}
      />

      <section className="band band--tight" aria-label="Shipping at a glance">
        <div className="stats">
          <div className="stats__cell stats__cell--accent">
            <span className="stats__k">Standard shipping</span>
            <span className="stats__v">Free</span>
            <span className="stats__note">On all orders, no minimum purchase</span>
          </div>
          <div className="stats__cell">
            <span className="stats__k">Processing</span>
            <span className="stats__v mono">1 to 3 days</span>
            <span className="stats__note">Business days before your order leaves us</span>
          </div>
          <div className="stats__cell">
            <span className="stats__k">United States</span>
            <span className="stats__v mono">5 to 15 days</span>
            <span className="stats__note">Standard delivery, business days</span>
          </div>
          <div className="stats__cell">
            <span className="stats__k">International</span>
            <span className="stats__v mono">10 to 25 days</span>
            <span className="stats__note">Standard delivery, business days</span>
          </div>
        </div>
      </section>

      <section className="band band--split" aria-labelledby="ship-services">
        <div className="band__head">
          <h2 id="ship-services" className="band__title">Services and times</h2>
          <p className="band__text">Times are counted in business days from when the order ships. Customs can add time on international orders.</p>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th scope="col">Service</th><th scope="col">Delivery</th><th scope="col">Price</th><th scope="col">Includes</th></tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={`${s.region}-${s.name}`}>
                  <th scope="row">{s.region}<br /><span style={{ fontWeight: 400, color: 'var(--c-muted)' }}>{s.name}</span></th>
                  <td className="num">{s.time}</td>
                  <td>{s.price}</td>
                  <td>{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="band band--split" aria-labelledby="ship-processing">
        <div className="band__head">
          <h2 id="ship-processing" className="band__title">From our shelf to your door</h2>
        </div>
        <ol className="steps">
          <li>
            <span className="steps__t">Order processing</span>
            <span className="steps__d">Orders are processed within 1-2 business days. You&apos;ll receive a confirmation email once your order ships.</span>
          </li>
          <li>
            <span className="steps__t">Secure packaging</span>
            <span className="steps__d">All items are carefully packaged with protective materials to ensure they arrive in perfect condition.</span>
          </li>
          <li>
            <span className="steps__t">Tracking and insurance</span>
            <span className="steps__d">Every package includes full tracking and insurance coverage.</span>
          </li>
        </ol>
      </section>

      <section className="band band--split" aria-labelledby="ship-customs">
        <div className="band__head">
          <h2 id="ship-customs" className="band__title">Customs</h2>
        </div>
        <div className="prose-q">
          <p>International customers are responsible for all customs duties, taxes, and import fees imposed by your country. These charges are not included in your order total and must be paid upon delivery.</p>
          <p>Delivery times may vary based on customs processing and local carrier efficiency. We cannot control or expedite customs clearance.</p>
        </div>
      </section>

      <section className="band band--split" aria-labelledby="ship-carriers">
        <div className="band__head">
          <h2 id="ship-carriers" className="band__title">Carriers</h2>
        </div>
        <ul className="rows">
          {carriers.map((c) => (
            <li key={c.name} className="rows__item">
              <span className="rows__t">{c.name}</span>
              <span className="rows__go">{c.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="band band--split" aria-labelledby="ship-faq">
        <div className="band__head">
          <h2 id="ship-faq" className="band__title">Shipping questions</h2>
        </div>
        <div className="qa">
          {faq.map((f) => (
            <details key={f.q} className="qa__item">
              <summary className="qa__q">{f.q}</summary>
              <p className="qa__a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Closer title="A shipping question we did not answer?" action={{ label: 'Track an order', href: '/orders' }} />
    </>
  );
}
