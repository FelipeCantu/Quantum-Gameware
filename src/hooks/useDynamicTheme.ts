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
      // Using a representative color from your blue-purple gradient
      themeColorMeta.content = '#23378e'; // Indigo-500 from your gradient
    }
  }, [isScrolled]);
}