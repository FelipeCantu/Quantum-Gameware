'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // Negative values move up, positive move down relative to scroll
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = 0.5,
  className = '',
}: ParallaxLayerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          if (elementRef.current) {
            const offsetY = window.scrollY * speed;
            elementRef.current.style.transform = `translate3d(0, ${offsetY}px, 0)`;
          }
          ticking = false;
        });
      }
    };

    handleScroll(); // Initial position
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
    >
      {children}
    </div>
  );
}
