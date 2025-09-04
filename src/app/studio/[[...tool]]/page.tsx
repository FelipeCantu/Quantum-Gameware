/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

// src/app/studio/[[...tool]]/page.tsx
// src/app/studio/[[...tool]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { useEffect } from 'react'

export const dynamic = 'force-static'

// Filter out the disableTransition prop
function SanityStudioWrapper(props: any) {
  const { disableTransition, ...rest } = props
  return <NextStudio {...rest} />
}

export default function StudioPage() {
  useEffect(() => {
    // Hide navbar, header, and footer elements
    const elementsToHide = [
      'header', 'nav', 'footer', 
      '[class*="navbar"]', '[class*="header"]', '[class*="footer"]',
      '[id*="navbar"]', '[id*="header"]', '[id*="footer"]'
    ];
    
    const selectors = elementsToHide.join(', ');
    const elements = document.querySelectorAll(selectors);
    
    // Store original styles to restore later
    const originalStyles: {element: Element, display: string}[] = [];
    
    elements.forEach(element => {
      originalStyles.push({
        element,
        display: (element as HTMLElement).style.display
      });
      (element as HTMLElement).style.display = 'none';
    });
    
    // Also hide any elements with common layout classes
    const layoutSelectors = [
      '.layout', '.container', '.main-container', '.page-container',
      '.site-header', '.site-nav', '.site-footer'
    ].join(', ');
    
    const layoutElements = document.querySelectorAll(layoutSelectors);
    layoutElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.position === 'fixed' || 
          computedStyle.position === 'sticky' ||
          element.classList.toString().includes('header') ||
          element.classList.toString().includes('footer') ||
          element.classList.toString().includes('nav')) {
        originalStyles.push({
          element,
          display: (element as HTMLElement).style.display
        });
        (element as HTMLElement).style.display = 'none';
      }
    });
    
    // Ensure body takes full height and has no margin/padding
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Restore original styles when leaving the studio
      originalStyles.forEach(({element, display}) => {
        (element as HTMLElement).style.display = display;
      });
      
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      <SanityStudioWrapper config={config} />
    </div>
  )
}