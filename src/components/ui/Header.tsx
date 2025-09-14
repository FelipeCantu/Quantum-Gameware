// components/ui/Header/Header.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import DesktopNavigation from './DesktopNavigation';
import ActionButtons from './ActionButtons';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollPositionRef = useRef(0);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      scrollPositionRef.current = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      if (scrollPositionRef.current > 0) {
        window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' });
      }
      
      document.removeEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo isScrolled={isScrolled} />
          <DesktopNavigation isScrolled={isScrolled} />
          <ActionButtons 
            isScrolled={isScrolled} 
            isMenuOpen={isMenuOpen}
            openMenu={openMenu}
          />
        </div>
      </div>
      
      <MobileMenu 
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
      />
    </header>
  );
}