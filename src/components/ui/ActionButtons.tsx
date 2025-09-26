// components/ui/Header/ActionButtons.tsx
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
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
  const searchRef = useRef<HTMLDivElement>(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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