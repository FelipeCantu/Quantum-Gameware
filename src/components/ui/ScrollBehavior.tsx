// src/components/ui/ScrollBehavior.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollBehavior() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component renders nothing but handles the scroll behavior
  return null;
}