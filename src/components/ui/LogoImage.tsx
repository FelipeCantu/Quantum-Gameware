// src/components/ui/LogoImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LogoImageProps {
  className?: string;
}

export default function LogoImage({ className }: LogoImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback: Show text logo or icon
    return (
      <div className={`flex items-center justify-center text-2xl font-bold text-blue-600 ${className}`}>
        QG
      </div>
    );
  }

  return (
    <Image
      src="/nextgens-logo.png"
      alt="Quantum Gameware Logo"
      fill
      className={className}
      onError={() => setHasError(true)}
    />
  );
}