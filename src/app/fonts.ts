import { Archivo, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

// Display and text: one variable family; the width axis carries the "superposition" ghosts.
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

// Prices, specs and readouts only (real data), never labels.
export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// Existing wordmark face.
export const brand = localFont({
  src: '../../public/fonts/ethnocentric.regular.woff2',
  variable: '--font-brand',
  display: 'swap',
});
