// components/ui/Header/ActionButtons.tsx - Updated with mobile Categories
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/categories';
import SearchDropdown from './SearchDropdown';
import UserMenu from './UserMenu';

interface ActionButtonsProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  openMenu: () => void;
}

export default function ActionButtons({ isScrolled, isMenuOpen, openMenu }: ActionButtonsProps) {
  const { toggleCart, getCartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClasses = `p-2.5 group rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 active:scale-95 flex-shrink-0 ${
    isScrolled 
      ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
      : 'hover:bg-white/10'
  }`;

  return (
    <div className="flex items-center space-x-2">
      {/* Categories Button - Show on mobile */}
      <div className="md:hidden relative" ref={categoriesRef}>
        <button
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className={buttonClasses}
          aria-label="Browse categories"
          style={{
            minHeight: '44px',
            minWidth: '44px',
            backgroundColor: isCategoriesOpen ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
          }}
        >
          <svg 
            className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
              isScrolled ? 'text-gray-600 group-hover:text-blue-600' : 'text-white group-hover:text-white'
            }`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        {/* Mobile Categories Dropdown */}
        {isCategoriesOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Categories</h3>
                  <p className="text-sm text-gray-600">Browse gaming gear</p>
                </div>
                <button
                  onClick={() => setIsCategoriesOpen(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  aria-label="Close categories"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Categories List */}
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="p-4 space-y-2">
                  {categories.slice(0, 8).map((category) => (
                    <a
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <span className="text-3xl mr-4">{category.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">From ${category.priceRange.min}</div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <a
                    href="/categories"
                    onClick={() => setIsCategoriesOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
                  >
                    View All Categories
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Button - Desktop */}
      <div className="hidden md:block relative" ref={searchRef}>
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={buttonClasses}
          aria-label="Search products"
        >
          <svg 
            className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
              isScrolled ? 'text-gray-600 group-hover:text-blue-600' : 'text-white group-hover:text-white'
            }`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <SearchDropdown 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>

      {/* User Menu - Sign In/Account */}
      <UserMenu isScrolled={isScrolled} />

      {/* Cart Button */}
      <button 
        onClick={toggleCart}
        className={`relative ${buttonClasses}`}
        aria-label={`Shopping cart ${cartCount > 0 ? `with ${cartCount} items` : ''}`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
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
          <span className={`absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center transform transition-all duration-300 shadow-lg z-10 ${
            isScrolled 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
              : 'bg-red-500 animate-pulse'
          }`}>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
      
      {/* Mobile Menu Button */}
      <button 
        onClick={openMenu}
        className={`lg:hidden ${buttonClasses} flex items-center justify-center`}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <span className={`absolute h-0.5 w-full transform transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
          } ${isScrolled ? 'bg-gray-600' : 'bg-white'}`} />
          <span className={`absolute h-0.5 w-full transform transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-0' : 'opacity-100'
          } ${isScrolled ? 'bg-gray-600' : 'bg-white'}`} />
          <span className={`absolute h-0.5 w-full transform transition-all duration-300 ease-in-out ${
            isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
          } ${isScrolled ? 'bg-gray-600' : 'bg-white'}`} />
        </div>
      </button>
    </div>
  );
}