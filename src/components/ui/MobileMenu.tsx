// components/ui/Header/MobileMenu.tsx - Updated to start from top of new pages
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const cartCount = getCartCount();

  // Store original scroll position to restore later
  const scrollPositionRef = useRef(0);

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
      
      if (
        isMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(target) &&
        (target as Element)?.classList?.contains('mobile-menu-backdrop')
      ) {
        handleCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside);
        clearTimeout(timeoutId);
      };
    }
  }, [isMenuOpen]);

  // FIXED: Better scroll lock management
  useEffect(() => {
    if (isMenuOpen) {
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
    } else {
      const scrollY = scrollPositionRef.current;
      
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      
      if (scrollY > 0) {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }
    }

    return () => {
      if (isMenuOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        document.documentElement.style.overflow = '';
        document.documentElement.style.position = '';
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';
      }
    };
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
      // Close menu immediately
      handleCloseMenu();
      
      // Navigate and scroll to top
      const searchUrl = `/products?search=${encodeURIComponent(searchQuery)}`;
      router.push(searchUrl);
      
      // Ensure we scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 100);
    }
  };

  // FIXED: Better toggle submenu function
  const toggleSubmenu = (menu: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggling submenu:', menu, 'Current:', activeSubmenu); // Debug log
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // NEW: Enhanced link click handler that ensures starting from top
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close the menu immediately
    handleCloseMenu();
    
    // Use router.push to navigate
    router.push(href);
    
    // Force scroll to top after a short delay to ensure navigation is complete
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        left: 0,
        behavior: 'instant' 
      });
    }, 50);
    
    // Additional fallback to ensure scroll position
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo({ 
          top: 0, 
          left: 0,
          behavior: 'instant' 
        });
      }
    }, 200);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart();
    handleCloseMenu();
  };

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className="lg:hidden fixed inset-0 z-[60] transition-all duration-300 ease-out">
      {/* Backdrop */}
      <div 
        className="mobile-menu-backdrop fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
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
        className="fixed inset-0 flex flex-col bg-transparent overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Logo and Close Button - Fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <a 
            href="/" 
            onClick={(e) => handleLinkClick(e, '/')} 
            className="flex items-center space-x-3 group"
          >
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
          </a>
          
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

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
                        className="flex items-center justify-between w-full px-6 py-4 text-white hover:text-blue-200 transition-all duration-300 font-medium rounded-2xl hover:bg-white/10 backdrop-blur-sm active:scale-95 group focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{
                          touchAction: 'manipulation',
                          WebkitTapHighlightColor: 'transparent'
                        }}
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
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          activeSubmenu === link.label ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}
                        style={{
                          visibility: activeSubmenu === link.label ? 'visible' : 'hidden'
                        }}
                      >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 ml-4 border border-white/10">
                          <div className="grid grid-cols-2 gap-3">
                            {link.submenu?.map((category) => (
                              <a
                                key={category.slug}
                                href={`/categories/${category.slug}`}
                                onClick={(e) => handleLinkClick(e, `/categories/${category.slug}`)}
                                className="flex flex-col items-center p-4 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-300 group border border-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                                style={{
                                  touchAction: 'manipulation',
                                  WebkitTapHighlightColor: 'transparent'
                                }}
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
                              </a>
                            ))}
                          </div>
                          <a
                            href="/categories"
                            onClick={(e) => handleLinkClick(e, '/categories')}
                            className="flex items-center justify-center w-full mt-4 px-4 py-3 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-xl transition-all duration-300 font-medium group focus:outline-none focus:ring-2 focus:ring-white/30"
                            style={{
                              touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'transparent'
                            }}
                          >
                            View All Categories
                            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a 
                      href={link.href} 
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="flex items-center justify-between w-full px-6 py-4 text-white hover:text-blue-200 transition-all duration-300 font-medium rounded-2xl hover:bg-white/10 active:bg-white/20 backdrop-blur-sm active:scale-95 group focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent'
                      }}
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
                    </a>
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
                  className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
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
                
                <a
                  href="/account"
                  onClick={(e) => handleLinkClick(e, '/account')}
                  className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <svg className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white text-sm font-medium">Account</span>
                  <span className="text-white/60 text-xs">Profile</span>
                </a>
              </div>
            </div>

            {/* Featured Categories */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-white/80 text-sm font-semibold mb-4 px-2">Featured Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(0, 4).map((category) => (
                  <a
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    onClick={(e) => handleLinkClick(e, `/categories/${category.slug}`)}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 active:from-white/30 active:to-white/15 rounded-2xl transition-all duration-300 group border border-white/10 hover:border-white/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/30"
                    style={{
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }}
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
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-white/80 text-sm font-semibold mb-4 px-2">Connect With Us</h3>
              <div className="flex justify-center space-x-3">
                {[
                  { 
                    label: 'Discord', 
                    href: '#',
                    bgColor: 'hover:bg-indigo-500/20',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                      </svg>
                    )
                  },
                  { 
                    label: 'Twitter/X', 
                    href: '#',
                    bgColor: 'hover:bg-black/30',
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )
                  },
                  { 
                    label: 'YouTube', 
                    href: '#',
                    bgColor: 'hover:bg-red-500/20',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )
                  },
                  { 
                    label: 'Twitch', 
                    href: '#',
                    bgColor: 'hover:bg-purple-500/20',
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                      </svg>
                    )
                  },
                  { 
                    label: 'Instagram', 
                    href: '#',
                    bgColor: 'hover:bg-pink-500/20',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )
                  }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`
                      flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl 
                      transition-all duration-300 group border border-white/10 
                      hover:border-white/30 hover:scale-110 hover:shadow-lg
                      ${social.bgColor} focus:outline-none focus:ring-2 focus:ring-white/30
                    `}
                    style={{
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
              
              {/* Social CTA */}
              <div className="mt-4 text-center">
                <p className="text-white/60 text-xs">
                  Follow us for gaming tips, updates & exclusive deals
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/20 text-center pb-8">
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
    </div>
  );
}