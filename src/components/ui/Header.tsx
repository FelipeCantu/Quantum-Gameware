// src/components/ui/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { toggleCart, getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && !(e.target as Element).closest('header')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const cartCount = getCartCount();

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-transparent py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="group flex items-center space-x-3 transition-transform hover:scale-105">
              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-xl p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <div className={`w-full h-full rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-white' : 'bg-white/90 backdrop-blur-sm'
                }`}>
                  <Image
                    src="/nextgens-logo.png"
                    alt="Quantum Gameware Logo"
                    fill
                    className="object-contain p-1 transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className={`text-xl sm:text-2xl font-bold ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
                    : 'text-white'
                }`}>
                  Quantum
                </span>
                <div className={`text-xs sm:text-sm font-medium -mt-1 ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  Gameware
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              { href: '/categories', label: 'Categories' },
              { href: '/about', label: 'About' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-3 lg:px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
                  group overflow-hidden text-center whitespace-nowrap
                  ${isScrolled 
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="relative z-10">{link.label}</span>
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-5' 
                    : 'bg-white opacity-0 group-hover:opacity-10'
                }`} />
                <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-white'
                }`} />
              </Link>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className={`
                relative p-2.5 sm:p-3 group rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
                active:scale-95 flex-shrink-0
                ${isScrolled 
                  ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'hover:bg-white/10'
                }
              `}
              aria-label={`Shopping cart ${cartCount > 0 ? `with ${cartCount} items` : ''}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 group-hover:scale-110 ${
                  isScrolled ? 'text-gray-600 group-hover:text-blue-600' : 'text-white group-hover:text-white'
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {cartCount > 0 && (
                <span className={`
                  absolute -top-1 -right-1 text-white text-xs font-bold
                  rounded-full h-6 w-6 flex items-center justify-center 
                  transform transition-all duration-300 shadow-lg z-10
                  ${isScrolled 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                    : 'bg-red-500 animate-pulse'
                  }
                `}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                md:hidden p-2.5 sm:p-3 rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
                active:scale-95 flex-shrink-0
                ${isScrolled 
                  ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'hover:bg-white/10'
                }
              `}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                <span className={`
                  absolute h-0.5 w-full transform transition-all duration-300 ease-in-out
                  ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}
                  ${isScrolled ? 'bg-gray-600' : 'bg-white'}
                `} />
                <span className={`
                  absolute h-0.5 w-full transform transition-all duration-300 ease-in-out
                  ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
                  ${isScrolled ? 'bg-gray-600' : 'bg-white'}
                `} />
                <span className={`
                  absolute h-0.5 w-full transform transition-all duration-300 ease-in-out
                  ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}
                  ${isScrolled ? 'bg-gray-600' : 'bg-white'}
                `} />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`
        md:hidden overflow-hidden transition-all duration-500 ease-out
        ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
          <nav className="px-4 py-4 max-w-7xl mx-auto">
            <div className="flex flex-col space-y-2">
              {[
                { href: '/', label: 'Home', icon: '🏠' },
                { href: '/products', label: 'Products', icon: '🎮' },
                { href: '/categories', label: 'Categories', icon: '📁' },
                { href: '/about', label: 'About', icon: '📖' }
              ].map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="
                    flex items-center justify-between w-full px-4 py-3
                    text-gray-700 hover:text-blue-600 
                    transition-all duration-300 font-medium rounded-xl
                    hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                    hover:shadow-sm active:scale-95
                  "
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg transition-transform duration-300">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  <svg 
                    className="w-4 h-4 text-gray-400 transition-all duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}