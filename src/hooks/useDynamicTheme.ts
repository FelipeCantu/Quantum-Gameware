// src/hooks/useDynamicTheme.ts
'use client';

import { useEffect } from 'react';

export function useDynamicTheme(isScrolled: boolean) {
  useEffect(() => {
    // Update theme color based on scroll state
    let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    
    if (!themeColorMeta) {
      // Create meta tag if it doesn't exist
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.getElementsByTagName('head')[0].appendChild(themeColorMeta);
    }
    
    if (isScrolled) {
      // White when header is scrolled/white
      themeColorMeta.content = '#f6f4f9';
    } else {
      // Gradient color when header is transparent over hero
      // Solid brand electric blue
      themeColorMeta.content = '#3B82F6'; // brand electric blue
    }
  }, [isScrolled]);
}