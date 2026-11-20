// src/app/products/[slug]/ProductImageGallery.tsx
// Gallery (DESIGN.md): one white plate and a thumb strip. Switching images uses the collapse verb:
// the new photo arrives as cobalt and gill ghosts offset from the true position and snaps into one.
// Arrow keys on the plate or the strip step through photos; swipe works on touch. Products without
// a photo get the honest initials plate. Reduced motion: images just swap.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Product } from '@/types';
import { initials } from '@/lib/catalog';
import { prefersReducedMotion } from '@/engine';

interface ProductImageGalleryProps {
  product: Product;
}

const isPhoto = (s: unknown): s is string => typeof s === 'string' && s.length > 0;

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const images = [...new Set([product.image, ...(product.images || [])].filter(isPhoto))];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const plateRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const first = useRef(true);
  const count = images.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  // Collapse: ghosts start offset and fold onto the real image. Skipped on first paint.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const plate = plateRef.current;
    if (!plate || prefersReducedMotion()) return;
    const q = plate.querySelector('.pdp-gallery__ghost--q');
    const g = plate.querySelector('.pdp-gallery__ghost--g');
    const img = plate.querySelector('.pdp-gallery__img');
    const tl = gsap.timeline({ defaults: { duration: 0.9, ease: 'expo.out' } });
    tl.fromTo(q, { xPercent: -6, yPercent: 3, opacity: 0.85 }, { xPercent: 0, yPercent: 0, opacity: 0 }, 0)
      .fromTo(g, { xPercent: 5, yPercent: -4, opacity: 0.85 }, { xPercent: 0, yPercent: 0, opacity: 0 }, 0)
      .fromTo(img, { opacity: 0.2 }, { opacity: 1, duration: 0.6 }, 0.05);
    return () => { tl.kill(); };
  }, [index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  };

  const src = images[index];
  const photo = isPhoto(src) && !failed[index];

  return (
    <section className="pdp-gallery" aria-label={`${product.name} photos`} onKeyDown={onKey}>
      <div
        ref={plateRef}
        className="pdp-gallery__plate"
        role={count > 1 ? 'group' : undefined}
        tabIndex={count > 1 ? 0 : undefined}
        aria-roledescription={count > 1 ? 'carousel' : undefined}
        aria-label={count > 1 ? `${product.name} photos. Use the arrow keys to change.` : undefined}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null || count < 2) return;
          const d = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(d) > 50) go(index + (d < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {photo ? (
          <>
            <Image src={src} alt="" fill sizes="(max-width: 1023px) 100vw, 58vw" className="pdp-gallery__ghost pdp-gallery__ghost--q" aria-hidden="true" />
            <Image src={src} alt="" fill sizes="(max-width: 1023px) 100vw, 58vw" className="pdp-gallery__ghost pdp-gallery__ghost--g" aria-hidden="true" />
            <Image
              key={src}
              src={src}
              alt={count > 1 ? `${product.name}, photo ${index + 1}` : product.name}
              fill
              priority={index === 0}
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="pdp-gallery__img"
              onError={() => setFailed((f) => ({ ...f, [index]: true }))}
            />
          </>
        ) : (
          <span className="qcard__blank" role="img" aria-label={`${product.name}, not photographed yet`}>
            <span className="qcard__glyph pdp-gallery__glyph" aria-hidden="true">{initials(product.name)}</span>
            <span className="qcard__blank-note" aria-hidden="true">Not photographed yet</span>
          </span>
        )}
        {count > 1 && (
          <p className="pdp-gallery__count mono" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
        )}
      </div>

      {count > 1 && (
        <p className="sr-only" role="status">{`Photo ${index + 1} of ${count}`}</p>
      )}

      {count > 1 && (
        <ul className="pdp-gallery__thumbs" role="list">
          {images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                className="pdp-gallery__thumb"
                aria-pressed={i === index}
                aria-label={`Show photo ${i + 1} of ${count}`}
                onClick={() => go(i)}
              >
                <Image src={img} alt="" fill sizes="88px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
