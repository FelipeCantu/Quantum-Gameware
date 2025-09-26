// components/ui/Header/DesktopNavigation.tsx - Debug Version
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { categories } from '@/data/categories';

interface DesktopNavigationProps {
  isScrolled: boolean;
}

export default function DesktopNavigation({ isScrolled }: DesktopNavigationProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [clickCount, setClickCount] = useState(0);

  // Debug function to track what's happening
  const debugLog = (message: string) => {
    console.log(`[DEBUG] ${message}`);
    setDebugInfo(prev => `${prev}\n${new Date().toLocaleTimeString()}: ${message}`);
  };

  useEffect(() => {
    debugLog(`Component mounted. User agent: ${navigator.userAgent}`);
    debugLog(`Screen size: ${window.innerWidth}x${window.innerHeight}`);
    debugLog(`Touch support: ${('ontouchstart' in window) ? 'Yes' : 'No'}`);
  }, []);

  // Simple click handler with lots of debugging
  const handleCategoriesClick = (event: any) => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    debugLog(`Categories button clicked! Click #${newClickCount}`);
    debugLog(`Event type: ${event.type}`);
    debugLog(`Event target: ${event.target.tagName}`);
    debugLog(`Current state: ${isCategoriesOpen}`);
    
    // Toggle the state
    const newState = !isCategoriesOpen;
    setIsCategoriesOpen(newState);
    debugLog(`New state: ${newState}`);
    
    // Prevent any default behavior
    event.preventDefault();
    event.stopPropagation();
  };

  const navLinkClasses = `relative px-4 py-2.5 transition-all duration-300 font-medium rounded-xl group overflow-hidden text-center whitespace-nowrap ${
    isScrolled 
      ? 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
      : 'text-white/90 hover:text-white hover:bg-white/10'
  }`;

  const underlineClasses = `absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${
    isScrolled 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
      : 'bg-white'
  }`;

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      <Link href="/" className={navLinkClasses}>
        <span className="relative z-10">Home</span>
        <div className={underlineClasses} />
      </Link>

      {/* Debug Categories Button - Multiple event handlers */}
      <div className="relative">
        <button
          onClick={handleCategoriesClick}
          onTouchStart={(e) => {
            debugLog('Touch start detected');
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            debugLog('Touch end detected');
            handleCategoriesClick(e);
          }}
          onMouseDown={() => debugLog('Mouse down detected')}
          onMouseUp={() => debugLog('Mouse up detected')}
          className={`${navLinkClasses} flex items-center`}
          style={{
            // Force larger touch target
            minHeight: '48px',
            minWidth: '120px',
            // Remove any CSS that might block touches
            pointerEvents: 'auto',
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            // High z-index to ensure it's on top
            zIndex: 1000,
            // Visible background for debugging
            backgroundColor: isCategoriesOpen ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)',
            // Remove any border radius that might cause issues
            borderRadius: '8px',
            // Ensure it's not hidden
            opacity: 1,
            visibility: 'visible'
          }}
          aria-expanded={isCategoriesOpen}
          aria-haspopup="true"
          type="button"
        >
          <span className="relative z-10">Categories ({clickCount})</span>
          <svg 
            className={`ml-1 w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <div className={underlineClasses} />
        </button>

        {/* Simple dropdown - no complex positioning */}
        {isCategoriesOpen && (
          <div 
            className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
            onClick={() => {
              debugLog('Backdrop clicked');
              setIsCategoriesOpen(false);
            }}
          >
            <div 
              className="bg-white p-8 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Categories Debug</h3>
              <p className="mb-4">State: {isCategoriesOpen ? 'OPEN' : 'CLOSED'}</p>
              <p className="mb-4">Clicks: {clickCount}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Categories:</h4>
                <div className="space-y-2">
                  {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block p-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {category.icon} {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  debugLog('Close button clicked');
                  setIsCategoriesOpen(false);
                }}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Link href="/products" className={navLinkClasses}>
        <span className="relative z-10">Products</span>
        <div className={underlineClasses} />
      </Link>

      <Link href="/about" className={navLinkClasses}>
        <span className="relative z-10">About</span>
        <div className={underlineClasses} />
      </Link>

      <Link href="/contact" className={navLinkClasses}>
        <span className="relative z-10">Contact</span>
        <div className={underlineClasses} />
      </Link>

      {/* Debug Info Panel - Only visible on mobile */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono overflow-auto max-h-32 z-[9998]">
        <strong>Debug Info:</strong>
        <pre className="whitespace-pre-wrap">{debugInfo}</pre>
      </div>
    </nav>
  );
}