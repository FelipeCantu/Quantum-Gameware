// src/components/ui/MobileMenu.tsx - Enhanced Version with Professional Icons & Smooth Transitions
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

// Professional SVG Icons
const Icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  products: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  categories: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  about: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  contact: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  cart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  wishlist: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  discord: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  twitch: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
    </svg>
  )
};

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
      {/* Top bar */}
      <span className={`
        absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
        ${isOpen 
          ? 'top-[11px] rotate-45' 
          : 'top-1'
        }
      `} />
      
      {/* Middle bar */}
      <span className={`
        absolute left-0 top-[11px] w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
        ${isOpen 
          ? 'opacity-0 scale-0' 
          : 'opacity-100 scale-100'
        }
      `} />
      
      {/* Bottom bar */}
      <span className={`
        absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out
        ${isOpen 
          ? 'top-[11px] -rotate-45' 
          : 'top-[22px]'
        }
      `} />
    </div>
  </button>
);

// Separate component for better performance
const MenuLink = ({ 
  href, 
  children, 
  icon, 
  onClick, 
  className = "" 
}: { 
  href: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode;
  onClick?: () => void; 
  className?: string;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      flex items-center px-6 py-4 text-white hover:bg-white/10 
      active:bg-white/20 transition-all duration-200 rounded-2xl 
      group touch-manipulation ${className}
    `}
  >
    {icon && (
      <span className="mr-4 text-white/80 group-hover:text-white transition-colors duration-200">
        {icon}
      </span>
    )}
    <span className="text-lg flex-1">{children}</span>
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

  // Mount check for portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Improved close handler with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
      setIsClosing(false);
      setActiveSubmenu(null);
      setSearchQuery('');
    }, 300); // Match animation duration
  }, [closeMenu]);

  // Handle escape key
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

  // Improved scroll lock with iOS support
  useEffect(() => {
    if (!mounted) return;

    if (isMenuOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.pageYOffset;
      
      // Apply scroll lock styles
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // iOS specific fixes
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style.WebkitOverflowScrolling = 'touch';
        document.documentElement.style.WebkitOverflowScrolling = 'touch';
      }
    } else {
      // Remove scroll lock styles
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.WebkitOverflowScrolling = '';
      document.documentElement.style.WebkitOverflowScrolling = '';
      
      // Restore scroll position
      if (scrollPositionRef.current > 0) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    }

    return () => {
      // Cleanup on unmount
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

  // Don't render until mounted (for portal)
  if (!mounted || !isMenuOpen) return null;

  const menuContent = (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop with blur effect */}
      <div 
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isClosing ? 'opacity-0' : 'opacity-100'}
        `}
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel - Slide from right */}
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
            
            {/* Animated Close Button */}
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
                               font-medium text-center transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {Icons.user}
                      <span>Account</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-200 
                               text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
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
                <MenuLink href="/" onClick={handleClose} icon={Icons.home}>
                  Home
                </MenuLink>
                <MenuLink href="/products" onClick={handleClose} icon={Icons.products}>
                  All Products
                </MenuLink>
                
                {/* Categories with Accordion */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('categories')}
                    className="w-full flex items-center px-6 py-4 text-white hover:bg-white/10 
                             active:bg-white/20 transition-all duration-200 rounded-2xl group"
                  >
                    <span className="mr-4 text-white/80 group-hover:text-white transition-colors">
                      {Icons.categories}
                    </span>
                    <span className="text-lg flex-1 text-left">Categories</span>
                    <svg 
                      className={`w-5 h-5 text-white/30 transition-transform duration-300 
                                ${activeSubmenu === 'categories' ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`
                    grid grid-cols-2 gap-2 px-4 mt-2 overflow-hidden transition-all duration-300
                    ${activeSubmenu === 'categories' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {categories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={handleClose}
                        className="flex flex-col items-center p-3 bg-white/5 hover:bg-white/10 
                                 rounded-xl transition-all duration-200 group"
                      >
                        <span className="text-2xl mb-1 transition-transform duration-200 
                                       group-active:scale-110">
                          {cat.icon}
                        </span>
                        <span className="text-white/90 text-xs text-center">
                          {cat.name.split(' ')[1] || cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <MenuLink href="/about" onClick={handleClose} icon={Icons.about}>
                  About
                </MenuLink>
                <MenuLink href="/contact" onClick={handleClose} icon={Icons.contact}>
                  Contact
                </MenuLink>
              </nav>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCartClick}
                  className="relative flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 
                           active:bg-white/30 rounded-2xl transition-all duration-200 group"
                >
                  <div className="relative text-white/80 group-hover:text-white transition-colors">
                    {Icons.cart}
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                                     font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-white text-sm mt-1">Cart</span>
                </button>
                
                <Link
                  href="/wishlist"
                  onClick={handleClose}
                  className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 
                           active:bg-white/30 rounded-2xl transition-all duration-200 group"
                >
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    {Icons.wishlist}
                  </div>
                  <span className="text-white text-sm mt-1">Wishlist</span>
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-indigo-500/30 rounded-xl 
                           flex items-center justify-center transition-all duration-200 group"
                  aria-label="Discord"
                >
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    {Icons.discord}
                  </div>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-black/30 rounded-xl 
                           flex items-center justify-center transition-all duration-200 group"
                  aria-label="Twitter"
                >
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    {Icons.twitter}
                  </div>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-red-500/30 rounded-xl 
                           flex items-center justify-center transition-all duration-200 group"
                  aria-label="YouTube"
                >
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    {Icons.youtube}
                  </div>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-purple-500/30 rounded-xl 
                           flex items-center justify-center transition-all duration-200 group"
                  aria-label="Twitch"
                >
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    {Icons.twitch}
                  </div>
                </a>
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

  // Use portal for better performance and z-index management
  return createPortal(menuContent, document.body);
}

// Export the AnimatedMenuButton for use in the Header component
export { AnimatedMenuButton };