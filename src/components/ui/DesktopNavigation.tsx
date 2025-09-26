// components/ui/Header/DesktopNavigation.tsx - Full Screen Overlay Approach
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { categories } from '@/data/categories';

interface DesktopNavigationProps {
  isScrolled: boolean;
}

export default function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleCategoriesToggle = () => {
    console.log('Categories button clicked, current state:', isCategoriesOpen);
    setIsCategoriesOpen(prev => !prev);
  };

  const handleCategoriesClose = () => {
    console.log('Categories close called');
    setIsCategoriesOpen(false);
  };

  const handleCategoryClick = (categorySlug: string) => {
    console.log('Category clicked:', categorySlug);
    handleCategoriesClose();
    // Navigate to category page
    window.location.href = `/categories/${categorySlug}`;
  };

  const handleViewAllClick = () => {
    console.log('View all categories clicked');
    handleCategoriesClose();
    window.location.href = '/categories';
  };

  // Handle escape key
  useEffect(() => {
    if (!isCategoriesOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCategoriesClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  return (
    <>
      <nav className="hidden lg:flex items-center space-x-1">
        <Link href="/" className={navLinkClasses}>
          <span className="relative z-10">Home</span>
          <div className={underlineClasses} />
        </Link>

        {/* Categories Button */}
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
            // Visual indicator
            backgroundColor: isCategoriesOpen ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
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

      {/* Full-Screen Categories Overlay - Rendered outside nav */}
      {isCategoriesOpen && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4"
          onClick={(e) => {
            // Only close if clicking the backdrop
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
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{
              maxHeight: '90vh',
              animation: 'modalSlideIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Categories</h2>
                  <p className="text-gray-600">Browse our gaming gear</p>
                </div>
                <button
                  onClick={handleCategoriesClose}
                  className="p-3 hover:bg-white/50 rounded-full transition-colors"
                  aria-label="Close categories"
                  style={{
                    minWidth: '48px',
                    minHeight: '48px'
                  }}
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div className="p-6 space-y-3">
                {categories.slice(0, 8).map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="w-full flex items-center p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100 group text-left"
                    style={{
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      minHeight: '80px'
                    }}
                  >
                    <span className="text-4xl mr-5 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1">{category.name}</div>
                      <div className="text-gray-500">Starting from ${category.priceRange.min}</div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
              
              {/* View All Button */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={handleViewAllClick}
                  className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-colors font-bold text-lg"
                  style={{
                    touchAction: 'manipulation',
                    minHeight: '64px'
                  }}
                >
                  View All Categories
                  <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* CSS for modal animation */}
          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                transform: scale(0.9) translateY(20px);
                opacity: 0;
              }
              to {
                transform: scale(1) translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}