// components/ui/ActionButtons.tsx - Updated with Animated Menu Button
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import SearchDropdown from './SearchDropdown';
import UserMenu from './UserMenu';

interface ActionButtonsProps {
  isScrolled: boolean;
  effectiveTheme: 'light' | 'dark';
  isMenuOpen: boolean;
  openMenu: () => void;
}

// Animated Menu Button Component
const AnimatedMenuButton = ({
  isOpen,
  onClick,
  isScrolled,
  effectiveTheme
}: {
  isOpen: boolean;
  onClick: () => void;
  isScrolled: boolean;
  effectiveTheme: 'light' | 'dark';
}) => (
  <button
    onClick={onClick}
    className={`
      lg:hidden p-2 sm:p-2.5 rounded-xl transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
      active:scale-95 flex-shrink-0 ${
        isScrolled
          ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
          : 'hover:bg-white/10'
      }
    `}
    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={isOpen}
  >
    <div className="w-5 h-5 relative">
      {/* Top bar */}
      <span className={`
        absolute left-0 w-full h-0.5 rounded-full
        transition-all duration-300 ease-out origin-center
        ${isScrolled
          ? effectiveTheme === 'light' ? 'bg-gray-600' : 'bg-gray-200'
          : 'bg-white'
        }
        ${isOpen
          ? 'top-[9.5px] rotate-45'
          : 'top-[3px]'
        }
      `} />

      {/* Middle bar */}
      <span className={`
        absolute left-0 top-[9.5px] w-full h-0.5 rounded-full
        transition-all duration-300 ease-out
        ${isScrolled
          ? effectiveTheme === 'light' ? 'bg-gray-600' : 'bg-gray-200'
          : 'bg-white'
        }
        ${isOpen
          ? 'opacity-0 scale-0'
          : 'opacity-100 scale-100'
        }
      `} />

      {/* Bottom bar */}
      <span className={`
        absolute left-0 w-full h-0.5 rounded-full
        transition-all duration-300 ease-out origin-center
        ${isScrolled
          ? effectiveTheme === 'light' ? 'bg-gray-600' : 'bg-gray-200'
          : 'bg-white'
        }
        ${isOpen
          ? 'top-[9.5px] -rotate-45'
          : 'top-[16px]'
        }
      `} />
    </div>
  </button>
);

export default function ActionButtons({ isScrolled, effectiveTheme, isMenuOpen, openMenu }: ActionButtonsProps) {
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

  const buttonClasses = `p-2 sm:p-2.5 group rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 active:scale-95 flex-shrink-0 ${
    isScrolled
      ? effectiveTheme === 'light'
        ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
        : 'hover:bg-white/10'
      : 'hover:bg-white/10'
  }`;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Search Button - Desktop */}
      <div className="hidden md:block relative" ref={searchRef}>
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={buttonClasses}
          aria-label="Search products"
        >
          <svg
            className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
              isScrolled
                ? effectiveTheme === 'light'
                  ? 'text-gray-600 group-hover:text-blue-600'
                  : 'text-gray-200 group-hover:text-white'
                : 'text-white group-hover:text-white'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <SearchDropdown 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>

      {/* User Menu - Sign In/Account */}
      <UserMenu isScrolled={isScrolled} effectiveTheme={effectiveTheme} />

      {/* Cart Button */}
      <button
        onClick={toggleCart}
        className={`relative ${buttonClasses}`}
        aria-label={`Shopping cart ${cartCount > 0 ? `with ${cartCount} items` : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
            isScrolled
              ? effectiveTheme === 'light'
                ? 'text-gray-600 group-hover:text-blue-600'
                : 'text-gray-200 group-hover:text-white'
              : 'text-white group-hover:text-white'
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
          />
        </svg>
        {cartCount > 0 && (
          <span className={`
            absolute -top-1 -right-1 text-white text-xs font-bold rounded-full
            h-5 w-5 flex items-center justify-center transform transition-all duration-300
            shadow-lg z-10
            ${isScrolled
              ? 'bg-gradient-to-r from-red-500 to-pink-500'
              : 'bg-red-500'
            }
          `}>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
      
      {/* Mobile Menu Button with Animated Icon */}
      <AnimatedMenuButton
        isOpen={isMenuOpen}
        onClick={openMenu}
        isScrolled={isScrolled}
        effectiveTheme={effectiveTheme}
      />
    </div>
  );
}