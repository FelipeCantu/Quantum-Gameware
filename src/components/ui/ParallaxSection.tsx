'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // 0 to 1, where 0.5 is half speed (slower than normal scroll)
  className?: string;
  offset?: number; // Additional offset for fine-tuning
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
  offset = 0,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          if (!sectionRef.current || !contentRef.current) {
            ticking = false;
            return;
          }

          const rect = sectionRef.current.getBoundingClientRect();
          const scrollProgress = window.scrollY;
          const elementTop = rect.top + scrollProgress;
          const windowHeight = window.innerHeight;

          // Calculate parallax offset
          // Only apply parallax when element is in viewport
          if (rect.top < windowHeight && rect.bottom > 0) {
            const parallaxOffset = (scrollProgress - elementTop + windowHeight) * (1 - speed) + offset;
            contentRef.current.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
          }

          ticking = false;
        });
      }
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, offset]);

  return (
    <div ref={sectionRef} className={className}>
      <div
        ref={contentRef}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }}
      >
        {children}
      </div>
    </div>
  );
}
