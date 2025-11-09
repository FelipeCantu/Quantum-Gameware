// components/ui/Header/DesktopNavigation.tsx - Professional Version Without Icons
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { categories } from '@/data/categories';
import PortalDropdown from './PortalDropdown';

interface DesktopNavigationProps {
  isScrolled: boolean;
  effectiveTheme: 'light' | 'dark';
}

export default function DesktopNavigation({ isScrolled, effectiveTheme }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const navLinkClasses = `relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl group overflow-hidden text-center whitespace-nowrap ${
    isScrolled
      ? effectiveTheme === 'light'
        ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
        : 'text-gray-200 hover:text-white hover:bg-white/10'
      : 'text-white/90 hover:text-white hover:bg-white/10'
  }`;

  const underlineClasses = `absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
    isScrolled
      ? effectiveTheme === 'light'
        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
        : 'bg-gradient-to-r from-blue-400 to-purple-400'
      : 'bg-white'
  }`;

  const handleCategoriesToggle = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleCategoriesClose = () => {
    setIsCategoriesOpen(false);
  };

  // Categories dropdown trigger
  const categoriesTrigger = (
    <button
      className={`${navLinkClasses} flex items-center ${isMobile ? 'active:bg-white/20' : ''}`}
      aria-expanded={isCategoriesOpen}
      aria-haspopup="true"
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
  );

  // Categories dropdown content - Professional & Clean
  const categoriesContent = (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ${
      isMobile ? 'w-full' : 'w-96'
    }`}>
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Browse Categories</h3>
            <p className="text-sm text-gray-600 mt-0.5">Find your perfect gaming gear</p>
          </div>
          {isMobile && (
            <button
              onClick={handleCategoriesClose}
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

      {/* Categories List - Clean & Professional */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-2">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              onClick={handleCategoriesClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group"
              role="menuitem"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                  {category.name}
                </div>
                <div className="text-gray-500 text-sm truncate">
                  From ${category.priceRange.min}
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-200 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Link
            href="/categories"
            onClick={handleCategoriesClose}
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 transition-colors font-medium"
            role="menuitem"
          >
            View All Categories
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      <Link href="/" className={navLinkClasses}>
        <span className="relative z-10">Home</span>
        <div className={underlineClasses} />
      </Link>

      {/* Categories Portal Dropdown */}
      <PortalDropdown
        trigger={categoriesTrigger}
        isOpen={isCategoriesOpen}
        onToggle={handleCategoriesToggle}
        onClose={handleCategoriesClose}
        position="bottom-left"
        isMobile={isMobile}
      >
        {categoriesContent}
      </PortalDropdown>

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