// components/ui/Header/MobileMenu.tsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/categories';

interface MobileMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
}

export default function MobileMenu({ isMenuOpen, closeMenu }: MobileMenuProps) {
  const { toggleCart, getCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = getCartCount();

  // Improved close menu handler
  const handleCloseMenu = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closeMenu();
    setActiveSubmenu(null);
  };

  // Handle escape key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        e.preventDefault();
        handleCloseMenu();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      // Only close if clicking on the backdrop, not the menu content
      if (
        isMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(target) &&
        // Make sure we're clicking on the backdrop div specifically
        (target as Element)?.classList?.contains('mobile-menu-backdrop')
      ) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Add small delay to prevent immediate closing
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside);
        document.body.style.overflow = 'unset';
        clearTimeout(timeoutId);
      };
    }
  }, [isMenuOpen]);

  // Focus management
  useEffect(() => {
    if (isMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      handleCloseMenu();
    }
  };

  const toggleSubmenu = (menu: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // Don't prevent default - let Next.js handle the navigation
    // Just close the menu after a small delay to allow navigation
    setTimeout(() => {
      handleCloseMenu();
    }, 50);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart();
    handleCloseMenu();
  };

  if (!isMenuOpen) {
    return null; // Don't render anything when closed
  }

  return (
    <div className="lg:hidden fixed inset-0 z-[60] transition-all duration-300 ease-out">
      {/* Backdrop */}
      <div 
        className="mobile-menu-backdrop absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
        onClick={handleCloseMenu}
        aria-label="Close menu"
      >
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-purple-300/5 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>
      </div>
      
      {/* Menu Content */}
      <div 
        ref={mobileMenuRef}
        className="relative h-full w-full overflow-y-auto bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                {!logoError ? (
                  <Image
                    src="/nextgens-logo.png"
                    alt="Quantum Gameware Logo"
                    width={40}
                    height={40}
                    className="object-contain p-1 transition-transform group-hover:scale-110"
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <div className="text-blue-600 font-bold text-lg">QG</div>
                )}
              </div>
            </div>
            <div className="group-hover:scale-105 transition-transform duration-300">
              <div className="text-white font-bold text-xl leading-none">Quantum</div>
              <div className="text-white/70 text-sm leading-none">Gameware</div>
            </div>
          </Link>
          
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleCloseMenu}
            className="relative p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20 hover:border-white/30 group min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className="absolute w-5 h-0.5 bg-white rounded-full transform rotate-45 transition-all duration-300 group-hover:w-6 group-hover:bg-red-200" />
              <span className="absolute w-5 h-0.5 bg-white rounded-full transform -rotate-45 transition-all duration-300 group-hover:w-6 group-hover:bg-red-200" />
            </div>
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gaming gear..."
              className="w-full px-6 py-4 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation Menu */}
        <div className="px-6 pb-6">
          <nav className="space-y-2">
            {[
              { href: '/', label: 'Home', icon: '🏠' },
              { href: '/products', label: 'Products', icon: '🎮' },
              { 
                href: '/categories', 
                label: 'Categories', 
                icon: '📁',
                hasSubmenu: true,
                submenu: categories.slice(0, 8)
              },
              { href: '/about', label: 'About', icon: '📖' },
              { href: '/contact', label: 'Contact', icon: '✉️' }
            ].map((link) => (
              <div key={link.href}>
                {link.hasSubmenu ? (
                  <div>
                    <button
                      onClick={(e) => toggleSubmenu(link.label, e)}
                      className="flex items-center justify-between w-full px-6 py-4 text-white hover:text-blue-200 transition-all duration-300 font-medium rounded-2xl hover:bg-white/10 backdrop-blur-sm active:scale-95 group"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                          {link.icon}
                        </span>
                        <span className="text-lg">{link.label}</span>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-white/70 transition-transform duration-300 ${activeSubmenu === link.label ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Submenu */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      activeSubmenu === link.label ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 ml-4 border border-white/10">
                        <div className="grid grid-cols-2 gap-3">
                          {link.submenu?.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/categories/${category.slug}`}
                              onClick={handleLinkClick}
                              className="flex flex-col items-center p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
                            >
                              <span className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110">
                                {category.icon}
                              </span>
                              <span className="text-white text-sm font-medium text-center leading-tight">
                                {category.name.split(' ')[1] || category.name}
                              </span>
                              <span className="text-white/60 text-xs mt-1">
                                ${category.priceRange.min}+
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/categories"
                          onClick={handleLinkClick}
                          className="flex items-center justify-center w-full mt-4 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium group"
                        >
                          View All Categories
                          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={link.href} 
                    onClick={handleLinkClick}
                    className="flex items-center justify-between w-full px-6 py-4 text-white hover:text-blue-200 transition-all duration-300 font-medium rounded-2xl hover:bg-white/10 backdrop-blur-sm active:scale-95 group"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                        {link.icon}
                      </span>
                      <span className="text-lg">{link.label}</span>
                    </div>
                    <svg 
                      className="w-5 h-5 text-white/70 transition-all duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-white/80 text-sm font-semibold mb-4 px-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCartClick}
                className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20"
              >
                <div className="relative">
                  <svg className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-white text-sm font-medium">Cart</span>
                <span className="text-white/60 text-xs">{cartCount} items</span>
              </button>
              
              <Link
                href="/account"
                onClick={handleLinkClick}
                className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20"
              >
                <svg className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-white text-sm font-medium">Account</span>
                <span className="text-white/60 text-xs">Profile</span>
              </Link>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-white/80 text-sm font-semibold mb-4 px-2">Featured Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  onClick={handleLinkClick}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20 hover:shadow-xl"
                >
                  <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </span>
                  <span className="text-white text-sm font-medium text-center leading-tight">
                    {category.name.split(' ')[1] || category.name}
                  </span>
                  <span className="text-white/60 text-xs mt-1">
                    ${category.priceRange.min}+
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-white/80 text-sm font-semibold mb-4 px-2">Connect With Us</h3>
            <div className="flex justify-center space-x-4">
              {[
                { icon: '📘', label: 'Facebook', href: '#' },
                { icon: '📸', label: 'Instagram', href: '#' },
                { icon: '🐦', label: 'Twitter', href: '#' },
                { icon: '💼', label: 'LinkedIn', href: '#' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group border border-white/10 hover:border-white/20"
                  aria-label={social.label}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Quantum Gameware. All rights reserved.
            </p>
            <p className="text-white/40 text-xs mt-1">
              Level up your gaming experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}