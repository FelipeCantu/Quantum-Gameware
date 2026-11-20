// Small, pure helpers over Sanity product data shared by the home page, cards and readouts.
import type { Product } from '@/types';

/** "$1,299.99" style, two decimals only when the price has cents. */
export function formatPrice(n: number) {
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export const hasPhoto = (p: Pick<Product, 'image'>) => typeof p.image === 'string' && p.image.length > 0;

/** Initials for photo-less plates: "Razer Gigantus V2" → "RG". */
export function initials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export const brandCount = (products: Product[]) => new Set(products.map((p) => p.brand).filter(Boolean)).size;
