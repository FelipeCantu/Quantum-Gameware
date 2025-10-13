// src/components/ui/ScrollBehavior.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollBehavior() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Multiple methods to ensure scroll to top works
    // Method 1: Direct property assignment (most reliable)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Method 2: window.scrollTo with instant behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });

    // Method 3: Fallback using setTimeout to ensure it happens after render
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    // Method 4: Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

  }, [pathname, searchParams]);

  return null;
}