// components/ui/PortalDropdown.tsx - Mobile Optimized Version
import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  className?: string;
  position?: 'bottom-left' | 'bottom-center' | 'bottom-right';
  isMobile?: boolean;
}

export default function PortalDropdown({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  className = '',
  position = 'bottom-left',
  isMobile = false
}: PortalDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Ensure we only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position
  const updatePosition = () => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Mobile-specific handling
    if (isMobile || viewportWidth < 1024) {
      // On mobile, use a different approach - fullscreen or bottom sheet style
      setDropdownStyle({
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '16px',
      });
      return;
    }

    // Desktop dropdown positioning (existing logic)
    const dropdownWidth = 320;
    const dropdownHeight = 400;
    const gap = 8;

    let top = triggerRect.bottom + gap + window.scrollY;
    let left = triggerRect.left + window.scrollX;

    // Adjust horizontal position based on position prop
    switch (position) {
      case 'bottom-center':
        left = triggerRect.left + window.scrollX + (triggerRect.width / 2) - (dropdownWidth / 2);
        break;
      case 'bottom-right':
        left = triggerRect.right + window.scrollX - dropdownWidth;
        break;
      case 'bottom-left':
      default:
        left = triggerRect.left + window.scrollX;
        break;
    }

    // Keep dropdown within viewport bounds
    if (left < 16) left = 16;
    if (left + dropdownWidth > viewportWidth - 16) {
      left = viewportWidth - dropdownWidth - 16;
    }

    // Vertical bounds check
    if (top + dropdownHeight > viewportHeight + window.scrollY - 16) {
      top = triggerRect.top + window.scrollY - dropdownHeight - gap;
      if (top < window.scrollY + 16) {
        top = window.scrollY + 16;
      }
    }

    setDropdownStyle({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
    });
  };

  // Update position when dropdown opens or window resizes/scrolls
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, position, isMobile]);

  // Handle clicks outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Mobile-friendly event listeners
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape, true);

    // Prevent body scroll on mobile when dropdown is open
    if (isMobile || window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape, true);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isMobile]);

  if (!mounted) return null;

  // Mobile vs Desktop content wrapper
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isMobile || window.innerWidth < 1024) {
      return (
        <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl shadow-2xl animate-fade-in-up max-h-[80vh] overflow-hidden">
          {children}
        </div>
      );
    }
    return <div className={`animate-fade-in ${className}`}>{children}</div>;
  };

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      role="menu"
      onClick={(e) => {
        // Close dropdown if clicking on mobile backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  ) : null;

  return (
    <>
      <div 
        ref={triggerRef} 
        onClick={onToggle}
        onTouchStart={(e) => {
          // Prevent double-tap zoom on mobile
          e.preventDefault();
          onToggle();
        }}
      >
        {trigger}
      </div>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}