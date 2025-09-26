// components/ui/Header/DesktopNavigation.tsx - Scroll Position Workaround
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { categories } from '@/data/categories';

interface DesktopNavigationProps {
  isScrolled: boolean;
}

export default function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    if (!isCategoriesOpen) {
      // Opening dropdown
      if (isMobile) {
        // Save current scroll position
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        setSavedScrollPosition(currentScrollY);
        
        // Smooth scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Small delay to let scroll finish before showing dropdown
        setTimeout(() => {
          setIsCategoriesOpen(true);
        }, 300);
      } else {
        // Desktop - open immediately
        setIsCategoriesOpen(true);
      }
    } else {
      // Closing dropdown
      handleCategoriesClose();
    }
  };

  const handleCategoriesClose = () => {
    setIsCategoriesOpen(false);
    
    // On mobile, restore scroll position after closing
    if (isMobile && savedScrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: savedScrollPosition,
          behavior: 'smooth'
        });
        setSavedScrollPosition(0);
      }, 100);
    }
  };

  const handleCategoryLinkClick = (href: string) => {
    // When clicking a category link, don't restore scroll position
    // because we're navigating to a new page
    setSavedScrollPosition(0);
    setIsCategoriesOpen(false);
    
    // Navigate to the category page
    window.location.href = href;
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

    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleEscape, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
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

        {/* Categories Dropdown */}
        {isCategoriesOpen && (
          <div 
            ref={dropdownRef}
            className={`
              bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50
              ${isMobile 
                ? 'fixed top-20 left-4 right-4 max-h-[calc(100vh-6rem)]' 
                : 'absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 max-h-96'
              }
            `}
            style={{
              animation: isMobile ? 'slideDown 0.3s ease-out' : 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shop by Category</h3>
                  <p className="text-sm text-gray-600">Find exactly what you need</p>
                  {isMobile && savedScrollPosition > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Close to return to your previous position
                    </p>
                  )}
                </div>
                {isMobile && (
                  <button
                    onClick={handleCategoriesClose}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    aria-label="Close categories"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Categories Grid/List */}
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              <div className={`gap-1 p-2 ${isMobile ? 'grid grid-cols-1' : 'grid grid-cols-2'}`}>
                {categories.slice(0, 8).map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryLinkClick(`/categories/${category.slug}`)}
                    className={`flex items-center p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group text-left w-full ${
                      isMobile ? 'py-4' : ''
                    }`}
                    style={{
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
                  </button>
                ))}
              </div>
              
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={() => handleCategoryLinkClick('/categories')}
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
                </button>
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

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
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
    </nav>
  );
}