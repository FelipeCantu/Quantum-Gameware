// components/ui/Header/DesktopNavigation.tsx - Complete with Mobile Scroll Fix
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { categories } from '@/data/categories';

interface DesktopNavigationProps {
  isScrolled: boolean;
}

export default function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Better mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isMobileViewport = window.innerWidth < 1024;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice || (isMobileViewport && isTouchDevice));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleCategoriesToggle = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleCategoriesClose = () => {
    setIsCategoriesOpen(false);
  };

  // Handle outside clicks
  useEffect(() => {
    if (!isCategoriesOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        handleCategoriesClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCategoriesClose();
      }
    };

    // Mobile-friendly event listeners
    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleEscape, { passive: true });

    // Prevent body scroll on mobile when dropdown is open
    if (isMobile) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCategoriesOpen, isMobile]);

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
            WebkitUserSelect: 'none'
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

        {/* Categories dropdown content - Mobile scroll position fix */}
        {isCategoriesOpen && (
          <>
            {/* Check if mobile */}
            {isMobile ? (
              // Mobile: Fixed positioning overlay
              <div 
                ref={dropdownRef}
                className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    handleCategoriesClose();
                  }
                }}
              >
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden animate-slide-up">
                  {/* Mobile Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Categories</h3>
                        <p className="text-sm text-gray-600">Browse gaming gear</p>
                      </div>
                      <button
                        onClick={handleCategoriesClose}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                        aria-label="Close"
                      >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Categories */}
                  <div className="overflow-y-auto max-h-[60vh]">
                    <div className="p-4 space-y-2">
                      {categories.slice(0, 8).map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          onClick={handleCategoriesClose}
                          className="flex items-center p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100"
                          style={{
                            touchAction: 'manipulation'
                          }}
                        >
                          <span className="text-3xl mr-4">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">From ${category.priceRange.min}</div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t border-gray-100">
                      <Link
                        href="/categories"
                        onClick={handleCategoriesClose}
                        className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
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
              </div>
            ) : (
              // Desktop: Normal dropdown
              <div 
                ref={dropdownRef}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in"
              >
                {/* Desktop Header */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Shop by Category</h3>
                      <p className="text-sm text-gray-600">Find exactly what you need</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Categories Grid */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        onClick={handleCategoriesClose}
                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                          {category.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {category.name.split(' ')[1] || category.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            From ${category.priceRange.min}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-gray-100">
                    <Link
                      href="/categories"
                      onClick={handleCategoriesClose}
                      className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                    >
                      View All Categories
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
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

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}