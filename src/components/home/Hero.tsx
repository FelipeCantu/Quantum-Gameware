// Home hero (DESIGN.md, signature): the headline in superposition, collapsed by scroll, beside the
// 3D headphones. Server-rendered in its observed state; src/motion/observe.ts drives [data-observe]
// on the client. Decorative ghost copies live outside the <h1> and are aria-hidden.
import Link from 'next/link';
import { site } from '@/data/site';
import HeroModelSlot from './HeroModelSlot';

const LINES = ['Gear,', 'measured.'];

export default function Hero() {
  return (
    <section className="hero" data-observe aria-labelledby="hero-title">
      <div className="hero__stage">
        <HeroModelSlot />
        <div className="hero__copy">
          <div className="hero__title-wrap">
            <h1 id="hero-title" className="hero__title">
              {LINES.map((line, i) => (
                <span key={line} className="hero__line" data-ghost-ref={i}>{line}</span>
              ))}
            </h1>
            <div className="hero__title-ghosts" aria-hidden="true">
              {LINES.map((line, i) => (
                <span key={line} className="hero__ghost-line">
                  <span className="hero__ghost-word hero__ghost-word--q" data-ghost-word={i}>{line}</span>
                  <span className="hero__ghost-word hero__ghost-word--g" data-ghost-word={i}>{line}</span>
                </span>
              ))}
            </div>
          </div>
          <p className="hero__lede">{site.promise}</p>
          <div className="hero__ctas">
            <Link href="/products" className="btn btn--solid" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Shop all gear</span>
            </Link>
            <Link href="/categories" className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Browse categories</span>
            </Link>
          </div>
        </div>

        <p className="hero__hint" aria-hidden="true">Scroll to observe</p>
      </div>
    </section>
  );
}
