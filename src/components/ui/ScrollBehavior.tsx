// src/components/ui/ScrollBehavior.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollBehavior() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top immediately when route changes
    // Using scrollTo with 'instant' behavior to override any smooth scroll CSS
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });

    // Also set scroll position directly as a backup
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
  }, [pathname]);

  return null;
}