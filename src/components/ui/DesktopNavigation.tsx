// components/ui/Header/DesktopNavigation.tsx - Portal Version
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { categories } from '@/data/categories';

interface DesktopNavigationProps {
  isScrolled: boolean;
}

export default function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoriesToggle = () => {
    console.log('Categories toggle clicked, current state:', isCategoriesOpen);
    setIsCategoriesOpen(prev => !prev);
  };

  const handleCategoriesClose = () => {
    console.log('Categories close called');
    setIsCategoriesOpen(false);
  };

  // Handle escape key and outside clicks
  useEffect(() => {
    if (!isCategoriesOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCategoriesClose();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element;
      
      // Don't close if clicking the button itself
      if (buttonRef.current?.contains(target)) {
        return;
      }
      
      // Don't close if clicking inside the dropdown
      if (target.closest('[data-dropdown="categories"]')) {
        return;
      }
      
      handleCategoriesClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Prevent body scroll when dropdown is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = originalOverflow;
    };
  }, [isCategoriesOpen]);

  const navLinkClasses = `relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl group overflow-hidden text-center whitespace-nowrap ${
    isScrolled 
      ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
      : 'text-white/90 hover:text-white hover:bg-white/10'
  }`;

  const underlineClasses = `absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
    isScrolled 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
      : 'bg-white'
  }`;

  // Categories dropdown content rendered via portal
  const dropdownContent = mounted && isCategoriesOpen ? createPortal(
    <div 
      className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-4"
      data-dropdown="categories"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCategoriesClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999
      }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
        style={{
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Categories</h3>
              <p className="text-sm text-gray-600">Browse gaming gear</p>
            </div>
            <button
              onClick={handleCategoriesClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              aria-label="Close categories"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="p-4 space-y-3">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                onClick={handleCategoriesClose}
                className="flex items-center p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100 group"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-lg">{category.name}</div>
                  <div className="text-sm text-gray-500">From ${category.priceRange.min}</div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <Link
              href="/categories"
              onClick={handleCategoriesClose}
              className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold text-lg"
              style={{
                touchAction: 'manipulation'
              }}
            >
              View All Categories
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  ) : null;

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      <Link href="/" className={navLinkClasses}>
        <span className="relative z-10">Home</span>
        <div className={underlineClasses} />
      </Link>

      {/* Categories Button */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={handleCategoriesToggle}
          className={`${navLinkClasses} flex items-center`}
          aria-expanded={isCategoriesOpen}
          aria-haspopup="true"
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            minHeight: '44px',
            minWidth: '120px',
            // Visual indicator when open
            backgroundColor: isCategoriesOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
          }}
        >
          <span className="relative z-10">Categories</span>
          <svg 
            className={`ml-1 w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <div className={underlineClasses} />
        </button>

        {/* Dropdown content is rendered via portal to document.body */}
        {dropdownContent}
      </div>

      <Link href="/products" className={navLinkClasses}>
        <span className="relative z-10">Products</span>
        <div className={underlineClasses} />
      </Link>

      <Link href="/about" className={navLinkClasses}>
        <span className="relative z-10">About</span>
        <div className={underlineClasses} />
      </Link>

      <Link href="/contact" className={navLinkClasses}>
        <span className="relative z-10">Contact</span>
        <div className={underlineClasses} />
      </Link>
    </nav>
  );
}