// components/ui/PortalDropdown.tsx
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
}

export default function PortalDropdown({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  className = '',
  position = 'bottom-left'
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
    const dropdownWidth = 320; // Default width
    const dropdownHeight = 400; // Max height
    const gap = 8; // Gap between trigger and dropdown

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
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Horizontal bounds check
    if (left < 16) left = 16;
    if (left + dropdownWidth > viewportWidth - 16) {
      left = viewportWidth - dropdownWidth - 16;
    }

    // Vertical bounds check - if dropdown would go below viewport, show above trigger
    if (top + dropdownHeight > viewportHeight + window.scrollY - 16) {
      top = triggerRect.top + window.scrollY - dropdownHeight - gap;
      // If still doesn't fit above, position at top of viewport
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
      const handleScroll = () => {
        updatePosition();
        // Optionally close dropdown on scroll
        // onClose();
      };

      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, position]);

  // Handle clicks outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
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

    // Use capture phase to ensure we catch the event
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className={`animate-fade-in ${className}`}
      style={dropdownStyle}
      role="menu"
    >
      {children}
    </div>
  ) : null;

  return (
    <>
      <div ref={triggerRef} onClick={onToggle}>
        {trigger}
      </div>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}