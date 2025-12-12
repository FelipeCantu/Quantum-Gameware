// src/components/ThemeWrapper.tsx
'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { getBgClass, effectiveTheme } = useTheme();

  // Apply dark class to HTML element for Tailwind dark mode
  useEffect(() => {
    const htmlElement = document.documentElement;

    if (effectiveTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [effectiveTheme]);

  return (
    <div className={`min-h-screen flex flex-col ${getBgClass()}`}>
      {children}
    </div>
  );
}
