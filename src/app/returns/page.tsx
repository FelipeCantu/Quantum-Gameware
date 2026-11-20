// src/app/returns/page.tsx: returns and exchanges (DESIGN.md, "Info and policy pages"). Policy text
// comes from the previous version of this page; only the layout moved to the system.
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import Closer from '@/components/ui/Closer';

export const metadata: Metadata = {
  title: 'Returns and exchanges',
  description: 'Return most items within 30 days of delivery. Eligibility, exchanges, and how refunds are paid.',
};

export default function ReturnsPage() {
  return (
    <>
      <PageHead
        title="Returns and exchanges"
        text="Not right? Most items can come back within 30 days of delivery."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help' }, { label: 'Returns' }]}
      />

      <section className="band band--tight" aria-label="Returns at a glance">
        <div className="stats">
          <div className="stats__cell stats__cell--accent">
            <span className="stats__k">Return window</span>
            <span className="stats__v mono">30 days</span>
            <span className="stats__note">From delivery, full refund on unused items</span>
          </div>
          <div className="stats__cell">
            <span className="stats__k">Exchanges</span>
            <span className="stats__v">Free</span>
            <span className="stats__note">Different size or color, defective, or the wrong item</span>
          </div>
          <div className="stats__cell">
            <span className="stats__k">Refund time</span>
            <span className="stats__v mono">5 to 10 days</span>
            <span className="stats__note">Business days after we receive and inspect the return</span>
          </div>
        </div>
      </section>

      <section className="band band--split" aria-labelledby="ret-how">
        <div className="band__head">
          <h2 id="ret-how" className="band__title">How to return an item</h2>
          <p className="band__text">Have your order number ready.</p>
          <div>
            <Link href="/returns-status" className="btn btn--solid">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Start a return</span>
            </Link>
          </div>
        </div>
        <ol className="steps">
          <li>
            <span className="steps__t">Start your return</span>
            <span className="steps__d">Visit the returns page or contact support to begin.</span>
          </li>
          <li>
            <span className="steps__t">Print your label</span>
            <span className="steps__d">We&apos;ll email you a prepaid return shipping label within minutes.</span>
          </li>
          <li>
            <span className="steps__t">Pack and ship</span>
            <span className="steps__d">Pack your item securely and drop it off at any carrier location.</span>
          </li>
          <li>
            <span className="steps__t">Get your refund</span>
            <span className="steps__d">Refunds are processed within 5-10 business days after we receive your return.</span>
          </li>
        </ol>
      </section>

      <section className="band" aria-labelledby="ret-rules">
        <div className="band__head">
          <h2 id="ret-rules" className="band__title">What can come back</h2>
        </div>
        <div className="pair">
          <div className="pair__col">
            <h3 className="pair__title">Eligible when</h3>
            <ul className="ticks">
              <li>Items are unused and in original condition with all tags attached</li>
              <li>All original packaging, accessories, manuals, and cables are included</li>
              <li>The return is started within 30 days of the delivery date</li>
              <li>You have valid proof of purchase (order number or receipt)</li>
              <li>You cover return shipping, unless the item is defective or incorrect</li>
              <li>Items pass inspection when they reach our facility</li>
            </ul>
          </div>
          <div className="pair__col pair__col--no">
            <h3 className="pair__title">Not returnable</h3>
            <ul className="ticks ticks--no">
              <li>Customized or personalized items</li>
              <li>Digital downloads and software licenses</li>
              <li>Items damaged by misuse or normal wear</li>
              <li>Items returned after 30 days</li>
              <li>Items without original packaging</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="band band--split" aria-labelledby="ret-exchange">
        <div className="band__head">
          <h2 id="ret-exchange" className="band__title">Exchanges</h2>
          <p className="band__text">Free for a different size or color, a defective or damaged item, or the wrong item received.</p>
        </div>
        <ol className="steps">
          <li><span className="steps__t">Contact us within 30 days</span></li>
          <li><span className="steps__t">We send a prepaid return label</span></li>
          <li><span className="steps__t">Ship the original item back to us</span></li>
          <li><span className="steps__t">We send your replacement</span></li>
        </ol>
      </section>

      <section className="band band--split" aria-labelledby="ret-refund">
        <div className="band__head">
          <h2 id="ret-refund" className="band__title">Refunds</h2>
        </div>
        <ul className="rows">
          <li className="rows__item"><span className="rows__t">Processing time<span className="rows__d">5-10 business days after we receive and inspect your return</span></span></li>
          <li className="rows__item"><span className="rows__t">Refund method<span className="rows__d">Issued to your original payment method. Allow 3-5 additional business days for bank processing.</span></span></li>
          <li className="rows__item"><span className="rows__t">Refund amount<span className="rows__d">The product price is refunded. Original shipping fees are non-refundable unless the item is defective.</span></span></li>
        </ul>
      </section>

      <Closer title="Stuck on a return?" action={{ label: 'Check a return', href: '/returns-status' }} />
    </>
  );
}
