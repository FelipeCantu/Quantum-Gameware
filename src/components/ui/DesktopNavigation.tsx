// components/ui/Header/DesktopNavigation.tsx - Fixed for mobile scroll positions
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

  // Enhanced mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024;
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileDevice || (isSmallScreen && hasTouchScreen);
    };

    setIsMobile(checkIsMobile());
    
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple toggle function
  const toggleCategories = () => {
    setIsCategoriesOpen(prev => !prev);
  };

  const closeCategories = () => {
    setIsCategoriesOpen(false);
  };

  // Handle outside clicks/touches
  useEffect(() => {
    if (!isCategoriesOpen) return;

    const handleOutsideClick = (event: Event) => {
      const target = event.target as Node;
      
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(target) && 
        !buttonRef.current.contains(target)
      ) {
        closeCategories();
      }
    };

    // Add both mouse and touch listeners
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    
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
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
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

      {/* Categories Button - Fixed for mobile */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleCategories}
          className={`${navLinkClasses} flex items-center`}
          aria-expanded={isCategoriesOpen}
          aria-haspopup="true"
          type="button"
          style={{
            // Ensure proper touch handling
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            minHeight: '44px',
            minWidth: '100px'
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

        {/* Dropdown - Fixed positioning for mobile */}
        {isCategoriesOpen && (
          <div 
            ref={dropdownRef}
            className={`
              absolute z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
              ${isMobile 
                ? 'fixed inset-x-4 top-20 max-h-[calc(100vh-6rem)]' 
                : 'top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 max-h-96'
              }
            `}
            style={{
              // For mobile: use fixed positioning to avoid scroll issues
              ...(isMobile && {
                position: 'fixed',
                left: '1rem',
                right: '1rem',
                top: '5rem',
                zIndex: 9999
              })
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shop by Category</h3>
                  <p className="text-sm text-gray-600">Find exactly what you need</p>
                </div>
                {isMobile && (
                  <button
                    onClick={closeCategories}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Categories Grid */}
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              <div className={`gap-1 p-2 ${isMobile ? 'grid grid-cols-1' : 'grid grid-cols-2'}`}>
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    onClick={closeCategories}
                    className={`flex items-center p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group ${
                      isMobile ? 'py-4' : ''
                    }`}
                    style={{
                      // Better touch targets on mobile
                      minHeight: isMobile ? '60px' : 'auto',
                      touchAction: 'manipulation'
                    }}
                  >
                    <span className={`mr-3 group-hover:scale-110 transition-transform ${
                      isMobile ? 'text-3xl' : 'text-2xl'
                    }`}>
                      {category.icon}
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>
                        {category.name.split(' ')[1] || category.name}
                      </div>
                      <div className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                        From ${category.priceRange.min}
                      </div>
                    </div>
                    {isMobile && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
              
              {/* View All Categories Button */}
              <div className="p-3 border-t border-gray-100">
                <Link
                  href="/categories"
                  onClick={closeCategories}
                  className={`flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 transition-colors font-medium ${
                    isMobile ? 'py-3 text-base' : ''
                  }`}
                  style={{
                    touchAction: 'manipulation'
                  }}
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