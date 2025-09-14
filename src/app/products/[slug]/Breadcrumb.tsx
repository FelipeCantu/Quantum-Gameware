// src/app/products/[slug]/Breadcrumb.tsx
import Link from 'next/link';
import { Product } from '@/types';

interface BreadcrumbProps {
  product: Product;
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 md:space-x-2 text-white/80 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 border border-white/20 text-sm md:text-base">
      <Link href="/" className="hover:text-white transition-colors font-medium truncate">
        Home
      </Link>
      <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <Link href="/products" className="hover:text-white transition-colors font-medium truncate">
        Products
      </Link>
      <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <Link 
        href={`/categories/${product.category.toLowerCase()}`} 
        className="hover:text-white transition-colors font-medium truncate"
      >
        {product.category}
      </Link>
      <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-white font-medium truncate">{product.name}</span>
    </nav>
  );
}