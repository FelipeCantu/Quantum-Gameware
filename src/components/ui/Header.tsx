// src/components/ui/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { toggleCart, getCartCount } = useCart();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          
          <div className="relative w-10 h-10">
            <Image
              src="/nextgens-logo.png" // Update this path to your actual logo
              alt="Quantum Gameware Logo"
              fill
              className="object-contain"
              onError={(e) => {
                // Fallback if logo doesn't exist yet
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span className="text-2xl font-bold text-blue-600">Quantum Gameware</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">Products</Link>
          <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">Categories</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
        </nav>
        
        <button 
          onClick={toggleCart}
          className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Shopping cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}