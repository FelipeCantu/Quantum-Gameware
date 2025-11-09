'use client';

import { useTheme } from '@/context/ThemeContext';
import { ReactNode } from 'react';

interface ThemedPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function ThemedPageWrapper({ children, className = '' }: ThemedPageWrapperProps) {
  const { getBgClass } = useTheme();

  return (
    <div className={`${getBgClass()} ${className}`}>
      {children}
    </div>
  );
}
