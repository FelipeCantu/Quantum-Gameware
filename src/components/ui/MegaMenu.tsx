'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';

// Import categories with error handling
let categories: Array<{
  slug: string;
  name: string;
  icon: string;
  description: string;
  priceRange: { min: number; max: number };
}> = [];

try {
  const categoriesModule = require('@/data/categories');
  categories = categoriesModule.categories || [];
} catch (error) {
  console.warn('Categories data not found, using fallback');
  // Fallback categories for build safety
  categories = [
    {
      slug: 'keyboards',
      name: 'Gaming Keyboards',
      icon: '⌨️',
      description: 'Mechanical keyboards for gaming',
      priceRange: { min: 49, max: 299 }
    },
    {
      slug: 'mice',
      name: 'Gaming Mice',
      icon: '🖱️',
      description: 'High-precision gaming mice',
      priceRange: { min: 29, max: 199 }
    },
    {
      slug: 'headsets',
      name: 'Gaming Headsets',
      icon: '🎧',
      description: 'Immersive gaming headsets',
      priceRange: { min: 39, max: 399 }
    },
    {
      slug: 'monitors',
      name: 'Gaming Monitors',
      icon: '🖥️',
      description: 'High-refresh gaming monitors',
      priceRange: { min: 199, max: 1299 }
    }
  ];
}

interface MegaMenuProps {
  isScrolled: boolean;
}

export default function MegaMenu({ isScrolled }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure component is mounted before showing interactive elements
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Don't render interactive elements until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className={`
            relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
            group overflow-hidden text-center whitespace-nowrap flex items-center
            ${isScrolled 
              ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
              : 'text-white/90 hover:text-white hover:bg-white/10'
            }
          `}
          aria-label="Categories menu"
        >
          <span className="relative z-10">Categories</span>
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative" 
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        className={`
          relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
          group overflow-hidden text-center whitespace-nowrap flex items-center
          ${isScrolled 
            ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
            : 'text-white/90 hover:text-white hover:bg-white/10'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Categories menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="relative z-10">Categories</span>
        <svg 
          className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-white'
        }`} />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
          role="menu"
          aria-label="Categories submenu"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Gaming Categories</h3>
                <p className="text-gray-600">Discover premium gaming gear organized by category</p>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                View All
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-6">
            {categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${encodeURIComponent(category.slug)}`}
                    className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    <div className="flex flex-col items-center text-center">
                      <span 
                        className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      >
                        {category.icon}
                      </span>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {category.description && typeof category.description === 'string' 
                          ? category.description.split('.')[0] + '.'
                          : 'Gaming accessories'
                        }
                      </p>
                      <div className="flex items-center justify-between w-full mt-auto">
                        <span className="text-xs font-medium text-blue-600">
                          ${category.priceRange?.min || 0}+
                        </span>
                        <svg 
                          className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Categories are loading...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-gray-900 mb-1">Need Help Choosing?</h4>
                <p className="text-sm text-gray-600">Our experts are here to help you find the perfect gaming gear.</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}