// src/components/ui/MobileMenu.tsx - Professional Version WITHOUT Icons
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data/categories';
import { createPortal } from 'react-dom';

interface MobileMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
}

// Animated Menu/Close Button Component
const AnimatedMenuButton = ({ 
  isOpen, 
  onClick, 
  className = "" 
}: { 
  isOpen: boolean; 
  onClick: () => void; 
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`relative p-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 
               transition-all duration-200 group touch-manipulation ${className}`}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <div className="w-6 h-6 relative">
      <span className={`
        absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
        ${isOpen ? 'top-[11px] rotate-45' : 'top-1'}
      `} />
      <span className={`
        absolute left-0 top-[11px] w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
        ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
      `} />
      <span className={`
        absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
        ${isOpen ? 'top-[11px] -rotate-45' : 'top-[22px]'}
      `} />
    </div>
  </button>
);

// Simple Menu Link Component
const MenuLink = ({ 
  href, 
  children, 
  onClick, 
  className = "" 
}: { 
  href: string; 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      flex items-center justify-between px-6 py-4 text-white hover:bg-white/10 
      active:bg-white/20 transition-all duration-200 rounded-2xl 
      group touch-manipulation ${className}
    `}
  >
    <span className="text-lg">{children}</span>
    <svg 
      className="w-5 h-5 text-white/30 transition-all duration-200 group-hover:text-white/50 group-hover:translate-x-1" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  </Link>
);

export default function MobileMenu({ isMenuOpen, closeMenu }: MobileMenuProps) {
  const { toggleCart, getCartCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const cartCount = getCartCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
      setIsClosing(false);
      setActiveSubmenu(null);
      setSearchQuery('');
    }, 300);
  }, [closeMenu]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        handleClose();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen, handleClose]);

  useEffect(() => {
    if (!mounted) return;

    if (isMenuOpen) {
      scrollPositionRef.current = window.pageYOffset;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style.WebkitOverflowScrolling = 'touch';
        document.documentElement.style.WebkitOverflowScrolling = 'touch';
      }
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.WebkitOverflowScrolling = '';
      document.documentElement.style.WebkitOverflowScrolling = '';

      // Don't restore scroll position - let ScrollBehavior component handle it
      // This ensures pages always start at the top when navigating
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen, mounted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      handleClose();
    }
  };

  const toggleSubmenu = useCallback((menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  }, [activeSubmenu]);

  const handleCartClick = () => {
    toggleCart();
    handleClose();
  };

  const handleSignOut = async () => {
    await signOut();
    handleClose();
  };

  if (!mounted || !isMenuOpen) return null;

  const menuContent = (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isClosing ? 'opacity-0' : 'opacity-100'}
        `}
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div 
        ref={menuRef}
        className={`
          fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-br 
          from-slate-900 via-purple-900 to-blue-900 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isClosing ? 'translate-x-full' : 'translate-x-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/" onClick={handleClose} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-1.5 shadow-lg">
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="/nextgens-logo.png"
                    alt="Logo"
                    width={36}
                    height={36}
                    className="object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-blue-600 font-bold text-sm">QG</div>';
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">Quantum</div>
                <div className="text-white/70 text-xs">Gameware</div>
              </div>
            </Link>
            
            <AnimatedMenuButton isOpen={true} onClick={handleClose} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="p-6 space-y-6">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-12 py-4 bg-white/10 border border-white/20 rounded-2xl 
                           text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 
                           focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>

              {/* User Section */}
              {isAuthenticated && user ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-white/70 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={handleClose}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm 
                               font-medium text-center transition-all duration-200"
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-200 
                               text-sm font-medium transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/signin"
                    onClick={handleClose}
                    className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white 
                             font-medium text-center transition-all duration-200 backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={handleClose}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                             hover:from-blue-600 hover:to-purple-600 rounded-xl text-white 
                             font-medium text-center transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Main Navigation */}
              <nav className="space-y-2">
                <MenuLink href="/" onClick={handleClose}>
                  Home
                </MenuLink>
                <MenuLink href="/products" onClick={handleClose}>
                  All Products
                </MenuLink>
                
                {/* Categories Accordion - NO ICONS */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('categories')}
                    className="w-full flex items-center justify-between px-6 py-4 text-white hover:bg-white/10 
                             active:bg-white/20 transition-all duration-200 rounded-2xl group"
                  >
                    <span className="text-lg">Categories</span>
                    <svg 
                      className={`w-5 h-5 text-white/30 transition-transform duration-300 
                                ${activeSubmenu === 'categories' ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Category List - Clean, No Icons, No Prices */}
                  <div className={`
                    space-y-1 px-4 mt-2 overflow-hidden transition-all duration-300
                    ${activeSubmenu === 'categories' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {/* Individual Categories */}
                    {categories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={handleClose}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 
                                 rounded-xl transition-all duration-200 group"
                      >
                        <span className="text-white/90 text-sm font-medium">
                          {cat.name}
                        </span>
                        <svg className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-all group-hover:translate-x-1" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                    
                    {/* View All Categories Button - At the bottom like desktop */}
                    <Link
                      href="/categories"
                      onClick={handleClose}
                      className="flex items-center justify-center p-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 
                               hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-200 group"
                    >
                      <span className="text-white text-sm font-medium">
                        View All Categories
                      </span>
                      <svg className="ml-2 w-4 h-4 text-white transition-transform group-hover:translate-x-1" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <MenuLink href="/about" onClick={handleClose}>
                  About
                </MenuLink>
                <MenuLink href="/contact" onClick={handleClose}>
                  Contact
                </MenuLink>
              </nav>

              {/* Quick Actions - Cart & Wishlist */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCartClick}
                  className="relative flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 
                           active:bg-white/30 rounded-2xl transition-all duration-200 group"
                >
                  <div className="text-white/90 text-sm font-medium">Cart</div>
                  {cartCount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs 
                                   font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
                
                <Link
                  href="/wishlist"
                  onClick={handleClose}
                  className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 
                           active:bg-white/30 rounded-2xl transition-all duration-200"
                >
                  <div className="text-white/90 text-sm font-medium">Wishlist</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Quantum Gameware
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}

export { AnimatedMenuButton };