// src/components/ThemeWrapper.tsx
'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { getBgClass } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${getBgClass()}`}>
      {children}
    </div>
  );
}
