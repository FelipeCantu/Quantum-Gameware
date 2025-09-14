"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { categories } from '@/data/categories';

export default function Header() {
  const { toggleCart, getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (mobileMenuRef.current && isMenuOpen && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
        setIsSearchOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [isMenuOpen]);

  const cartCount = getCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-transparent py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="group flex items-center space-x-3 transition-transform hover:scale-105">
              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-xl p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <div className={`w-full h-full rounded-lg flex items-center justify-center ${
                  isScrolled ? 'bg-white' : 'bg-white/90 backdrop-blur-sm'
                }`}>
                  <Image
                    src="/nextgens-logo.png"
                    alt="Quantum Gameware Logo"
                    width={40}
                    height={40}
                    className="object-contain p-1 transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Show fallback text
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-xl font-bold text-blue-600">QG</div>';
                      }
                    }}
                  />
                </div>
              </div>
              {/* Text Logo - Fixed mobile layout */}
              <div className="hidden sm:block">
                <span className={`text-lg sm:text-xl md:text-2xl font-bold leading-none ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
                    : 'text-white'
                }`}>
                  Quantum
                </span>
                <div className={`text-xs sm:text-sm font-medium leading-none ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  Gameware
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`
                relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
                group overflow-hidden text-center whitespace-nowrap
                ${isScrolled 
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="relative z-10">Home</span>
              <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-white'
              }`} />
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`
                  relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
                  group overflow-hidden text-center whitespace-nowrap flex items-center
                  ${isScrolled 
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="relative z-10">Categories</span>
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-white'
                }`} />
              </button>

              {/* Categories Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-1">Shop by Category</h3>
                    <p className="text-sm text-gray-600">Find exactly what you need</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {categories.slice(0, 8).map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
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
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                      >
                        View All Categories
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/products"
              className={`
                relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
                group overflow-hidden text-center whitespace-nowrap
                ${isScrolled 
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="relative z-10">Products</span>
              <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-white'
              }`} />
            </Link>

            <Link
              href="/about"
              className={`
                relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
                group overflow-hidden text-center whitespace-nowrap
                ${isScrolled 
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="relative z-10">About</span>
              <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-white'
              }`} />
            </Link>

            <Link
              href="/contact"
              className={`
                relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl
                group overflow-hidden text-center whitespace-nowrap
                ${isScrolled 
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span className="relative z-10">Contact</span>
              <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-white'
              }`} />
            </Link>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Search Button - Desktop */}
            <div className="hidden md:block relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`
                  p-2.5 group rounded-xl transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
                  active:scale-95 flex-shrink-0
                  ${isScrolled 
                    ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                    : 'hover:bg-white/10'
                  }
                `}
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

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for gaming gear..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Press Enter to search or browse categories below
                    </div>
                  </form>
                  <div className="border-t border-gray-100 p-2">
                    <div className="text-xs font-medium text-gray-500 px-2 py-1">Quick Categories</div>
                    {categories.slice(0, 4).map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg mr-3">{category.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className={`
                relative p-2.5 group rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
                active:scale-95 flex-shrink-0
                ${isScrolled 
                  ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'hover:bg-white/10'
                }
              `}
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
                <span className={`
                  absolute -top-1 -right-1 text-white text-xs font-bold
                  rounded-full h-6 w-6 flex items-center justify-center 
                  transform transition-all duration-300 shadow-lg z-10
                  ${isScrolled 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                    : 'bg-red-500 animate-pulse'
                  }
                `}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                lg:hidden p-2.5 rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
                active:scale-95 flex-shrink-0 flex items-center justify-center
                ${isScrolled 
                  ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                  : 'hover:bg-white/10'
                }
              `}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className={`
                  absolute h-0.5 w-full transform transition-all duration-300 ease-in-out
                  ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}
                  ${isScrolled ? 'bg-gray-600' : 'bg-white'}
                `} />
                <span className={`
                  absolute h-0.5 w-full transform transition-all duration-300 ease-in-out
                  ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
                  ${isScrolled ? 'bg-gray-600' : 'bg-white'}
                `} />
                <span className={`
                  absolute h-0.5 w-full transform transition-all duration-300 ease-in-out
                  ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}
                  ${isScrolled ? 'bg-gray-600' : 'bg-white'}
                `} />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        ref={mobileMenuRef}
        className={`
          lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-in-out
          ${isMenuOpen 
            ? 'opacity-100 visible translate-x-0' 
            : 'opacity-0 invisible translate-x-full'
          }
        `}
        style={{ top: 0 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        {/* Menu Content */}
        <div className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto">
          <div className="p-6 relative">
            {/* Close Button - Fixed positioning */}
            <button
              ref={closeButtonRef}
              onClick={closeMenu}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile Search - Added margin top to make space for close button */}
            <div className="mb-6 mt-10">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for gaming gear..."
                  className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>

            <div className="flex flex-col space-y-1">
              {[
                { href: '/', label: 'Home', icon: '🏠' },
                { href: '/products', label: 'Products', icon: '🎮' },
                { 
                  href: '/categories', 
                  label: 'Categories', 
                  icon: '📁',
                  hasSubmenu: true,
                  submenu: categories.slice(0, 6)
                },
                { href: '/about', label: 'About', icon: '📖' },
                { href: '/contact', label: 'Contact', icon: '✉️' }
              ].map((link, index) => (
                <div key={link.href}>
                  {link.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(link.label)}
                        className="
                          flex items-center justify-between w-full px-4 py-3
                          text-gray-700 hover:text-blue-600 
                          transition-all duration-300 font-medium rounded-xl
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                          active:scale-95
                        "
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg transition-transform duration-300 w-6 flex justify-center">
                            {link.icon}
                          </span>
                          <span>{link.label}</span>
                        </div>
                        <svg 
                          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${activeSubmenu === link.label ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Submenu */}
                      <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${activeSubmenu === link.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                      `}>
                        <div className="pl-10 pr-4 py-1 space-y-1">
                          {link.submenu.map((category, subIndex) => (
                            <Link
                              key={category.slug}
                              href={`/categories/${category.slug}`}
                              onClick={closeMenu}
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              style={{ animationDelay: `${(index + subIndex) * 50}ms` }}
                            >
                              <span className="text-lg mr-3">{category.icon}</span>
                              <span className="text-gray-700">{category.name.split(' ')[1] || category.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="
                        flex items-center justify-between w-full px-4 py-3
                        text-gray-700 hover:text-blue-600 
                        transition-all duration-300 font-medium rounded-xl
                        hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                        active:scale-95
                      "
                      onClick={closeMenu}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg transition-transform duration-300 w-6 flex justify-center">
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </div>
                      <svg 
                        className="w-4 h-4 text-gray-400 transition-all duration-300" 
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
            </div>

            {/* Quick Categories */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 px-2 mb-3">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 4).map((category, index) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    onClick={closeMenu}
                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-sm"
                    style={{ animationDelay: `${(6 + index) * 50}ms` }}
                  >
                    <span className="text-2xl mb-1 transition-transform duration-300 hover:scale-110">
                      {category.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {category.name.split(' ')[1] || category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  toggleCart();
                  closeMenu();
                }}
                className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🛒</span>
                  <span className="font-medium text-gray-700">Your Cart</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600">{cartCount} items</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}