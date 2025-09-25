// components/ui/Header/DesktopNavigation.tsx
import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/data/categories';
import PortalDropdown from './PortalDropdown';

interface DesktopNavigationProps {
  isScrolled: boolean;
}

export default function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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

  const handleCategoriesToggle = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleCategoriesClose = () => {
    setIsCategoriesOpen(false);
  };

  // Categories dropdown trigger
  const categoriesTrigger = (
    <button
      className={`${navLinkClasses} flex items-center`}
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

  // Categories dropdown content
  const categoriesContent = (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-1">Shop by Category</h3>
        <p className="text-sm text-gray-600">Find exactly what you need</p>
      </div>
      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-2 gap-1 p-2">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              onClick={handleCategoriesClose}
              className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              role="menuitem"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {category.name.split(' ')[1] || category.name}
                </div>
                <div className="text-xs text-gray-500">
                  ${category.priceRange.min}+
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